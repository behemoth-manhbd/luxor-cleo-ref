// Core engine types. Engine is pure TS — no pixi/react imports anywhere under src/engine.
// All money values are integer cents. Pay multipliers are stored ×100 (see config/paytable).

export const REELS = 5
export const ROWS = 4

export type SymbolId =
  | 'cleopatra'
  | 'gold_scarab'
  | 'ankh_ring'
  | 'cleopatra_coin'
  | 'eye_of_horus'
  | 'sym_a'
  | 'sym_k'
  | 'sym_q'
  | 'sym_j'
  | 'sym_10'
  | 'sym_9'
  | 'wild_pyramid'
  | 'wild_multiplier'
  | 'scatter_lotus'

/** Board indexed [reel][row]: 5 reels × 4 rows. Reel 0 is leftmost. */
export type Board = SymbolId[][]

export type SpinMode = 'base' | 'freeSpins'

export interface CellPos {
  reel: number
  row: number
}

export interface SymbolWin {
  symbol: SymbolId
  reelsMatched: number
  /** number of ways = product of effective symbol counts per matched reel */
  ways: number
  /** pay × bet × ways, before wild ×2 multipliers */
  baseWinCents: number
  /** final win including per-way wild ×2 multipliers */
  winCents: number
}

export type GameEvent =
  | { type: 'spin_start'; mode: SpinMode }
  | { type: 'bet_deduct'; amountCents: number }
  | { type: 'reels_land'; board: Board }
  | { type: 'ways_evaluate'; wins: SymbolWin[] }
  | { type: 'scatter_check'; count: number }
  | { type: 'win_detect'; spinWinCents: number }
  | { type: 'win_present'; spinWinCents: number }
  | { type: 'fs_trigger'; scatters: number; spinsAwarded: number }
  | { type: 'fs_intro'; vaultCents: number }
  | { type: 'fs_spin'; index: number; remaining: number }
  | { type: 'vault_init_marks'; positions: CellPos[] }
  | {
      type: 'vault_update'
      vaultCents: number
      marked: number
      wildAddCents: number
      scatterAddCents: number
      newMarks: CellPos[]
    }
  | { type: 'vault_award'; vaultCents: number }
  | { type: 'vault_forfeit'; marked: number; vaultCents: number }
  | { type: 'win_cap_clamp'; rawCents: number; cappedCents: number }
  | { type: 'fs_end'; fsWinCents: number }
  | { type: 'round_end'; totalWinCents: number }

export interface RoundResult {
  events: GameEvent[]
  /** total credited win for the round (base + free spins + vault), after cap */
  totalWinCents: number
  /** stake removed from balance: bet (base) or 30×bet (buy) */
  costCents: number
}
