// Round orchestrator — the only public entry point for playing.
// Determinism contract: same (seed, betCents, buy, config) ⇒ identical event stream.
//
// Base round draw order: d1..d5 reel stops → [FS subloop, see freeSpins.ts].
// Buy round draw order:  d1..d5 reel stops (scatterless strips) → d6 forced scatter
//                        placement (3 reels + 3 rows) → [FS subloop].

import type { Board, GameEvent, RoundResult, SymbolId } from './types'
import { REELS, ROWS } from './types'
import { mulberry32, randInt, sample } from './rng'
import { BUY_COST_MULT, FREE_SPINS_AWARDED } from './config/bets'
import { MAX_WIN_X } from './config/vault'
import { DEFAULT_CONFIG, type EngineConfig } from './config/engineConfig'
import { fillBoard, resolveBoard, spin } from './spin'
import { runFreeSpins } from './freeSpins'

export interface PlayOptions {
  seed: number
  betCents: number
  buy?: boolean
  config?: Partial<EngineConfig>
}

export function playRound(opts: PlayOptions): RoundResult {
  const cfg: EngineConfig = { ...DEFAULT_CONFIG, ...opts.config }
  const rng = mulberry32(opts.seed)
  const { betCents } = opts
  const events: GameEvent[] = []
  const capCents = MAX_WIN_X * betCents

  const costCents = opts.buy ? BUY_COST_MULT * betCents : betCents
  events.push({ type: 'spin_start', mode: 'base' })
  events.push({ type: 'bet_deduct', amountCents: costCents })

  const result = opts.buy
    ? resolveBoard(buildBuyBoard(rng, cfg), betCents, 'base', cfg)
    : spin(rng, betCents, 'base', cfg.baseStrips, cfg)

  events.push({ type: 'reels_land', board: result.board })
  events.push({ type: 'ways_evaluate', wins: result.wins })
  events.push({ type: 'scatter_check', count: result.scatterCount })

  const scatterPay = opts.buy && !cfg.buyPaysScatter ? 0 : result.scatterPayCents
  let total = result.lineWinCents + scatterPay
  events.push({ type: 'win_detect', spinWinCents: total })
  events.push({ type: 'win_present', spinWinCents: total })

  if (result.scatterCount >= 3) {
    events.push({
      type: 'fs_trigger',
      scatters: result.scatterCount,
      spinsAwarded: FREE_SPINS_AWARDED,
    })
    total = runFreeSpins(rng, betCents, total, cfg, events).roundTotalCents
  } else if (total >= capCents) {
    // theoretical for a single base spin, but the cap is uniform
    events.push({ type: 'win_cap_clamp', rawCents: total, cappedCents: capCents })
    total = capCents
  }

  events.push({ type: 'round_end', totalWinCents: total })
  return { events, totalWinCents: total, costCents }
}

/**
 * Buy board: fill from scatterless base strips, then force EXACTLY 3 scatters
 * (paytable-3: "always gives the same result containing 3 SCATTER symbols").
 * [ASSUMPTION] the 3 scatters land on 3 distinct reels.
 */
function buildBuyBoard(rng: ReturnType<typeof mulberry32>, cfg: EngineConfig): Board {
  if (cfg.boardQueue?.length) return cfg.boardQueue.shift()!
  const board = fillBoard(rng, cfg.buyStrips)
  const reelIndexes = [...Array(REELS).keys()]
  const chosenReels = sample(rng, reelIndexes, 3) // draw d6a
  for (const reel of chosenReels) {
    const row = randInt(rng, ROWS) // draw d6b
    board[reel]![row] = 'scatter_lotus' as SymbolId
  }
  return board
}
