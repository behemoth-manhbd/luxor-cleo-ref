# Wild Multiplier — Mechanics

## Trigger
- Appears **only during Free Spins** (gold-coin "WILD x2" symbol) [t49]. Not present in the base game.

## Parameters
| Constant | Value | Source |
|---|---|---|
| Base multiplier per wild | ×2 | spec, live [t49] |
| Stacking rule | multiplicative: k wilds in one way → ×2^k (2×/4×/8×…) | spec |
| Own paytable (× total bet) | 2→0.5, 3→5, 4→12.5, 5→25 | **exact — paytable p2** ($1/$10/$25/$50 at $2 bet) |
| Carry across spins | none (no respin mechanic) | spec |
| Reel restriction | not stated for FS **[ASSUMPTION: unrestricted on FS reels]** | — |

## Algorithm
1. During FS evaluation, substitute `wild_multiplier` for regular symbols to complete ways (identical to `wild_base` substitution).
2. For each winning way, count the wilds `k` that participate in that specific way.
3. Multiply that way's base payout by `2^k`: `wayWin = paytable[sym][run] × waysForThatSymbol × totalBet × 2^k`.
4. If `wild_multiplier` itself forms a run from reel 1 (2+ consecutive), also pay its own paytable line (2→0.5 … 5→25).
5. Wilds also feed the Vault value when they land (see [[vault_bonus-mechanics]]).

## State
- Within a spin: per-way `wildsInWay`, computed `multiplier = 2^wildsInWay`.
- No multiplier state persists across spins.

## Interactions
- **Grid:** substitutes like a wild; each ×2 applies only to the way(s) it joins.
- **Math:** applied per-way, once, at evaluation time (see [[math-and-rtp]]).
- **Other features:** landing increments the Vault (see [[vault_bonus-mechanics]]); only exists inside [[free_spins-mechanics]].

## Edge cases
- **Multiple wilds, one way:** multiply, don't add (2 wilds → ×4, not ×2+×2).
- **Wild in some ways only:** the multiplier affects only the ways containing it; other ways of the same symbol are unmultiplied.
- **Win cap:** post-multiplier way totals still clamp to the 12,500× round cap.

## QA checklist
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
1. Assert one wild in a way multiplies that way's win by 2; two wilds by 4; three by 8.
2. Assert the multiplier applies per-way and never to ways not containing the wild.
3. Assert `wild_multiplier` is absent from base-game boards and present only in FS.

## References
- game-brief.md; live play-log [t13][t49][t50]
- https://clashofslots.com/slots/pragmatic-play/luxor-of-cleopatra/