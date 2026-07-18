// VAULT constants — verified against paytable-2/paytable-3 screenshots.
// Increment tables are keyed by the number of wild_multiplier symbols hit in one spin.
// Values are total-bet multipliers × 100. The PROBABILITY distribution over each table
// is NOT published — uniform draw is a TUNABLE placeholder.

export const VAULT_START_X100 = 2000 // 20× total bet

export const VAULT_TOTAL_POSITIONS = 20 // the whole 4×5 grid
export const VAULT_INIT_MARKS = 8 // marked after the FIRST free spin, on reels 2/3/4

export const VAULT_INCREMENTS_X100: Record<1 | 2 | 3 | 4 | 5 | 6, number[]> = {
  1: [100, 150, 200, 250, 500, 1250, 2500, 5000],
  2: [500, 1000, 2500, 5000, 10000, 25000, 50000, 250000],
  3: [750, 1500, 3750, 7500, 15000, 37500, 75000, 1250000],
  4: [1000, 2000, 5000, 10000, 20000, 50000, 100000, 1250000],
  5: [1250, 2500, 6250, 12500, 25000, 62500, 125000, 1250000],
  6: [1500, 3000, 7500, 15000, 30000, 75000, 150000, 1250000], // 6 or more
}

export function vaultTableFor(wildHits: number): number[] {
  const key = Math.min(Math.max(wildHits, 1), 6) as 1 | 2 | 3 | 4 | 5 | 6
  return VAULT_INCREMENTS_X100[key]
}

/** Max win: 12,500× total bet. Reaching it ends the round IMMEDIATELY (paytable-3/6). */
export const MAX_WIN_X = 12500
