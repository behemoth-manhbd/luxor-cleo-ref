# Test Vectors — Luxor of Cleopatra

## Conventions
- **Board notation:** a 4×5 matrix, **row 1 = top**, columns = reels 1→5. Symbol ids: `CLEO, SCA, RING, COIN, EYE, A, K, Q, J, 10, 9, W`(wild)`, WM`(wild-multiplier)`, SC`(scatter).
- **Bet used:** **total bet = $2.00** (non-1, so bet-multiplication bugs surface).
- **Where pays come from:** the paytable in [[math-and-rtp]]. `win = paytableValue × ways × totalBet`; scatter pays `paytableValue × totalBet`. These vectors assert the **ways arithmetic** over the documented (estimated) paytable — not the pays' real-world accuracy, and never any statistical figure (RTP, hit-freq, weights).
- **No cascade:** this game has no tumble; a spin is a single evaluation. The multi-step "chain" vector (TV-12) uses the free-spins multi-spin Vault sequence as the analog, showing every intermediate state.
- **Refill injection:** where a vector spans multiple free spins, each spin's board is **given** (injected via the seeded RNG stub), never random.

## Vectors

### TV-01 — No-win board
- **Given:**
```
reel:  1    2    3    4    5
r1     9    A    K    Q    J
r2     9    A    K    Q    J
r3     9    A    K    Q    J
r4     9    A    K    Q    J
```
- **When:** base spin evaluated.
- **Then:** win = **$0.00**. `nine` is only on reel 1 (not reel 2) → no 2+ consecutive; every other symbol starts on reel ≥2 so cannot begin a way; scatter count 0.
- **Why:** ways must start from reel 1 — [[math-and-rtp]].

### TV-02 — Exact minimum threshold, CLEOPATRA 2-of (L_min = 2)
- **Given:**
```
reel:  1     2     3     4     5
r1     CLEO  CLEO  J     K     Q
r2     CLEO  A     10    Q     K
r3     10    K     9     A     J
r4     9     Q     A     J     10
```
- **When:** base spin.
- **Then:** CLEO on reel 1 = 2, reel 2 = 1, reel 3 = 0 → length 2, ways = 2×1 = **2**. `paytableValue(cleopatra,2)=0.25` ⇒ `0.25 × 2 × $2.00 = $1.00`. No other symbol wins.
- **Why:** CLEOPATRA pays from 2-of; matches the live win `[t21]` — [[math-and-rtp]].

### TV-03 — Exact threshold for a 3-min symbol, COIN 3-of
- **Given:**
```
reel:  1     2     3     4     5
r1     COIN  COIN  COIN  A     Q
r2     9     A     K     J     10
r3     K     J     Q     10    9
r4     Q     10    9     K     A
```
- **When:** base spin.
- **Then:** COIN on reels 1–3 (1 each), reel 4 = 0 → length 3, ways = 1. `paytableValue(coin,3)=1` ⇒ `1 × 1 × $2.00 = $2.00`.
- **Why:** COIN does not pay at 2; 3 is its minimum — pay-band edge vs TV-02 — [[math-and-rtp]].

### TV-04 — Pay-band boundary, CLEOPATRA 4-of vs 5-of
- **Given A (4-of):**
```
reel:  1     2     3     4     5
r1     CLEO  CLEO  CLEO  CLEO  9
r2     9     A     K     Q     K
r3     K     Q     J     10    Q
r4     Q     10    9     J     A
```
- **Then A:** CLEO reels 1–4 (1 each), reel 5 = 0 → length 4, ways 1. `paytableValue(cleopatra,4)=3.75` ⇒ `3.75 × 1 × $2.00 = $7.50`.
- **Given B:** identical, but reel 5 r1 = `CLEO`. CLEO reels 1–5 → length 5, ways 1. `paytableValue(cleopatra,5)=5` ⇒ `5 × 1 × $2.00 = $10.00`.
- **Why:** extending to reel 5 moves the pay band 3.75→5 ($7.50→$10.00) — [[math-and-rtp]].

