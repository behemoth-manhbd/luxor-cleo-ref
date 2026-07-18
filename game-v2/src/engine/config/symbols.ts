// Symbol ids per docs/luxor-of-cleopatra-v4/docs/product-spec.md.
// wild_base: pyramid wild, reels 2-4, base game AND free spins, no own pay.
// wild_multiplier: gold-coin WILD x2, free spins only, any reel, own pay line.

export const REGULAR_SYMBOLS = [
  'cleopatra',
  'scarab',
  'eye_of_horus',
  'coin',
  'ring',
  'A',
  'K',
  'Q',
  'J',
  'T',
  '9',
] as const;

export type RegularSymbol = (typeof REGULAR_SYMBOLS)[number];
export type SymbolId = RegularSymbol | 'wild_base' | 'wild_multiplier' | 'scatter';

export const WILD_BASE = 'wild_base' as const;
export const WILD_MULTIPLIER = 'wild_multiplier' as const;
export const SCATTER = 'scatter' as const;

export function isWild(s: SymbolId): boolean {
  return s === WILD_BASE || s === WILD_MULTIPLIER;
}
