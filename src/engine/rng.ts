// Deterministic PRNG stub (mulberry32). Contract: same (seed, stake, mode) ⇒ identical
// event stream. The draw ORDER is part of the golden-snapshot contract — new draws may
// only be appended at documented positions (see round.ts / freeSpins.ts comments).

export type Rng = () => number

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function randInt(rng: Rng, n: number): number {
  return Math.floor(rng() * n)
}

export function pick<T>(rng: Rng, arr: readonly T[]): T {
  const v = arr[randInt(rng, arr.length)]
  if (v === undefined) throw new Error('pick from empty array')
  return v
}

/** k distinct elements, order deterministic given rng state (partial Fisher-Yates). */
export function sample<T>(rng: Rng, arr: readonly T[], k: number): T[] {
  const copy = arr.slice()
  const n = Math.min(k, copy.length)
  for (let i = 0; i < n; i++) {
    const j = i + randInt(rng, copy.length - i)
    const a = copy[i]!
    copy[i] = copy[j]!
    copy[j] = a
  }
  return copy.slice(0, n)
}
