import { describe, expect, it } from 'vitest';
import { evaluateBoard } from '../../src/engine';
import type { SymbolId } from '../../src/engine';
import { board, filledBoard, royalJunk } from '../helpers';

const BET = 2.0;

describe('ways evaluation', () => {
  it('pays 2-of-a-kind only for cleopatra, scarab, ring and 9', () => {
    const cases: [SymbolId, number][] = [
      ['cleopatra', 0.25],
      ['scarab', 0.1],
      ['ring', 0.1],
      ['9', 0.1],
    ];
    for (const [sym, pay] of cases) {
      const b = board([
        [sym, 'K', 'Q', 'J', 'T'],
        ['A', sym, 'J', 'Q', 'K'],
        ['K', 'T', 'T', 'A', 'J'],
        ['Q', 'A', 'J', 'T', 'A'],
      ]);
      const ev = evaluateBoard(b, 'base', BET);
      const win = ev.wins.find((w) => w.symbol === sym)!;
      expect(win, String(sym)).toBeDefined();
      expect(win.run).toBe(2);
      expect(win.amount).toBeCloseTo(pay * BET, 5);
      expect(ev.totalWin).toBeCloseTo(pay * BET, 5); // nothing else pays
    }
  });

  it('does NOT pay 2-of-a-kind for symbols without a 2-band (A)', () => {
    const b = board([
      ['A', 'K', 'Q', 'J', 'T'],
      ['9', 'A', 'J', 'Q', 'K'],
      ['K', 'T', 'T', '9', 'J'],
      ['Q', 'T', 'J', 'T', '9'],
    ]);
    const ev = evaluateBoard(b, 'base', BET);
    expect(ev.wins.find((w) => w.symbol === 'A')).toBeUndefined();
    expect(ev.totalWin).toBe(0);
  });

  it('ways = product of per-reel counts', () => {
    const b = royalJunk();
    b[0][0] = 'coin';
    b[1][0] = 'coin';
    b[0][1] = 'coin';
    b[2][1] = 'coin';
    b[3][1] = 'coin';
    b[0][2] = 'coin';
    const ev = evaluateBoard(b, 'base', BET);
    const coin = ev.wins.find((w) => w.symbol === 'coin')!;
    expect(coin.run).toBe(3);
    expect(coin.ways).toBe(2 * 3 * 1);
    expect(coin.amount).toBeCloseTo(1 * 6 * BET, 5); // $12.00
  });

  it('FS: a wild_multiplier doubles only the ways passing through it', () => {
    const b = royalJunk();
    b[0][0] = 'coin';
    b[1][0] = 'coin';
    b[0][1] = 'coin';
    b[1][1] = 'wild_multiplier';
    b[0][2] = 'coin';
    // col1 weight = 1 real + 2*1 wild = 3; weighted ways = 2 * 3 * 1 = 6
    const ev = evaluateBoard(b, 'fs', BET);
    const coin = ev.wins.find((w) => w.symbol === 'coin')!;
    expect(coin.amount).toBeCloseTo(1 * 6 * BET, 5); // $12.00
  });

  it('FS: pure-wild ways pay only the wild_multiplier line, not every symbol', () => {
    // reels 1-2 all-wild-capable, reel 3 scatters so every substituted run stops at 2:
    // 2-band symbols (cleopatra/scarab/ring/9) absent from the board must NOT cash the
    // pure-wild 2-run — it pays once, on the wild's own line.
    const b = board([
      ['wild_multiplier', 'wild_multiplier', 'scatter', 'K', 'Q'],
      ['J', 'T', 'scatter', 'Q', 'A'],
      ['J', 'T', 'scatter', 'A', 'K'],
      ['J', 'T', 'scatter', 'K', 'Q'],
    ]);
    const ev = evaluateBoard(b, 'fs', BET);
    expect(ev.wins).toHaveLength(1);
    const wild = ev.wins[0];
    expect(wild.symbol).toBe('wild_multiplier');
    expect(wild.run).toBe(2);
    expect(wild.amount).toBeCloseTo(0.5 * 1 * BET, 5); // $1.00 (paytable p2)
    expect(ev.scatterCount).toBe(4);
    expect(ev.totalWin).toBeCloseTo(1 + 5 * BET, 5); // wild line + 4-scatter pay
  });

  it('full cleopatra board pays 5x on all 1024 ways', () => {
    const ev = evaluateBoard(filledBoard('cleopatra'), 'base', BET);
    const cleo = ev.wins.find((w) => w.symbol === 'cleopatra')!;
    expect(cleo.ways).toBe(4 ** 5);
    expect(cleo.amount).toBeCloseTo(5 * 1024 * BET, 5);
  });

  it('scatters pay anywhere: 3/4/5 = 1x/5x/25x', () => {
    for (const [n, x] of [
      [3, 1],
      [4, 5],
      [5, 25],
    ] as const) {
      const b = royalJunk();
      for (let i = 0; i < n; i++) b[i % 4][i] = 'scatter';
      const ev = evaluateBoard(b, 'base', BET);
      expect(ev.scatterCount).toBe(n);
      expect(ev.scatterWin).toBeCloseTo(x * BET, 5);
    }
  });
});
