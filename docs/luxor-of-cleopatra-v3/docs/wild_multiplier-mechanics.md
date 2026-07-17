# wild_multiplier — Mechanics

## Trigger
- `wild_multiplier` symbols land **only during free spins** [t26].
- Each carries a **fixed ×2** multiplier (only ×2 observed this session; higher values not confirmed).

## Parameters
VAULT contribution: a spin with one or more x2 wild hits adds a random amount to the VAULT, drawn from a table keyed by the number of simultaneous hits that spin (1 hit → {1x,1.5x,2x,2.5x,5x,12.5x,25x,50x} bet; 2 hits → {5x,10x,25x,50x,100x,250x,500x,2500x} bet; etc. up to 6+ hits) — not a fixed +10x. All other rows (multiplier value x2, all-reels appearance in FS, substitution, multiplicative stacking, no standalone pay) are confirmed by the in-game paytable.
## Algorithm
6. Feed VAULT: if one or more `wild_multiplier` symbols hit this spin, add a random amount to `vaultValue`, drawn from the table keyed by the count of simultaneous hits (see [[vault-mechanics]] Parameters) — not a fixed 10x total bet.
## State
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- Within a spin: `wildCells[]`, per-way `k`, per-way `M`.
- Within the tumble/spin: N/A (no cascade).
- Across the feature: contributes to `vaultValue` only.

## Interactions
**[[vault-mechanics]]:** each spin with one or more hits adds a random amount to the meter (see table in [[vault-mechanics]] Parameters), not a fixed 10x bet.
## Edge cases
- Two+ wilds in one way multiply (×2×2 = ×4); across different ways they apply independently to each way.
- The in-game rules state the WILD MULTIPLIER symbol always carries a fixed ×2 multiplier ("the WILD MULTIPLIER symbol carries a multiplier of x2", paytable-2.webp) — there is no higher standalone multiplier value; only the VAULT increment amount is randomized, not the wild's own multiplier.
- Win cap: multiplied total still clamped to 12,500× bet — confirmed in-game (paytable-3.webp/paytable-6.webp).
## QA checklist
1. One ×2 wild in a winning way doubles exactly that way's payout (basePay × ways × 2).
2. Two ×2 wilds in the same way quadruple it (×4), not add (not ×3).
3. `wild_multiplier` never appears in a base-game spin.

## References
- spec.features.wild_multiplier; spec.symbols.wild_multiplier
- Live play-log [t26][t40][t65]
- https://www.bigwinboard.com/luxor-of-cleopatra-pragmatic-play-slot-review/