// Property test: the per-reel weight-sum shortcut must equal brute-force enumeration
// of every way (path) with per-way wild ×2 multipliers — on random boards, both modes.

import { describe, expect, it } from 'vitest'
import type { Board, SpinMode, SymbolId } from '../../src/engine'
import {
  ALL_SYMBOLS,
  PAY_X100,
  PAYING_SYMBOLS,
  REELS,
  ROWS,
  evaluateWays,
  isWildFor,
  minCount,
  mulberry32,
  randInt,
} from '../../src/engine'
import { BET } from '../helpers'

function randomBoard(rng: () => number, mode: SpinMode): Board {
  const pool = ALL_SYMBOLS.filter((s) => s !== (mode === 'base' ? 'wild_multiplier' : 'wild_pyramid'))
  const board: Board = []
  for (let reel = 0; reel < REELS; reel++) {
    const col: SymbolId[] = []
    for (let row = 0; row < ROWS; row++) {
      let sym = pool[randInt(rng, pool.length)]!
      // wild_pyramid only exists on reels 2/3/4
      while (sym === 'wild_pyramid' && (reel === 0 || reel === 4)) {
        sym = pool[randInt(rng, pool.length)]!
      }
      col.push(sym)
    }
    board.push(col)
  }
  return board
}

/** Brute force: enumerate every way, multiply per-cell (×2 for wild_multiplier). */
function enumerateWin(board: Board, sym: SymbolId, mode: SpinMode): number {
  const pays = PAY_X100[sym]
  if (!pays) return 0
  const cellMults: number[][] = []
  for (let reel = 0; reel < REELS; reel++) {
    const mults: number[] = []
    for (const cell of board[reel]!) {
      if (cell === sym) mults.push(cell === 'wild_multiplier' ? 1 : 1)
      else if (sym !== 'wild_multiplier' && isWildFor(cell, mode)) {
        mults.push(cell === 'wild_multiplier' ? 2 : 1)
      }
    }
    if (mults.length === 0) break
    cellMults.push(mults)
  }
  const matched = cellMults.length
  if (matched < minCount(sym)) return 0
  const payX100 = pays[matched]
  if (payX100 === undefined) return 0

  // sum over all paths of the product of cell multipliers
  let paths = [1]
  for (const mults of cellMults) {
    const next: number[] = []
    for (const p of paths) for (const m of mults) next.push(p * m)
    paths = next
  }
  const weight = paths.reduce((s, x) => s + x, 0)
  return Math.round((payX100 * BET * weight) / 100)
}

describe('ways weight-sum ≡ brute-force way enumeration', () => {
  for (const mode of ['base', 'freeSpins'] as const) {
    it(`${mode}: 300 random boards agree symbol-by-symbol`, () => {
      const rng = mulberry32(mode === 'base' ? 1111 : 2222)
      for (let i = 0; i < 300; i++) {
        const board = randomBoard(rng, mode)
        const wins = evaluateWays(board, BET, mode)
        for (const sym of PAYING_SYMBOLS) {
          if (sym === 'wild_multiplier' && mode === 'base') continue
          const fast = wins.find((w) => w.symbol === sym)?.winCents ?? 0
          const brute = enumerateWin(board, sym, mode)
          expect(fast, `${mode} board#${i} ${sym}`).toBe(brute)
        }
      }
    })
  }
})
