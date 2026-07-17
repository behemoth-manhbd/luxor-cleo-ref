# Test Vectors

## Conventions
- **Board notation:** a **4×5** matrix of symbol ids (4 rows × 5 cols); **row 1 = top**. Reels are columns (reel 1 = col 1, leftmost).
- **Bet used:** **totalBet = 2.0** (non-1, so bet-multiplication bugs surface).
- **Win formula:** for a symbol matched on consecutive reels from reel 1, `win = payValue(reelsMatched) × totalBet × ways`, `ways = product of the symbol's count on each matched reel`. Scatters pay `payValue × totalBet` (anywhere, no ways). Expected pays are taken from the paytable in [[math-and-rtp]].
- **No cascade:** the board resolves once — there is NO tumble in this game (confirmed [t18][t19]).
- **Refill-injection rule:** this game has no cascade refills; where a vector needs a specific reel outcome it is **GIVEN by the vector** (injected via the seeded RNG stub), never random.
- `wild_pyramid` appears only on reels 2/3/4; `wild_multiplier` appears only in free spins.

## Vectors

### TV-01 — No-win board
Given:
```
sym_9  sym_a  sym_k  sym_j  sym_9
sym_10 sym_k  sym_q  sym_a  sym_j
sym_j  ram_coin sym_9 sym_10 sym_q
sym_q  eye_of_horus sym_10 sym_k sym_a
```
When: base spin resolves.
Then: **win = $0.00**. No cleopatra; every reel-1 symbol {sym_9,sym_10,sym_j,sym_q} is absent from reel 2 → matched = 1 (< 3). Scatters = 0.
Why: adjacency win rule from reel 1 — see [[product-spec]].

### TV-02 — Exact threshold (count == minimum), cleopatra 2-of
Given:
```
cleopatra cleopatra sym_k  sym_j  sym_9
sym_a     sym_9     sym_q  sym_a  sym_j
sym_10    sym_j     sym_k  sym_10 sym_q
sym_q     sym_10    sym_9  sym_k  sym_a
```
When: base spin resolves.
Then: cleopatra matched reels 1–2 (reel 3 has none), ways = 1×1 = 1. `win = 0.25 × 2.0 × 1 = $0.50`.
Why: cleopatra pays from 2 reels — see [[product-spec]] / [[math-and-rtp]].

### TV-03 — Pay-band, ram_coin 3-of (ways = 1)
Given:
```
ram_coin ram_coin ram_coin sym_k  sym_9
sym_a    sym_k    sym_q    sym_a  sym_10
sym_9    sym_10   sym_j    sym_q  sym_a
sym_j    sym_q    sym_10   sym_j  sym_k
```
When: base spin resolves.
Then: ram_coin reels 1–3 (reel 4 none), ways = 1×1×1 = 1. `win = 0.75 × 2.0 × 1 = $1.50`.
Why: band-3 pay = 0.75 — see [[math-and-rtp]].

### TV-04 — Pay-band boundary, ram_coin 4-of (ways = 1)
Given:
```
ram_coin ram_coin ram_coin ram_coin sym_9
sym_a    sym_k    sym_q    sym_j    sym_10
sym_9    sym_10   sym_k    sym_a    sym_q
sym_j    sym_q    sym_a    sym_10   sym_k
```
When: base spin resolves.
Then: ram_coin reels 1–4 (reel 5 none), ways = 1. `win = 2.0 × 2.0 × 1 = $4.00`.
Why: **band boundary** — same symbol, same ways, 3-of = 0.75 (TV-03) vs 4-of = 2.0 (TV-04). See [[math-and-rtp]].

### TV-05 — Two symbols winning simultaneously
Given:
```
sym_a         sym_a         sym_a         sym_9  sym_q
eye_of_horus  eye_of_horus  eye_of_horus  sym_10 sym_j
sym_9         sym_k         sym_j         sym_k  sym_10
sym_10        sym_q         sym_q         sym_j  sym_9
```
When: base spin resolves.
Then:
- sym_a reels 1–3, ways 1 → `0.25 × 2.0 × 1 = $0.50`
- eye_of_horus reels 1–3, ways 1 → `1 × 2.0 × 1 = $2.00`
- **Total = $2.50**
Why: independent ways wins sum in one evaluation — see [[product-spec]].

