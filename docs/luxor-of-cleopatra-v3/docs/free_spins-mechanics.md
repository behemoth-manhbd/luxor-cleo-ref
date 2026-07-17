# free_spins — Mechanics

## Trigger
- **3+ `scatter_lotus` anywhere** in a single **base-game** spin.
- Exact thresholds: 3, 4, or 5 scatters. Each also pays the scatter award (3→1×, 4→5×, 5→25× total bet — estimated (confidence: 0.4, sources: 3)) added to the spin win.
- Award: **10 free spins**, played at the triggering bet.
- Corroborated live: natural trigger [t37], award "10 FREE SPINS" [t23].

## Parameters
| Constant | Value | Source |
|---|---|---|
| Scatters to trigger | 3 | spec.features.free_spins |
| Free spins awarded | 10 | spec.features.free_spins; live [t23] |
| Retrigger | **No** — extra scatters add to VAULT | spec; live (6 rounds, 0 retriggers [t69][t78]) |
| Bet during round | = triggering bet | spec.behavior |
| Scatter-in-FS VAULT add | 3→10×, 4→50×, 5→250× total bet | spec.symbols.scatter_lotus.note |
| Wilds introduced | `wild_multiplier` (×2) | spec |

## Algorithm
1. On base-spin resolution, count `scatter_lotus` on the board (anywhere).
2. If count ≥ 3: pay the scatter award (see paytable), then set `freeSpinsRemaining = 10`.
3. Play the FS intro transition; activate the VAULT (see [[vault-mechanics]]) at `20 × totalBet`.
4. For each free spin (auto-advance, no player input [t26]):
   a. Spin reels (special reels: `wild_multiplier` symbols may appear; reel 4/5 may show stacked cleopatra [t24][t53]).
   b. Evaluate ways wins exactly as base game.
   c. Apply any `wild_multiplier` multipliers to ways they join (see [[wild_multiplier-mechanics]]).
   d. Update VAULT: cleopatra symbols mark positions; wild-multipliers and scatters add increments.
   e. Add spin win to the running round total.
   f. Decrement `freeSpinsRemaining`.
5. If ≥3 scatters land during the round: **do not retrigger**; instead add scatter VAULT increment.
6. When `freeSpinsRemaining == 0`: resolve VAULT (pay only if 20/20 marked; else forfeit — see [[vault-mechanics]]), show outro, return to base game.

## State
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- Within a spin: `boardSymbols`, `waysWins[]`, `activeMultiplier`, `scatterCount`.
- Within the round: `freeSpinsRemaining`, `roundWinTotal`, `vaultValue`, `vaultMarked (0..20)`.
- Across the feature: none persists to base game except paid winnings.

## Interactions
- **Grid/math:** identical 1024-ways evaluation as base — see [[product-spec]] win rule and [[math-and-rtp]].
- **[[wild_multiplier-mechanics]]:** only active inside this feature.
- **[[vault-mechanics]]:** activated on entry, resolved on exit.
- **[[buy_feature-mechanics]]:** alternative entry path (guaranteed 3 scatters).

## Edge cases
- Retrigger: none — extra scatters divert to VAULT (spec; confirmed 0/6 rounds).
- Win cap: total round win clamped to 12,500× bet — estimated (confidence: 0.9, sources: 6). See [[math-and-rtp]].
- Empty/no-win spin: still decrements the counter; VAULT unchanged unless cleopatra/wild/scatter lands.
- Concurrency: free spins auto-advance; no overlapping user spin.

## QA checklist
1. Landing exactly 3 scatters in base sets `freeSpinsRemaining == 10` and pays the 3-scatter award once.
2. Landing 3+ scatters DURING free spins does NOT increase `freeSpinsRemaining` and DOES add the scatter VAULT increment.
3. After 10 spins, `freeSpinsRemaining == 0` and control returns to base game with `roundWinTotal` credited (plus VAULT only if 20/20).

## References
- spec.features.free_spins; spec.symbols.scatter_lotus
- Live play-log [t22][t23][t26][t37][t69][t78]
- https://www.bigwinboard.com/luxor-of-cleopatra-pragmatic-play-slot-review/