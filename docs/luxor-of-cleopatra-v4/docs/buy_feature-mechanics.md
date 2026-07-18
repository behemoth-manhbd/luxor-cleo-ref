# Buy Feature — Mechanics

## Trigger
- Player opens the **Buy Feature** panel (button top-left, idle only) and confirms the purchase [t56][t57].
- Purchase forces a spin containing **exactly 3 scatters**, immediately entering the 10-spin Free Spins round [t60].

## Parameters
| Constant | Value | Source |
|---|---|---|
| Cost | 30 × total bet | paytable p3, live |
| Cost at $2.00 bet | $60.00 | live [t57] |
| Cost at $0.20 bet | $6.00 | spec (derived) |
| Grants | 10 free spins (via forced 3 scatters) | live [t60] |
| Buy-feature RTP | 96.56% — estimated (confidence: 0.85) | spec |
| Tiers | single tier only — no enhanced/super buy offered across 5+ purchases | live |
| Availability | disabled while autoplay is running | live [t55] |

## Algorithm
1. Player clicks **Buy Feature** → emit `buy_open{cost: 30 × totalBet}`; show cost panel [t57].
2. On **cancel/X** → `buy_decline`; return to base game, no charge.
3. On **confirm (YES)** → verify `balance ≥ cost`; if insufficient, block. Else emit `buy_confirm` + `buy_charge`, `balance -= cost` [t59][t60].
4. Force a base spin whose board contains exactly 3 scatters → `fs_trigger{scatterCount:3, awarded:10}`.
5. Enter Free Spins (see [[free_spins-mechanics]]); the forced scatters pay their normal 3-scatter award (1× total bet).

## State
- `cost = 30 × totalBet`, `balanceBefore`, `balanceAfter = balanceBefore − cost`.
- Purchase flag consumed on entry; does not persist past the round.

## Interactions
- **Grid/Math:** identical FS math to a natural trigger; only the entry is forced. Buy-feature RTP 96.56% — estimated (confidence: 0.85) differs slightly from base 96.51% — estimated (confidence: 0.50, sources: 5) (see [[math-and-rtp]]).
- **Other features:** directly enters [[free_spins-mechanics]] and its [[vault_bonus-mechanics]] / [[wild_multiplier-mechanics]].

## Edge cases
- **Insufficient balance:** purchase blocked (balance guard).
- **During autoplay:** button disabled — must cancel autoplay first [t55][t56].
- **No super-buy variant:** only the single 30× tier exists; do not implement a second tier.
- **No rebuy offer observed:** no re-trigger-purchase / rebuy prompt appears after the Free Spins round ends — autoplay/base game simply resumes [t42][t79]. Because no rebuy evidence exists, this doc intentionally has **no `## Rebuy` section** and the determinism contract emits no `rebuy_*` events.

## QA checklist
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
1. Assert cost == 30 × totalBet for several bets (e.g. $2→$60, $0.20→$6, $12→$360).
2. Assert confirm deducts exactly the cost and grants exactly 10 free spins with a 3-scatter board.
3. Assert decline/cancel charges nothing and returns to base game unchanged.

## References
- game-brief.md; live play-log [t55][t56][t57][t59][t60]
- https://www.bigwinboard.com/luxor-of-cleopatra-pragmatic-play-slot-review/