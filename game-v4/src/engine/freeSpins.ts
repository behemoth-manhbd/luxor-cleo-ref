// Free Spins round (free_spins-mechanics.md): flat 10 spins, no retrigger; hosts the
// Vault; 12,500x cap ends the round immediately and forfeits remaining spins + Vault.

import { round2 } from './config/bets';
import { FREE_SPINS_COUNT, MAX_WIN_X } from './config/rules';
import { FS_STRIPS } from './config/strips';
import type { EventSink } from './events';
import { fillBoard } from './spin';
import * as vaultOps from './vault';
import { countSymbol, evaluateBoard } from './ways';
import type { Rng } from './rng';
import type { FsSpinResult } from './types';

export type FsRoundOutcome = {
  spins: FsSpinResult[];
  fsWin: number; // line+scatter wins across spins (no vault)
  vaultPaid: boolean;
  vaultPayout: number;
  capped: boolean;
};

export function playFreeSpins(
  totalBet: number,
  priorRoundWin: number, // win already accrued this round (trigger scatter pay)
  rng: Rng,
  emit: EventSink,
  injectedBoards?: import('./types').Board[], // test vectors: boards GIVEN, not drawn
): FsRoundOutcome {
  const cap = round2(MAX_WIN_X * totalBet);
  const vault = vaultOps.initVault(totalBet);
  const spins: FsSpinResult[] = [];
  let fsWin = 0;
  let roundWin = priorRoundWin;
  let capped = false;

  emit({ id: 'fs_start', spinsAwarded: FREE_SPINS_COUNT, reelSet: 'night' });
  emit({ id: 'vault_init', vaultValue: vault.value, preMarked: 0 });

  let spinsLeft = FREE_SPINS_COUNT;
  while (spinsLeft > 0) {
    spinsLeft--;
    emit({ id: 'fs_spin_start', spinsLeft });

    const board = injectedBoards?.[spins.length] ?? fillBoard(FS_STRIPS, rng);
    emit({ id: 'fs_reels_land', board });

    const evaluation = evaluateBoard(board, 'fs', totalBet);
    emit({ id: 'fs_ways_evaluate', wins: evaluation.wins, totalWin: evaluation.totalWin });

    const isFirstSpin = spins.length === 0;
    let newlyMarked: [number, number][] = [];
    if (isFirstSpin) {
      newlyMarked = vaultOps.preMark(vault, rng);
      emit({ id: 'vault_premark', markedCells: newlyMarked, markedCount: vault.markedCount });
    }

    const cleoMarks = vaultOps.markCells(vault, countSymbol(board, 'cleopatra'));
    if (cleoMarks.length > 0) {
      emit({ id: 'cleopatra_mark', markedCells: cleoMarks, markedCount: vault.markedCount });
    }
    newlyMarked = [...newlyMarked, ...cleoMarks];

    let vaultIncrement = 0;
    const wildCount = countSymbol(board, 'wild_multiplier').length;
    if (wildCount > 0) {
      const addX = vaultOps.wildIncrementX(wildCount, rng);
      vaultIncrement += round2(addX * totalBet);
      vault.value = round2(vault.value + addX * totalBet);
      emit({ id: 'vault_increment', source: 'wild_multiplier', addX, vaultValue: vault.value });
    }
    if (evaluation.scatterCount >= 3) {
      const addX = vaultOps.scatterAddX(evaluation.scatterCount);
      vaultIncrement += round2(addX * totalBet);
      vault.value = round2(vault.value + addX * totalBet);
      emit({ id: 'vault_increment', source: 'scatter', addX, vaultValue: vault.value });
    }

    fsWin = round2(fsWin + evaluation.totalWin);
    roundWin = round2(roundWin + evaluation.totalWin);

    spins.push({
      board,
      evaluation,
      newlyMarked,
      vaultIncrement,
      vaultValue: vault.value,
      markedCount: vault.markedCount,
      spinsLeft,
    });
    emit({ id: 'fs_spin_end', spinsLeft });

    if (roundWin >= cap) {
      // cap hit: round ends now, remaining spins and the un-paid Vault are forfeited
      capped = true;
      emit({ id: 'vault_resolve', markedCount: vault.markedCount, paid: false, vaultPayout: 0 });
      return { spins, fsWin, vaultPaid: false, vaultPayout: 0, capped };
    }
  }

  const vaultPaid = vaultOps.isComplete(vault);
  const vaultPayout = vaultPaid ? vault.value : 0;
  emit({ id: 'vault_resolve', markedCount: vault.markedCount, paid: vaultPaid, vaultPayout });
  if (vaultPaid && round2(roundWin + vaultPayout) >= cap) capped = true;

  return { spins, fsWin, vaultPaid, vaultPayout, capped };
}
