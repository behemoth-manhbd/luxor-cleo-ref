# Math & RTP

## Headline figures
| Field | Value |
|---|---|
| Base RTP | **96.51%** — estimated (confidence: 0.5, sources: 6) |
| Buy-feature RTP | **96.56%** — estimated (confidence: ~0.5, sources: 6) |
| Volatility | **high** — estimated (confidence: 0.9, sources: 2) |
| Max win | **12,500× total bet** — estimated (confidence: 0.9, sources: 6) |
| Hit frequency | **~32%** — estimated (confidence: 0.15, sources: 0) |
| Ways | 1024 (derivable: 4^5) |

Note: base RTP was read from the in-game paytable p.4 [t11] but per researcher rules RTP is never asserted as certain — hence estimated. Hit frequency has **no supporting source** (placeholder). Volatility conflicts across sources (in-game 5/5 "high" vs several reviews "medium"); "high" chosen to match the game's own displayed rating.

## How RTP is achieved (distribution)
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- 1024-ways game: win = `payValue × totalBet × ways`, ways = product of per-reel symbol counts on consecutive reels from reel 1.
- RTP is delivered via symbol reel-strip **weights/distribution** — these weights are **NOT in the spec and are not derivable**; do not invent them. They are proprietary. [ASSUMPTION for any implementation: tune strip weights to hit 96.51% base / 96.56% buy — the exact strips are unknown.]
- Free-spins value concentration: `wild_multiplier` (×2, stacking) + the VAULT accumulator carry the high-volatility tail; the VAULT rarely completes (never seen live), so its EV contribution is small and gated on 20/20 marking.

## Full paytable
The in-game paytable (paytable-1.webp page 1/6, paytable-2.webp page 2/6) shows these per-symbol dollar payouts on a $2.00 total bet:

| id | 2 | 3 | 4 | 5 |
|---|---|---|---|---|
| cleopatra | $0.50 | $5.00 | $7.50 | $10.00 |
| ankh_ring / gold_scarab (identical pay) | $0.20 | $4.00 | $6.00 | $8.00 |
| cleopatra_coin / eye_of_horus (identical pay) | — | $2.00 | $5.00 | $7.00 |
| sym_a / sym_k | — | $0.50 | $3.00 | $6.00 |
| sym_q / sym_j | — | $0.30 | $2.00 | $5.00 |
| sym_10 / sym_9 | — | $0.30 | $1.00 | $4.00 |
| scatter_lotus | — | $2.00 (1x) | $10.00 (5x) | $50.00 (25x) |

All of the above match the in-game paytable exactly (paytable-1.webp). `wild_pyramid` (the base WILD, reels 2/3/4) has NO standalone payout — paytable-1.webp shows only substitution text, no dollar figures. The $1.00/$10.00/$25.00/$50.00 row previously attributed to `wild_pyramid` actually belongs to the separate `wild_multiplier` symbol (paytable-2.webp: the free-spins-only x2 wild). `ram_coin`'s distinct icon/payout could not be confirmed against the paytable screenshots and remains estimated.
## Derivability / provenance note
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
| Figure | Status |
|---|---|
| grid rows/cols, ways=1024 | derivable |
| paytable multipliers | estimated (confidence: 0.4, sources: 3) — market research, not exact |
| base RTP 96.51% | estimated (confidence: 0.5, sources: 6) |
| buy RTP 96.56% | estimated (confidence: ~0.5, sources: 6) |
| volatility (high) | estimated (confidence: 0.9, sources: 2) — conflicting evidence |
| max win 12,500× | estimated (confidence: 0.9, sources: 6) |
| hit frequency ~32% | estimated (confidence: 0.15, sources: 0) — placeholder, no source |
| symbol reel weights | not in spec / not derivable — do not invent |

## References
- spec.math; spec.provenance (fieldConfidence, derivability, fieldSupport, sources)
- In-game paytable p.4 [t11] (RTP), p.3/p.6 [t10][t13] (max win)
- https://www.bigwinboard.com/luxor-of-cleopatra-pragmatic-play-slot-review/
- https://slotcatalog.com/en/slots/luxor-of-cleopatra
- https://www.pragmaticplay.com/en/games/luxor-of-cleopatra/
- https://www.igamingtoday.com/luxor-of-cleopatra-slot-review/