### TV-05 — Two symbol ids winning simultaneously
### TV-05 — Two symbol ids winning simultaneously
- **Given:**
```
reel:  1     2     3     4     5
r1     CLEO  CLEO  CLEO  9     K
r2     10    10    10    A     Q
r3     K     A     9     J     A
r4     Q     J     K     Q     J
```
- **When:** base spin evaluated.
- **Then:** CLEO reels 1–3, ways 1, `paytableValue(cleopatra,3)=2.5` ⇒ `2.5 × 1 × $2.00 = $5.00`. TEN reels 1–3, ways 1, `paytableValue(ten,3)=0.15` ⇒ `0.15 × 1 × $2.00 = $0.30`. **Total = $5.30.**
- **Why:** all ways wins on distinct symbols are summed; TEN's 3-of pay is 0.15× total bet, confirmed on paytable-1.png/paytable-1-verify.png — [[math-and-rtp]].
### TV-06 — Ways multiplication (4 ways)
- **Given:**
```
reel:  1     2     3     4     5
r1     CLEO  CLEO  CLEO  A     K
r2     CLEO  CLEO  9     J     Q
r3     K     A     10    Q     9
r4     Q     J     K     10    A
```
- **When:** base spin.
- **Then:** CLEO reel1 = 2, reel2 = 2, reel3 = 1, reel4 = 0 → length 3, ways = 2×2×1 = **4**. `paytableValue(cleopatra,3)=2.5` ⇒ `2.5 × 4 × $2.00 = $20.00`.
- **Why:** ways = product of per-reel counts — [[math-and-rtp]].

### TV-07 — Wild substitution
### TV-07 — Wild substitution
- **Given:**
```
reel:  1     2     3     4     5
r1     SCA   W     SCA   A     Q
r2     K     A     10    9     J
r3     Q     10    9     10    K
r4     J     9     A     K     A
```
- **When:** base spin evaluated.
- **Then:** SCA reel1 = 1, reel2 = W (substitutes, count 1), reel3 = 1, reel4 = 0 → length 3, ways 1. `paytableValue(scarab,3)=2` ⇒ `2 × 1 × $2.00 = $4.00`. K/Q/J on reel 1 continue through the wild to length 2 only (pay 0). WILD is not on reel 1 → no standalone wild win.
- **Why:** WILD substitutes for all but SCATTER; SCARAB's 3-of pay is 2× total bet, confirmed on paytable-1.png/paytable-1-verify.png (SCARAB pays identically to RING) — [[math-and-rtp]].
### TV-08 — Scatter trigger count
- **Given:**
```
reel:  1     2     3     4     5
r1     9     SC    A     J     K
r2     A     10    SC    Q     10
r3     K     J     K     SC    A
r4     Q     9     10    9     J
```
- **When:** base spin.
- **Then:** 3 scatters (reel2 r1, reel3 r2, reel4 r3) ⇒ scatter pay `paytableValue(scatter,3)=1 × $2.00 = $2.00`, and `fs_trigger` awards **10 free spins**. No ways win (reel-1 `9` dies at reel 2).
- **Why:** 3+ scatters anywhere pay and trigger — [[free_spins-mechanics]]. Matches `[t27]`.

