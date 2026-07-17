# Free Spins — Mechanics

## Trigger
- **Condition:** 3 or more `scatter` (lotus) symbols land **anywhere** on the 5×4 board in a single base-game spin.
- **Award:** a fixed **10 free spins** — 3, 4, or 5 scatters all award exactly 10 (no scaling). Confirmed `[t28]`, `[t34]`.
- The triggering spin **also pays the scatter prize** (1×/5×/25× total bet for 3/4/5 scatters) — see [[math-and-rtp]]. Observed: guaranteed buy-trigger paid $2.00 = 1× total bet on 3 scatters `[t27]`.
- **Retrigger:** NONE. Extra scatters during free spins do not add spins; they feed the [[vault-mechanics|Vault]] instead. No retrigger observed across 5 rounds `[t34]`,`[t46]`,`[t51]`.

## Parameters
| Constant | Value | Source |
|---|---|---|
| Scatters to trigger | 3+ | paytable 2/6 `[t11]` |
| Free spins awarded | 10 (fixed) | `[t28]` |
| Wild behaviour in FS | every WILD becomes `wild_multiplier` ×2 | paytable 2/6, `[t33]` |
| Retrigger | disabled | `[t34]` |
| Vault start | 20× total bet | [[vault-mechanics]] |
| Scatter FS award (added to Vault) | +10× / +50× / +250× for 3 / 4 / 5 | paytable 3/6 `[t13]` |
| Global win cap | 12,500× total bet per round — estimated (confidence: 0.50, sources: 5) | paytable 3/6, 6/6 |
| Background | night-desert scene | `[t30]` |

## Algorithm
1. On base-spin `ways_evaluate`, run `scatter_check`; if scatter count ≥ 3 → set `fsTriggered = true`, pay the scatter prize, emit `fs_trigger`.
2. Emit `fs_intro` (Congratulations overlay, "10 FREE SPINS"); set `freeSpinsRemaining = 10`.
3. Emit `fs_start`: initialise `vault = 20 × totalBet`, `vaultPositionsMarked = 0` (of 20). Enter free-spins mode (all wilds → `wild_multiplier`, appearing on all 5 reels).
4. For each free spin while `freeSpinsRemaining > 0`:
   a. `fs_spin_start`; `freeSpinsRemaining -= 1`.
   b. `fs_board_fill` → `fs_reels_land`.
   c. `wild_multiplier_collect`: record all `wild_multiplier` cells and their positions (any of the 5 reels).
   d. `ways_evaluate`: compute all left-to-right ways wins (wilds substitute).
   e. `wild_multiplier_apply`: multiply each winning way by the product of the WM multipliers on that way, once — see [[wild_multiplier-mechanics]].
   f. **After spin 1 only:** `vault_seed_mark`: 8 random positions on reels 2, 3 or 4 are marked automatically (confirmed paytable 3/6: "after the first free spin, 8 random positions on reels 2, 3 or 4 are marked"). Then on every spin, `vault_key_mark`: each `cleopatra` on the board marks its (still-unmarked) board position (up to 20); increment `vaultPositionsMarked`.
   g. `fs_scatter_check` + `vault_add`: extra scatters add +10×/50×/250×; each WM adds a random increment — see [[vault-mechanics]].
   h. `fs_spin_settle`: add spin win to `roundWin`. If `roundWin ≥ 12500 × totalBet` at any point, immediately end the round (`win_cap_check`), award up to the cap, and forfeit all remaining free spins/features (paytable 3/6 & 6/6) — do not wait for spin 10.
5. On the last spin (or on early cap-exit) emit `fs_last_spin` (banner `[t33]`).
6. `vault_resolve`: if `vaultPositionsMarked == 20` → `vault_award` (add `vault` to `roundWin`); else → `vault_forfeit` (add nothing). Skipped if the round already ended early via the cap.
7. `win_cap_check`: `roundWin = min(roundWin, 12500 × totalBet)`.
8. `fs_end`: present total FS win, return to base game.
## State
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- **Within a spin:** current board, WM cells + multipliers, ways wins, spin win.
- **Across the feature:** `freeSpinsRemaining`, `roundWin`, `vault`, `vaultPositionsMarked` (0–20), `fsTriggered`.
- **Mode flag:** `mode = free_spins` (changes wild → wild_multiplier and enables Vault).

## Interactions
- **Grid:** same 5×4 / 1024-ways evaluation as base — see [[math-and-rtp]].
- **[[wild_multiplier-mechanics]]:** all wilds carry ×2 and stack multiplicatively during this round.
- **[[vault-mechanics]]:** runs in parallel; its award depends on the 20-position "key" collection completed by end of spin 10.
- **[[buy_feature-mechanics]]:** an alternate entry point that force-lands a 3-scatter trigger.
- **Order:** WM multipliers apply per-spin before Vault resolves at round end — see [[event-order-and-determinism]].

## Edge cases
- **Retrigger:** none — extra scatters never extend the round, only feed the Vault.
- **Empty/no-win spin:** valid; still marks Cleopatra keys and may add to Vault.
- **Vault not completed:** best observed 18/20 → forfeit; award $0 from Vault `[t34]`,`[t57]`.
- **Win cap:** round total clamped to 12,500× total bet; excess forfeited (paytable 6/6, `[t16]`).
- **Concurrency:** free spins auto-advance `[t30]`; player input is not required between spins.

## QA checklist
1. 3, 4, and 5 scatters each award exactly 10 free spins (no scaling).
2. Triggering spin credits the scatter prize (e.g. 3 scatters at $2.00 bet ⇒ +$2.00) before FS begins.
3. Landing extra scatters mid-round adds to the Vault and does **not** increment `freeSpinsRemaining`.
4. During free spins every WILD is treated as a `wild_multiplier` (×2) for win/Vault purposes. Note: live captures this session (`multiplier-stacked-x2x2.png`, `freespins-wildmultiplier.png`) show the symbol rendered with the same pyramid "WILD" art as the base-game wild — the ×2 behavior is confirmed by paytable text and observed win-value jumps, but a visually distinct "coin" graphic was not observed on the reels.
## References
- paytable-2.png, paytable-3.png, freespins-trigger.png, freespins-intro.png, freespins-outro.png
- Play-log `[t27]`,`[t28]`,`[t30]`,`[t33]`,`[t34]`
- https://www.bigwinboard.com/luxor-of-cleopatra-pragmatic-play-slot-review/
- https://www.aboutslots.com/casino-slots/luxor-of-cleopatra