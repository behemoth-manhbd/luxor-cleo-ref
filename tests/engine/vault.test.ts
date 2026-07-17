import { describe, expect, it } from 'vitest'
import type { Board, GameEvent } from '../../src/engine'
import { VAULT_INCREMENTS_X100, playRound } from '../../src/engine'
import { BET, NEUTRAL_BOARD, TRIGGER_BOARD, fullCleoReel, grid } from '../helpers'

function playWithBoards(boards: Board[], seed = 42) {
  return playRound({
    seed,
    betCents: BET,
    config: { boardQueue: boards.map((b) => b.map((c) => c.slice())) },
  })
}

const ofType = <T extends GameEvent['type']>(events: GameEvent[], type: T) =>
  events.filter((e) => e.type === type) as Extract<GameEvent, { type: T }>[]

describe('vault', () => {
  it('20/20 marked → vault pays 20× bet on top ($40.00 at $2.00)', () => {
    // spin1 marks reel1 (4) → init marks 8 of reels 2-4 → spins 2-4 complete reels 2-4
    // → spin5 marks reel5 (4) = 20/20. Spins 6-10 neutral.
    const boards = [
      TRIGGER_BOARD,
      fullCleoReel(0),
      fullCleoReel(1),
      fullCleoReel(2),
      fullCleoReel(3),
      fullCleoReel(4),
      ...Array.from({ length: 5 }, () => NEUTRAL_BOARD),
    ]
    const { events, totalWinCents } = playWithBoards(boards)
    const award = ofType(events, 'vault_award')
    expect(award).toHaveLength(1)
    expect(award[0]!.vaultCents).toBe(20 * BET)
    // total = 1× scatter pay ($2.00) + vault $40.00 — cleo full-reel boards pay nothing
    expect(totalWinCents).toBe(200 + 20 * BET)
  })

  it('19/20 marked → all-or-nothing forfeit, vault pays $0', () => {
    const boards = [
      TRIGGER_BOARD,
      fullCleoReel(0),
      fullCleoReel(1),
      fullCleoReel(2),
      fullCleoReel(3),
      fullCleoReel(4, 3), // only 3 of 4 rows on reel 5 → 19/20
      ...Array.from({ length: 5 }, () => NEUTRAL_BOARD),
    ]
    const { events, totalWinCents } = playWithBoards(boards)
    expect(ofType(events, 'vault_award')).toHaveLength(0)
    const forfeit = ofType(events, 'vault_forfeit')
    expect(forfeit).toHaveLength(1)
    expect(forfeit[0]!.marked).toBe(19)
    expect(totalWinCents).toBe(200) // scatter pay only
  })

  it('8 init marks land on reels 2/3/4 AFTER the first free spin', () => {
    const boards = [TRIGGER_BOARD, ...Array.from({ length: 10 }, () => NEUTRAL_BOARD)]
    const { events } = playWithBoards(boards)
    const init = ofType(events, 'vault_init_marks')
    expect(init).toHaveLength(1)
    expect(init[0]!.positions).toHaveLength(8)
    for (const p of init[0]!.positions) {
      expect(p.reel).toBeGreaterThanOrEqual(1)
      expect(p.reel).toBeLessThanOrEqual(3)
    }
    // emitted after the first fs spin's board, not before
    const firstLand = events.findIndex((e, i) => e.type === 'reels_land' && i > 0)
    expect(events.findIndex((e) => e.type === 'vault_init_marks')).toBeGreaterThan(firstLand)
  })

  it('wild hit adds a random draw from the 1-wild table (never a fixed +10×)', () => {
    const oneWild = grid(`
      k  wm k  a  n
      a  q  q  j  t
      n  j  j  q  a
      t  a  co t  j
    `)
    const boards = [TRIGGER_BOARD, oneWild, ...Array.from({ length: 9 }, () => NEUTRAL_BOARD)]
    const { events } = playWithBoards(boards)
    const updates = ofType(events, 'vault_update').filter((e) => e.wildAddCents > 0)
    expect(updates).toHaveLength(1)
    const allowed = VAULT_INCREMENTS_X100[1].map((x) => Math.round((x * BET) / 100))
    expect(allowed).toContain(updates[0]!.wildAddCents)
  })

  it('two wilds in one spin draw from the 2-wild table', () => {
    const twoWilds = grid(`
      k  wm k  wm q
      a  q  q  a  j
      n  j  j  n  co
      t  a  co t  ey
    `)
    const boards = [TRIGGER_BOARD, twoWilds, ...Array.from({ length: 9 }, () => NEUTRAL_BOARD)]
    const { events } = playWithBoards(boards)
    const updates = ofType(events, 'vault_update').filter((e) => e.wildAddCents > 0)
    const allowed = VAULT_INCREMENTS_X100[2].map((x) => Math.round((x * BET) / 100))
    expect(allowed).toContain(updates[0]!.wildAddCents)
  })

  it('scatters during FS add 10× to the vault and NEVER retrigger', () => {
    const boards = [
      TRIGGER_BOARD,
      TRIGGER_BOARD, // 3 scatters inside FS
      ...Array.from({ length: 9 }, () => NEUTRAL_BOARD),
    ]
    const { events, totalWinCents } = playWithBoards(boards)
    expect(ofType(events, 'fs_trigger')).toHaveLength(1) // no retrigger
    expect(ofType(events, 'fs_spin')).toHaveLength(10) // still exactly 10 spins
    const scatterAdds = ofType(events, 'vault_update').filter((e) => e.scatterAddCents > 0)
    expect(scatterAdds).toHaveLength(1)
    expect(scatterAdds[0]!.scatterAddCents).toBe(10 * BET)
    // FS scatters pay no cash by default → total is the base scatter pay only
    expect(totalWinCents).toBe(200)
  })
})
