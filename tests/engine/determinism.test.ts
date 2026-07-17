import { describe, expect, it } from 'vitest'
import { playRound } from '../../src/engine'
import { BET } from '../helpers'

describe('determinism / replay contract', () => {
  it('same (seed, stake, mode) ⇒ identical event stream', () => {
    for (const seed of [1, 7, 1234, 987654]) {
      const a = playRound({ seed, betCents: BET })
      const b = playRound({ seed, betCents: BET })
      expect(JSON.stringify(b.events)).toBe(JSON.stringify(a.events))
      expect(b.totalWinCents).toBe(a.totalWinCents)

      const c = playRound({ seed, betCents: BET, buy: true })
      const d = playRound({ seed, betCents: BET, buy: true })
      expect(JSON.stringify(d.events)).toBe(JSON.stringify(c.events))
    }
  })

  it('different seeds diverge (sanity)', () => {
    const a = playRound({ seed: 1, betCents: BET })
    const b = playRound({ seed: 2, betCents: BET })
    expect(JSON.stringify(a.events)).not.toBe(JSON.stringify(b.events))
  })

  it('win scales with bet: same seed at 2× bet pays exactly 2× (pay values are ×bet)', () => {
    const a = playRound({ seed: 31337, betCents: 200 })
    const b = playRound({ seed: 31337, betCents: 400 })
    expect(b.totalWinCents).toBe(a.totalWinCents * 2)
  })
})
