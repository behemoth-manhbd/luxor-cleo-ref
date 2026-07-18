import { create } from 'zustand'
import type { RoundResult } from '../engine'
import {
  BET_LEVELS_CENTS,
  BUY_COST_MULT,
  DEFAULT_BET_INDEX,
  STARTING_BALANCE_CENTS,
  playRound,
} from '../engine'

export type Speed = 'normal' | 'quick' | 'turbo'
export const SPEED_FACTOR: Record<Speed, number> = { normal: 1, quick: 0.45, turbo: 0.18 }

export interface HistoryEntry {
  seed: number
  betCents: number
  buy: boolean
  totalWinCents: number
}

interface GameState {
  balanceCents: number
  betIndex: number
  speed: Speed
  phase: 'idle' | 'presenting'
  winCents: number
  pendingRound: RoundResult | null
  autoplayRemaining: number
  history: HistoryEntry[]
  settings: { ambient: boolean; soundFx: boolean; introScreen: boolean }

  spin: (buy?: boolean) => void
  presentDone: () => void
  setWin: (cents: number) => void
  cycleSpeed: () => void
  setBetIndex: (i: number) => void
  setAutoplay: (n: number) => void
  toggleSetting: (k: keyof GameState['settings']) => void
}

export const useGameStore = create<GameState>((set, get) => ({
  balanceCents: STARTING_BALANCE_CENTS,
  betIndex: Math.max(DEFAULT_BET_INDEX, 0),
  speed: 'normal',
  phase: 'idle',
  winCents: 0,
  pendingRound: null,
  autoplayRemaining: 0,
  history: [],
  settings: { ambient: true, soundFx: true, introScreen: true },

  spin: (buy = false) => {
    const s = get()
    if (s.phase !== 'idle') return
    const betCents = BET_LEVELS_CENTS[s.betIndex]!
    const costCents = buy ? BUY_COST_MULT * betCents : betCents
    if (s.balanceCents < costCents) return // insufficient credit blocks the play
    const seed = (Math.random() * 0x100000000) >>> 0
    const round = playRound({ seed, betCents, buy })
    set({
      balanceCents: s.balanceCents - costCents,
      phase: 'presenting',
      winCents: 0,
      pendingRound: round,
      history: [
        { seed, betCents, buy, totalWinCents: round.totalWinCents },
        ...s.history.slice(0, 19),
      ],
    })
  },

  presentDone: () => {
    const s = get()
    const won = s.pendingRound?.totalWinCents ?? 0
    set({
      balanceCents: s.balanceCents + won,
      pendingRound: null,
      phase: 'idle',
      winCents: won,
    })
    const auto = get().autoplayRemaining
    if (auto > 0) {
      set({ autoplayRemaining: auto - 1 })
      setTimeout(() => {
        if (get().phase === 'idle' && get().autoplayRemaining >= 0) get().spin()
      }, 350)
    }
  },

  setWin: (cents) => set({ winCents: cents }),
  cycleSpeed: () =>
    set((s) => ({
      speed: s.speed === 'normal' ? 'quick' : s.speed === 'quick' ? 'turbo' : 'normal',
    })),
  setBetIndex: (i) =>
    set({ betIndex: Math.min(Math.max(i, 0), BET_LEVELS_CENTS.length - 1) }),
  setAutoplay: (n) => set({ autoplayRemaining: n }),
  toggleSetting: (k) =>
    set((s) => ({ settings: { ...s.settings, [k]: !s.settings[k] } })),
}))

export function fmt(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
