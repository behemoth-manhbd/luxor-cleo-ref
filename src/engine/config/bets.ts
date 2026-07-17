// Bet model — verified: min $0.20 / max $240.00 (paytable-4).
// The concrete level ladder between min and max is a design choice (not published).

export const BET_LEVELS_CENTS: number[] = [
  20, 40, 60, 100, 200, 300, 500, 1000, 2000, 3000, 5000, 8000, 12000, 16000, 20000, 24000,
]

export const DEFAULT_BET_INDEX = BET_LEVELS_CENTS.indexOf(200) // $2.00 like the reference capture

export const BUY_COST_MULT = 30 // buy feature costs 30× total bet (paytable-3)
export const FREE_SPINS_AWARDED = 10 // fixed for 3/4/5 scatters (paytable-2)
export const STARTING_BALANCE_CENTS = 10_000_000 // $100,000 demo credit (screenshots)
