# Luxor of Cleopatra — Product Spec

## Identity
| Field | Value |
|---|---|
| Name | Luxor of Cleopatra |
| Provider | Pragmatic Play |
| Theme | Ancient Egypt / Cleopatra |
| gameId | `luxor-of-cleopatra` |
| gameSymbol | `vswaysladythf` |
| Release | July 2026 |
| Play mode | demo/fun (no real money) |
| Source | text (spec captured 2026-07-18) |

## Grid & Win Rule
**Win rule (one sentence):** A regular symbol pays when it appears on **2 or more consecutive reels starting from the leftmost reel (reel 1)** — `cleopatra`, `scarab`, `ring` and `9` are confirmed to pay from 2-of-a-kind, while all other regular symbols (`coin`, `eye_of_horus`, `A`, `K`, `Q`, `J`, `10`) require 3-of-a-kind minimum — and the payout equals `paytable[symbol][reelRun] × ways × totalBet`, where `ways` = the product of the number of matching symbols (including substituting wilds) on each contributing reel. Scatters pay anywhere (not per-way).
## Full Symbol Table
| Symbol | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- |
| cleopatra | 0.25 | 2.5 | 3.75 | 5 |
| scarab | 0.1 | 2 | 3 | 4 |
| eye_of_horus |  | 1 | 2.5 | 3.5 |
| coin |  | 1 | 2.5 | 3.5 |
| ring | 0.1 | 2 | 3 | 4 |
| A |  | 0.25 | 1.5 | 3 |
| K |  | 0.25 | 1.5 | 3 |
| Q |  | 0.15 | 1 | 2.5 |
| J |  | 0.15 | 1 | 2.5 |
| T |  | 0.15 | 0.5 | 2 |
| 9 | 0.1 | 0.15 | 0.5 | 2 |
| wild_multiplier | 0.5 | 5 | 12.5 | 25 |
| scatter |  | 1 | 5 | 25 |

_Confirmed against in-game paytable screenshots (paytable-*.png)._
## Bet Model
| Field | Value |
|---|---|
| Min bet | $0.20 |
| Max bet | $240.00 |
| Currency | USD |
| Bet multiplier | 20× (Total Bet = Bet × Coin Value × 20) [t100] |
| Ante-bet | None — confirmed absent [t100] |
| Buy-feature cost | 30× total bet ($60.00 at $2.00 bet; $6.00 at $0.20 bet) [t57] |

## Feature Index
- `free_spins` — 3+ scatters award 10 free spins on a night-temple reel set with stacking wild multipliers.
- `vault_bonus` — a 20-position "key" meter active throughout Free Spins; pays its accumulated value only if all 20 positions are marked before the round ends, else forfeited.
- `buy_feature` — buy the Free Spins entry for 30× total bet; forces a spin with exactly 3 scatters.
- `wild_multiplier` — Free-Spins-only gold-coin Wild carrying ×2, multiplying multiplicatively when several join one way.

## References
- game-brief.md
- https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vswaysladythf&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=en&cur=USD
- https://www.bigwinboard.com/luxor-of-cleopatra-pragmatic-play-slot-review/
- https://casino.guru/cleopatra-slot-math
- https://wizardofodds.com/games/slots/cleopatra/
- https://clashofslots.com/slots/pragmatic-play/luxor-of-cleopatra/
- https://casino.draftkings.com/how-to-play-cleopatra
- https://www.slingo.com/blog/guides/cleopatra-slot-symbols-what-each-one-means/
- https://guidebook.mostbet.com/cleopatra/
- https://www.pragmaticplay.com/en/games/luxor-of-cleopatra/
- https://www.youtube.com/watch?v=isdUVgyZaTc
- https://www.rotowire.com/betting/casinos/slot-sites/cleopatra
- https://betsoft.com/games/treasures-of-cleopatra/
- https://slots.info/pragmatic-play/luxor-of-cleopatra/
- https://casino.guru/free-casino-games/slots/luxor-of-cleopatra-slot-play-free
- https://m.zitobox.com/game/slotgame/Wild-Cleopatra-Deluxe-T2/5883/7/2/0
- https://www.igamingtoday.com/luxor-of-cleopatra-slot-review/
- https://stationcasinosblog.com/2015/01/cleopatra/