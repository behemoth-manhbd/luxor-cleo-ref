# Math & RTP — Luxor of Cleopatra

## Headline figures
| Metric | Value | Label |
|---|---|---|
| Base RTP | 96.51% | — estimated (confidence: 0.50, sources: 5) — displayed on paytable 4/6 but operator-configurable |
| Buy-Feature RTP | 96.56% | — estimated (confidence: 0.90, sources: 1) — paytable 4/6 |
| Alternate RTP configs | 95.51% / 94.56% | — estimated (operator variants; research) |
| Volatility | Medium | verified via on-screen descriptor text ("Medium volatility games pay out steadily...", paytable 4/6); the badge shows 5 lightning-bolt icons but the exact lit/filled count is not legible in the capture, so no specific bolt count can be confirmed |
| Max win | 12,500× total bet per round | — estimated (confidence: 0.50, sources: 5) — stated as a hard cap, paytable 3/6 & 6/6 |
| Hit frequency | 32.26% | — estimated (confidence: 0.60, sources: 3) |
| Avg spins to bonus | ≈82.22 | — estimated (research, sources: 3) |
| Bet range | 0.20 – 240.00 total | derivable — paytable 4/6 |
## How the RTP is achieved
- **Structure:** 5 reels × 4 rows, **1024 ways** (4⁵), left-to-right adjacent from reel 1.
- **Distribution / weights:** reel strips and symbol weights are **not published and not-derivable** (`math.weights = not-derivable`). RTP is delivered by proprietary weighting we cannot reproduce; a clone must tune its own weights to hit 96.51%. Do **not** treat any weight as known.
- **Contribution drivers:** base ways pays + SCATTER pays + the free-spins round (10 spins, ×2 stacking wild multipliers, and the Vault progressive). Buy-Feature RTP (96.56%) is marginally above base because the purchase price is folded into the return.

## Win math (the rule)
For a pay symbol S with minimum length `L_min` (2 for `cleopatra`/`scarab`/`ring`/`wild`; 3 for all others):
```
wayLength = number of consecutive reels, from reel 1, on which S (or a substituting WILD) appears
if wayLength >= L_min:
    ways   = product over those reels of (count of S-or-wild on that reel)   # up to 1024
    win    = paytableValue(S, wayLength) × ways × totalBet
```
- SCATTER pays `paytableValue × totalBet` (NOT multiplied by ways), anywhere on the board.
- WILD substitutes for everything except SCATTER; when a way could pay as either the natural symbol or the wild's own value, the higher is taken.
- In free spins each WILD is a `wild_multiplier` (×2); the way win is multiplied by the product of participating WM once — see [[wild_multiplier-mechanics]].

**Worked check (observed):** 2 Cleopatra on reel 1 + 1 on reel 2, none on reel 3 ⇒ length 2, ways = 2×1 = 2, `paytableValue(cleopatra,2)=0.25` ⇒ `0.25 × 2 × $2.00 = $1.00` — matches the live win `[t21]`.

Correction: `scarab` also pays from 2-of (`paytableValue(scarab,2)=0.1`), same minimum length as `cleopatra`/`ring`/`wild` — confirmed on paytable-1.png/paytable-1-verify.png (SCARAB shows a 2-count pay of $0.20 at $2 bet). The original text omitted SCARAB from the 2-of group.
## Full paytable
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
## Paylines
Not applicable — this title uses a **ways** system (`math.paylineSystem = ways`, `count = 1024`), not fixed paylines. `spec.math.paylines` is absent, so no per-line pattern table exists. Wins are evaluated as 1024 left-to-right adjacent ways (see the win-math rule above), not along enumerated lines.

## Provenance / derivability note
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
| Figure | Derivability | Note |
|---|---|---|
| grid type/rows/cols/ways | derivable | screenshot + paytable confirmed |
| symbol pays / paytable | estimated | per-count values from market research, not fully transcribed on screen |
| base RTP / buy RTP | estimated | displayed but operator-configurable; true realized RTP needs simulation |
| max win 12,500× | estimated | stated hard cap; provenance flags config-variability |
| hit frequency 32.26% | estimated | single research source, not measured live |
| volatility Medium | derivable | on-screen badge |
| symbol weights | not-derivable | proprietary reel strips |

## References
- paytable-1.png, paytable-2.png, paytable-3.png, paytable-4.png, paytable-6.png, win-small-3ways.png
- Play-log `[t11]`,`[t13]`,`[t14]`,`[t16]`,`[t21]`
- https://www.bigwinboard.com/luxor-of-cleopatra-pragmatic-play-slot-review/
- https://www.aboutslots.com/casino-slots/luxor-of-cleopatra
- https://slotcatalog.com/en/slots/luxor-of-cleopatra