// 1024-ways evaluation (product-spec.md Grid & Win Rule):
// - a symbol's run = consecutive reels from reel 1 where the symbol or a substituting
//   wild is present; win = pay[run] x ways x totalBet; ways = product of per-reel counts.
// - free spins: each wild_multiplier in a way doubles that way (2^k, multiplicative).
//   Summing 2^(wilds in way) over all ways factorises to prod(matches + 2*wilds).
// - ways made ENTIRELY of wilds are excluded from every regular symbol and paid once on
//   the wild_multiplier's own pay line instead (only-highest-win-per-way, paytable p4).
// - scatters pay anywhere, not per-way.

import { GRID_COLS, GRID_ROWS } from './config/rules';
import { payFor } from './config/paytable';
import { REGULAR_SYMBOLS, SCATTER, WILD_BASE, WILD_MULTIPLIER } from './config/symbols';
import type { Board, Mode, SpinEvaluation, WayWin } from './types';

type ColCounts = { sym: number; wildBase: number; wildMult: number };

function countCol(board: Board, col: number, symbol: string): ColCounts {
  let sym = 0;
  let wildBase = 0;
  let wildMult = 0;
  for (let row = 0; row < GRID_ROWS; row++) {
    const cell = board[row][col];
    if (cell === symbol) sym++;
    else if (cell === WILD_BASE) wildBase++;
    else if (cell === WILD_MULTIPLIER) wildMult++;
  }
  return { sym, wildBase, wildMult };
}

export function evaluateBoard(board: Board, mode: Mode, totalBet: number): SpinEvaluation {
  const wins: WayWin[] = [];
  const wildMultActive = mode === 'fs';

  for (const symbol of REGULAR_SYMBOLS) {
    let weighted = 1; // sum over ways of 2^(wild_multiplier count in way)
    let pureWild = 1; // same sum restricted to all-wild ways
    let plainWays = 1; // unweighted ways, for reporting
    let run = 0;
    for (let col = 0; col < GRID_COLS; col++) {
      const c = countCol(board, col, symbol);
      const wilds = c.wildBase + (wildMultActive ? c.wildMult : 0);
      if (c.sym + wilds === 0) break;
      run++;
      const wildWeight = c.wildBase + (wildMultActive ? 2 * c.wildMult : 0);
      weighted *= c.sym + wildWeight;
      pureWild *= wildWeight;
      plainWays *= c.sym + wilds;
    }
    const pay = run >= 2 ? payFor(symbol, run) : 0;
    if (pay > 0 && weighted - pureWild > 0) {
      wins.push({
        symbol,
        run,
        ways: plainWays,
        amount: pay * (weighted - pureWild) * totalBet,
      });
    }
  }

  // wild_multiplier's own line: pure-wild runs from reel 1 (wild_base substitutes too).
  if (wildMultActive) {
    let ways = 1;
    let run = 0;
    for (let col = 0; col < GRID_COLS; col++) {
      // countCol tallies wild_multiplier cells into `sym` when it IS the target symbol
      const c = countCol(board, col, WILD_MULTIPLIER);
      const total = c.sym + c.wildBase;
      if (total === 0) break;
      run++;
      ways *= total;
    }
    const pay = run >= 2 ? payFor(WILD_MULTIPLIER, run) : 0;
    if (pay > 0 && ways > 0) {
      wins.push({ symbol: WILD_MULTIPLIER, run, ways, amount: pay * ways * totalBet });
    }
  }

  let scatterCount = 0;
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      if (board[row][col] === SCATTER) scatterCount++;
    }
  }
  const scatterWin = scatterCount >= 3 ? payFor(SCATTER, Math.min(scatterCount, 5)) * totalBet : 0;

  const lineWin = wins.reduce((s, w) => s + w.amount, 0);
  return { wins, lineWin, scatterCount, scatterWin, totalWin: lineWin + scatterWin };
}

export function countSymbol(board: Board, symbol: string): [number, number][] {
  const cells: [number, number][] = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      if (board[row][col] === symbol) cells.push([row, col]);
    }
  }
  return cells;
}
