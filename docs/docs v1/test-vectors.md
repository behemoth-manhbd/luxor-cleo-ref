# Test Vectors — Golden Worked Examples

## Conventions
The exact per-way combination formula is unconfirmed. Observed real gameplay: 3 Cleopatra landing on 2 ways at a $2.00 total bet paid a total of $1.00. Multiplying either this doc's estimated pay[3]=0.5 or the real paytable's shown pay[3]=2.5x by 2 ways x $2 bet predicts $2.00–$10.00, not the $1.00 actually paid. The true ways/way-count combination rule needs re-derivation from further gameplay sampling before these worked examples can be trusted.
## Vectors

### TV-01 — No-win board
- **Given:**
```
a   k   q   j   10
9   scarab ring coin eye-of-horus
k   a   9   10  q
j   q   k   a   9
```
- **When:** base spin, evaluate.
- **Then:** No symbol appears on 3+ adjacent reels from reel 1. **Win = $0.00.**
- **Why:** ways rule requires ≥3 from reel 1 — see [[event-order-and-determinism]].

### TV-02 — Exact threshold: cleopatra 3-of-a-kind, 1 way
Formula unconfirmed — see corrected Conventions note. The real cleopatra 3-OAK paytable value is 2.5x total bet (not 0.5x), and the real observed 3-cleopatra/2-ways win was $1.00, not the $2.00-$10.00 a ways-multiplied formula would predict with either pay figure.
### TV-03 — Pay-band boundary: 4-OAK vs 5-OAK
Real scarab paytable at $2 bet: 4-OAK=$6.00 (3x), 5-OAK=$8.00 (4x). The 5-OAK figure matches this doc coincidentally, but the 4-OAK figure ($2.40 predicted vs $6.00 actual) does not, and the ways-multiplication formula itself is unconfirmed (see Conventions).
### TV-04 — Two symbols winning simultaneously
Formula unconfirmed — see corrected Conventions note; this worked total cannot be trusted until the real ways/pay combination rule is re-derived.
### TV-05 — Ways multiplication (stacked symbol)
The 'ways = product of per-reel counts, multiplied into the win' rule is unconfirmed by real gameplay (see corrected Conventions note) — this worked example cannot be trusted as-is.
### TV-06 — Wild-pyramid substitution (base game)
Real ring 3-OAK paytable value is 2x total bet (=$4.00 at $2 bet), not 0.4x, and the ways-multiplication formula used here is unconfirmed (see Conventions).
### TV-07 — Scatter 3: trigger + prize
- **Given:** exactly 3 `scatter-lotus` anywhere (reels 2,3,4).
- **When:** base spin.
- **Then:** scatter prize = `1 × 2.0` = **$2.00**, AND `fs_trigger` → 10 free spins.
- **Why:** scatter[3]=1× total bet, 3+ scatters trigger — see [[free-spins-mechanics]]. [OBSERVED: "3X SCATTER PAYS $2.00" t26/t41].

### TV-08 — Scatter pay bands 4 vs 5
- **Given (A):** 4 scatters → `5 × 2.0` = **$10.00** + 10 free spins.
- **Given (B):** 5 scatters → `25 × 2.0` = **$50.00** + 10 free spins.
- **Why:** scatter 4→5×, 5→25×; spins fixed at 10 regardless — see [[free-spins-mechanics]].

### TV-09 — Free-spins single wild-multiplier (×2)
- **Given (FS mode):** `9` on reels 1,2,3; the reel-2 `9` is a `wild-multiplier` acting as `9`.
```
9              wild-multiplier 9   j   10
q              a               k   coin eye
a              q               10  a   9
j              10              q   a   k
```
- **When:** free spin. count=3, ways=1, wildsInWay=1 → multiplier ×2.
- **Then:** Win = `0.1 × 1 × 2.0 × 2` = **$0.40.** Plus Vault contribution for the landed wild.
- **Why:** wild multiplies its way ×2 in the same step — see [[wild-multiplier-mechanics]].

