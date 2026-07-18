// Vault bonus constants, exact from paytable p2/p3 (docs v4 vault_bonus-mechanics.md).
// One random increment per spin, chosen from the set for the number of wild_multiplier
// symbols that hit that spin (paytable p2: "every time one or more WILD MULTIPLIER
// symbols hit, a random amount is added").

export const VAULT_START_X = 20; // x total bet
export const VAULT_POSITIONS = 20; // full 5x4 board
export const VAULT_PREMARK_COUNT = 8; // random positions on reels 2-4, AFTER free spin 1 resolves
export const VAULT_PREMARK_COLS = [1, 2, 3]; // 0-indexed reels 2-4

// Increment sets (x total bet) keyed by wild_multiplier count this spin; 6 = "6 or more".
export const VAULT_WILD_INCREMENTS: Record<number, number[]> = {
  1: [1, 1.5, 2, 2.5, 5, 12.5, 25, 50],
  2: [5, 10, 25, 50, 100, 250, 500, 2500],
  3: [7.5, 15, 37.5, 75, 150, 375, 750, 12500],
  4: [10, 20, 50, 100, 200, 500, 1000, 12500],
  5: [12.5, 25, 62.5, 125, 250, 625, 1250, 12500],
  6: [15, 30, 75, 150, 300, 750, 1500, 12500],
};

// Scatter hits during free spins add to the vault (x total bet), no extra spins.
export const VAULT_SCATTER_ADD: Record<number, number> = { 3: 10, 4: 50, 5: 250 };
