// Round orchestrator: base spin -> optional Free Spins -> settle, emitting the canonical
// event stream in the documented deterministic order (event-order-and-determinism.md).
// Buy mode differs only at entry: charge 30x bet, then force an exactly-3-scatter board.

import { round2 } from './config/bets';
import { BUY_COST_X, MAX_WIN_X, SCATTERS_TO_TRIGGER } from './config/rules';
import { BASE_STRIPS } from './config/strips';
import type { EventSink, GameEvent } from './events';
import { playFreeSpins } from './freeSpins';
import { mulberry32 } from './rng';
import { fillBoard } from './spin';
import type { Board, RoundResult } from './types';
import { evaluateBoard } from './ways';

// MEGA banner threshold is not printed in-game; observed banner around ~8.5x bet
// (presentation-and-feel.md) — 8x chosen as [ASSUMPTION].
const MEGA_THRESHOLD_X = 8;

export type PlayArgs = {
  seed: number;
  totalBet: number;
  balance: number;
  buy?: boolean;
  sink?: EventSink;
};

export function buyCost(totalBet: number): number {
  return round2(BUY_COST_X * totalBet);
}

export function playRound({ seed, totalBet, balance, buy = false, sink }: PlayArgs): RoundResult {
  const events: GameEvent[] = [];
  const emit: EventSink = (e) => {
    events.push(e);
    sink?.(e);
  };
  const rng = mulberry32(seed);
  const cap = round2(MAX_WIN_X * totalBet);

  emit({ id: 'spin_start', seed, stake: totalBet, mode: buy ? 'buy' : 'base', balanceBefore: balance });

  let balanceAfter: number;
  let baseBoard: Board;
  if (buy) {
    const cost = buyCost(totalBet);
    if (balance < cost) throw new Error('insufficient balance for buy feature');
    balanceAfter = round2(balance - cost);
    emit({ id: 'buy_confirm', cost, balanceAfter });
    emit({ id: 'buy_charge', cost });
    emit({ id: 'reels_spin', mode: 'base' });
    baseBoard = forceScatterBoard(rng);
  } else {
    balanceAfter = round2(balance - totalBet);
    emit({ id: 'bet_deduct', betAmount: totalBet, balanceAfter });
    emit({ id: 'reels_spin', mode: 'base' });
    baseBoard = fillBoard(BASE_STRIPS, rng);
  }
  emit({ id: 'reels_land', board: baseBoard });

  const baseEvaluation = evaluateBoard(baseBoard, 'base', totalBet);
  emit({ id: 'ways_evaluate', wins: baseEvaluation.wins, totalWin: baseEvaluation.totalWin });
  emit({ id: 'scatter_check', scatterCount: baseEvaluation.scatterCount });

  if (baseEvaluation.totalWin > 0) {
    emit({ id: 'win_present', totalWin: baseEvaluation.totalWin });
    const winX = baseEvaluation.totalWin / totalBet;
    if (winX >= MEGA_THRESHOLD_X) emit({ id: 'win_tier_banner', tier: 'MEGA', amountX: winX });
  }

  let totalWin = Math.min(baseEvaluation.totalWin, cap);
  let capped = totalWin >= cap;
  const fsTriggered = !capped && baseEvaluation.scatterCount >= SCATTERS_TO_TRIGGER;
  let fsSpins: RoundResult['fsSpins'] = [];
  let vaultPaid = false;
  let vaultPayout = 0;

  if (fsTriggered) {
    emit({ id: 'fs_trigger', scatterCount: baseEvaluation.scatterCount, awarded: 10 });
    const fs = playFreeSpins(totalBet, totalWin, rng, emit);
    fsSpins = fs.spins;
    vaultPaid = fs.vaultPaid;
    vaultPayout = fs.vaultPayout;
    totalWin = Math.min(round2(totalWin + fs.fsWin + fs.vaultPayout), cap);
    capped = fs.capped || totalWin >= cap;
    balanceAfter = round2(balanceAfter + totalWin);
    emit({ id: 'fs_end', totalFsWin: round2(fs.fsWin + fs.vaultPayout), balanceAfter });
  } else {
    balanceAfter = round2(balanceAfter + totalWin);
  }

  emit({ id: 'round_end', totalWin, balanceAfter });

  return {
    seed,
    totalBet,
    baseBoard,
    baseEvaluation,
    fsTriggered,
    fsSpins,
    vaultPaid,
    vaultPayout,
    capped,
    totalWin,
    balanceAfter,
  };
}

function forceScatterBoard(rng: ReturnType<typeof mulberry32>): Board {
  // deterministic rejection sampling: redraw until the board holds exactly 3 scatters
  for (let i = 0; i < 100000; i++) {
    const board = fillBoard(BASE_STRIPS, rng);
    let scatters = 0;
    for (const row of board) for (const cell of row) if (cell === 'scatter') scatters++;
    if (scatters === 3) return board;
  }
  throw new Error('could not force a 3-scatter board');
}
