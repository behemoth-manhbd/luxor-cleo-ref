# Game Features — Luxor of Cleopatra

| feature | one-line summary | trigger | details |
|---|---|---|---|
| `base_game` | 5×4, 1024-ways; same symbol (or WILD) on consecutive reels from reel 1 pays `value × ways × total bet` (CLEO/RING/WILD from 2-of, others from 3-of). | every base spin | [[math-and-rtp]] |
| `free_spins` | Fixed 10 free spins; all wilds become ×2 multipliers and the Vault runs; trigger spin also pays the scatter prize. | 3+ SCATTER anywhere | [[free_spins-mechanics]] |
| `wild_multiplier` | Free-spins-only wilds each carry ×2, multiplying together on a shared way (×2·×2=×4); also feed the Vault. | a WILD lands during free spins | [[wild_multiplier-mechanics]] |
| `vault` | Progressive pot starting 20× total bet; paid in full only if all 20 board positions are marked by Cleopatra "keys" by the end of spin 10, else forfeited. | active throughout the free-spins round | [[vault-mechanics]] |
| `buy_feature` | Buy the free-spins round for 30× total bet via a guaranteed 3-scatter trigger (trigger pays 1× scatter prize). | purchase for 30× total bet | [[buy_feature-mechanics]] |

- No ante bet exists (`anteBet = false`, confirmed `[t59]`).
- Retrigger during free spins was **not observed**; extra scatters feed the Vault instead of adding spins.

## References
- paytable-1.png … paytable-6.png, buy-feature-panel.png, freespins-trigger.png
- Play-log `[t11]`,`[t13]`,`[t27]`,`[t34]`,`[t59]`
- https://www.bigwinboard.com/luxor-of-cleopatra-pragmatic-play-slot-review/
- https://www.aboutslots.com/casino-slots/luxor-of-cleopatra