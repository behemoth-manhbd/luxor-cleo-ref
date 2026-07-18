// Board fill: RNG draws 1..5 are the reel stops, left to right (RNG Contract draw order).

import { GRID_COLS, GRID_ROWS } from './config/rules';
import type { SymbolId } from './config/symbols';
import type { Rng } from './rng';
import type { Board } from './types';

export function fillBoard(strips: SymbolId[][], rng: Rng): Board {
  const board: Board = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill('9' as SymbolId));
  for (let col = 0; col < GRID_COLS; col++) {
    const strip = strips[col];
    const stop = rng.int(strip.length);
    for (let row = 0; row < GRID_ROWS; row++) {
      board[row][col] = strip[(stop + row) % strip.length];
    }
  }
  return board;
}
