# Event Order & Determinism

## Canonical Event IDs
| event id | phase | payload fields | emitted when |
|---|---|---|---|
| `spin_start` | init | seed, stake, mode | player/auto initiates a spin |
| `bet_deduct` | init | stake, balance | stake removed from balance (base/buy only) |
| `reels_land` | reveal | board[4][5] | reel stops chosen and grid revealed |
| `ways_evaluate` | eval | wins[]{symbol, reels, ways, basePay} | ways scanned left→right from reel 1 |
| `wild_multiplier_apply` | eval | perWay{k, M} | FS only: ×2 wilds fold into ways they join |
| `win_detect` | eval | spinWin | per-symbol wins summed into spin win |
| `scatter_check` | eval | scatterCount, band | scatter_lotus counted anywhere |
| `win_present` | present | tier, amount | win roll-up / tier banner shown |
| `fs_trigger` | feature | scatters, awarded=10 | base spin has ≥3 scatters |
| `fs_intro` | feature | vaultStart, marked | FS transition + VAULT activation |
| `fs_spin` | feature | index, remaining | each free spin begins |
| `vault_update` | feature | vaultValue, marked | cleopatra marks / wild+scatter increments applied |
| `vault_resolve` | feature | marked, paid | round end: pay if 20/20 else forfeit |
| `fs_end` | feature | roundWinTotal | free spins exhausted |
| `win_cap_clamp` | eval | raw, capped | total exceeds 12,500× bet → clamp |
| `round_end` | settle | totalWin, balance | spin fully resolved, balance updated |

## Deterministic Spin Event Order
Base game (one spin):
1. `spin_start`
2. `bet_deduct`
3. `reels_land`
4. `ways_evaluate`
5. `scatter_check`
6. `win_detect`
7. `win_cap_clamp` (if raw > cap)
8. `win_present`
9. If `scatter_check` ≥ 3 → `fs_trigger` → enter FREE-SPINS MODE (below)
10. `round_end`

FREE-SPINS MODE (entered after `fs_trigger`, or after buy):
- `fs_intro` (VAULT set to 20× bet)
- **FREE-SPINS LOOP (repeat 10 times, no retrigger):**
  a. `fs_spin`
  b. `reels_land`
  c. `ways_evaluate`
  d. `wild_multiplier_apply` (fold ×2 wilds into ways)
  e. `scatter_check` (feeds VAULT, never retriggers)
  f. `win_detect`
  g. `vault_update` (cleopatra marks + wild/scatter increments, clamp to cap)
  h. `win_cap_clamp` (if needed)
  i. `win_present`
- `vault_resolve` (pay VAULT iff marked == 20, else forfeit)
- `fs_end`
- `round_end`

Per-mode notes:
- **Buy mode:** `spin_start` → `bet_deduct (30× bet)` → forced `reels_land` with exactly 3 scatters → `scatter_check` → `fs_trigger` → FREE-SPINS MODE. No random base outcome.
- **Base vs FS:** `wild_multiplier_apply` and `vault_update` occur **only** in FS.

## Ordering Invariants
- `bet_deduct` MUST precede `reels_land` and any win — stake is committed before outcome (base/buy). See [[buy_feature-mechanics]].
- `wild_multiplier_apply` MUST occur **after** `ways_evaluate` and **before** `win_detect`, because the multiplier is applied per-way to the base ways payout — see [[wild_multiplier-mechanics]].
- `scatter_check` in base MUST resolve before `fs_trigger`; in FS it MUST route to `vault_update` and MUST NOT emit `fs_trigger` (no retrigger) — see [[free_spins-mechanics]].
- `vault_resolve` MUST run exactly once, at `fs_end`, and pays only when `marked == 20` — see [[vault-mechanics]].
- `win_cap_clamp` MUST apply after all multipliers/vault are summed for the payout unit being clamped (12,500× bet) — see [[math-and-rtp]].
- [ASSUMPTION] Within a spin, per-symbol ways wins are summed in a fixed symbol order (paytable order top→bottom) before `win_present`; the game does not pin this — chosen for reproducibility.

## RNG Contract
The draw-order table's step "FS-only: wild_multiplier placement/value per reel" is misleading: the wild_multiplier's own multiplier is fixed at x2 (not drawn), but the VAULT increment triggered by a wild-multiplier hit IS a random draw from a fixed table of possible values that depends on how many wild_multiplier symbols hit simultaneously (1 hit: 1x/1.5x/2x/2.5x/5x/12.5x/25x/50x bet; 2 hits: 5x/10x/25x/50x/100x/250x/500x/2500x bet; and so on up to 6+ hits). This VAULT-increment draw must be an explicit, separately documented draw position — it is not the same thing as "wild_multiplier value per reel."
## Replay & Golden Snapshots
- A spin is reproduced from `(seed, stake, mode)`; replaying the same tuple regenerates the identical board, ways wins, multiplier applications, VAULT updates, and event stream.
- Changing any rule (paytable, multiplier stacking, VAULT logic) or any **draw position** invalidates golden snapshots and requires an **intentional, reviewed regeneration**.
- Injected refill/reel symbols in test vectors are supplied via the seeded stub (see [[test-vectors]]).

## References
- spec.features; spec.math; spec.grid
- [[free_spins-mechanics]], [[vault-mechanics]], [[wild_multiplier-mechanics]], [[buy_feature-mechanics]]
- Live play-log [t16][t22][t26]