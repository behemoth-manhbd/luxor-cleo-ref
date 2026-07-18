// Bet model: Total Bet = Bet x Coin Value x 20 (paytable p4, modal-bet-panel.webp).
// Min $0.20 / max $240.00. Step values are [ASSUMPTION] — only min/max/formula are in docs.

export const BET_MULTIPLIER = 20;
export const MIN_TOTAL_BET = 0.2;
export const MAX_TOTAL_BET = 240;

export const BET_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const COIN_VALUES = [0.01, 0.02, 0.03, 0.05, 0.1, 0.2, 0.5, 1.0, 1.2];

export const DEFAULT_BET_LEVEL = 2;
export const DEFAULT_COIN_VALUE = 0.05; // 2 x 0.05 x 20 = $2.00 default total bet

export function totalBet(betLevel: number, coinValue: number): number {
  return round2(betLevel * coinValue * BET_MULTIPLIER);
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
