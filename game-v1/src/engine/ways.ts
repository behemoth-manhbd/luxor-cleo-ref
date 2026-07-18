// 1024-ways evaluation. VERIFIED win rule (paytable-1/4 + live corroboration):
//   win = pay(reelsMatched) × totalBet × ways
//   ways = product of the symbol's effective count on each consecutive reel from reel 1
// "Only the highest win is paid per way": each symbol pays only its longest run band.
// Wild ×2 handling uses per-reel weight sums — mathematically identical to enumerating
// every way and multiplying 2^(wilds in that way), because
//   Σ_ways Π mult(cell) = Π_reels Σ_cells mult(cell).

import type { Board, CellPos, SpinMode, SymbolWin } from './types'
import { REELS } from './types'
import { PAY_X100 } from './config/paytable'
import { PAYING_SYMBOLS, isWildFor, minCount } from './config/symbols'

export interface EvalOptions {
  wildSelfMultiplier?: boolean
}

export function evaluateWays(
  board: Board,
  betCents: number,
  mode: SpinMode,
  opts: EvalOptions = {},
): SymbolWin[] {
  const wins: SymbolWin[] = []

  for (const sym of PAYING_SYMBOLS) {
    if (sym === 'wild_multiplier' && mode !== 'freeSpins') continue
    const pays = PAY_X100[sym]
    if (!pays) continue

    let ways = 1
    let weight = 1
    let matched = 0

    for (let reel = 0; reel < REELS; reel++) {
      const column = board[reel]
      if (!column) break
      let own = 0
      let pyramids = 0
      let multWilds = 0
      for (const cell of column) {
        if (cell === sym) own++
        else if (sym !== 'wild_multiplier' && isWildFor(cell, mode)) {
          if (cell === 'wild_multiplier') multWilds++
          else pyramids++
        }
      }
      const eff = own + pyramids + multWilds
      if (eff === 0) break
      matched++
      ways *= eff
      // weight: each wild_multiplier cell doubles every way passing through it.
      // When the paying symbol IS wild_multiplier, self-doubling is [AMBIGUOUS] → config.
      const ownWeight = sym === 'wild_multiplier' && opts.wildSelfMultiplier ? own * 2 : own
      weight *= ownWeight + pyramids + multWilds * 2
    }

    if (matched < minCount(sym)) continue
    const payX100 = pays[matched]
    if (payX100 === undefined) continue

    const baseWinCents = Math.round((payX100 * betCents * ways) / 100)
    const winCents = Math.round((payX100 * betCents * weight) / 100)
    wins.push({ symbol: sym, reelsMatched: matched, ways, baseWinCents, winCents })
  }

  return wins
}

/** Cells participating in wins — for presentation highlighting. */
export function winningCells(board: Board, wins: SymbolWin[], mode: SpinMode): CellPos[] {
  const seen = new Set<string>()
  const cells: CellPos[] = []
  for (const win of wins) {
    for (let reel = 0; reel < win.reelsMatched; reel++) {
      const column = board[reel]
      if (!column) continue
      column.forEach((cell, row) => {
        const isPart =
          cell === win.symbol || (win.symbol !== 'wild_multiplier' && isWildFor(cell, mode))
        if (!isPart) return
        const key = `${reel},${row}`
        if (seen.has(key)) return
        seen.add(key)
        cells.push({ reel, row })
      })
    }
  }
  return cells
}
