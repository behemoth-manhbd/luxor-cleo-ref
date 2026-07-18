import type { Board, CellPos, SpinMode, SymbolId, SymbolWin } from './types'
import { REELS, ROWS } from './types'
import type { Rng } from './rng'
import { randInt } from './rng'
import { SCATTER_PAY_X100, scatterBand } from './config/paytable'
import { evaluateWays } from './ways'
import type { EngineConfig } from './config/engineConfig'

export interface SpinResult {
  board: Board
  wins: SymbolWin[]
  /** ways wins for this spin (with wild multipliers applied) */
  lineWinCents: number
  scatterCount: number
  /** base-game scatter award (0 in FS unless fsScatterPaysCash) */
  scatterPayCents: number
  wildMultiplierCount: number
  cleopatraCells: CellPos[]
}

/** Draw order per board fill: one stop index per reel, reel 1 → reel 5. */
export function fillBoard(rng: Rng, strips: SymbolId[][]): Board {
  const board: Board = []
  for (let reel = 0; reel < REELS; reel++) {
    const strip = strips[reel]
    if (!strip || strip.length < ROWS) throw new Error(`strip ${reel} too short`)
    const stop = randInt(rng, strip.length)
    const column: SymbolId[] = []
    for (let row = 0; row < ROWS; row++) column.push(strip[(stop + row) % strip.length]!)
    board.push(column)
  }
  return board
}

/** Pure evaluation of an already-landed board (no RNG). */
export function resolveBoard(
  board: Board,
  betCents: number,
  mode: SpinMode,
  cfg: EngineConfig,
): SpinResult {
  const wins = evaluateWays(board, betCents, mode, {
    wildSelfMultiplier: cfg.wildSelfMultiplier,
  })
  const lineWinCents = wins.reduce((sum, w) => sum + w.winCents, 0)

  let scatterCount = 0
  let wildMultiplierCount = 0
  const cleopatraCells: CellPos[] = []
  board.forEach((column, reel) =>
    column.forEach((cell, row) => {
      if (cell === 'scatter_lotus') scatterCount++
      if (cell === 'wild_multiplier') wildMultiplierCount++
      if (cell === 'cleopatra') cleopatraCells.push({ reel, row })
    }),
  )

  const band = scatterBand(scatterCount)
  const paysCash = mode === 'base' || cfg.fsScatterPaysCash
  const scatterPayCents =
    band && paysCash ? Math.round((SCATTER_PAY_X100[band]! * betCents) / 100) : 0

  return {
    board,
    wins,
    lineWinCents,
    scatterCount,
    scatterPayCents,
    wildMultiplierCount,
    cleopatraCells,
  }
}

export function spin(
  rng: Rng,
  betCents: number,
  mode: SpinMode,
  strips: SymbolId[][],
  cfg: EngineConfig,
): SpinResult {
  const board = cfg.boardQueue?.length ? cfg.boardQueue.shift()! : fillBoard(rng, strips)
  return resolveBoard(board, betCents, mode, cfg)
}

/** Test/docs helper: build a [reel][row] board from row-major text-order rows. */
export function boardFromRows(rows: SymbolId[][]): Board {
  if (rows.length !== ROWS || rows.some((r) => r.length !== REELS)) {
    throw new Error('boardFromRows expects 4 rows × 5 cols')
  }
  const board: Board = []
  for (let reel = 0; reel < REELS; reel++) {
    const column: SymbolId[] = []
    for (let row = 0; row < ROWS; row++) column.push(rows[row]![reel]!)
    board.push(column)
  }
  return board
}
