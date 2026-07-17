import { describe, expect, it } from 'vitest'
import type { GameEvent } from '../../src/engine'
import { playRound } from '../../src/engine'
import { BET } from '../helpers'

const ofType = <T extends GameEvent['type']>(events: GameEvent[], type: T) =>
  events.filter((e) => e.type === type) as Extract<GameEvent, { type: T }>[]

describe('buy feature', () => {
  it('costs exactly 30× bet ($60.00 at $2.00) and always lands exactly 3 scatters', () => {
    for (const seed of [1, 2, 3, 99, 12345]) {
      const { events, costCents } = playRound({ seed, betCents: BET, buy: true })
      expect(costCents).toBe(30 * BET)
      expect(ofType(events, 'bet_deduct')[0]!.amountCents).toBe(30 * BET)

      const board = ofType(events, 'reels_land')[0]!.board
      const scatters = board.flat().filter((s) => s === 'scatter_lotus').length
      expect(scatters).toBe(3)

      const trigger = ofType(events, 'fs_trigger')
      expect(trigger).toHaveLength(1)
      expect(trigger[0]!).toMatchObject({ scatters: 3, spinsAwarded: 10 })
      expect(ofType(events, 'fs_spin')).toHaveLength(10)
    }
  })

  it('pays the 1× scatter award on the bought trigger (live-corroborated $2.00)', () => {
    const { events } = playRound({ seed: 5, betCents: BET, buy: true })
    const detect = ofType(events, 'win_detect')[0]!
    expect(detect.spinWinCents).toBeGreaterThanOrEqual(200) // ≥ scatter pay; line wins may add
  })

  it('buyPaysScatter=false drops the scatter award (config flag)', () => {
    const withPay = playRound({ seed: 5, betCents: BET, buy: true })
    const withoutPay = playRound({
      seed: 5,
      betCents: BET,
      buy: true,
      config: { buyPaysScatter: false },
    })
    const first = (r: typeof withPay) => ofType(r.events, 'win_detect')[0]!.spinWinCents
    expect(first(withPay) - first(withoutPay)).toBe(200)
  })
})
