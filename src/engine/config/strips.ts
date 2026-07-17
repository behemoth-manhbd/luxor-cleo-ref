// Reel strips — TUNABLE placeholders. Real strip weights are proprietary and NOT
// derivable from any evidence; these exist only so the game runs and are tuned
// by simulation (scripts/simulate.ts) toward RTP 96.51% base / 96.56% buy.
// Constraints that ARE verified: wild_pyramid only on reels 2/3/4 (base);
// wild_multiplier on all reels but ONLY in free spins ("special reels", paytable-3).

import type { SymbolId } from '../types'

type Weights = Array<[SymbolId, number]>

function expand(weights: Weights): SymbolId[] {
  const strip: SymbolId[] = []
  // interleave round-robin so identical symbols are spread along the strip
  const pools = weights.map(([sym, n]) => ({ sym, left: n }))
  let remaining = pools.reduce((s, p) => s + p.left, 0)
  let i = 0
  while (remaining > 0) {
    const p = pools[i % pools.length]!
    if (p.left > 0) {
      strip.push(p.sym)
      p.left--
      remaining--
    }
    i++
  }
  return strip
}

// TUNABLE — tuned by simulation, see git history for iterations
const BASE_LOW: Weights = [
  ['sym_9', 12],
  ['sym_10', 12],
  ['sym_j', 12],
  ['sym_q', 12],
  ['sym_k', 12],
  ['sym_a', 12],
]

const BASE_HIGH: Weights = [
  ['eye_of_horus', 12],
  ['cleopatra_coin', 12],
  ['ankh_ring', 12],
  ['gold_scarab', 12],
  ['cleopatra', 12],
]

// TUNABLE per-reel densities (tuned by simulation against 96.51% / 96.56%)
const BASE_SCATTER_W = [2, 2, 3, 2, 2]
const BASE_PYRAMID_W = [0, 1, 1, 1, 0] // reels 2/3/4 only (verified constraint)
const FS_WILD_W = [2, 3, 2, 3, 2]

function baseReel(reel: number): SymbolId[] {
  const w: Weights = [...BASE_LOW, ...BASE_HIGH, ['scatter_lotus', BASE_SCATTER_W[reel]!]]
  if (BASE_PYRAMID_W[reel]! > 0) w.push(['wild_pyramid', BASE_PYRAMID_W[reel]!])
  return expand(w)
}

function fsReel(reel: number): SymbolId[] {
  const w: Weights = [
    ...BASE_LOW,
    ...BASE_HIGH,
    ['cleopatra', 1], // extra cleopatra in FS (marking symbol) — TUNABLE
    ['scatter_lotus', 2],
    ['wild_multiplier', FS_WILD_W[reel]!],
  ]
  return expand(w)
}

/** Base game strips: wild_pyramid appears on reels 2/3/4 only (index 1..3). */
export const BASE_STRIPS: SymbolId[][] = [0, 1, 2, 3, 4].map(baseReel)

/** Free-spins "special reels": wild_multiplier on all reels, no wild_pyramid. */
export const FS_STRIPS: SymbolId[][] = [0, 1, 2, 3, 4].map(fsReel)

/** Buy-feature strips: base strips with scatters removed (the 3 scatters are forced). */
export const BASE_STRIPS_NO_SCATTER: SymbolId[][] = BASE_STRIPS.map((strip) =>
  strip.filter((s) => s !== 'scatter_lotus'),
)
