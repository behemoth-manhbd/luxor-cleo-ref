# vault — Mechanics

## Trigger
Active only during free spins. Starting value: 20 x total bet (confirmed in-game: "The VAULT starts with a value of 20x total bet"). Pre-marked positions: 8 of 20, marked on reels 2, 3, or 4 — but per the in-game rules text this marking happens **after the first free spin resolves**, not at FS entry: "When the round starts, after the first free spin, 8 random positions on the screen on reels 2, 3 or 4 are marked."
## Parameters
| Constant | Value | Source |
|---|---|---|
| Start value | 20x total bet | in-game paytable |
| Total positions | 20 | in-game paytable |
| Pre-marked at start | 8, on reels 2/3/4, applied after the first free spin | in-game paytable |
| Wild-multiplier increment | Random draw from a table, keyed to the number of wild_multiplier symbols hit in that spin: 1 hit → {1x,1.5x,2x,2.5x,5x,12.5x,25x,50x}; 2 hits → {5x,10x,25x,50x,100x,250x,500x,2500x}; 3 hits → {7.5x,15x,37.5x,75x,150x,375x,750x,12500x}; 4 hits → {10x,20x,50x,100x,200x,500x,1000x,12500x}; 5 hits → {12.5x,25x,62.5x,125x,250x,625x,1250x,12500x}; 6+ hits → {15x,30x,75x,150x,300x,750x,1500x,12500x} (all x total bet) | in-game paytable |
| Scatter increment (in FS) | 3→10x, 4→50x, 5→250x total bet | in-game paytable |
| Marking symbol | cleopatra | in-game paytable |
| Payout condition | ALL 20 positions marked before round end | in-game paytable |
| Cap | 12,500x total bet | in-game paytable |
## Algorithm
1. On FS entry: `vaultValue = 20 x totalBet`; `vaultMarked = 0`.
2. After the first free spin resolves: mark 8 random unmarked positions on reels 2, 3, or 4 (`vaultMarked = 8`).
3. Per free spin, after ways evaluation:
   a. For each `cleopatra` landed on an unmarked position, mark it.
   b. For each spin where one or more `wild_multiplier` symbols hit, add a random amount to `vaultValue` drawn from the table keyed by the number of simultaneous wild_multiplier hits (see Parameters).
   c. If ≥3 scatters landed: `vaultValue += {10,50,250}[band] x totalBet`.
   d. `vaultValue = min(vaultValue, 12500 x totalBet)`.
4. At round end: award `vaultValue` only if `vaultMarked == 20`, else forfeit.
## State
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- Within a spin: `newCleopatras`, `wildHits`, `scatterCount`.
- Within the round: `vaultValue`, `vaultMarked (0..20)`.
- Across the feature: reset on each new FS entry (0/20 observed on fresh round [t42]).

## Interactions
**[[wild_multiplier-mechanics]]:** each spin with one or more x2 wild hits adds a random amount to the meter, drawn from a table keyed by the number of simultaneous hits (see [[vault-mechanics]] Parameters) — not a fixed +10x.
## Edge cases
- Never completed live (closest 19/20, forfeited [t41][t78]) — completion path is inferred from rules.
- If `vaultMarked` reaches 20 before the last spin, meter is still paid at round end (award once).
- Cap clamp: `vaultValue` cannot exceed 12,500× bet.
- Marking is monotonic (positions never un-mark within a round).

## QA checklist
1. `vaultMarked < 20` at round end ⇒ meter pays 0 (forfeit); round total excludes vaultValue.
2. Each spin where one or more x2 `wild_multiplier` symbols hit adds a random VAULT increment drawn from the value-count-keyed table (never a fixed 10x).
3. `vaultValue` after any increment never exceeds `12500 x totalBet`.
## References
- spec.features.vault; spec.symbols.scatter_lotus; spec.math.maxWinX
- Live play-log [t24][t26][t40][t41][t42][t78]
- https://slotcatalog.com/en/slots/luxor-of-cleopatra