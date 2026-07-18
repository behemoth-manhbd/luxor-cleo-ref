# Vault Bonus — Mechanics

## Trigger
- Active **throughout every Free Spins round** (base-triggered or bought). Not independently triggerable; it starts at `fs_start` and resolves at `fs_end`.

## Parameters
| Constant | Value | Source |
|---|---|---|
| Starting Vault value | 20 × total bet ($40 at $2 bet) | paytable p3, live |
| Total positions | 20 (the full 5×4 board = 20 cells) | paytable p3, live |
| Pre-marked positions | 8, on reels 2–4 — applied **after the first free spin resolves**, not at round start | paytable p3 ("When the round starts, after the first free spin, 8 random positions... are marked") |
| Marker source | each `cleopatra` on an **unmarked** cell marks it | paytable p3, live |
| Wild increment | exact table (paytable p2): 1 wild → 1x/1.5x/2x/2.5x/5x/12.5x/25x/50x; 2 wilds → 5x/10x/25x/50x/100x/250x/500x/2500x; 3 wilds → 7.5x/15x/37.5x/75x/150x/375x/750x/12500x; 4 wilds → 10x/20x/50x/100x/200x/500x/1000x/12500x; 5 wilds → 12.5x/25x/62.5x/125x/250x/625x/1250x/12500x; 6+ wilds → 15x/30x/75x/150x/300x/750x/1500x/12500x (all × total bet) | paytable p2, exact |
| Scatter increment (in FS) | +10× / +50× / +250× total bet for 3 / 4 / 5 scatters | paytable p3, exact |
| Payout condition | ALL 20 positions marked by round end | paytable p3, live |
| On shortfall | Vault **forfeited** (pays 0) | live |
## Algorithm
1. At `fs_start`: `vaultValue = 20 × totalBet`; `markedCount = 0` (no positions pre-marked yet — paytable page 3 confirms the 8-position pre-mark happens after the first free spin, not at round start).
2. After free spin 1's reels land: select and mark 8 random positions on reels 2–4 (`markedCount = 8`); play the gold sparkle-burst per newly-marked cell.
3. For each free spin (including spin 1, after the step-2 pre-mark on spin 1), after reels land:
   a. For each `cleopatra` on an unmarked cell: mark it, `markedCount += 1` (cap 20); play the gold sparkle-burst.
   b. For each `wild_multiplier` landing: `vaultValue += randomWildIncrement` (from the exact increment table).
   c. If `scatter` count ≥ 3 this spin: `vaultValue += {3:10×,4:50×,5:250×} × totalBet`.
4. Marks and value persist across spins within the round.
5. At `fs_end` (`freeSpinsLeft == 0`):
   - IF `markedCount == 20`: pay `vaultValue`, emit `vault_resolve{paid:true}`.
   - ELSE: forfeit — `vault_resolve{paid:false, vaultPayout:0}`.
## State
- Within a spin: `newlyMarked[]`, `wildIncrementsThisSpin`, `scatterIncrementThisSpin`.
- Within the round: `vaultValue`, `markedCount` (0..20), `markedGrid[4][5]` booleans.
- Across the feature: none — Vault does not persist beyond the round.

## Interactions
- **Grid:** marking overlays the 5×4 board (marked cells render red with an ankh/scroll icon vs plain purple) [t39].
- **Math:** Vault payout (when it pays) adds to the FS `roundWin`; increments are total-bet multiples.
- **Other features:** fed by [[wild_multiplier-mechanics]] (value) and `cleopatra`/`scatter` landings; lives inside [[free_spins-mechanics]].

## Edge cases
- **Never reached 20/20** across all observed rounds (peak 16/20 twice) — forfeit is the common path [t41][t94]; treat completion as rare but reachable.
- **Cap interaction:** if `vaultValue` + line wins would exceed 12,500× total bet, clamp to the cap and end the round (see [[math-and-rtp]]).
- **Cleopatra on already-marked cell:** no additional mark; still pays as a normal symbol.
- **Round end mid-climb:** any un-completed Vault is forfeited regardless of accumulated value ($113 forfeited at 16/20 observed [t41]).

## QA checklist
1. Assert `markedCount` starts at 0, becomes 8 after free spin 1's pre-mark, and increments by exactly one per `cleopatra` on an unmarked cell thereafter, never exceeding 20.
2. Assert Vault pays only when `markedCount == 20`; every `< 20` end state pays 0.
3. Assert scatter-in-FS adds +10×/+50×/+250× for 3/4/5 and that `vaultValue` starts at exactly 20× total bet.
## References
- game-brief.md; live play-log [t38][t39][t40][t41][t48][t49][t94]
- https://clashofslots.com/slots/pragmatic-play/luxor-of-cleopatra/