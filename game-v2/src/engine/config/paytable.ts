// Paytable in multiples of TOTAL BET, transcribed from in-game paytable screenshots
// (docs v4 game-spec.json math.paytable — the vision-corrected table; paytable-1/2.webp).
// cleopatra/scarab/ring/9 pay from 2-of-a-kind; all other regulars from 3.

import type { SymbolId } from './symbols';

export type PayBands = Partial<Record<2 | 3 | 4 | 5, number>>;

export const PAYTABLE: Record<Exclude<SymbolId, 'wild_base'>, PayBands> = {
  cleopatra: { 2: 0.25, 3: 2.5, 4: 3.75, 5: 5 },
  scarab: { 2: 0.1, 3: 2, 4: 3, 5: 4 },
  eye_of_horus: { 3: 1, 4: 2.5, 5: 3.5 },
  coin: { 3: 1, 4: 2.5, 5: 3.5 },
  ring: { 2: 0.1, 3: 2, 4: 3, 5: 4 },
  A: { 3: 0.25, 4: 1.5, 5: 3 },
  K: { 3: 0.25, 4: 1.5, 5: 3 },
  Q: { 3: 0.15, 4: 1, 5: 2.5 },
  J: { 3: 0.15, 4: 1, 5: 2.5 },
  T: { 3: 0.15, 4: 0.5, 5: 2 },
  '9': { 2: 0.1, 3: 0.15, 4: 0.5, 5: 2 },
  wild_multiplier: { 2: 0.5, 3: 5, 4: 12.5, 5: 25 },
  scatter: { 3: 1, 4: 5, 5: 25 },
};

export function payFor(symbol: Exclude<SymbolId, 'wild_base'>, run: number): number {
  const bands = PAYTABLE[symbol];
  return bands[run as 2 | 3 | 4 | 5] ?? 0;
}
