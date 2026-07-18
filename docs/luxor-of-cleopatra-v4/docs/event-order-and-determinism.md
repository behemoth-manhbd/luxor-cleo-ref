# Event Order & Determinism Contract

## Canonical Event IDs
| event id | phase | payload fields | emitted when |
|---|---|---|---|
| `spin_start` | base | seed, stake, mode, balanceBefore | player presses spin / autoplay tick |
| `bet_deduct` | base | betAmount, balanceAfter | immediately after `spin_start` |
| `reels_spin` | base | mode | reels begin spinning |
| `reels_land` | base | board[4][5] | all 5 reels stopped |
| `ways_evaluate` | base | wins[{symbol,run,ways,amount}], totalWin | after `reels_land` |
| `scatter_check` | base | scatterCount | during evaluation (scatters pay anywhere) |
| `win_present` | base | totalWin | after evaluation if totalWin > 0 |
| `win_tier_banner` | base/fs | tier ("MEGA"), amountX | when a win crosses a named-tier threshold |
| `fs_trigger` | base→fs | scatterCount, awarded=10 | scatterCount ≥ 3 |
| `round_end` | base | totalWin, balanceAfter | spin fully settled (no FS pending) |
| `fs_start` | fs | spinsAwarded=10, reelSet="night" | entering Free Spins |
| `vault_init` | fs | vaultValue=20×bet, preMarked=8 | at `fs_start` |
| `fs_spin_start` | fs | spinsLeft | each free spin |
| `fs_reels_land` | fs | board[4][5] | FS reels stopped |
| `wild_multiplier_apply` | fs | wildsInWay, multiplier=2^k | during FS way evaluation |
| `fs_ways_evaluate` | fs | wins, totalWin | after `fs_reels_land` |
| `cleopatra_mark` | fs | markedCells[], markedCount/20 | `cleopatra` lands on unmarked cell |
| `vault_increment` | fs | source, addX, vaultValue | `wild_multiplier` or scatter lands in FS |
| `fs_spin_end` | fs | spinsLeft | FS spin settled |
| `vault_resolve` | fs | markedCount/20, paid, vaultPayout | at FS round end |
| `fs_end` | fs | totalFsWin, balanceAfter | Free Spins complete |
| `buy_open` | buy | cost=30×bet | player opens Buy Feature panel |
| `buy_confirm` | buy | cost, balanceAfter | player confirms purchase |
| `buy_decline` | buy | — | player cancels Buy Feature |
| `buy_charge` | buy | cost | on confirm, balance debited |

## Deterministic Spin Event Order
**BASE SPIN**
1. `spin_start`
2. `bet_deduct`
3. `reels_spin`
4. `reels_land`
5. `ways_evaluate` (compute every symbol's leftmost run + ways)
6. `scatter_check`
7. IF totalWin > 0: `win_present` → (IF win ≥ named-tier threshold: `win_tier_banner`)
8. IF scatterCount ≥ 3: `fs_trigger` → go to FREE SPINS
9. `round_end`

**FREE SPINS** (entered via `fs_trigger` or [[buy_feature-mechanics]])
1. `fs_start`
2. `vault_init` (vaultValue = 20×bet, markedCount = 0 — no positions are pre-marked yet)
3. FREE-SPIN LOOP (repeat 10 times, or until win cap): a..f
   a. `fs_spin_start`
   b. `fs_reels_land`
   c. `fs_ways_evaluate` → per winning way containing wilds: `wild_multiplier_apply`
   d. IF this is free spin 1: mark 8 random positions on reels 2–4 (`markedCount = 8`) — paytable page 3 confirms this happens "after the first free spin", not at round start — THEN per `cleopatra` on an unmarked cell: `cleopatra_mark`
   e. per `wild_multiplier` / scatter landing: `vault_increment`
   f. `fs_spin_end`
4. `vault_resolve` (pay iff markedCount == 20, else forfeit)
5. `fs_end` → resume base game

**BUY MODE** (differs only at entry)
`buy_open` → (`buy_decline` → base) OR (`buy_confirm` → `buy_charge` → forced 3-scatter `reels_land` → `fs_trigger` → FREE SPINS as above).
## Ordering Invariants
- Free Spins are entered **only after** `scatter_check` confirms ≥3 scatters — `fs_trigger` never precedes evaluation (see [[free_spins-mechanics]]).
- `wild_multiplier_apply` happens **per-way during** `fs_ways_evaluate`, multiplicatively and ONCE per way, before `fs_spin_end` — a way's ×2^k is never re-applied on a later spin (see [[wild_multiplier-mechanics]]).
- `vault_resolve` fires **exactly once**, only at `fs_end` after the last `fs_spin_end`; the Vault pays iff `markedCount == 20`, else forfeits (see [[vault_bonus-mechanics]]).
- `bet_deduct` precedes `reels_spin`; `buy_charge` precedes the forced FS board — balance is never debited after the outcome is shown.
- **[ASSUMPTION]** Within a spin, `cleopatra_mark` is processed reel-by-reel left→right, top→bottom (row-major); the game does not pin an order, so this order is chosen for determinism.
- **[ASSUMPTION]** The named-tier banner (`win_tier_banner`) is evaluated after the full spin/round win is known, so escalation reflects the final total (only "MEGA" was observed [t86]).

## RNG Contract
- Use a deterministic seeded PRNG **stub** (reference: **mulberry32** or equivalent). The **contract is the property, not the algorithm**: the same `(seed, stake, mode)` MUST produce an identical event stream and outcome.
- Draw order:

| draw # | purpose | when |
|---|---|---|
| 1 | reel 1 stop | initial board fill |
| 2 | reel 2 stop | initial board fill |
| 3 | reel 3 stop | initial board fill |
| 4 | reel 4 stop | initial board fill |
| 5 | reel 5 stop | initial board fill |
| 6 (FS only) | Vault pre-mark selection (8 positions) | at `vault_init` |
| 7..m (FS only) | per-`wild_multiplier` Vault increment value | each wild landing, row-major order |

- **Symbol WEIGHTS/distribution are NOT part of this contract** (proprietary / not-derivable). The stub is **uniform** unless the spec states weights (it does not). Any new draw MUST be appended at a fixed, documented position.

## Replay & Golden Snapshots
- A spin/round is fully reproduced from `(seed, stake, mode)` by replaying draws 1..m in the fixed order above.
- Changing any rule, paytable value, or draw position **invalidates golden snapshots** and requires an intentional, reviewed regeneration (see [[test-vectors]]).

## References
- game-brief.md; live play-log [t34][t36][t86]
- https://clashofslots.com/slots/pragmatic-play/luxor-of-cleopatra/