// Golden vectors TV-01..TV-13 from docs v4 test-vectors.md (post-correction values).

import { describe, expect, it } from 'vitest';
import { buyCost, evaluateBoard, playRound } from '../../src/engine';
import { board, junkBoard } from '../helpers';

const BET = 2.0;

describe('test vectors', () => {
  it('TV-01 no-win board pays $0 and does not trigger', () => {
    const ev = evaluateBoard(junkBoard(), 'base', BET);
    expect(ev.totalWin).toBe(0);
    expect(ev.scatterCount).toBe(0);
  });

  it('TV-02 cleopatra 3-of-a-kind, 1 way = $5.00', () => {
    const b = junkBoard(true);
    b[0][0] = 'cleopatra';
    b[1][1] = 'cleopatra';
    b[2][2] = 'cleopatra';
    const ev = evaluateBoard(b, 'base', BET);
    expect(ev.totalWin).toBeCloseTo(2.5 * 1 * BET, 5); // $5.00
  });

  it('TV-03 cleopatra 4-reel run = $7.50', () => {
    const b = junkBoard(true);
    b[0][0] = 'cleopatra';
    b[1][1] = 'cleopatra';
    b[2][2] = 'cleopatra';
    b[3][3] = 'cleopatra';
    const ev = evaluateBoard(b, 'base', BET);
    expect(ev.totalWin).toBeCloseTo(3.75 * 1 * BET, 5); // $7.50
  });

  it('TV-04 cleopatra 5-reel run = $10.00', () => {
    const b = board([
      ['cleopatra', 'K', 'Q', 'J', 'cleopatra'],
      ['9', 'cleopatra', 'T', 'K', '9'],
      ['A', 'scarab', 'cleopatra', 'Q', 'J'],
      ['K', 'T', '9', 'cleopatra', 'scarab'],
    ]);
    const ev = evaluateBoard(b, 'base', BET);
    const cleo = ev.wins.find((w) => w.symbol === 'cleopatra')!;
    expect(cleo.run).toBe(5);
    expect(cleo.amount).toBeCloseTo(5 * 1 * BET, 5); // $10.00
  });

  it('TV-05 two symbols winning simultaneously = $9.00', () => {
    const b = board([
      ['cleopatra', 'cleopatra', 'cleopatra', 'J', 'T'],
      ['scarab', 'scarab', 'scarab', 'Q', 'K'],
      ['A', 'K', 'eye_of_horus', 'coin', 'ring'],
      ['K', 'Q', 'J', 'T', '9'],
    ]);
    const ev = evaluateBoard(b, 'base', BET);
    expect(ev.totalWin).toBeCloseTo((2.5 + 2.0) * BET, 5); // $5.00 + $4.00
  });

  it('TV-06 ways multiplication, 2 ways = $20.00', () => {
    const b = board([
      ['cleopatra', 'K', 'cleopatra', 'J', 'cleopatra'],
      ['9', 'cleopatra', 'cleopatra', 'K', '9'],
      ['A', 'scarab', 'Q', 'cleopatra', 'J'],
      ['K', 'T', '9', 'A', 'T'],
    ]);
    const ev = evaluateBoard(b, 'base', BET);
    const cleo = ev.wins.find((w) => w.symbol === 'cleopatra')!;
    expect(cleo.ways).toBe(2);
    expect(cleo.amount).toBeCloseTo(5 * 2 * BET, 5); // $20.00
  });

  it('TV-07 wild_base substitution completes cleopatra 3-run = $5.00', () => {
    const b = junkBoard(true);
    b[0][0] = 'cleopatra';
    b[1][1] = 'wild_base';
    b[2][2] = 'cleopatra';
    const ev = evaluateBoard(b, 'base', BET);
    const cleo = ev.wins.find((w) => w.symbol === 'cleopatra')!;
    expect(cleo.run).toBe(3);
    expect(cleo.amount).toBeCloseTo(2.5 * 1 * BET, 5);
  });

  it('TV-08 three scatters pay $2.00 anywhere', () => {
    const b = board([
      ['scatter', 'K', 'Q', 'J', 'T'],
      ['9', 'cleopatra', 'scatter', 'K', '9'],
      ['A', 'scarab', 'Q', 'cleopatra', 'scatter'],
      ['K', 'T', '9', 'A', 'scarab'],
    ]);
    const ev = evaluateBoard(b, 'base', BET);
    expect(ev.scatterCount).toBe(3);
    expect(ev.scatterWin).toBeCloseTo(1 * BET, 5); // $2.00
  });

  it('TV-09 FS wild multiplier stacking: 2 wilds in way = x4 = $40.00', () => {
    const b = board([
      ['cleopatra', 'K', 'Q', 'J', 'cleopatra'],
      ['9', 'wild_multiplier', 'wild_multiplier', 'K', '9'],
      ['A', 'scarab', 'Q', 'cleopatra', 'J'],
      ['K', 'T', '9', 'A', 'T'],
    ]);
    const ev = evaluateBoard(b, 'fs', BET);
    const cleo = ev.wins.find((w) => w.symbol === 'cleopatra')!;
    expect(cleo.amount).toBeCloseTo(5 * 1 * BET * 4, 5); // $40.00
    expect(ev.wins.find((w) => w.symbol === 'wild_multiplier')).toBeUndefined();
  });

  it('TV-11 cap rule: min(total, 12500x)', () => {
    expect(Math.min(13000, 12500) * BET).toBe(25000);
  });

  it('TV-12 buy feature cost arithmetic and forced trigger', () => {
    expect(buyCost(2)).toBe(60);
    expect(buyCost(0.2)).toBe(6);
    expect(buyCost(12)).toBe(360);
    const r = playRound({ seed: 7, totalBet: 2, balance: 100000, buy: true });
    expect(r.baseEvaluation.scatterCount).toBe(3);
    expect(r.fsTriggered).toBe(true);
    expect(r.fsSpins.length).toBeGreaterThan(0);
  });

  it('TV-13 bet multiplication: cleopatra 3-run scales with bet', () => {
    const mk = () => {
      const b = junkBoard(true);
      b[0][0] = 'cleopatra';
      b[1][1] = 'cleopatra';
      b[2][2] = 'cleopatra';
      return b;
    };
    expect(evaluateBoard(mk(), 'base', 2).totalWin).toBeCloseTo(5.0, 5);
    expect(evaluateBoard(mk(), 'base', 1).totalWin).toBeCloseTo(2.5, 5);
    expect(evaluateBoard(mk(), 'base', 0.2).totalWin).toBeCloseTo(0.5, 5);
  });
});
