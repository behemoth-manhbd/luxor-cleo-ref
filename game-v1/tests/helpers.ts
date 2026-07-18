import type { Board, SymbolId } from '../src/engine'
import { boardFromRows } from '../src/engine'

const CODES: Record<string, SymbolId> = {
  cl: 'cleopatra',
  sb: 'gold_scarab',
  rg: 'ankh_ring',
  co: 'cleopatra_coin',
  ey: 'eye_of_horus',
  a: 'sym_a',
  k: 'sym_k',
  q: 'sym_q',
  j: 'sym_j',
  t: 'sym_10',
  n: 'sym_9',
  wp: 'wild_pyramid',
  wm: 'wild_multiplier',
  sc: 'scatter_lotus',
}

/** Parse a 4×5 whitespace grid of short codes (row-major, like the docs) into a Board. */
export function grid(text: string): Board {
  const rows = text
    .trim()
    .split('\n')
    .map((line) =>
      line
        .trim()
        .split(/\s+/)
        .map((code) => {
          const sym = CODES[code]
          if (!sym) throw new Error(`unknown symbol code: ${code}`)
          return sym
        }),
    )
  return boardFromRows(rows)
}

export const BET = 200 // $2.00 — matches the reference capture and docs conventions

/** Base board: exactly 3 scatters, zero ways wins. */
export const TRIGGER_BOARD = grid(`
  sc q  a  j  n
  a  sc k  q  t
  n  j  sc t  k
  k  t  q  a  j
`)

/** Neutral board: no wins, no cleopatra, no wilds, no scatters. */
export const NEUTRAL_BOARD = grid(`
  n  a  k  j  n
  t  k  q  a  j
  j  co n  t  q
  q  ey t  k  a
`)

/** One full reel of cleopatra (reel = 0..4), other reels neutral, no wins possible. */
export function fullCleoReel(reel: number, cleoRows = 4): Board {
  const columns: SymbolId[][] = [
    ['sym_9', 'sym_10', 'sym_j', 'sym_q'],
    ['sym_a', 'sym_k', 'cleopatra_coin', 'eye_of_horus'],
    ['sym_k', 'sym_q', 'sym_9', 'sym_10'],
    ['sym_j', 'sym_a', 'sym_10', 'sym_k'],
    ['sym_9', 'sym_j', 'sym_q', 'sym_a'],
  ]
  const col: SymbolId[] = []
  for (let row = 0; row < 4; row++) {
    col.push(row < cleoRows ? 'cleopatra' : columns[reel]![row]!)
  }
  const board = columns.map((c) => c.slice())
  board[reel] = col
  return board
}
