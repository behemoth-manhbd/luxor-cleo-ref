import { describe, expect, it } from 'vitest';
import { mulberry32, vault } from '../../src/engine';
import type { Rng } from '../../src/engine';
import { VAULT_WILD_INCREMENTS } from '../../src/engine/config/vault';

const BET = 2.0;

describe('vault state', () => {
  it('initialises at 20x bet with zero marks', () => {
    const v = vault.initVault(BET);
    expect(v.value).toBe(40);
    expect(v.markedCount).toBe(0);
    expect(v.preMarkDone).toBe(false);
  });

  it('pre-marks exactly 8 distinct cells on reels 2-4', () => {
    const v = vault.initVault(BET);
    const cells = vault.preMark(v, mulberry32(42));
    expect(cells).toHaveLength(8);
    expect(v.markedCount).toBe(8);
    const keys = new Set(cells.map(([r, c]) => `${r}:${c}`));
    expect(keys.size).toBe(8);
    for (const [, col] of cells) expect([1, 2, 3]).toContain(col);
  });

  it('marks cells once, capping at 20, and detects completion', () => {
    const v = vault.initVault(BET);
    const all: [number, number][] = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) all.push([r, c]);
    expect(vault.markCells(v, all)).toHaveLength(20);
    expect(vault.markCells(v, all)).toHaveLength(0); // already marked
    expect(v.markedCount).toBe(20);
    expect(vault.isComplete(v)).toBe(true);
  });

  it('wild increment draws from the exact per-count tables (6+ shares one table)', () => {
    const fixed = (v: number): Rng => ({ next: () => v, int: (m) => Math.floor(v * m), pick: (a) => a[Math.floor(v * a.length)] });
    expect(vault.wildIncrementX(1, fixed(0))).toBe(VAULT_WILD_INCREMENTS[1][0]); // 1x
    expect(vault.wildIncrementX(1, fixed(0.999))).toBe(50);
    expect(vault.wildIncrementX(2, fixed(0.999))).toBe(2500);
    expect(vault.wildIncrementX(3, fixed(0.999))).toBe(12500);
    expect(vault.wildIncrementX(6, fixed(0))).toBe(15);
    expect(vault.wildIncrementX(9, fixed(0))).toBe(15); // 6+ clamps to the 6 table
  });

  it('scatter adds 10x/50x/250x for 3/4/5', () => {
    expect(vault.scatterAddX(3)).toBe(10);
    expect(vault.scatterAddX(4)).toBe(50);
    expect(vault.scatterAddX(5)).toBe(250);
    expect(vault.scatterAddX(2)).toBe(0);
  });
});
