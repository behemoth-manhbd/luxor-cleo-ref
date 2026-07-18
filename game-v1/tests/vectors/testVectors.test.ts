// Golden worked examples — expected values computed from the VERIFIED paytable
// (screenshots paytable-1/2). Bet = $2.00 so bet-multiplication bugs surface.

import { describe, expect, it } from 'vitest'
import { evaluateWays } from '../../src/engine'
import { BET, grid } from '../helpers'

const win = (wins: ReturnType<typeof evaluateWays>, symbol: string) =>
  wins.find((w) => w.symbol === symbol)

describe('test vectors (base game)', () => {
  it('TV-A: no-win board pays $0.00', () => {
    const wins = evaluateWays(
      grid(`
        n  a  k  j  n
        t  k  q  a  j
        j  co n  t  q
        q  ey t  k  a
      `),
      BET,
      'base',
    )
    expect(wins).toEqual([])
  })

  it('TV-B: cleopatra pays from 2 reels — $0.50', () => {
    const wins = evaluateWays(
      grid(`
        cl cl k  j  n
        a  n  q  a  j
        t  j  k  t  q
        q  t  n  k  a
      `),
      BET,
      'base',
    )
    const cleo = win(wins, 'cleopatra')
    expect(cleo).toMatchObject({ reelsMatched: 2, ways: 1, winCents: 50 })
    expect(wins.reduce((s, w) => s + w.winCents, 0)).toBe(50)
  })

  it('TV-B2: sym_9 pays from 2 reels — $0.20 (only low symbol with a 2-band)', () => {
    const wins = evaluateWays(
      grid(`
        n  n  k  j  q
        a  k  q  a  j
        t  co j  t  a
        j  ey t  k  k
      `),
      BET,
      'base',
    )
    expect(win(wins, 'sym_9')).toMatchObject({ reelsMatched: 2, ways: 1, winCents: 20 })
    expect(wins.reduce((s, w) => s + w.winCents, 0)).toBe(20)
  })

  it('TV-B3: sym_10 on 2 reels pays NOTHING (min count is 3)', () => {
    const wins = evaluateWays(
      grid(`
        t  t  k  j  q
        a  k  q  a  j
        n  co j  t  a
        j  ey n  k  k
      `),
      BET,
      'base',
    )
    expect(win(wins, 'sym_10')).toBeUndefined()
    expect(wins).toEqual([])
  })

  it('TV-C: cleopatra_coin 3-of pays $2.00', () => {
    const wins = evaluateWays(
      grid(`
        co co co k  n
        a  k  q  a  t
        n  t  j  q  a
        j  q  t  j  k
      `),
      BET,
      'base',
    )
    expect(win(wins, 'cleopatra_coin')).toMatchObject({ reelsMatched: 3, winCents: 200 })
    expect(wins.reduce((s, w) => s + w.winCents, 0)).toBe(200)
  })

  it('TV-D: cleopatra_coin 4-of pays $5.00 (band boundary 3→4)', () => {
    const wins = evaluateWays(
      grid(`
        co co co co n
        a  k  q  a  t
        n  t  j  q  a
        j  q  t  j  k
      `),
      BET,
      'base',
    )
    expect(win(wins, 'cleopatra_coin')).toMatchObject({ reelsMatched: 4, winCents: 500 })
  })

  it('TV-E: two symbols win simultaneously — $0.50 + $2.00 = $2.50', () => {
    const wins = evaluateWays(
      grid(`
        a  a  a  n  q
        ey ey ey t  j
        n  k  j  k  t
        t  q  q  j  n
      `),
      BET,
      'base',
    )
    expect(win(wins, 'sym_a')).toMatchObject({ reelsMatched: 3, winCents: 50 })
    expect(win(wins, 'eye_of_horus')).toMatchObject({ reelsMatched: 3, winCents: 200 })
    expect(wins.reduce((s, w) => s + w.winCents, 0)).toBe(250)
  })

  it('TV-F: gold_scarab 3-of via wild_pyramid = $4.00 (2×, NOT the stale 0.5×)', () => {
    const wins = evaluateWays(
      grid(`
        sb wp sb a  n
        a  a  q  k  t
        n  k  t  q  j
        k  q  j  j  k
      `),
      BET,
      'base',
    )
    expect(win(wins, 'gold_scarab')).toMatchObject({ reelsMatched: 3, ways: 1, winCents: 400 })
    // the pyramid also bridges sym_9 reel1 → 2-of $0.20 (substitutes for everything)
    expect(win(wins, 'sym_9')).toMatchObject({ reelsMatched: 2, winCents: 20 })
    expect(wins.reduce((s, w) => s + w.winCents, 0)).toBe(420)
  })

  it('TV-J: cleopatra 5-of stacked → ways = 2×2×1×1×1 = 4 → $40.00', () => {
    const wins = evaluateWays(
      grid(`
        cl cl cl cl cl
        cl cl q  j  n
        n  k  t  q  a
        t  j  k  n  j
      `),
      BET,
      'base',
    )
    expect(win(wins, 'cleopatra')).toMatchObject({ reelsMatched: 5, ways: 4, winCents: 4000 })
    expect(wins.reduce((s, w) => s + w.winCents, 0)).toBe(4000)
  })

  it('only the highest band pays per symbol (no 2-of + 3-of double pay)', () => {
    const wins = evaluateWays(
      grid(`
        cl cl cl k  n
        a  k  q  a  t
        n  t  j  q  a
        j  q  t  j  k
      `),
      BET,
      'base',
    )
    const cleoWins = wins.filter((w) => w.symbol === 'cleopatra')
    expect(cleoWins).toHaveLength(1)
    expect(cleoWins[0]).toMatchObject({ reelsMatched: 3, winCents: 500 })
  })
})

