// Core rule constants from docs v4 (paytable p2/p3/p6, product-spec.md).

export const GRID_COLS = 5;
export const GRID_ROWS = 4;
export const WAYS_COUNT = 1024;

export const FREE_SPINS_COUNT = 10; // flat for 3/4/5 scatters, no retrigger
export const SCATTERS_TO_TRIGGER = 3;

export const BUY_COST_X = 30; // x total bet, forces exactly 3 scatters
export const MAX_WIN_X = 12500; // round ends immediately when total round win reaches cap

// wild_base restricted to reels 2-4 (0-indexed cols 1..3), both base game and free spins.
export const WILD_BASE_COLS = [1, 2, 3];
