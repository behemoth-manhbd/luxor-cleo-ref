# Wild Multiplier — Mechanics

## Trigger
- A `wild_multiplier` symbol lands during **free spins only** (`freeSpinsOnly = true`). Outside free spins the symbol is the plain `wild`.
- Appears on **all 5 reels** during free spins — confirmed by paytable page 2/6 text: "This is the WILD MULTIPLIER symbol. It can appear on all reels only during the FREE SPINS feature." This is **not** restricted to reels 2–4 (that restriction applies only to the base-game `wild`); the reel-1 sighting at `[t49]` is the normal rule, not an exception.
- Live reel captures during free spins (`multiplier-stacked-x2x2.png`, `freespins-wildmultiplier.png`) render the symbol with the same gold-pyramid "WILD" art as the base-game wild — no visually distinct "gold coin" art was observed on the reels this session, despite the paytable's info-screen icon for WILD MULTIPLIER being a round gold coin (paytable-2.png). Treat the paytable icon as the info-screen representation only; the confirmed in-reel art is the pyramid "WILD" graphic.
## Parameters
| Constant | Value | Source |
|---|---|---|
| Per-symbol multiplier | ×2 | paytable 2/6, `[t33]` |
| Combination rule | multiplicative on a shared way (×2·×2 = ×4, ×2·×2·×2 = ×8 …) | `[t53]`,`[t54]` |
| Standalone wild pays | 2→0.5, 3→5, 4→12.5, 5→25 (× total bet, per way) — estimated (confidence: 0.90, sources: 5) | paytable 1/6 |
| Substitution | all symbols except `scatter` | paytable 1/6 |
| Vault increment per WM | random draw from a list (e.g. 1×,1.5×,2×,2.5×,5×,7.5×,10×,…) — estimated | [[vault-mechanics]] |

## Algorithm
1. After `fs_reels_land`, `wild_multiplier_collect`: list every `wild_multiplier` cell (all 5 reels) with multiplier 2.
2. `ways_evaluate`: treat each WM as a wild for substitution and ways counting.
3. For each winning way, compute `wayMultiplier = ∏(multiplier of every WM cell that participates in this win)`; if no WM participates, `wayMultiplier = 1`.
4. `wild_multiplier_apply`: `wayWin = paytableValue × ways × wayMultiplier`. Apply the multiplier **once** per way (do not re-apply at round end).
5. `vault_add`: each WM on the board also adds a random increment to the Vault (see [[vault-mechanics]]).
6. Sum all way wins into the spin win.

> Stacked-WM ways interaction (e.g. two WM on one reel) is documented as ×2·×2 = ×4 for the win passing through them `[t53]`. Whether the ways count *and* the combined multiplier both scale is not fully published — mark the exact stacked-ways arithmetic **[ASSUMPTION]**; the ×-product-applied-once rule is authoritative.
## State
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- **Within a spin:** list of WM cells + multipliers; per-way multiplier product.
- **Across the round:** cumulative Vault increments contributed by WM.

## Interactions
- **[[free_spins-mechanics]]:** exists only inside that round; every wild becomes a WM.
- **[[vault-mechanics]]:** each WM may add to the Vault pot.
- **Grid/math:** substitution + ways evaluation identical to base wild — see [[math-and-rtp]].
- **Order:** multiplier applied per-spin at `wild_multiplier_apply`, strictly after `ways_evaluate` and before `fs_spin_settle` — see [[event-order-and-determinism]].

## Edge cases
- **No WM in a winning way:** multiplier = 1 (win unchanged).
- **Multiple WM on different reels of one way:** all multiply together (product).
- **Two WM stacked on one reel:** both count toward substitution/ways and the multiplier product `[t53]`.
- **WM in a losing arrangement:** still adds to Vault; no win multiplier applied.
- **Win cap:** post-multiplier win still subject to the 12,500× round cap — see [[free_spins-mechanics]].

## QA checklist
1. A single-WM winning way pays exactly 2× its base ways value (e.g. base 2.25 ⇒ 4.5).
2. Two WM in the same winning way yield ×4, applied once (not ×2 twice at different stages).
3. A WM that is not part of any winning way applies no multiplier but may still add to the Vault.

## References
- paytable-1.png, paytable-2.png, freespins-wildmultiplier.png
- Play-log `[t33]`,`[t49]`,`[t53]`,`[t54]`
- https://www.bigwinboard.com/luxor-of-cleopatra-pragmatic-play-slot-review/