# Event Order & Determinism — Luxor of Cleopatra

This is a **ways** game with **no cascade** (`cascade = false`, confirmed `[t23]`): each spin is a single board fill + single evaluation. Free spins are a fixed loop of 10 such spins with per-spin wild multipliers and a round-end Vault resolution.

## Canonical Event IDs
| event id | phase | payload fields | emitted when |
|---|---|---|---|
| `spin_start` | init | `mode, totalBet, seed` | player commits a spin |
| `bet_deduct` | balance | `totalBet, balanceAfter` | stake removed (skipped inside free spins) |
| `board_fill` | rng | `board[4][5]` | RNG draws the 20 symbols |
| `reels_land` | reels | `board` | final board settles |
| `ways_evaluate` | eval | `wins[]{symbol,length,ways,base}` | left-to-right ways scanned |
| `scatter_check` | eval | `scatterCount, scatterPay` | scatters counted / paid |
| `win_tally` | eval | `spinWinMultiple` | way + scatter wins summed |
| `win_present` | presentation | `spinWin, tier` | wins animated / tier banner |
| `win_cap_check` | settle | `preCap, postCap` | clamp to 12,500× total bet |
| `balance_update` | settle | `balanceAfter` | winnings credited |
| `round_end` | end | `roundWin, mode` | spin/round finalised |
| `fs_trigger` | trigger | `scatterCount` | 3+ scatters detected |
| `fs_intro` | trigger | `spinsAwarded=10` | Congratulations overlay |
| `fs_start` | fs-init | `vault=20x, marked=0` | free-spins mode begins |
| `fs_spin_start` | fs-loop | `freeSpinsRemaining` | each free spin begins |
| `wild_multiplier_collect` | fs-loop | `wmCells[]` | WM positions recorded |
| `wild_multiplier_apply` | fs-loop | `wayMultiplier` | multiplier applied to winning ways |
| `vault_key_mark` | fs-loop | `marked` | Cleopatra keys mark positions |
| `vault_add` | fs-loop | `vaultDelta, vaultTotal` | scatter/WM increments added |
| `fs_spin_settle` | fs-loop | `spinWin, roundWin` | free spin resolved |
| `fs_last_spin` | fs-loop | `—` | final free spin banner |
| `vault_resolve` | fs-end | `marked, awarded` | branches to award/forfeit |
| `vault_award` | fs-end | `vaultTotal` | 20/20 → Vault paid |
| `vault_forfeit` | fs-end | `vaultTotal` | <20/20 → Vault forfeited |
| `fs_end` | fs-end | `roundWin` | free-spins round complete |
| `buy_feature_open` | buy | `cost=30x` | Buy panel opened |
| `buy_feature_confirm` | buy | `—` | player confirms Yes |
| `buy_feature_purchase` | buy | `cost, balanceAfter` | 30× total bet deducted |
| `buy_scatter_inject` | buy | `forced=3scatter` | trigger board forced |

## Deterministic Spin Event Order
**FREE-SPINS SEQUENCE** (`fs_start`, then FS LOOP repeated up to 10×):
- `fs_start`
- FS LOOP (repeat `freeSpinsRemaining` = 10 down to 0): a `fs_spin_start` → b `board_fill`/`reels_land` → c `wild_multiplier_collect` → d `ways_evaluate` → e `wild_multiplier_apply` → f `scatter_check` → g `vault_key_mark` (plus an automatic 8-position `vault_seed_mark` after spin 1 only) → h `vault_add` → i `win_tally` → j `fs_spin_settle`; on the last iteration emit `fs_last_spin`.
- **Early exit:** if `roundWin` reaches 12,500× total bet on ANY spin (not only the 10th), the round immediately ends there: emit `fs_last_spin`, skip straight to `win_cap_check` (award capped total), and forfeit all remaining free spins AND the Vault (`vault_forfeit`) without running `vault_resolve` — confirmed on paytable 3/6 & 6/6 ("the round immediately ends... all remaining free spins/features are forfeited").
- `vault_resolve` → (`vault_award` | `vault_forfeit`) — only reached if the round completes all 10 spins without hitting the cap early.
- `win_cap_check` → `fs_end`
- Return to base flow step 9.
- *Note:* no `bet_deduct` inside free spins (spins are free).
## Ordering Invariants
- Scatters are counted and free spins triggered **only after** `ways_evaluate`, so the trigger spin's scatter prize is paid before `fs_intro` — see [[free_spins-mechanics]] (forces `scatter_check` before `fs_trigger`).
- `wild_multiplier_apply` runs **per free spin**, immediately after `ways_evaluate`, and multiplies each winning way **once** — never re-applied at round end — see [[wild_multiplier-mechanics]].
- The Vault is normally resolved **once**, only after the 10th spin (`fs_last_spin` → `vault_resolve`); Cleopatra keys (plus the automatic 8-position seed after spin 1) accumulate across all spins first — see [[vault-mechanics]]. **Exception:** if the 12,500× cap is reached before spin 10, the round ends immediately and the Vault is forfeited without ever reaching `vault_resolve` (paytable 3/6 & 6/6).
- `win_cap_check` (12,500× clamp) is checked **continuously** through the free-spins loop, not only as a final step after Vault award — the round can end on any spin once the cap is reached, forfeiting the Vault and any remaining spins — see [[math-and-rtp]].
- **[ASSUMPTION]** Within a spin, `scatter_check` is evaluated before `vault_key_mark`/`vault_add`; the game does not pin this order on screen, so we fix scatter→keys→adds for determinism.
## RNG Contract
- **Stub:** a deterministic seeded PRNG (reference: `mulberry32`, or any equivalent); the **contract** is the property, not the algorithm — the same `(seed, stake, mode)` MUST produce an identical event stream and outcome.
- **Weights are NOT part of this contract.** Symbol weights/reel strips are proprietary and `not-derivable`; the stub draws **uniformly** unless real weights are supplied. Replacing weights changes outcomes but not the ordering contract.

**Draw-order table**
| draw # | purpose | when |
|---|---|---|
| 1 | reel 1 column fill (4 cells, top→bottom) | base/FS `board_fill` |
| 2 | reel 2 column fill | base/FS `board_fill` |
| 3 | reel 3 column fill | base/FS `board_fill` |
| 4 | reel 4 column fill | base/FS `board_fill` |
| 5 | reel 5 column fill | base/FS `board_fill` |
| 6…5+k | Vault increment per landed WM (reel-major order, k = WM count) | FS `vault_add` |
| — | Buy mode: reels 1–5 filled with a **forced** exactly-3-scatter placement (no draw for scatter positions) | `buy_scatter_inject` |

Any new draw MUST be appended at a fixed, documented position — never inserted mid-table.

## Replay & Golden Snapshots
- `(seed, stake, mode)` deterministically reproduces a full spin/round: same board fills, same WM increments, same Vault resolution, same clamped total.
- Golden snapshots record the ordered event stream + final balances for a fixed `(seed, stake, mode)`.
- Changing **any** rule, draw position, or event order **invalidates** existing golden snapshots and requires an intentional, reviewed regeneration.

## References
- paytable-1.png … paytable-6.png, freespins-trigger.png
- Play-log `[t23]`,`[t27]`,`[t30]`,`[t33]`,`[t34]`
- https://www.bigwinboard.com/luxor-of-cleopatra-pragmatic-play-slot-review/