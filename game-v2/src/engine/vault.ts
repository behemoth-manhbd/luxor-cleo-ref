// Vault state machine (vault_bonus-mechanics.md + paytable p2/p3, video-verified):
// value starts at 20x bet at fs_start; ZERO cells marked until free spin 1 resolves,
// then 8 random cells on reels 2-4 are pre-marked; each cleopatra on an unmarked cell
// marks it; one random increment per spin by wild count; scatters 3/4/5 add 10/50/250x;
// pays only if all 20 cells are marked at round end, else forfeited.

import { GRID_COLS, GRID_ROWS } from './config/rules';
import {
  VAULT_PREMARK_COLS,
  VAULT_PREMARK_COUNT,
  VAULT_POSITIONS,
  VAULT_SCATTER_ADD,
  VAULT_START_X,
  VAULT_WILD_INCREMENTS,
} from './config/vault';
import { round2 } from './config/bets';
import type { Rng } from './rng';
import type { VaultState } from './types';

export function initVault(totalBet: number): VaultState {
  return {
    value: round2(VAULT_START_X * totalBet),
    marked: Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(false)),
    markedCount: 0,
    preMarkDone: false,
  };
}

export function preMark(vault: VaultState, rng: Rng): [number, number][] {
  const cells: [number, number][] = [];
  for (const col of VAULT_PREMARK_COLS) {
    for (let row = 0; row < GRID_ROWS; row++) cells.push([row, col]);
  }
  const chosen: [number, number][] = [];
  while (chosen.length < VAULT_PREMARK_COUNT) {
    const idx = rng.int(cells.length);
    const cell = cells[idx];
    if (!vault.marked[cell[0]][cell[1]]) {
      vault.marked[cell[0]][cell[1]] = true;
      vault.markedCount++;
      chosen.push(cell);
    }
  }
  vault.preMarkDone = true;
  return chosen;
}

export function markCells(vault: VaultState, cells: [number, number][]): [number, number][] {
  const newly: [number, number][] = [];
  for (const [row, col] of cells) {
    if (!vault.marked[row][col] && vault.markedCount < VAULT_POSITIONS) {
      vault.marked[row][col] = true;
      vault.markedCount++;
      newly.push([row, col]);
    }
  }
  return newly;
}

export function wildIncrementX(wildCount: number, rng: Rng): number {
  const key = Math.min(wildCount, 6);
  return rng.pick(VAULT_WILD_INCREMENTS[key]);
}

export function scatterAddX(scatterCount: number): number {
  return VAULT_SCATTER_ADD[Math.min(scatterCount, 5)] ?? 0;
}

export function isComplete(vault: VaultState): boolean {
  return vault.markedCount === VAULT_POSITIONS;
}
