import { describe, expect, it } from 'vitest';
import { mulberry32, playFreeSpins } from '../../src/engine';
import type { GameEvent } from '../../src/engine';
import { junkBoard } from '../helpers';

const BET = 2.0;

function run(boards: ReturnType<typeof junkBoard>[], seed = 1) {
  const events: GameEvent[] = [];
  const outcome = playFreeSpins(BET, 0, mulberry32(seed), (e) => events.push(e), boards);
  return { events, outcome };
}

describe('free spins round', () => {
  it('plays exactly 10 spins, counting down, never up', () => {
    const { events, outcome } = run(Array.from({ length: 10 }, () => junkBoard(true)));
    expect(outcome.spins).toHaveLength(10);
    const starts = events.filter((e) => e.id === 'fs_spin_start').map((e) => (e as { spinsLeft: number }).spinsLeft);
    expect(starts).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
  });

  it('vault_init reports zero pre-marks; pre-mark lands after spin 1 resolves', () => {
    const { events, outcome } = run(Array.from({ length: 10 }, () => junkBoard(true)));
    const init = events.find((e) => e.id === 'vault_init')!;
    expect((init as { preMarked: number }).preMarked).toBe(0);
    // no cleopatra anywhere: exactly the 8 pre-marked cells, on reels 2-4 only
    expect(outcome.spins[0].markedCount).toBe(8);
    const premark = events.find((e) => e.id === 'vault_premark')! as {
      markedCells: [number, number][];
    };
    expect(premark.markedCells).toHaveLength(8);
    for (const [, col] of premark.markedCells) expect([1, 2, 3]).toContain(col);
    // pre-mark event must come after the first fs_reels_land
    const landIdx = events.findIndex((e) => e.id === 'fs_reels_land');
    const premarkIdx = events.findIndex((e) => e.id === 'vault_premark');
    expect(premarkIdx).toBeGreaterThan(landIdx);
  });

  it('scatters during FS add vault value but never add spins (no retrigger)', () => {
    const withScatters = junkBoard(true);
    withScatters[0][0] = 'scatter';
    withScatters[1][2] = 'scatter';
    withScatters[2][4] = 'scatter';
    const boards = [junkBoard(true), withScatters, ...Array.from({ length: 8 }, () => junkBoard(true))];
    const { events, outcome } = run(boards);
    expect(outcome.spins).toHaveLength(10); // still exactly 10
    const inc = events.find((e) => e.id === 'vault_increment' && (e as { source: string }).source === 'scatter')!;
    expect((inc as { addX: number }).addX).toBe(10); // 3 scatters -> +10x
    expect(outcome.spins[1].vaultValue).toBeCloseTo(20 * BET + 10 * BET, 5);
  });

  it('vault forfeits below 20/20 and pays at exactly 20/20', () => {
    const forfeit = run(Array.from({ length: 10 }, () => junkBoard(true)));
    expect(forfeit.outcome.vaultPaid).toBe(false);
    expect(forfeit.outcome.vaultPayout).toBe(0);

    // spin 1 all-cleopatra: 8 pre-marks + 12 cleopatra marks = 20/20
    const allCleo = junkBoard(true).map((r) => r.map(() => 'cleopatra' as const));
    const paid = run([allCleo, ...Array.from({ length: 9 }, () => junkBoard(true))]);
    expect(paid.outcome.spins[0].markedCount).toBe(20);
    expect(paid.outcome.vaultPaid).toBe(true);
    expect(paid.outcome.vaultPayout).toBeCloseTo(20 * BET, 5); // no increments occurred
  });

  it('hitting the 12,500x cap ends the round immediately and forfeits the vault', () => {
    // all wild_multiplier board: pure-wild line pays 25x * 1024 ways = 25,600x > cap
    const allWild = junkBoard(true).map((r) => r.map(() => 'wild_multiplier' as const));
    const { outcome } = run([allWild, ...Array.from({ length: 9 }, () => junkBoard(true))]);
    expect(outcome.capped).toBe(true);
    expect(outcome.spins).toHaveLength(1); // remaining 9 spins forfeited
    expect(outcome.vaultPaid).toBe(false);
    expect(outcome.vaultPayout).toBe(0);
  });
});
