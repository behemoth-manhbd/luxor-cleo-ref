# buy_feature — Mechanics

## Trigger
- Player clicks BUY FEATURE, then confirms via the **CONFIRM BUY** dialog (Cancel / Yes) [t21].
- Cost: **30 × total bet** (observed $60.00 on $2.00 [t20]).

## Parameters
| Constant | Value | Source |
|---|---|---|
| Cost | 30× total bet | spec; live [t20] |
| Guaranteed scatters | exactly 3 | spec; live [t20] |
| Awarded free spins | 10 | via free_spins path |
| Scatter award paid | 3-scatter pay = 1× total bet | spec; live "WIN $2.00" [t22] |
| Effective RTP | 96.56% — estimated (confidence: ~0.5, sources: 6) | spec.math.buyFeatureRTP |
| Confirmation gate | Yes (CONFIRM BUY) | live [t21] |

## Algorithm
1. Player presses BUY FEATURE → show cost modal (`30 × totalBet`).
2. Show CONFIRM BUY dialog; on Cancel → abort, no charge.
3. On Yes: deduct `30 × totalBet` from credit.
4. Force a base spin that lands **exactly 3 `scatter_lotus`**; pay the 3-scatter award (1× total bet).
5. Enter free spins with `freeSpinsRemaining = 10` — hand off to [[free_spins-mechanics]].

## State
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- Transient: `buyCost = 30 × totalBet`, `confirmed (bool)`.
- No persistent state beyond entering free spins.

## Interactions
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- **[[free_spins-mechanics]]:** buy is an alternate entry; identical FS thereafter.
- **[[vault-mechanics]]:** VAULT activates on entry just like a natural trigger.
- **Bet model ([[product-spec]]):** cost scales with total bet.

## Edge cases
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- Insufficient credit: block the purchase (standard) [ASSUMPTION — not observed].
- Always exactly 3 scatters (never 4/5 from a buy) — so the buy always pays the 1× scatter award, never 5×/25×.
- Cancel path must not deduct credit.

## QA checklist
1. Buy on a $2.00 bet deducts exactly $60.00 (`30 × 2.0`).
2. Bought spin lands exactly 3 scatters and pays `1 × totalBet` ($2.00), then starts 10 free spins.
3. Cancelling the CONFIRM BUY dialog leaves credit unchanged.

## References
- spec.features.buy_feature; spec.math.buyFeatureRTP
- Live play-log [t20][t21][t22]
- https://www.igamingtoday.com/luxor-of-cleopatra-slot-review/