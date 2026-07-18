// Presenter: runs the deterministic engine round, then plays its event stream against
// the Pixi scene + zustand store with human-paced timings (turbo shortens, Skip Screens
// suppresses the outro card — ui-and-controls.md / presentation-and-feel.md).

import type { Board, FsSpinResult, RoundResult } from './engine';
import { buyCost, playRound } from './engine';
import type { BoardScene } from './game/scene/BoardScene';
import { useGameStore } from './store/gameStore';

let scene: BoardScene | null = null;
let seedCounter = (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0;
let bannerResolve: (() => void) | null = null;
let running = false;

export function registerScene(s: BoardScene) {
  scene = s;
}

export function dismissBanner() {
  bannerResolve?.();
  bannerResolve = null;
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function store() {
  return useGameStore.getState();
}

async function waitBanner(autoDismissMs?: number) {
  await new Promise<void>((resolve) => {
    bannerResolve = resolve;
    if (autoDismissMs !== undefined) setTimeout(() => dismissBanner(), autoDismissMs);
  });
  store().patch({ banner: null });
}

async function presentSpinResult(board: Board, win: number, message: string | null, turbo: boolean) {
  await scene?.spinTo(board, turbo);
  if (win > 0) {
    store().patch({ lastWin: win, winMessage: message });
    await sleep(turbo ? 150 : 700);
  }
}

function winMessageFor(result: { wins: { symbol: string; run: number; ways: number; amount: number }[]; scatterWin: number; scatterCount: number }): string | null {
  const parts = result.wins.map(
    (w) => `${w.run}X ${w.symbol.toUpperCase()} PAYS $${w.amount.toFixed(2)} ON ${w.ways} WAYS`,
  );
  if (result.scatterWin > 0) parts.push(`${result.scatterCount} SCATTERS PAY $${result.scatterWin.toFixed(2)}`);
  return parts.length ? parts.join('  ·  ') : null;
}

async function playFsSpins(spins: FsSpinResult[], turbo: boolean) {
  const s = store();
  s.patch({ phase: 'fs', vault: { active: true, value: null, markedCount: 0, marked: emptyMarks() } });
  scene?.clearMarks();

  for (const spin of spins) {
    store().patch({ fsSpinsLeft: spin.spinsLeft, winMessage: null });
    await presentSpinResult(spin.board, spin.evaluation.totalWin, winMessageFor(spin.evaluation), turbo);
    if (spin.evaluation.wins.length > 0) {
      scene?.highlightSymbols(new Set(spin.evaluation.wins.map((w) => w.symbol)));
      await sleep(turbo ? 120 : 500);
    }
    // vault updates land after the spin resolves (video-verified: value+marks appear post spin 1)
    const marked = marksFrom(spin);
    store().patch({ vault: { active: true, value: spin.vaultValue, markedCount: spin.markedCount, marked } });
    scene?.setMarks(marked);
    if (spin.newlyMarked.length > 0) await sleep(turbo ? 100 : 400);
  }
}

function emptyMarks(): boolean[][] {
  return Array.from({ length: 4 }, () => Array(5).fill(false));
}

const markAccumulator = { marks: emptyMarks() };

function marksFrom(spin: FsSpinResult): boolean[][] {
  for (const [r, c] of spin.newlyMarked) markAccumulator.marks[r][c] = true;
  return markAccumulator.marks.map((row) => [...row]);
}

async function runRound(buy: boolean) {
  if (running) return;
  const s = store();
  const cost = buy ? buyCost(s.totalBet) : s.totalBet;
  if (s.balance < cost) return;

  running = true;
  markAccumulator.marks = emptyMarks();
  const seed = (seedCounter = (seedCounter * 1664525 + 1013904223) >>> 0);
  const result: RoundResult = playRound({ seed, totalBet: s.totalBet, balance: s.balance, buy });
  const turbo = s.turbo;

  s.patch({ phase: 'spinning', lastWin: 0, winMessage: null });
  s.setBalance(buy ? round2(s.balance - buyCost(s.totalBet)) : round2(s.balance - s.totalBet));

  await presentSpinResult(result.baseBoard, result.baseEvaluation.totalWin, winMessageFor(result.baseEvaluation), turbo);
  if (result.baseEvaluation.wins.length > 0 || result.baseEvaluation.scatterWin > 0) {
    scene?.highlightSymbols(new Set(result.baseEvaluation.wins.map((w) => w.symbol)));
  }

  const megaX = result.baseEvaluation.totalWin / result.totalBet;
  if (megaX >= 8 && !store().skipScreens) {
    store().patch({ banner: { kind: 'mega', amount: result.baseEvaluation.totalWin } });
    await waitBanner(store().autoplayActive ? 1800 : undefined);
  }

  if (result.fsTriggered) {
    store().patch({ banner: { kind: 'fsTrigger', spins: 10 }, fsSpinsLeft: 10 });
    await waitBanner(store().skipScreens ? 600 : undefined);
    await playFsSpins(result.fsSpins, turbo);
    if (!store().skipScreens) {
      store().patch({ banner: { kind: 'fsOutro', amount: round2(result.totalWin) } });
      await waitBanner(store().autoplayActive ? 2000 : undefined);
    }
    scene?.clearMarks();
    store().patch({ phase: 'idle', fsSpinsLeft: null, vault: { active: false, value: null, markedCount: 0, marked: emptyMarks() } });
  }

  store().setBalance(result.balanceAfter);
  store().patch({ phase: 'idle', lastWin: result.totalWin });
  running = false;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export async function spinOnce() {
  await runRound(false);
}

export async function buyFeature() {
  if (store().autoplayActive) return; // disabled during autoplay (ui-and-controls.md)
  await runRound(true);
}

export async function startAutoplay(count: number) {
  const s = store();
  s.patch({ autoplayActive: true, autoplayLeft: count, modal: null });
  while (store().autoplayActive && store().autoplayLeft > 0 && store().balance >= store().totalBet) {
    store().patch({ autoplayLeft: store().autoplayLeft - 1 });
    await runRound(false);
    await sleep(store().turbo ? 80 : 300);
  }
  store().patch({ autoplayActive: false, autoplayLeft: 0 });
}

export function stopAutoplay() {
  store().patch({ autoplayActive: false, autoplayLeft: 0 });
}
