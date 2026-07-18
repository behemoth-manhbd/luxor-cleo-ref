// Canonical event ids per event-order-and-determinism.md, with the verified correction:
// vault_init emits preMarked=0 — the 8-position pre-mark happens after free spin 1
// resolves (paytable p3, confirmed on video).

export type GameEvent =
  | { id: 'spin_start'; seed: number; stake: number; mode: 'base' | 'buy'; balanceBefore: number }
  | { id: 'bet_deduct'; betAmount: number; balanceAfter: number }
  | { id: 'reels_spin'; mode: 'base' | 'fs' }
  | { id: 'reels_land'; board: string[][] }
  | { id: 'ways_evaluate'; wins: { symbol: string; run: number; ways: number; amount: number }[]; totalWin: number }
  | { id: 'scatter_check'; scatterCount: number }
  | { id: 'win_present'; totalWin: number }
  | { id: 'win_tier_banner'; tier: 'MEGA'; amountX: number }
  | { id: 'fs_trigger'; scatterCount: number; awarded: 10 }
  | { id: 'round_end'; totalWin: number; balanceAfter: number }
  | { id: 'fs_start'; spinsAwarded: 10; reelSet: 'night' }
  | { id: 'vault_init'; vaultValue: number; preMarked: 0 }
  | { id: 'fs_spin_start'; spinsLeft: number }
  | { id: 'fs_reels_land'; board: string[][] }
  | { id: 'fs_ways_evaluate'; wins: { symbol: string; run: number; ways: number; amount: number }[]; totalWin: number }
  | { id: 'vault_premark'; markedCells: [number, number][]; markedCount: number }
  | { id: 'cleopatra_mark'; markedCells: [number, number][]; markedCount: number }
  | { id: 'vault_increment'; source: 'wild_multiplier' | 'scatter'; addX: number; vaultValue: number }
  | { id: 'fs_spin_end'; spinsLeft: number }
  | { id: 'vault_resolve'; markedCount: number; paid: boolean; vaultPayout: number }
  | { id: 'fs_end'; totalFsWin: number; balanceAfter: number }
  | { id: 'buy_open'; cost: number }
  | { id: 'buy_confirm'; cost: number; balanceAfter: number }
  | { id: 'buy_decline' }
  | { id: 'buy_charge'; cost: number };

export type EventSink = (e: GameEvent) => void;
