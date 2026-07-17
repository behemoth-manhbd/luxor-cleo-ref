# Buy Feature — Mechanics

## Trigger
- Player presses **BUY FEATURE** (top-left), confirms the modal, then the **CONFIRM BUY** dialog.

## Parameters
| Constant | Value | Source |
|---|---|---|
| Cost | **30× total bet** ($60.00 at $2.00) | spec.features buy-feature |
| Guaranteed scatters | exactly **3** on the triggering spin | spec.features buy-feature |
| Free spins granted | 10 (identical to natural trigger) | spec.features |
| Vault starting value | 20× total bet | [[vault-award-mechanics]] |
| RTP with Buy Free Spins | 96.56% — estimated (confidence: 0.5, sources: 4) | spec.math rtpWithBuyFeature |

## Algorithm
1. Player clicks BUY FEATURE → confirmation modal shows `cost = 30 × totalBet` ("TRIGGER FREE SPINS WITH 3X SCATTERS").
2. On CONFIRM: deduct `30 × totalBet` from balance.
3. Force exactly 3 `scatter-lotus` symbols onto the triggering spin's board.
4. Emit `fs_trigger` and proceed **identically** to a natural free-spins trigger (see [[free-spins-mechanics]]): 10 spins, Vault at 20× total bet.
5. On CANCEL/No: no deduction; return to base idle.

## State
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- **Transient:** `pendingBuyCost`, `buyConfirmed`.
- Thereafter, state is the same as [[free-spins-mechanics]].

## Interactions
- With [[free-spins-mechanics]]: entry point; guarantees the 3-scatter trigger.
- With [[vault-award-mechanics]]: Vault behaves exactly as natural entry.
- Bought triggers use the **buy-feature RTP config** (96.56%) not the base RTP.

## Edge cases
- The forced 3 scatters also pay the natural 3-scatter prize (1× total bet). [ASSUMPTION] scatter prize is credited in addition to entering free spins, as in a natural trigger.
- **Cap:** total bought-round win clamps to 12,500× — estimated (confidence: 0.5, sources: 4).
- Insufficient balance for `30 × totalBet` → buy blocked. [ASSUMPTION].

## QA checklist
1. Confirm buy deducts exactly `30 × totalBet` (e.g. $60.00 at $2.00).
2. Bought spin lands exactly 3 scatters (never 4/5) and awards 10 free spins.
3. Cancel deducts nothing and leaves the board idle.

## References
- spec.features `buy-feature`, spec.math `rtpWithBuyFeature`
- PLAYER LOG [t23], [t24], [t25]
- https://newslotgames.net/pragmatic-play/luxor-of-cleopatra.html