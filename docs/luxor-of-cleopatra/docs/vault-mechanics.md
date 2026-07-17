# Vault — Mechanics

## Trigger
- The **Vault** is a progressive pot **active throughout the entire free-spins round** (it does not exist in the base game). It is created on `fs_start` and resolved on the final free spin.

## Parameters
| Constant | Value | Source |
|---|---|---|
| Starting value | **20× total bet** (observed $40.00 at $2.00 bet) | paytable 3/6 `[t13]`, `[t31]` |
| Positions to fill | **20** (all board positions) | paytable 3/6, `[t13]` |
| Key symbol | `cleopatra` marks the board position it lands on | paytable 3/6, `[t31]` |
| Extra-SCATTER add | +10× / +50× / +250× for 3 / 4 / 5 extra scatters | paytable 3/6 `[t13]` |
| WILD-MULTIPLIER add | random increment from a list (1×…up to 12500× for large WM counts) — estimated | paytable 2/6 |
| Unlock condition | mark **all 20** positions by the end of spin 10 | paytable 3/6 |
| On failure | Vault **forfeited** (paid $0) | `[t34]` |
| Global cap | 12,500× total bet — estimated (confidence: 0.50, sources: 5) | paytable 3/6, 6/6 |

## Algorithm
1. `fs_start`: `vault = 20 × totalBet`; `marked = 0`; `positionMarked[20] = false`.
2. **After the first free spin only:** 8 random positions on reels 2, 3 or 4 are marked automatically (`marked += 8`) — confirmed paytable 3/6.
3. Each free spin after `fs_reels_land`:
   a. `vault_key_mark`: for every `cleopatra` cell, if its board position is not yet marked → set marked, `marked += 1` (cap 20).
   b. `fs_scatter_check`: if extra scatters land, `vault += {10,50,250}× totalBet` for 3/4/5.
   c. `vault_add`: for each `wild_multiplier` on the board, `vault += randomIncrement × totalBet` (see the exact per-hit-count table in Parameters — confirmed via paytable 2/6).
4. On the final spin (or on an early win-cap exit, see [[event-order-and-determinism]]) `vault_resolve`:
   - if `marked == 20` → `vault_award`: `roundWin += vault`.
   - else → `vault_forfeit`: add nothing.
5. `win_cap_check` clamps `roundWin` to 12,500× total bet.
## State
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- **Within the round:** `vault` (running total), `marked` (0–20), `positionMarked[]` (which of the 20 cells are keyed).
- **Across the round:** persists for all 10 spins; reset only on next `fs_start`.

## Interactions
- **[[free_spins-mechanics]]:** the Vault lives for exactly the 10-spin round.
- **[[wild_multiplier-mechanics]]:** each WM feeds a random Vault increment.
- **Scatters:** extra scatters (which do not retrigger) instead add to the Vault.
- **[[math-and-rtp]]:** the Vault award is part of `roundWin` and shares the 12,500× cap.

## Edge cases
- **Never completed:** across 5 observed rounds the best was 18/20 → forfeit each time `[t34]`,`[t46]`,`[t51]`,`[t57]`. A clone must still support 20/20 completion + payout.
- **Position already marked:** a repeat Cleopatra on a marked position does not double-count.
- **Vault ≥ cap:** if `vault` alone would exceed 12,500× the round total is clamped at award.
- **Awarded value forfeit past cap:** anything beyond 12,500× per round is forfeited (paytable 6/6).

## QA checklist
1. Vault initialises to exactly 20× total bet on `fs_start` (e.g. $40.00 at $2.00 bet).
2. Reaching `marked == 20` by end of spin 10 pays the full accumulated Vault; `marked < 20` pays $0 from the Vault.
3. Adding 3/4/5 extra scatters increases the Vault by exactly +10×/+50×/+250× total bet and does not add free spins.

## References
- paytable-2.png, paytable-3.png, freespins-wildmultiplier.png
- Play-log `[t31]`,`[t34]`,`[t46]`,`[t49]`,`[t51]`,`[t57]`
- https://www.bigwinboard.com/luxor-of-cleopatra-pragmatic-play-slot-review/