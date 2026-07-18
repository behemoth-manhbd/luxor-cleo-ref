import type { Board, SymbolId } from '../src/engine';

// rows top->bottom, 5 symbols per row (test-vectors.md board notation)
export function board(rows: SymbolId[][]): Board {
  if (rows.length !== 4 || rows.some((r) => r.length !== 5)) throw new Error('board must be 4x5');
  return rows.map((r) => [...r]);
}

export function filledBoard(fill: SymbolId): Board {
  return board(Array.from({ length: 4 }, () => Array(5).fill(fill)));
}

// all-royal no-win board: no 3+ run, no 2-band symbol on reels 1+2, no scatters/premiums
export function royalJunk(): Board {
  return board([
    ['A', 'K', 'T', 'A', '9'],
    ['9', 'T', 'J', 'K', 'J'],
    ['K', 'Q', '9', 'Q', 'T'],
    ['Q', 'A', 'J', 'T', 'K'],
  ]);
}

// TV-01's no-win board: no 3+ run, no 2-band symbol on reels 1+2, no scatters
export function junkBoard(noCleo = false): Board {
  return board([
    ['A', 'K', 'Q', 'J', 'T'],
    ['9', 'T', 'J', 'Q', 'K'],
    [noCleo ? 'coin' : 'cleopatra', 'scarab', 'eye_of_horus', 'coin', 'ring'],
    ['K', 'Q', 'J', 'T', '9'],
  ]);
}
