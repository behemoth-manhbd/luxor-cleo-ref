# Math & RTP

## Headline Figures
| Field | Value |
|---|---|
| Base RTP | 96.51% — estimated (confidence: 0.50, sources: 5) |
| Buy-feature RTP | 96.56% — estimated (confidence: 0.85) |
| Operator RTP tiers | 94.56% / 95.51% / 96.51% — estimated operator-configurable tiers (confidence: 0.50) |
| Max win | 12,500× total bet — estimated (confidence: 0.50, sources: 5) (round ends immediately if reached) |
| Hit frequency | 25% — estimated (confidence: 0.50, sources: 1) |
| Volatility | Medium volatility (paytable p4) — recorded as **medium-high** because the in-game badge shows 5/5 bolts and the splash advertised a 5-bolt rating (derivable, confidence 0.90) [t05][t17] |
| Ways | 1024 (4⁵), 5 reels × 4 rows |

## How the RTP is achieved
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
RTP is tuned through the **reel-strip symbol frequencies/distribution** (per-reel weights) and the feature contribution (Free Spins + Vault). The exact reel weights are **proprietary and not-derivable** (`math.weights`: not-derivable) — they are NOT part of the determinism/RNG contract (see [[event-order-and-determinism]]). The base line returns ~96.51% — estimated (confidence: 0.50, sources: 5); buying the feature nudges it to 96.56% — estimated (confidence: 0.85). Because weights are unknown, treat all RTP/hit-frequency/max-win numbers as estimates, never as hard facts.

## Full Paytable
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
## Paylines
Not applicable — this is a **1024-ways** game (`paylineSystem: ways`, `count: 1024`); `spec.math.paylines` is **not present**, so there is no per-line pattern table and `paylineCount = N/A`. Any two horizontally-adjacent-from-left matches on 3+ reels form a "way" [t10].

## Bet & Buy Costs
- Bet range $0.20–$240.00 (USD); Total Bet = Bet × Coin Value × 20.
- Buy Feature = 30× total bet ($60 at $2). Max win cap = 12,500× total bet — estimated (confidence: 0.50, sources: 5).

## Provenance / Derivability Note
- **Exact / screenshot-confirmed:** grid (type/rows/cols), volatility label (medium text vs 5-bolt badge — paytable-4), full paytable for every regular symbol, wild_multiplier and scatter (paytable-1, paytable-2), base RTP 96.51%, buy-feature RTP 96.56%, and the 12,500x max-win cap (paytable-3, paytable-4).
- **Estimated / not shown in-game:** hit frequency, operator-configurable RTP tiers (94.56%/95.51%).
- **Not-derivable:** reel-strip symbol weights/distribution.
## References
- game-brief.md
- https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vswaysladythf&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=en&cur=USD
- https://www.bigwinboard.com/luxor-of-cleopatra-pragmatic-play-slot-review/
- https://clashofslots.com/slots/pragmatic-play/luxor-of-cleopatra/
- https://slots.info/pragmatic-play/luxor-of-cleopatra/