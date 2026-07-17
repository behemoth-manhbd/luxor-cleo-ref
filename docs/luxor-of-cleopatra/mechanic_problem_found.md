# Mechanic Problems Found — docs/luxor-of-cleopatra

Review date: 2026-07-17. Internal consistency check across the mechanics docs and `game-spec.json`.

## Critical — contradictions between docs

### 1. Per-spin event order conflict: `scatter_check` vs `vault_key_mark`
- `event-order-and-determinism.md:41` and the invariant at line 52 pin the order `wild_multiplier_apply → scatter_check → vault_key_mark → vault_add` ("we fix scatter→keys→adds").
- `free_spins-mechanics.md:31-32` (step f keys → step g `fs_scatter_check` + `vault_add`) and `vault-mechanics.md:22-24` (a `vault_key_mark` → b `fs_scatter_check` → c `vault_add`) both say **keys before scatter**.
- Golden snapshots depend on the event stream, so one order must be chosen and propagated everywhere.

### 2. Early win-cap exit: is `vault_resolve` emitted or not?
- `event-order-and-determinism.md:42` and `free_spins-mechanics.md:35` say `vault_resolve` is **skipped** on an early 12,500× cap exit (straight to forfeit).
- `vault-mechanics.md:25` says `vault_resolve` **runs** "on the final spin (or on an early win-cap exit)".
- Same monetary outcome (forfeit) but a different event stream → breaks golden snapshots.

### 3. TV-10 contradicts the per-way wild-multiplier product rule
- `wild_multiplier-mechanics.md:19`: `wayMultiplier = ∏(multiplier of every WM cell that participates in this win)` — each way passes through exactly **one** cell per reel.
- `test-vectors.md` TV-10 (4 WM stacked on reel 5) computes "WM product = 2⁴ = 16" applied to **every** way → pre-cap 81,920×.
- Under the per-way rule each way gets only ×2 → pre-cap = 5 × 1024 × 2 = **10,240× < 12,500×** → the board never hits the cap and TV-10's clamp assertion fails.
- `wild_multiplier-mechanics.md:39` (edge case: stacked WM "both count toward … the multiplier product") also leans against algorithm step 3. The stacked-WM interpretation is flagged [ASSUMPTION] — pick one interpretation, then fix TV-10 (or change its board so the cap is reached regardless of the assumption).

### 4. `nine` has a 2-of pay that contradicts the min-length rule
- `math-and-rtp.md:47`, `product-spec.md:40` and `game-spec.json` (`math.paytable.nine."2": 0.1`) give `nine` a 2-of pay.
- The rule at `math-and-rtp.md:20` / `product-spec.md:21` says 2-of applies only to CLEOPATRA/SCARAB/RING/WILD, "3 for all others".
- Likely a stray copy of the scarab correction (in the JSON both `scarab` and `nine` have `"2"` appended last).

## Stale after the SCARAB correction

### 5. "SCARAB also pays 2-of" not propagated
- `game-features.md:5` still says "CLEO/RING/WILD from 2-of, others from 3-of" (missing SCARAB). `docs-verify.json` flagged this section `contradicted` with action `fix` in both rounds, but the fix was rejected (`section_not_found`) and never applied.
- `test-vectors.md:163` coverage checklist still says "2-of minimum (CLEOPATRA/RING/WILD)".

## Determinism / event gaps

### 6. Base-game event sequence missing
- `event-order-and-determinism.md:38-45` — the "Deterministic Spin Event Order" section starts directly with the FREE-SPINS SEQUENCE, yet line 45 references "Return to base flow step 9", which is defined nowhere in the doc.

### 7. Draw-order table missing the 8-position vault seed draw
- `event-order-and-determinism.md:57-67` lists draws 1–5 (reel fills) and 6…5+k (WM vault increments) only. `vault_seed_mark` needs random selection of 8 positions on reels 2–4 (`free_spins-mechanics.md:31`) — an undocumented draw, violating the table's own rule ("any new draw MUST be appended at a fixed, documented position", line 68).

### 8. Event ids used but not defined in the canonical table
- `vault_seed_mark` (`event-order-and-determinism.md:41,50`, `free_spins-mechanics.md:31`), plus the ids already flagged by `consistency.json`: `fs_board_fill`, `fs_reels_land`, `fs_scatter_check`, `buy_feature_decline`.

### 9. Ambiguity: do 3+ scatters during free spins also pay the scatter prize?
- `free_spins-mechanics.md:52` says extra scatters "**only** feed the Vault"; `math-and-rtp.md:27` says SCATTER "pays … anywhere on the board" with no mode distinction. Needs an explicit rule.

## Minor

- `test-vectors.md:64-65, 90-91, 116-117`: TV-05 / TV-07 / TV-09 headings are duplicated.
- The paytable tables (`math-and-rtp.md:48-52`, `product-spec.md:41-45`) contain duplicate rows `scatter`/`scatterPays` and `wild_multiplier`/`wildStandalone`, a `vault` row mixed into the symbol table, and no plain `wild` row even though the rule text references `wild` — generation noise from the JSON→table step.

## Suggested fix priority

1. #1–#3 (directly affect engine behaviour / golden snapshots)
2. #4–#5 (paytable data + stale correction)
3. #6–#8 (determinism/event hygiene), then #9 and the minor items.
