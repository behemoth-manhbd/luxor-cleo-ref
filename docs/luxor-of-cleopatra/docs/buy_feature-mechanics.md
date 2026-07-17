# Buy Feature — Mechanics

## Trigger
- Player presses the persistent **BUY FEATURE** button (bottom-left of the frame) and confirms the purchase.
- Cost: **30× total bet** ($60.00 at $2.00 bet, confirmed `[t18]`, panel text "$60.00 TRIGGER FREE SPINS WITH 3X SCATTERS").
- Effect: the next spin is forced to land **exactly 3 SCATTER** symbols, guaranteeing entry into [[free_spins-mechanics]].

## Parameters
| Constant | Value | Source |
|---|---|---|
| Cost multiplier | **30× total bet** | paytable 3/6 `[t13]`, panel `[t18]` |
| Guaranteed scatters | exactly 3 | paytable 3/6, `[t27]` |
| Trigger-spin scatter pay | 1× total bet (3-scatter prize) | `[t27]` |
| Free spins granted | 10 | [[free_spins-mechanics]] |
| Buy-feature RTP | 96.56% — estimated (confidence: 0.90, sources: 1) | paytable 4/6 `[t14]` |
| Confirmation dialog | Yes/No prompt | `[t26]` |

## Algorithm
1. `buy_feature_open`: show purchase panel with cost = `30 × totalBet`.
2. `buy_feature_confirm`: player accepts (Yes). Balance guard: require `balance ≥ 30 × totalBet`; else block.
3. `buy_feature_purchase`: deduct `30 × totalBet`.
4. `buy_scatter_inject`: force the trigger board to contain exactly 3 scatters (via the seeded RNG stub's forced placement — see [[event-order-and-determinism]]).
5. `scatter_check` on that board: 3 scatters ⇒ pay scatter prize (1× total bet) and emit `fs_trigger`.
6. Enter [[free_spins-mechanics]] with 10 free spins; proceed identically to a natural trigger.

## State
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- **Before purchase:** `balance`, `totalBet`.
- **On purchase:** `balance -= 30 × totalBet`; set `forcedTrigger = 3scatters`.
- **After:** hands off entirely to `free_spins` state (`freeSpinsRemaining = 10`, Vault at 20×).

## Interactions
- **[[free_spins-mechanics]]:** identical round to a natural trigger, only the entry is guaranteed.
- **[[vault-mechanics]] / [[wild_multiplier-mechanics]]:** unchanged inside the bought round.
- **Ante bet:** the game has **no** ante bet; Buy Feature is the only purchase (`[t59]`).

## Edge cases
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- **Insufficient balance:** purchase blocked before deduction (balance guard).
- **Cancel at confirm:** no deduction, return to base game (`buy_feature_decline` path).
- **Trigger scatter pay:** the 1× scatter prize is credited in addition to the round wins (do not double-charge/refund the buy cost).
- **Win cap:** the bought round shares the 12,500× round cap.

## Rebuy
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- **Not applicable / not observed.** No rebuy or re-trigger-purchase offer was presented after any free-spins round ended this session; play returned directly to the base game (`[t34]`,`[t35]`,`[t46]`). Buy Feature is a **base-game** purchase only, not a post-feature rebuy. If a future capture reveals a post-round rebuy offer, add a dedicated `## Rebuy` section here and the `rebuy_*` events to [[event-order-and-determinism]].

## QA checklist
1. Purchase deducts exactly 30× total bet (e.g. $60.00 at $2.00 bet) and no more.
2. The forced trigger board always contains exactly 3 scatters and always starts 10 free spins.
3. The trigger spin credits the 3-scatter prize (1× total bet) on top of any free-spins winnings.

## References
- paytable-3.png, paytable-4.png, buy-feature-panel.png, freespins-trigger.png
- Play-log `[t13]`,`[t18]`,`[t26]`,`[t27]`,`[t59]`
- https://www.bigwinboard.com/luxor-of-cleopatra-pragmatic-play-slot-review/