describe('test vectors (free spins — wild multiplier)', () => {
  it('TV-H: one ×2 wild in the way doubles it — sym_k 3-of $0.50 → $1.00', () => {
    const wins = evaluateWays(
      grid(`
        k  wm k  a  n
        a  q  q  j  t
        n  j  j  q  a
        t  a  co t  j
      `),
      BET,
      'freeSpins',
    )
    const k = win(wins, 'sym_k')
    expect(k).toMatchObject({ reelsMatched: 3, ways: 1, baseWinCents: 50, winCents: 100 })
    // the wild also bridges sym_9 → 2-of, doubled: $0.20 → $0.40
    expect(win(wins, 'sym_9')).toMatchObject({ reelsMatched: 2, baseWinCents: 20, winCents: 40 })
  })

  it('TV-I: two ×2 wilds in one way multiply (×4, not ×3) — sym_k 4-of $3.00 → $12.00', () => {
    const wins = evaluateWays(
      grid(`
        k  wm k  wm q
        a  q  q  a  j
        n  j  j  n  co
        t  a  co t  ey
      `),
      BET,
      'freeSpins',
    )
    const k = win(wins, 'sym_k')
    expect(k).toMatchObject({ reelsMatched: 4, ways: 1, baseWinCents: 300, winCents: 1200 })
  })

  it('wild_multiplier pays its OWN paytable from 2 reels ($1.00), no self-doubling by default', () => {
    const wins = evaluateWays(
      grid(`
        wm wm k  a  n
        a  q  q  j  t
        n  j  j  q  a
        t  a  co t  j
      `),
      BET,
      'freeSpins',
    )
    const wm = win(wins, 'wild_multiplier')
    expect(wm).toMatchObject({ reelsMatched: 2, ways: 1, winCents: 100 })
    // [AMBIGUOUS] config on: pure-wild combo doubles per wild → ×4
    const winsSelf = evaluateWays(
      grid(`
        wm wm k  a  n
        a  q  q  j  t
        n  j  j  q  a
        t  a  co t  j
      `),
      BET,
      'freeSpins',
      { wildSelfMultiplier: true },
    )
    expect(win(winsSelf, 'wild_multiplier')?.winCents).toBe(400)
  })

  it('wild_multiplier never pays/substitutes in base mode', () => {
    const wins = evaluateWays(
      grid(`
        k  wm k  a  n
        a  q  q  j  t
        n  j  j  q  a
        t  a  co t  j
      `),
      BET,
      'base',
    )
    expect(win(wins, 'sym_k')).toBeUndefined()
    expect(win(wins, 'wild_multiplier')).toBeUndefined()
  })
})