### TV-09 — Free-spins wild multiplier applied once
### TV-09 — Free-spins wild multiplier applied once
- **Given (mode = free_spins):**
```
reel:  1     2     3     4     5
r1     SCA   WM    SCA   A     Q
r2     K     A     10    9     J
r3     Q     10    9     10    K
r4     J     9     A     K     A
```
- **When:** free spin evaluated.
- **Then:** SCA length 3, ways 1, base = `2 × 1 = 2`. One WM (×2) participates ⇒ `wayMultiplier = 2`, applied once ⇒ `2 × 2 × $2.00 = $8.00` (exactly 2× TV-07's corrected $4.00).
- **Why:** WM multiplies the winning way once — [[wild_multiplier-mechanics]]. SCARAB's 3-of pay corrected to 2× total bet per paytable-1.png. *(Two WM stacked on one reel would give ×4 by the product rule; exact stacked-ways arithmetic is [ASSUMPTION].)*
### TV-10 — Max-win cap clamp
- **Given (mode = free_spins):**
```
reel:  1     2     3     4     5
r1     CLEO  CLEO  CLEO  CLEO  WM
r2     CLEO  CLEO  CLEO  CLEO  WM
r3     CLEO  CLEO  CLEO  CLEO  WM
r4     CLEO  CLEO  CLEO  CLEO  WM
```
- **When:** free spin evaluated (illustrative 4 stacked WM on reel 5).
- **Then:** CLEO length 5 (reel 5 WM substitutes), ways = 4×4×4×4×4 = 1024, base = `5 × 1024 = 5120`. WM product = 2⁴ = 16 ⇒ pre-cap = `5120 × 16 = 81,920×`. Clamp: `min(81,920×, 12,500×) = 12,500×` ⇒ `12,500 × $2.00 = $25,000.00`; the excess is forfeited.
- **Why:** 12,500× round cap clamps the computed total — [[math-and-rtp]], [[event-order-and-determinism]]. *(WM stack depth is illustrative; the clamp is the asserted rule.)*

### TV-11 — Buy-feature cost arithmetic
- **Given:** total bet = $2.00, balance $100.00, player buys the feature.
- **When:** `buy_feature_purchase`.
- **Then:** cost = `30 × $2.00 = $60.00` ⇒ balance $40.00. Forced trigger spin lands 3 scatters ⇒ scatter prize `1 × $2.00 = $2.00` credited (balance $42.00), then 10 free spins begin.
- **Why:** Buy cost 30× total bet; trigger pays 3-scatter prize — [[buy_feature-mechanics]]. Matches `[t18]`,`[t27]`.

### TV-12 — Free-spins Vault sequence (multi-step analog) + resolve
- **Given (mode = free_spins):** Vault initialised at `20 × $2.00 = $40.00`; `marked = 0`.
  - **Spin A board** (3 extra scatters, +10×): Vault `20× → 30×` ⇒ $60.00.
  - **Spin B board** (4 extra scatters, +50×): Vault `30× → 80×` ⇒ $160.00.
  - (WM increments excluded from the asserted number — estimated.)
- **When:** the 10th free spin settles → `vault_resolve`.
- **Then:**
  - **Branch award (marked = 20):** `vault_award` adds `80 × $2.00 = $160.00` to `roundWin`.
  - **Branch forfeit (marked = 18):** `vault_forfeit` adds `$0.00` (observed outcome each round `[t34]`).
- **Why:** Vault starts 20×, scatter adds +10×/+50×, paid only at 20/20 — [[vault-mechanics]].

## Coverage checklist
| Rule | Vector(s) |
|---|---|
| No win when no way starts on reel 1 | TV-01 |
| 2-of minimum (CLEOPATRA/RING/WILD) | TV-02 |
| 3-of minimum (other symbols) | TV-03 |
| Pay-band boundary by length | TV-04 |
| Multiple symbols summed | TV-05 |
| Ways = product of per-reel counts | TV-06 |
| Wild substitution (reels 2–4) | TV-07 |
| Scatter pay + free-spins trigger | TV-08 |
| Wild multiplier applied once (×2) | TV-09 |
| 12,500× round cap clamp | TV-10 |
| Buy cost 30× + trigger prize | TV-11 |
| Vault start/adds/award-vs-forfeit across spins | TV-12 |

## References
- Paytable & rules per [[math-and-rtp]], [[free_spins-mechanics]], [[vault-mechanics]], [[wild_multiplier-mechanics]], [[buy_feature-mechanics]]
- Play-log `[t21]`,`[t27]`,`[t18]`,`[t34]`
- https://www.bigwinboard.com/luxor-of-cleopatra-pragmatic-play-slot-review/