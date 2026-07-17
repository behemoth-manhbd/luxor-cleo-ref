// VERIFIED paytable — read from in-game GAME RULES screenshots (paytable-1/paytable-2),
// values are total-bet multipliers × 100 (integers, avoids float drift).
// Source of truth: docs/luxor-of-cleopatra-v3/screenshots + docs/ai-agent-problems.md.

import type { SymbolId } from '../types'

/** payX100[symbol][reelsMatched]. Absent key = that count does not pay. */
export const PAY_X100: Partial<Record<SymbolId, Record<number, number>>> = {
  cleopatra: { 2: 25, 3: 250, 4: 375, 5: 500 },
  gold_scarab: { 2: 10, 3: 200, 4: 300, 5: 400 },
  ankh_ring: { 2: 10, 3: 200, 4: 300, 5: 400 },
  cleopatra_coin: { 3: 100, 4: 250, 5: 350 },
  eye_of_horus: { 3: 100, 4: 250, 5: 350 },
  sym_a: { 3: 25, 4: 150, 5: 300 },
  sym_k: { 3: 25, 4: 150, 5: 300 },
  sym_q: { 3: 15, 4: 100, 5: 250 },
  sym_j: { 3: 15, 4: 100, 5: 250 },
  sym_10: { 3: 15, 4: 50, 5: 200 },
  // sym_9 is the ONLY low symbol with a 2-of-a-kind pay (confirmed by zoomed screenshot)
  sym_9: { 2: 10, 3: 15, 4: 50, 5: 200 },
  // wild_multiplier has its OWN paytable (free spins only); wild_pyramid pays nothing
  wild_multiplier: { 2: 50, 3: 500, 4: 1250, 5: 2500 },
}

/** Scatter pays anywhere (no ways), base game: 3→1×, 4→5×, 5→25× total bet. */
export const SCATTER_PAY_X100: Record<number, number> = { 3: 100, 4: 500, 5: 2500 }

/** Scatters landing DURING free spins add to the VAULT instead: 3→10×, 4→50×, 5→250×. */
export const FS_SCATTER_VAULT_X100: Record<number, number> = { 3: 1000, 4: 5000, 5: 25000 }

export function scatterBand(count: number): 3 | 4 | 5 | null {
  if (count < 3) return null
  return count >= 5 ? 5 : (count as 3 | 4)
}
