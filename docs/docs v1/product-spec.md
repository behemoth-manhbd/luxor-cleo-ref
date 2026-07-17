# Luxor of Cleopatra — Product Spec

## Identity
| Field | Value |
|---|---|
| Name | Luxor of Cleopatra |
| Provider | Pragmatic Play |
| Theme | Ancient Egypt / Cleopatra |
| gameId | `luxor-of-cleopatra` |
| Source | text (spec `meta.source`) |
| Captured | 2026-07-16 |
| Game URL slug | `vswaysladythf` (Pragmatic demo) |

## Grid
| Field | Value |
|---|---|
| Type | ways-to-win |
| Rows × Cols | **4 rows × 5 cols** |
| Ways | **1024** (4^5) |
| minCluster / min count | 3 identical symbols (of-a-kind), left-to-right |
| Cascade / tumble | **None** (confirmed absent — no tumble mechanic) |

**WIN RULE (one sentence):** A symbol wins when it appears on **adjacent reels starting from the leftmost reel (reel 1)**, on **3, 4, or 5 consecutive reels**, and each such symbol pays its per-count band multiplied by the number of distinct ways (number of matching-symbol combinations across the participating reels); ways within a symbol sum together and different winning symbols sum together.

## Full Symbol Table
Actual paytable (screenshots paytable-1/paytable-2, values shown at $2.00 total bet, converted to total-bet multiplier): cleopatra 2=0.25x/3=2.5x/4=3.75x/5=5x; scarab 2=0.1x/3=2x/4=3x/5=4x; ring 2=0.1x/3=2x/4=3x/5=4x; coin 3=1x/4=2.5x/5=3.5x (no 2-OAK); eye-of-horus 3=1x/4=2.5x/5=3.5x (no 2-OAK); a 3=0.25x/4=1.5x/5=3x; k 3=0.25x/4=1.5x/5=3x; q 3=0.15x/4=1x/5=2.5x; j 3=0.15x/4=1x/5=2.5x; 10 3=0.15x/4=0.5x/5=2x; 9 3=0.1x/4=0.5x/5=2x. `wild-pyramid` (base-game pyramid) has **no own paytable** — the info screen only describes it as a substitute (appears reels 2-3-4), with no dollar figures. `wild-multiplier` (free-spins gold coin) is the symbol that DOES carry its own paytable: 2=0.5x/3=5x/4=12.5x/5=25x total bet.
## Bet Model
| Field | Value |
|---|---|
| Min bet | $0.20 |
| Max bet | $240.00 |
| Test bet (docs) | $2.00 |
| Ante-bet | None |
| Buy-feature cost | **30× total bet** ($60.00 at $2.00) — guarantees exactly 3 scatters |

## Feature Index
- `free-spins` — 3/4/5 scatters anywhere award a fixed **10 free spins**; night-scene transition.
- `wild-multiplier` — free-spins-only ×2 wild; substitutes all but scatter; multiple multipliers multiply together; each feeds the Vault.
- `vault-award` — fill all 20 key positions on reels 2–4 during free spins to win the accumulated Vault (all-or-nothing).
- `buy-feature` — pay 30× total bet to force a 3-scatter free-spins trigger.

## References
- game-brief.md
- https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vswaysladythf
- https://www.bigwinboard.com/luxor-of-cleopatra-pragmatic-play-slot-review/
- https://newslotgames.net/pragmatic-play/luxor-of-cleopatra.html
- https://casino.guru/cleopatra-slot-math
- https://play.google.com/store/apps/details?id=com.gekkotech.cleopatra
- https://blog.betway.com/casino-game-reviews/cleopatra-slots-review-and-gameplay-guide-betway/
- https://www.pragmaticplay.com/en/games/luxor-of-cleopatra/
- https://roshtein.com/slots/pragmatic-play/luxor-of-cleopatra
- https://www.freeslots99.com/blog/what-is-cleopatra-volatility-level-and-what-does-it-mean-for-your-gameplay/
- https://casino.draftkings.com/how-to-play-cleopatra
- https://www.wsn.com/online-casinos/slots/cleopatra/
- https://www.youtube.com/watch?v=GdwHFZuMtnE
- https://www.pragmaticplay.com/en/games/heart-of-cleopatra/
- https://www.youtube.com/watch?v=CdfSwWjO5wU
- https://www.hardrockgames.com/cleopatra-ii-mobile-slot-game-overview/
- https://slots.info/pragmatic-play/luxor-of-cleopatra/
- https://www.metropolitancasinos.com/casino-life/cleopatra-slot-guide
- https://www.youtube.com/watch?v=R5rD2bMOF1k
- https://www.rotowire.com/betting/casinos/slot-sites/cleopatra