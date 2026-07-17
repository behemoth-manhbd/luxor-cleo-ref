# Vault Award — Mechanics

## Trigger
- **Free spins active.** Award is paid if **all 20 key positions on reels 2–4 (the middle three reels)** are marked by the **end** of the free-spins round.
- All-or-nothing: 19/20 pays nothing; 20/20 pays the full accumulated Vault.

## Parameters
The wild-multiplier Vault contribution distribution IS specified in the info screen, not unspecified: 1 wild hits → 1x/1.5x/2x/2.5x/5x/12.5x/25x/50x; 2 wilds → 5x/10x/25x/50x/100x/250x/500x/2500x; 3 wilds → 7.5x/15x/37.5x/75x/150x/375x/750x/12500x; 4 wilds → 10x/20x/50x/100x/200x/500x/1000x/12500x; 5 wilds → 12.5x/25x/62.5x/125x/250x/625x/1250x/12500x; 6+ wilds → 15x/30x/75x/150x/300x/750x/1500x/12500x (all as total-bet multipliers).
## Algorithm
1. On free-spins start: `vaultValue = 20 × totalBet`; `positionsMarked = 0`.
2. On the **first** free spin: mark **8** random positions → `positionsMarked = 8`.
3. On every free spin:
   a. For each `cleopatra` landed, mark additional positions (up to 20). [ASSUMPTION] one position per landed cleopatra, capped at 20.
   b. For each `wild-multiplier` landed, `vaultValue += randomContribution`.
   c. If 3/4/5 scatters land in FS, `vaultValue += (10×/50×/250×) × totalBet`.
4. After the final free spin: if `positionsMarked == 20`, credit `min(vaultValue, capRemaining)` on top of regular wins (`vault_award` event); else forfeit.
5. Never let cumulative round win exceed 12,500× total bet — estimated (confidence: 0.5, sources: 4).

## State
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- **Across the feature:** `vaultValue`, `positionsMarked (0..20)`, `vaultAwarded (bool)`.

## Interactions
- With [[free-spins-mechanics]]: exists only inside that feature.
- With [[wild-multiplier-mechanics]]: wilds grow the Vault.
- With grid/math: Vault is paid separately from ways wins but shares the win cap ([[math-and-rtp]]).

## Edge cases
- **Not completed:** 20/20 not reached by round end → Vault forfeited entirely.
- **Retriggers:** none — no extra spins to reach 20/20.
- **Concurrency:** Vault award resolves **after** the last spin's regular win, before `round_end`.
- **Cap:** Vault + spin wins clamp to the max-win cap.

## QA checklist
1. Round ending at 19/20 pays $0 Vault (all-or-nothing).
2. Round ending at 20/20 pays the accumulated `vaultValue` on top of spin wins.
3. Vault starts at exactly `20 × totalBet` at every free-spins entry (natural or bought).

## References
- spec.features `vault-award`, spec.symbols `scatter-lotus`, spec.math `maxWinX`
- PLAYER LOG [t28], [t29], [t31], [t32], [t42], [t44], [t48]
- https://newslotgames.net/pragmatic-play/luxor-of-cleopatra.html