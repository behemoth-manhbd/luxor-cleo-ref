// Reel strips. Symbol weights are NOT derivable from docs v4 (proprietary) — these
// compositions are [ASSUMPTION], tunable without touching any rule code. Hard rules kept:
// wild_base only on reels 2-4; wild_multiplier only on FS strips (any reel); FS strips
// raise cleopatra density (free_spins-mechanics.md).

import type { SymbolId } from './symbols';

type StripSpec = Partial<Record<SymbolId, number>>;

function buildStrip(spec: StripSpec): SymbolId[] {
  const strip: SymbolId[] = [];
  const entries = Object.entries(spec) as [SymbolId, number][];
  const max = Math.max(...entries.map(([, n]) => n));
  // interleave round-robin so identical symbols spread across the strip
  for (let pass = 0; pass < max; pass++) {
    for (const [sym, count] of entries) {
      if (pass < count) strip.push(sym);
    }
  }
  return strip;
}

const BASE_COMMON: StripSpec = {
  cleopatra: 3,
  scarab: 4,
  ring: 4,
  coin: 5,
  eye_of_horus: 5,
  A: 7,
  K: 7,
  Q: 8,
  J: 8,
  T: 8,
  '9': 8,
  scatter: 2,
};

const FS_COMMON: StripSpec = {
  cleopatra: 7,
  scarab: 4,
  ring: 4,
  coin: 5,
  eye_of_horus: 5,
  A: 6,
  K: 6,
  Q: 7,
  J: 7,
  T: 7,
  '9': 7,
  scatter: 2,
};

export const BASE_STRIPS: SymbolId[][] = [0, 1, 2, 3, 4].map((col) =>
  buildStrip(col >= 1 && col <= 3 ? { ...BASE_COMMON, wild_base: 3 } : BASE_COMMON),
);

export const FS_STRIPS: SymbolId[][] = [0, 1, 2, 3, 4].map((col) =>
  buildStrip(
    col >= 1 && col <= 3
      ? { ...FS_COMMON, wild_base: 2, wild_multiplier: 3 }
      : { ...FS_COMMON, wild_multiplier: 3 },
  ),
);
