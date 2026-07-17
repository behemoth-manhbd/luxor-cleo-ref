# Luxor of Cleopatra — Product Spec

## Identity
| Field | Value |
|---|---|
| Name | Luxor of Cleopatra |
| Provider | Pragmatic Play |
| Theme | Egyptian / Cleopatra |
| gameId | `luxor-of-cleopatra` |
| gameSymbol | `vswaysladythf` |
| Schema version | 1.0.0 |
| Source | text (research + live demo play-through) |
| Captured | 2026-07-17T04:58:42Z |

## Grid
| Field | Value |
|---|---|
| Type | ways-to-win |
| Rows × Cols | **4 rows × 5 reels** (20 positions) |
| Ways | **1024** (4⁵) |
| Min paying length | 2 consecutive reels for CLEOPATRA / SCARAB / RING / WILD; 3 consecutive reels for every other pay symbol |
| Cascade / tumble | **None** — single evaluation per spin (confirmed `[t23]`) |

**Win rule (one sentence):** A win is awarded when the same pay symbol — or a substituting WILD — lands on the minimum-or-more **consecutive reels starting from reel 1 (leftmost)**; the win pays `paytableValue × waysCount × totalBet`, where `waysCount` = the product, across the contributing reels, of that symbol's count on each reel (up to 1024 ways). Scatters pay "anywhere" and do not follow the left-to-right rule.

Correction: SCARAB also pays from 2-of (confirmed $0.20 at $2 bet on paytable-1.png/paytable-1-verify.png), not just CLEOPATRA/RING/WILD.
## Full Symbol Table
| Symbol | 2 | 3 | 4 | 5 | capX | note | scatterAddX | startX | unlockCondition | wildMultiplierAddX |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| cleopatra | 0.25 | 2.5 | 3.75 | 5 |  |  |  |  |  |  |
| scarab | 0.1 | 2 | 3 | 4 |  |  |  |  |  |  |
| ring | 0.1 | 2 | 3 | 4 |  |  |  |  |  |  |
| coin |  | 1 | 2.5 | 3.5 |  |  |  |  |  |  |
| eye_amulet |  | 1 | 2.5 | 3.5 |  |  |  |  |  |  |
| ace |  | 0.25 | 1.5 | 3 |  |  |  |  |  |  |
| king |  | 0.25 | 1.5 | 3 |  |  |  |  |  |  |
| queen |  | 0.15 | 1 | 2.5 |  |  |  |  |  |  |
| jack |  | 0.15 | 1 | 2.5 |  |  |  |  |  |  |
| ten |  | 0.15 | 0.5 | 2 |  |  |  |  |  |  |
| nine | 0.1 | 0.15 | 0.5 | 2 |  |  |  |  |  |  |
| wild_multiplier | 0.5 | 5 | 12.5 | 25 |  |  |  |  |  |  |
| scatter |  | 1 | 5 | 25 |  |  |  |  |  |  |
| scatterPays |  | 1 | 5 | 25 |  |  |  |  |  |  |
| vault |  |  |  |  | 12500 | Observed start = $40 at $2 bet (20x). Vault never fully unlocked across 5 observed rounds (best 18/20). | {'3': 10, '4': 50, '5': 250} | 20 | mark all 20 board positions via Cleopatra 'key' collection during the 10 free spins; otherwise Vault is forfeited | random increment drawn from a list (e.g. 1x,1.5x,2x,2.5x,5x,7.5x,10x,12.5x,15x,20x ... up to 12500x for large wild-multiplier counts) |
| wildStandalone | 0.5 | 5 | 12.5 | 25 |  |  |  |  |  |  |

_Confirmed against in-game paytable screenshots (paytable-*.png)._
## Bet Model
| Field | Value | Provenance |
|---|---|---|
| Min total bet | 0.20 | paytable 4/6 `[t14]` |
| Max total bet | 240.00 | paytable 4/6 `[t14]` |
| Default demo bet | 2.00 | `[t07]` |
| Ante bet | **None** — confirmed absent `[t59]` | live check |
| Buy Feature cost | **30× total bet** ($60.00 at $2.00 bet) | paytable 3/6 `[t13]`, panel `[t18]` |

## Feature Index
- `free_spins` — 3+ SCATTER awards a fixed 10 free spins (all wilds become ×2 multipliers, Vault active).
- `wild_multiplier` — free-spins-only wilds each carry ×2, multiplied together on a shared way; also feed the Vault.
- `vault` — a progressive pot (starts 20× total bet) paid only if all 20 board positions are marked by Cleopatra "keys" by the end of spin 10, else forfeited.
- `buy_feature` — purchase the free-spins round for 30× total bet via a guaranteed 3-scatter trigger.

## References
- game-brief.md
- Live demo: https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vswaysladythf&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=en&cur=USD
- 01-loaded.png
- paytable-1.png, paytable-2.png, paytable-3.png, paytable-4.png, paytable-6.png
- buy-feature-panel.png, freespins-trigger.png, freespins-outro.png, win-small-3ways.png
- https://www.bigwinboard.com/luxor-of-cleopatra-pragmatic-play-slot-review/
- https://www.vegasslotsonline.com/igt/cleopatra/
- https://casino.guru/cleopatra-slot-math
- https://wizardofodds.com/games/slots/cleopatra/
- https://www.slotstube.com/luxor-of-cleopatra/
- https://www.pragmaticplay.com/en/games/luxor-of-cleopatra/
- https://casino.guru/free-casino-games/slots/Cleopatra-slot-play-free
- https://www.youtube.com/watch?v=CdfSwWjO5wU
- https://www.metropolitancasinos.com/casino-life/cleopatra-slot-guide
- https://www.aboutslots.com/casino-slots/luxor-of-cleopatra
- https://slotcatalog.com/en/slots/luxor-of-cleopatra
- https://speedygames.com/social-casino-games/slot-games/luxor-of-cleopatra
- https://chipy.com/games/igt/igt-cleopatra
- https://www.youtube.com/watch?v=nLZRlL_En4U
- https://www.betus.com.pa/online-casino/game-info/slots/cleopatra/
- https://betsoft.com/games/treasures-of-cleopatra/
- https://www.casinos.com/slots/luxor-of-cleopatra