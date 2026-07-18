# Free Spins — Mechanics

## Trigger
- **Condition:** 3 or more `scatter` (lotus) symbols land anywhere on the 5×4 grid in a single base spin.
- **Award:** exactly **10** free spins, flat, regardless of whether 3, 4 or 5 scatters landed (confirmed across all observed triggers [t36][t48][t72]).
- The triggering scatters also pay their scatter value (`scatter` 3→1×, 4→5×, 5→25× total bet) as part of the same spin.

## Parameters
| Constant | Value | Source |
|---|---|---|
| Scatter count to trigger | ≥ 3 | spec.features.free_spins |
| Free spins awarded | 10 (flat) | live [t36][t72] |
| Reel set | night-temple special reels | live [t38] |
| Retrigger | **none** — 3 scatters on a round's final spin added 0 spins | live [t72], spec |
| Wild present in FS | `wild_multiplier` (×2, stacks 2×/4×/8×…) | spec, live [t49] |
| Cleopatra density | raised on FS reels to drive Vault | spec |
| Buy-feature entry | 30× total bet (see [[buy_feature-mechanics]]) | live [t57] |

## Algorithm
1. On base spin resolution, count `scatter` symbols on the board.
2. If count ≥ 3: pay the scatter award, emit `fs_trigger`, and set `freeSpinsLeft = 10`.
3. Show the "CONGRATULATIONS — YOU HAVE WON 10 FREE SPINS" screen, then transition to the night-temple reel set.
4. Initialize the Vault (see [[vault_bonus-mechanics]]): `vaultValue = 20 × totalBet`, `markedCount = 0`. The 8-position pre-mark on reels 2–4 is applied after the FIRST free spin resolves, not before spin 1 — confirmed by in-game paytable page 3 ("When the round starts, after the first free spin, 8 random positions... are marked").
5. LOOP while `freeSpinsLeft > 0`:
   a. `freeSpinsLeft -= 1`; spin the FS reels.
   b. Evaluate ways wins with `wild_multiplier` substitution and multiplicative stacking (see [[wild_multiplier-mechanics]]).
   c. On spin 1 only: apply the 8-position Vault pre-mark. Apply Vault marking/increments for any `cleopatra`, `wild_multiplier`, and `scatter` landings.
   d. Add the spin win to `roundWin`; present it.
6. On `freeSpinsLeft == 0`: resolve the Vault (pay if 20/20 marked, else forfeit — see [[vault_bonus-mechanics]]).
7. Present the round-outro summary card (total FS win) unless "Skip Screens" is enabled; return to base game.
## State
- Within a spin: `board[4][5]`, `spinWin`, `scatterCountThisSpin`, wilds-in-each-way.
- Within the round: `freeSpinsLeft`, `roundWin`, plus all Vault state (`vaultValue`, `markedPositions/20`).
- Across features: none — no multiplier or Vault value carries beyond the round (no respin mechanic).

## Interactions
- **Grid:** uses a dedicated FS reel set with higher `cleopatra` density; evaluation rule is identical 1024-ways (see [[math-and-rtp]]).
- **Math:** scatter award + all FS line wins accrue to `roundWin`; Vault payout (if any) is added at round end.
- **Other features:** hosts [[wild_multiplier-mechanics]] and [[vault_bonus-mechanics]]; entered directly by [[buy_feature-mechanics]].

## Edge cases
- **Retrigger:** none — additional scatters during FS do NOT add spins; they only feed the Vault [t72].
- **Final-spin scatters:** add Vault value but no spins.
- **Empty/no-win spin:** allowed; Vault marks/increments still apply if the relevant symbols land.
- **Win cap:** the 12,500× total-bet cap applies to the whole round; if reached the round ends immediately (see [[math-and-rtp]]).
- **Skip Screens on:** suppresses the outro summary card (round total not displayed) [t96].

## QA checklist
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
1. Assert every trigger (3, 4 or 5 scatters) awards exactly 10 free spins.
2. Assert scatters landing during FS never increment `freeSpinsLeft` (no retrigger).
3. Assert `roundWin` equals the sum of all per-spin wins plus any Vault payout, and that FS entry deducts nothing from balance when reached via base trigger.

## References
- game-brief.md; live play-log [t36][t48][t72][t96]
- https://www.bigwinboard.com/luxor-of-cleopatra-pragmatic-play-slot-review/
- https://clashofslots.com/slots/pragmatic-play/luxor-of-cleopatra/