### TV-06 — Wild (`wild_pyramid`) substitution on reel 2
Given:
```
gold_scarab wild_pyramid gold_scarab sym_a  sym_9
sym_a       sym_a        sym_q       sym_k  sym_10
sym_9       sym_k        sym_10      sym_q  sym_j
sym_k       sym_q        sym_j       sym_j  sym_k
```
When: base spin resolves.
Then: gold_scarab: reel 1 (1), reel 2 wild subs (1), reel 3 (1), reel 4 none → matched 3, ways 1. `win = 0.5 × 2.0 × 1 = $1.00`. (Reel-1's other symbols do not recur on reel 3, so the wild bridges nothing else.)
Why: `wild_pyramid` substitutes for all except scatter, reels 2/3/4 — see [[product-spec]].

### TV-07 — Scatter trigger (3 scatters)
Given:
```
scatter_lotus sym_q         sym_a         sym_j  sym_9
sym_a         scatter_lotus sym_k         sym_q  sym_a
sym_9         sym_j         scatter_lotus sym_10 sym_q
sym_k         sym_10        sym_9         sym_k  sym_j
```
When: base spin resolves.
Then: 3 `scatter_lotus` anywhere → **free spins triggered (10)** + scatter pay `1 × 2.0 = $2.00` (matches live "WIN $2.00" [t22]). No ways wins.
Why: scatter pays anywhere; 3+ trigger — see [[free_spins-mechanics]].

### TV-08 — Wild-multiplier single (×2) in free spins
Given (mode = free_spins):
```
sym_k          wild_multiplier sym_k  sym_a  sym_9
sym_a          sym_q           sym_q  sym_j  sym_10
sym_9          sym_j           sym_j  sym_q  sym_a
sym_10         sym_a           ram_coin sym_10 sym_j
```
When: free spin resolves.
Then: sym_k reels 1–3 (reel 2 = wild_multiplier subs), ways 1. base = `0.25 × 2.0 × 1 = $0.50`; one ×2 wild → `0.50 × 2 = $1.00`. Also `vault_update`: +10× bet from the wild hit.
Why: wild-multiplier multiplies the way it joins — see [[wild_multiplier-mechanics]].

### TV-09 — Wild-multiplier stacking (×2 × ×2 = ×4) in free spins
Given (mode = free_spins):
```
sym_k  wild_multiplier sym_k         wild_multiplier sym_q
sym_a  sym_q           sym_q         sym_a           sym_j
sym_9  sym_j           sym_j         sym_9           ram_coin
sym_10 ram_coin        eye_of_horus  sym_10          eye_of_horus
```
When: free spin resolves.
Then: sym_k reels 1–4 (reels 2 & 4 = wild_multiplier), reel 5 none, ways = 1×1×1×1 = 1. base = `1.5 × 2.0 × 1 = $3.00`; two ×2 wilds → ×4 → `3.00 × 4 = $12.00`.
Why: multiple wild-multipliers in one way multiply, not add — see [[wild_multiplier-mechanics]].

### TV-10 — Max-win cap clamp
Given: a computed round total of **12,600 × totalBet** (raw = `12,600 × 2.0 = $25,200`).
When: `win_cap_clamp` runs.
Then: clamp to `min(25,200, 12,500 × 2.0) = min(25,200, 25,000) = $25,000`. Cap magnitude **12,500× — estimated (confidence: 0.9, sources: 6)**; the **clamp operation** `min(raw, cap × bet)` is the rule under test.
Why: max-win cap — see [[math-and-rtp]] / [[vault-mechanics]].

### TV-11 — Buy-feature cost arithmetic
Given: totalBet = 2.0; player buys the feature.
When: CONFIRM BUY → Yes.
Then: cost = `30 × 2.0 = $60.00` deducted (matches live [t20]); bought spin lands exactly 3 scatters → scatter pay `1 × 2.0 = $2.00`; then 10 free spins begin.
Why: buy = 30× bet, always 3 scatters — see [[buy_feature-mechanics]].

### TV-12 — Ways multiplication (cleopatra 5-of, stacked)
Given:
```
cleopatra cleopatra cleopatra sym_a  sym_9
cleopatra cleopatra sym_q     sym_j  sym_10
sym_9     sym_k     sym_10    sym_q  sym_a
sym_10    sym_j     sym_k     sym_9  sym_j
```
Reel counts of cleopatra: reel1 = 2, reel2 = 2, reel3 = 1, reel4 = 1 (col4 = sym_a,sym_j,sym_q,sym_9 → 0). 
Correction — to reach 5-of, inject reel4/reel5 cleopatra: use this board:
```
cleopatra cleopatra cleopatra cleopatra cleopatra
cleopatra cleopatra sym_q     sym_j     sym_9
sym_9     sym_k     sym_10    sym_q     sym_a
sym_10    sym_j     sym_k     sym_9     sym_j
```
Counts: reel1 = 2, reel2 = 2, reel3 = 1, reel4 = 1, reel5 = 1. matched 5, ways = 2×2×1×1×1 = 4.
When: base spin resolves.
Then: `win = payValue(cleopatra,5) × totalBet × ways = 5 × 2.0 × 4 = $40.00`.
Why: ways = product of per-reel counts — see [[product-spec]] / [[math-and-rtp]].

## Coverage checklist
| Rule | Vector(s) |
|---|---|
| No-win adjacency break | TV-01 |
| cleopatra pays from 2 (exact threshold) | TV-02 |
| Pay-band by reels-matched (boundary 3→4) | TV-03, TV-04 |
| Two symbols pay in one evaluation | TV-05 |
| `wild_pyramid` substitution (reels 2/3/4) | TV-06 |
| Scatter pays anywhere + 3-scatter trigger | TV-07 |
| `wild_multiplier` ×2 (FS) | TV-08 |
| `wild_multiplier` multiplicative stacking | TV-09 |
| Max-win cap clamp | TV-10 |
| Buy cost = 30× bet + guaranteed 3 scatters | TV-11 |
| Ways = product of per-reel counts | TV-12 |
| Cascade/tumble chain | **N/A — game has no cascade** (confirmed [t18][t19]); replaced by ways-multiplication TV-12 |
| VAULT completion pay | Not a vector — never observed; behavior in [[vault-mechanics]] |

## References
- [[math-and-rtp]] (paytable), [[product-spec]] (win rule), [[free_spins-mechanics]], [[wild_multiplier-mechanics]], [[buy_feature-mechanics]], [[vault-mechanics]]
- Live corroboration: 4× A = $3.00 [t16] (= 1.5 × 2.0 × 1); 3-scatter = $2.00 [t22]; buy $60 [t20]