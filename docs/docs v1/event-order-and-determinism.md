# Event Order & Determinism Contract

This is a **ways-pay** game with **no cascade/tumble**. Evaluation uses the win RULE: identical symbols on adjacent reels from reel 1, 3–5 in a row, paid per-way.

## Canonical Event IDs
| event id | phase | payload fields | emitted when |
|---|---|---|---|
| `spin_start` | spin init | seed, stake, mode | player presses SPIN / buy confirmed |
| `reels_drop` | reel motion | mode | reels begin dropping |
| `reels_land` | board fill | board[4][5] | all reels resolved left→right |
| `ways_evaluate` | evaluation | wins[], waysPerSymbol | matching ways computed |
| `multiplier_apply` | evaluation (FS) | wayMultipliers[] | wild-multiplier ways scaled (same step) |
| `scatter_check` | evaluation | scatterCount | scatters counted anywhere |
| `win_present` | presentation | totalWin, tier | winning cells highlighted + counter roll-up |
| `fs_trigger` | feature entry | scatterCount, spinsAwarded=10 | 3+ scatters (or buy) |
| `vault_init` | feature (FS) | vaultValue=20×bet, marked=8 | first free spin |
| `vault_update` | feature (FS) | vaultValue, positionsMarked | wild/scatter/cleopatra lands |
| `vault_award` | feature (FS) | vaultValue paid | round end AND positionsMarked==20 |
| `round_end` | settle | totalRoundWin, balance | spin/feature fully resolved |

## Deterministic Spin Event Order
```
1. spin_start
2. reels_drop
3. reels_land                (board[4][5] filled, row-major)
4. ways_evaluate             (per-symbol ways, left→right adjacency)
5. [FREE SPINS ONLY] multiplier_apply   (each winning way × product of its wilds)
6. scatter_check             (count scatters anywhere)
7. win_present               (highlight + counter; tier banner if threshold met)
8. [BASE ONLY] if scatterCount>=3 -> fs_trigger, then FREE SPINS SUBLOOP
9. round_end

FREE SPINS SUBLOOP (entered from fs_trigger; runs 10 spins):
   vault_init                (vaultValue=20×bet; mark 8 positions) — first spin only
   FS SPIN LOOP (repeat 10 times):
     a. spin_start (mode=freeSpins)
     b. reels_drop
     c. reels_land
     d. ways_evaluate
     e. multiplier_apply     (wild multipliers)
     f. scatter_check        (scatters add to Vault, not spins)
     g. vault_update         (cleopatra marks / wild + scatter contributions)
     h. win_present
   after 10th spin: if positionsMarked==20 -> vault_award
   round_end                 (round-total summary)
```
**Per-mode notes:**
- **Base:** steps 5 skipped (no wild-multiplier in base). `wild-pyramid` may substitute on reels 2–4.
- **Buy:** identical to base but the triggering board is forced to exactly 3 scatters before `reels_land`.

## Ordering Invariants
- `multiplier_apply` happens in the **same evaluation step** as base pay, BEFORE `win_present` — per [[wild-multiplier-mechanics]] ("applied and displayed in the same win-evaluation step").
- `scatter_check` runs on the landed board only; scatters never contribute after `win_present` in base — see [[free-spins-mechanics]].
- `vault_award` is emitted **once**, only after the **last** free spin and only if `positionsMarked==20` — all-or-nothing, see [[vault-award-mechanics]].
- `fs_trigger` fires only in base/buy mode; free spins **do not retrigger** (`retrigger: false`) — see [[free-spins-mechanics]].
- The max-win cap clamps `round_end.totalRoundWin` last, after Vault — see [[math-and-rtp]]. [ASSUMPTION] cap applied at round_end.
- [ASSUMPTION] within a spin, symbols evaluate reel-by-reel left→right; ways within a symbol are summed in ascending reel order (order does not affect the sum, chosen for determinism).

## RNG Contract
- **Property (the contract):** same `(seed, stake, mode)` ⇒ **identical event stream and outcome**. Use a deterministic seeded PRNG STUB (reference: **mulberry32**); the algorithm is replaceable, the property is not.
- **Symbol WEIGHTS/distribution are NOT part of this contract** — proprietary / not-derivable (confidence: 0.05). The stub draws **uniform** over the symbol set unless real weights are supplied.

| draw # | purpose | when |
|---|---|---|
| 1 | initial board fill — reel 1 (top→bottom) | `reels_land` |
| 2 | board fill — reel 2 | `reels_land` |
| 3 | board fill — reel 3 | `reels_land` |
| 4 | board fill — reel 4 | `reels_land` |
| 5 | board fill — reel 5 | `reels_land` |
| 6 | scatter forcing (buy mode only) | before `reels_land` |
| 7 | FS wild-multiplier Vault contribution | per landed wild (`vault_update`) |
| 8 | FS initial 8 position marks | `vault_init` |

Any **new** draw MUST be appended at a fixed documented position; inserting a draw mid-sequence shifts all later draws and invalidates snapshots.

## Replay & Golden Snapshots
- A spin replays exactly from `(seed, stake, mode)` fed to the PRNG stub in the draw order above.
- Changing any rule, pay value, draw position, or event order **invalidates golden snapshots** and requires an intentional, reviewed regeneration.

## References
- spec.grid, spec.features, spec.math
- PLAYER LOG event-order narration [t17]–[t36]
- https://www.bigwinboard.com/luxor-of-cleopatra-pragmatic-play-slot-review/