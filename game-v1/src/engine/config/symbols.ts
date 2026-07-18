import type { SpinMode, SymbolId } from '../types'
import { PAY_X100 } from './paytable'

export const ALL_SYMBOLS: SymbolId[] = [
  'cleopatra',
  'gold_scarab',
  'ankh_ring',
  'cleopatra_coin',
  'eye_of_horus',
  'sym_a',
  'sym_k',
  'sym_q',
  'sym_j',
  'sym_10',
  'sym_9',
  'wild_pyramid',
  'wild_multiplier',
  'scatter_lotus',
]

/** Symbols with their own left-to-right ways pay (scatter excluded — pays anywhere). */
export const PAYING_SYMBOLS = Object.keys(PAY_X100) as SymbolId[]

/** Minimum consecutive reels from reel 1. Derived from the verified paytable bands. */
export function minCount(sym: SymbolId): number {
  const pays = PAY_X100[sym]
  if (!pays) return Infinity
  return Math.min(...Object.keys(pays).map(Number))
}

/** wild_pyramid: base wild, reels 2/3/4 only. wild_multiplier: free-spins-only wild. */
export function isWildFor(cell: SymbolId, mode: SpinMode): boolean {
  if (cell === 'wild_pyramid') return true
  if (cell === 'wild_multiplier') return mode === 'freeSpins'
  return false
}
