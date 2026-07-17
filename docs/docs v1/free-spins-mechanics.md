# Free Spins — Mechanics

## Trigger
- **3, 4, or 5** `scatter-lotus` symbols land **anywhere** on a single **base** spin.
- Award: a **fixed 10 free spins** regardless of trigger count.
- The trigger count also pays a scatter prize (base game): 3→1×, 4→5×, 5→25× total bet (see [[math-and-rtp]]).

## Parameters
| Constant | Value | Source |
|---|---|---|
| Scatters to trigger | 3 (minimum) | spec.features free-spins |
| Free spins awarded | 10 (fixed) | spec.features free-spins |
| Retrigger | **No** | spec `retrigger: false` |
| Scatter trigger pay (3/4/5) | 1× / 5× / 25× total bet | spec.symbols scatter-lotus |
| Vault starting value (FS) | 20× total bet | spec.features vault-award / [[vault-award-mechanics]] |
| In-FS scatter Vault add (3/4/5) | 10× / 50× / 250× total bet | spec.symbols scatter-lotus |
| Wild appearing in FS | `wild-multiplier` on all reels | [[wild-multiplier-mechanics]] |

## Algorithm
1. On each base spin, `scatter_check`: count `scatter-lotus` cells anywhere on the 4×5 board.
2. If count ≥ 3: emit `fs_trigger`, credit the scatter prize (`scatterPay[count] × totalBet`) to the base win.
3. Play the night-scene transition and "YOU HAVE WON 10 FREE SPINS" banner. Set `freeSpinsRemaining = 10`.
4. Initialize the Vault to `20 × totalBet` (see [[vault-award-mechanics]]). Mark the initial 8 random key positions on reels 2–4 on the first free spin.
5. For each free spin (repeat 10 times):
   a. Draw a new board; the `wild-multiplier` symbol may appear on any reel.
   b. Evaluate ways wins (with wild-multiplier applied per [[wild-multiplier-mechanics]]).
   c. Any `cleopatra` that lands marks additional key positions; any `wild-multiplier` adds a random Vault contribution; any in-FS scatters (3/4/5) add 10×/50×/250× to the Vault.
   d. Credit the spin win; decrement `freeSpinsRemaining`.
6. After the 10th free spin: if all 20 positions are marked, pay the Vault (see [[vault-award-mechanics]]); else forfeit.
7. Show the round-total summary banner; emit `round_end`; return to base game.

## State
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- **Within a spin:** board, matched ways, per-way multiplier product, scatter count.
- **Across the feature:** `freeSpinsRemaining`, `vaultValue`, `positionsMarked (0..20)`, accumulated FS win total.

## Interactions
- With grid/math: uses the same 1024-ways evaluation as base (see [[math-and-rtp]]).
- With [[wild-multiplier-mechanics]]: wilds only exist during this feature.
- With [[vault-award-mechanics]]: this feature is the only context where the Vault runs.
- With [[buy-feature-mechanics]]: a purchase enters this feature via a forced 3-scatter trigger.

## Edge cases
- **No retrigger:** additional scatters during free spins do **not** add spins; they only add to the Vault. [ASSUMPTION] scatters landing in FS pay no additional scatter cash prize (only Vault contribution) — spec states only the Vault add.
- **Win cap:** all free-spins winnings (including Vault) are subject to the 12,500× total-bet max-win cap — estimated (confidence: 0.5, sources: 4).
- Empty/no-win free spins still count against `freeSpinsRemaining`.

## QA checklist
1. Exactly 3 scatters → exactly 10 free spins awarded (not 3× anything).
2. 5 scatters → 25× total-bet scatter prize credited **and** 10 free spins (not 50).
3. Additional scatters mid-feature never increase `freeSpinsRemaining` beyond the remaining count.

## References
- spec.features `free-spins`, spec.symbols `scatter-lotus`
- PLAYER LOG [t26], [t41], [t42], [t45]
- https://www.bigwinboard.com/luxor-of-cleopatra-pragmatic-play-slot-review/