// Free spins + VAULT. Verified rules (paytable-2/3):
// - 10 fixed spins, no retrigger (extra scatters feed the VAULT instead).
// - VAULT starts at 20× bet; won ONLY if all 20 grid positions are marked, else forfeited.
// - AFTER the first free spin, 8 random positions on reels 2/3/4 are marked.
// - A cleopatra hitting an UNMARKED position marks that position.
// - Each spin with ≥1 wild_multiplier adds a random amount drawn from the table keyed
//   by the number of simultaneous wild hits (uniform draw = TUNABLE placeholder).
// - MAX WIN: reaching 12,500× bet ends the round IMMEDIATELY, remaining spins and the
//   unpaid VAULT are forfeited.
//
// FS draw order per spin (appended-only contract):
//   d1..d5 reel stops → d7 vault increment (if ≥1 wild) → [after spin 1 only] d8 init marks

import type { CellPos, GameEvent } from './types'
import { ROWS } from './types'
import type { Rng } from './rng'
import { pick, sample } from './rng'
import { FS_SCATTER_VAULT_X100, scatterBand } from './config/paytable'
import {
  MAX_WIN_X,
  VAULT_INIT_MARKS,
  VAULT_START_X100,
  VAULT_TOTAL_POSITIONS,
  vaultTableFor,
} from './config/vault'
import { FREE_SPINS_AWARDED } from './config/bets'
import type { EngineConfig } from './config/engineConfig'
import { spin } from './spin'

export interface FreeSpinsOutcome {
  /** round total after FS (base trigger win + FS wins + vault if awarded), cap applied */
  roundTotalCents: number
  capped: boolean
}

const posKey = (p: CellPos) => `${p.reel},${p.row}`

export function runFreeSpins(
  rng: Rng,
  betCents: number,
  startTotalCents: number,
  cfg: EngineConfig,
  events: GameEvent[],
): FreeSpinsOutcome {
  const capCents = MAX_WIN_X * betCents
  let total = startTotalCents
  let vaultCents = Math.round((VAULT_START_X100 * betCents) / 100)
  const marked = new Set<string>()
  const fsStartTotal = startTotalCents

  events.push({ type: 'fs_intro', vaultCents })

  for (let index = 1; index <= FREE_SPINS_AWARDED; index++) {
    events.push({ type: 'fs_spin', index, remaining: FREE_SPINS_AWARDED - index })
    events.push({ type: 'spin_start', mode: 'freeSpins' })

    const result = spin(rng, betCents, 'freeSpins', cfg.fsStrips, cfg)
    events.push({ type: 'reels_land', board: result.board })
    events.push({ type: 'ways_evaluate', wins: result.wins })
    events.push({ type: 'scatter_check', count: result.scatterCount })

    const spinWin = result.lineWinCents + result.scatterPayCents
    events.push({ type: 'win_detect', spinWinCents: spinWin })
    total += spinWin

    // VAULT updates — cleopatra marks positions ([ASSUMPTION] active from spin 1,
    // before the init marks land; rules don't pin the spin-1 ordering).
    const newMarks: CellPos[] = []
    for (const cell of result.cleopatraCells) {
      const key = posKey(cell)
      if (!marked.has(key) && marked.size < VAULT_TOTAL_POSITIONS) {
        marked.add(key)
        newMarks.push(cell)
      }
    }

    let wildAddCents = 0
    if (result.wildMultiplierCount > 0) {
      const table = vaultTableFor(result.wildMultiplierCount)
      wildAddCents = Math.round((pick(rng, table) * betCents) / 100) // draw d7
    }

    let scatterAddCents = 0
    const band = scatterBand(result.scatterCount)
    if (band) {
      scatterAddCents = Math.round((FS_SCATTER_VAULT_X100[band]! * betCents) / 100)
    }

    if (wildAddCents || scatterAddCents || newMarks.length) {
      vaultCents = Math.min(vaultCents + wildAddCents + scatterAddCents, capCents)
      events.push({
        type: 'vault_update',
        vaultCents,
        marked: marked.size,
        wildAddCents,
        scatterAddCents,
        newMarks,
      })
    }

    events.push({ type: 'win_present', spinWinCents: spinWin })

    // Init marks: AFTER the first free spin resolves — 8 random unmarked positions
    // on reels 2/3/4 (board reel indexes 1..3). Draw d8.
    if (index === 1) {
      const candidates: CellPos[] = []
      for (let reel = 1; reel <= 3; reel++) {
        for (let row = 0; row < ROWS; row++) {
          if (!marked.has(`${reel},${row}`)) candidates.push({ reel, row })
        }
      }
      const initMarks = sample(rng, candidates, VAULT_INIT_MARKS)
      initMarks.forEach((p) => marked.add(posKey(p)))
      events.push({ type: 'vault_init_marks', positions: initMarks })
    }

    // MAX WIN check after EVERY spin: cap reached → round ends immediately,
    // remaining spins AND the unpaid vault are forfeited (paytable-3/6).
    if (total >= capCents) {
      events.push({ type: 'win_cap_clamp', rawCents: total, cappedCents: capCents })
      events.push({ type: 'vault_forfeit', marked: marked.size, vaultCents })
      events.push({ type: 'fs_end', fsWinCents: capCents - fsStartTotal })
      return { roundTotalCents: capCents, capped: true }
    }
  }

  // Round end: vault pays only at 20/20, then the cap still applies to the total.
  if (marked.size >= VAULT_TOTAL_POSITIONS) {
    events.push({ type: 'vault_award', vaultCents })
    total += vaultCents
    if (total > capCents) {
      events.push({ type: 'win_cap_clamp', rawCents: total, cappedCents: capCents })
      total = capCents
    }
  } else {
    events.push({ type: 'vault_forfeit', marked: marked.size, vaultCents })
  }

  events.push({ type: 'fs_end', fsWinCents: total - fsStartTotal })
  return { roundTotalCents: total, capped: false }
}
