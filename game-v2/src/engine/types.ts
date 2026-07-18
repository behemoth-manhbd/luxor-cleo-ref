import type { SymbolId } from './config/symbols';

// board[row][col], row 0 = top, col 0 = reel 1 (test-vectors.md conventions)
export type Board = SymbolId[][];

export type Mode = 'base' | 'fs';

export type WayWin = {
  symbol: SymbolId;
  run: number;
  ways: number;
  // total amount for this symbol line in currency, wild multipliers already applied
  amount: number;
};

export type SpinEvaluation = {
  wins: WayWin[];
  lineWin: number;
  scatterCount: number;
  scatterWin: number;
  totalWin: number; // lineWin + scatterWin
};

export type VaultState = {
  value: number; // currency
  marked: boolean[][]; // [row][col]
  markedCount: number;
  preMarkDone: boolean;
};

export type FsSpinResult = {
  board: Board;
  evaluation: SpinEvaluation;
  newlyMarked: [number, number][]; // [row, col]
  vaultIncrement: number;
  vaultValue: number;
  markedCount: number;
  spinsLeft: number;
};

export type RoundResult = {
  seed: number;
  totalBet: number;
  baseBoard: Board;
  baseEvaluation: SpinEvaluation;
  fsTriggered: boolean;
  fsSpins: FsSpinResult[];
  vaultPaid: boolean;
  vaultPayout: number;
  capped: boolean;
  totalWin: number; // whole round, cap applied
  balanceAfter: number;
};
