# Wild Multiplier — Mechanics

## Trigger
- A `wild-multiplier` symbol (gold coin labelled "WILD x2") **lands during a free spin**. It does **not** appear in the base game (free-spins-exclusive).

## Parameters
wild-multiplier DOES have its own paytable, shown directly above its description on the info screen: 2=$1.00 (0.5x), 3=$10.00 (5x), 4=$25.00 (12.5x), 5=$50.00 (25x) total bet. (It is `wild-pyramid`, the base-game symbol, that has no own paytable.)
## Algorithm
1. When evaluating a winning way, collect the list of `wild-multiplier` cells participating in that way.
2. Compute `wayMultiplier = 2 ^ (number of wild-multipliers in that way)` (each ×2, multiplied together).
3. `wayWin = symbolPay[count] × totalBet × wayMultiplier`.
4. Apply this in the **same win-evaluation step** as the base pay (no separate deferred step); show in the per-way breakdown.
5. Independently, for each landed `wild-multiplier` cell, add its random contribution to the Vault meter (see [[vault-award-mechanics]]).

## State
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- **Within a tumble/way:** count of wild-multipliers in the current winning way, `wayMultiplier`.
- **Within a spin:** total wild-multipliers landed (for Vault contribution).

## Interactions
- With [[free-spins-mechanics]]: only active during free spins.
- With grid/math: the multiplier scales the ways pay from [[math-and-rtp]]; different ways get their own independent `wayMultiplier`.
- With [[vault-award-mechanics]]: every landed wild feeds the Vault.

## Edge cases
- A wild that is **not** part of any winning way still contributes to the Vault but pays nothing.
- Two wilds in the **same** way → ×4; two wilds in **different** ways → each way keeps its own multiplier (they do not cross-multiply).
- **Win cap:** multiplied ways still clamp to 12,500× — estimated (confidence: 0.5, sources: 4).

## QA checklist
1. One wild in a winning way doubles exactly that way's pay, no other way.
2. Two wilds in one way yield ×4 (not ×2 twice added = not ×4 via addition — must be product).
3. A wild landing on a non-winning board still increments the Vault contribution counter.

## References
- spec.features `wild-multiplier`, spec.symbols `wild-multiplier`
- PLAYER LOG [t29], [t33] ("4X 9 PAYS $0.60 X2 = $1.20 ON 2 WAYS")
- https://www.bigwinboard.com/luxor-of-cleopatra-pragmatic-play-slot-review/