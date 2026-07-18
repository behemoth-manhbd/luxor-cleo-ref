import { create } from 'zustand';
import {
  DEFAULT_BET_LEVEL,
  DEFAULT_COIN_VALUE,
  round2,
  totalBet as calcTotalBet,
} from '../engine';

export type BannerState =
  | { kind: 'fsTrigger'; spins: number }
  | { kind: 'fsOutro'; amount: number }
  | { kind: 'mega'; amount: number }
  | null;

export type VaultView = {
  active: boolean;
  value: number | null; // null = not yet revealed (before spin 1 resolves)
  markedCount: number;
  marked: boolean[][];
};

type GameState = {
  balance: number;
  betLevel: number;
  coinValue: number;
  totalBet: number;
  phase: 'idle' | 'spinning' | 'fs';
  lastWin: number;
  winMessage: string | null;
  fsSpinsLeft: number | null;
  vault: VaultView;
  banner: BannerState;
  autoplayLeft: number;
  autoplayActive: boolean;
  turbo: boolean;
  skipScreens: boolean;
  modal: 'bet' | 'autoplay' | 'buy' | 'info' | null;

  setBet(level: number, coin: number): void;
  addBalance(delta: number): void;
  setBalance(v: number): void;
  patch(p: Partial<GameState>): void;
  resetVault(): void;
};

const emptyVault = (): VaultView => ({
  active: false,
  value: null,
  markedCount: 0,
  marked: Array.from({ length: 4 }, () => Array(5).fill(false)),
});

export const useGameStore = create<GameState>((set) => ({
  balance: 100000,
  betLevel: DEFAULT_BET_LEVEL,
  coinValue: DEFAULT_COIN_VALUE,
  totalBet: calcTotalBet(DEFAULT_BET_LEVEL, DEFAULT_COIN_VALUE),
  phase: 'idle',
  lastWin: 0,
  winMessage: null,
  fsSpinsLeft: null,
  vault: emptyVault(),
  banner: null,
  autoplayLeft: 0,
  autoplayActive: false,
  turbo: false,
  skipScreens: false,
  modal: null,

  setBet: (level, coin) => set({ betLevel: level, coinValue: coin, totalBet: calcTotalBet(level, coin) }),
  addBalance: (delta) => set((s) => ({ balance: round2(s.balance + delta) })),
  setBalance: (v) => set({ balance: v }),
  patch: (p) => set(p),
  resetVault: () => set({ vault: emptyVault() }),
}));
