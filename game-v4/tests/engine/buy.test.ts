import { describe, expect, it } from 'vitest';
import { buyCost, playRound } from '../../src/engine';

describe('buy feature', () => {
  it('costs exactly 30x total bet', () => {
    expect(buyCost(2)).toBe(60);
    expect(buyCost(0.2)).toBe(6);
  });

  it('charges the cost, forces exactly 3 scatters and enters 10 free spins', () => {
    const r = playRound({ seed: 123, totalBet: 2, balance: 1000, buy: true });
    expect(r.baseEvaluation.scatterCount).toBe(3);
    expect(r.fsTriggered).toBe(true);
    // balance = 1000 - 60 + totalWin
    expect(r.balanceAfter).toBeCloseTo(1000 - 60 + r.totalWin, 2);
    // forced scatters still pay their 3-scatter award (1x bet)
    expect(r.baseEvaluation.scatterWin).toBeCloseTo(2, 5);
  });

  it('blocks purchase on insufficient balance', () => {
    expect(() => playRound({ seed: 1, totalBet: 2, balance: 59.99, buy: true })).toThrow();
  });
});