### TV-10 — Two wild-multipliers in one way (×4)
Two wild-multipliers in one way (×4) — corrected using the real paytable (paytable-1/paytable-2): `coin` 3-of-a-kind pays 1× total bet ($2.00 at $2.00 bet), not the previously-estimated 0.3×. With two wild-multipliers in the same way (×2 each, multiplying to ×4): Win = `1.0 × 1 way × $2.00 × 4` = **$8.00**. The underlying ways/way-count combination formula itself remains unconfirmed (see Conventions).
### TV-11 — Multi-spin FS sequence + Vault 20/20 award
Multi-spin FS sequence + Vault 20/20 award — Spin 1 pay corrected: real `cleopatra` 3-of-a-kind pays 2.5× total bet ($5.00 at $2.00 bet), not the previously-estimated 0.5×; the prior worked total also contained an arithmetic error (0.5×1×2.0 = $1.00, not the stated $2.00). Using the real pay figure and 1 way: Spin 1 win = `2.5 × 1 × 2.0` = **$5.00**. Round total becomes spin wins ($5.00+$8.00 given = $13.00) + vault $77.00 = **$90.00**, subject to the unreached 12,500× cap. The underlying ways/way-count combination formula remains unconfirmed (see Conventions); the 20/20 vault-award mechanism and its distinct 'ROYAL TRIBUTE UNLOCKED!' presentation are confirmed (see [[vault-award-mechanics]]).
### TV-12 — Max-win cap clamp
- **Given:** free-spins round computes raw total `7,000× + Vault 6,000×` = 13,000× total bet = $26,000 at $2.00.
- **When:** round_end.
- **Then:** clamp to `12,500 × 2.0` = **$25,000.00** — estimated cap (confidence: 0.5, sources: 4).
- **Why:** max win cap 12,500× — see [[math-and-rtp]]/[[event-order-and-determinism]].

### TV-13 — Buy-feature cost arithmetic
- **Given:** totalBet 2.0, player buys feature.
- **When:** confirm buy.
- **Then:** deduct `30 × 2.0` = **$60.00**; board forced to exactly 3 scatters → scatter prize `1×2.0`=$2.00 + 10 free spins, Vault init $40.00.
- **Why:** buy = 30× total bet, 3 guaranteed scatters — see [[buy-feature-mechanics]].

### TV-14 — In-FS scatter Vault bands (no extra spins)
- **Given (FS):** vaultValue currently $40.00. A spin lands 4 scatters.
- **Then:** Vault += `50 × 2.0` = $100.00 → vaultValue = **$140.00**; `freeSpinsRemaining` unchanged (no retrigger).
- **Why:** in-FS 4 scatters add 50× to Vault, spins fixed — see [[vault-award-mechanics]]/[[free-spins-mechanics]].

## Coverage checklist
| Rule | Vector(s) |
|---|---|
| No-win board | TV-01 |
| Exact threshold (count==3) | TV-02 |
| Pay-band boundary (4 vs 5) | TV-03, TV-08 |
| Two symbols simultaneously | TV-04 |
| Ways = product of counts | TV-05 |
| Wild-pyramid substitution (base) | TV-06 |
| Scatter trigger count | TV-07, TV-08 |
| Wild-multiplier ×2 (one way) | TV-09 |
| Multiple wilds multiply (×4) | TV-10 |
| Multi-spin FS + Vault 20/20 | TV-11 |
| Max-win cap clamp | TV-12 |
| Buy cost arithmetic | TV-13 |
| In-FS scatter Vault add / no retrigger | TV-14 |

## References
- [[math-and-rtp]] (paytable), [[product-spec]], [[free-spins-mechanics]], [[wild-multiplier-mechanics]], [[vault-award-mechanics]], [[buy-feature-mechanics]]
- spec.symbols, spec.math.paytable