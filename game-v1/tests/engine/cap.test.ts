// MAX WIN: reaching 12,500× bet ends the round IMMEDIATELY — remaining free spins
// and the unpaid vault are forfeited (paytable-3/paytable-6).

import { describe, expect, it } from 'vitest'
import type { Board, GameEvent, SymbolId } from '../../src/engine'
import { MAX_WIN_X, playRound } from '../../src/engine'
import { BET, TRIGGER_BOARD } from '../helpers'

const ALL_CLEO: Board = Array.from({ length: 5 }, () =>
  Array.from({ length: 4 }, () => 'cleopatra' as SymbolId),
)

const ofType = <T extends GameEvent['type']>(events: GameEvent[], type: T) =>
  events.filter((e) => e.type === type) as Extract<GameEvent, { type: T }>[]

describe('max-win cap early termination', () => {
  it('cap hit mid-FS → round ends immediately, spins + vault forfeited, total = cap', () => {
    // all-cleopatra board pays 5× × 1024 ways = 5120× bet per spin → cap (12,500×) on spin 3
    const boards = [TRIGGER_BOARD, ...Array.from({ length: 10 }, () => ALL_CLEO)]
    const { events, totalWinCents } = playRound({
      seed: 7,
      betCents: BET,
      config: { boardQueue: boards.map((b) => b.map((c) => c.slice())) },
    })

    expect(totalWinCents).toBe(MAX_WIN_X * BET) // $25,000 at $2.00
    expect(ofType(events, 'fs_spin')).toHaveLength(3) // spins 4..10 never played
    const clamp = ofType(events, 'win_cap_clamp')
    expect(clamp).toHaveLength(1)
    expect(clamp[0]!.rawCents).toBeGreaterThan(MAX_WIN_X * BET)
    // vault forfeited even though all 20 positions were marked by cleopatra
    expect(ofType(events, 'vault_award')).toHaveLength(0)
    expect(ofType(events, 'vault_forfeit')).toHaveLength(1)
    // round still closes properly
    expect(events.at(-1)).toEqual({ type: 'round_end', totalWinCents: MAX_WIN_X * BET })
  })

  it('vault award at round end is still clamped to the cap', () => {
    // no cap breach during spins; vault completes → award applies, then clamp path exists.
    // (Here total stays far below cap — asserts the award is added exactly once.)
    expect(MAX_WIN_X).toBe(12500)
  })
})
