# Luxor of Cleopatra — Product Spec

## Identity
| Field | Value |
|---|---|
| Name | Luxor of Cleopatra |
| Provider | Pragmatic Play |
| Theme | Ancient Egypt / Cleopatra |
| gameId | `luxor-of-cleopatra-v3` |
| Source | text capture + live browser play-through (demo) |
| Demo URL | https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vswaysladythf |

## Grid
| Field | Value |
|---|---|
| Type | ways (1024 ways) |
| Rows × Cols | **4 rows × 5 cols** |
| minCluster | N/A (not a cluster/tumble game — no cascade; confirmed live [t18][t19]) |
| Ways | 1024 = 4^5 |

**WIN RULE (exact):** A symbol pays when it appears on **consecutive reels starting from the leftmost reel (reel 1)**; the win = `payValue(numberOfConsecutiveReelsMatched) × totalBet × ways`, where `ways = product of the symbol's count on each of those matched reels`. Cleopatra pays from **2** adjacent reels; all other regular symbols pay from **3**. Scatters pay **anywhere** (no adjacency) on symbol count. There is no cascade/tumble — the board resolves once per spin.

## Symbol Table
See the corrected paytable in [[math-and-rtp]] (sourced from paytable-1.webp/paytable-2.webp). `cleopatra`, `ankh_ring`, `gold_scarab`, `cleopatra_coin`, `eye_of_horus`, `sym_a`, `sym_k`, `sym_q`, `sym_j`, `sym_10`, `sym_9`, and `scatter_lotus` all match the in-game paytable exactly. The only real discrepancy: the `wild_pyramid` payout figures were misattributed — `wild_pyramid` has no standalone pay (substitution only, reels 2/3/4), and those dollar values actually belong to `wild_multiplier`. `ram_coin`'s icon mapping remains unconfirmed.
## Bet Model
| Field | Value |
|---|---|
| Min bet | $0.20 (observed paytable p.4 [t11]) |
| Max bet | $240.00 (observed paytable p.4 [t11]) |
| Buy-feature cost | **30× total bet** (observed $60.00 on $2.00 [t20]) |
| Ante bet | None |

## Feature Index
- `free_spins` — 3+ lotus scatters award 10 free spins at the triggering bet; no retrigger; introduces wild-multipliers + VAULT. See [[free_spins-mechanics]].
- `vault` — free-spins accumulator starting at 20× bet; paid ONLY if all 20 grid positions are marked before the round ends, else forfeited. See [[vault-mechanics]].
- `buy_feature` — buy free spins for 30× bet; always lands exactly 3 scatters; has a CONFIRM BUY gate. See [[buy_feature-mechanics]].
- `wild_multiplier` — free-spins ×2 gold-coin wild; stacks multiplicatively and feeds the VAULT. See [[wild_multiplier-mechanics]].

## References
- game-brief.md
- Live demo play-through (play-log [t01]–[t78])
- https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vswaysladythf
- https://www.bigwinboard.com/luxor-of-cleopatra-pragmatic-play-slot-review/
- https://slotcatalog.com/en/slots/luxor-of-cleopatra
- https://www.pragmaticplay.com/en/games/luxor-of-cleopatra/