import { describe, expect, it } from 'vitest';
import { playRound } from '../../src/engine';
import type { GameEvent } from '../../src/engine';

describe('determinism', () => {
  it('same (seed, stake, mode) produces an identical event stream and outcome', () => {
    for (const seed of [1, 42, 987654, 2 ** 31 - 1]) {
      const a: GameEvent[] = [];
      const b: GameEvent[] = [];
      const ra = playRound({ seed, totalBet: 2, balance: 100000, sink: (e) => a.push(e) });
      const rb = playRound({ seed, totalBet: 2, balance: 100000, sink: (e) => b.push(e) });
      expect(JSON.stringify(a)).toBe(JSON.stringify(b));
      expect(ra.totalWin).toBe(rb.totalWin);
      expect(ra.balanceAfter).toBe(rb.balanceAfter);
    }
  });

  it('different seeds diverge (sanity)', () => {
    const r1 = playRound({ seed: 1, totalBet: 2, balance: 100000 });
    const r2 = playRound({ seed: 2, totalBet: 2, balance: 100000 });
    expect(JSON.stringify(r1.baseBoard)).not.toBe(JSON.stringify(r2.baseBoard));
  });

  it('event order: bet_deduct precedes reels_spin; win never precedes evaluation', () => {
    const events: GameEvent[] = [];
    playRound({ seed: 5, totalBet: 2, balance: 100000, sink: (e) => events.push(e) });
    const ids = events.map((e) => e.id);
    expect(ids.indexOf('bet_deduct')).toBeLessThan(ids.indexOf('reels_spin'));
    expect(ids.indexOf('reels_land')).toBeLessThan(ids.indexOf('ways_evaluate'));
    expect(ids.indexOf('ways_evaluate')).toBeLessThan(ids.indexOf('scatter_check'));
    expect(ids[ids.length - 1]).toBe('round_end');
  });
});
