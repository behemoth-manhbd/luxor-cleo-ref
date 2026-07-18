# Test Vectors

## Conventions
- **Board notation:** a 4-row × 5-column matrix; **row 1 = top**, columns are reels 1→5 left→right. Cells hold symbol ids.
- **Bet used:** **$2.00 total bet** (non-1, so bet-multiplication bugs surface) unless a vector states otherwise.
- **Expected pays** come from the paytable in [[math-and-rtp]]: `win = paytable[sym][run] × ways × totalBet`; scatters pay `paytable.scatter[count] × totalBet`; in FS a way is ×`2^(wilds in way)`.
- **Refill/injection rule:** this game has **no cascade/tumble** (confirmed absent [t43]); there are no refills. Any symbol on any board below is **GIVEN by the vector** (injected via the seeded RNG stub), never random.
- `ways` = product of matching symbols per contributing reel.

## Vectors

### TV-01 — No-win board
- **Given:**
  ```
  A          K      Q             J     T
  9          T      J             Q     K
  cleopatra  scarab eye_of_horus  coin  ring
  K          Q      J             T     9
  ```
- **When:** base spin resolves, bet $2.00.
- **Then:** no symbol occupies 3 consecutive reels from reel 1; scatterCount = 0. **Win = $0.00**, no `fs_trigger`.
- **Why:** win rule requires a 3+ reel run from the left ([[product-spec]]).

### TV-02 — Exact threshold (`cleopatra` 3-of-a-kind, 1 way)
**Then:** `cleopatra` on reels 1,2,3 (1 each) → run 3, ways = 1×1×1 = 1. Actual band-3 rate is $5.00 at $2 bet (2.5× total bet), per paytable page 1. **Win = 2.5 × 1 × $2.00 = $5.00.**
### TV-03 — Pay-band boundary (`cleopatra` 4-reel run)
**Then:** `cleopatra` on reels 1–4 → run 4, ways = 1. Actual band-4 rate is $7.50 at $2 bet (3.75× total bet), per paytable page 1. **Win = 3.75 × 1 × $2.00 = $7.50.**
### TV-04 — Pay-band boundary (`cleopatra` 5-reel run)
- **Given:**
  ```
  cleopatra  K         Q          J          cleopatra
  9          cleopatra T          K          9
  A          scarab    cleopatra  Q          J
  K          T         9          cleopatra  scarab
  ```
- **When:** base spin, bet $2.00.
- **Then:** run 5, ways = 1. **Win = 5 × 1 × $2.00 = $10.00.** (Contrast TV-03's $4.00 — band 5 ≠ band 4.)
- **Why:** band-boundary difference 4→5 ([[math-and-rtp]]).

### TV-05 — Two symbols winning simultaneously
**Then:** `cleopatra` reels 1–3 (1 way) — actual band-3 rate $5.00 (2.5×) = $5.00; `scarab` reels 1–3 (1 way) — actual band-3 rate $4.00 (2×) = $4.00. **Total = $9.00.**
### TV-06 — Ways multiplication (2 ways)
- **Given:**
  ```
  cleopatra  K         cleopatra  J          cleopatra
  9          cleopatra cleopatra  K          9
  A          scarab    Q          cleopatra  J
  K          T         9          A          T
  ```
- **When:** base spin, bet $2.00.
- **Then:** reel 3 holds **two** `cleopatra`; run 5, ways = 1×1×2×1×1 = 2. **Win = 5 × 2 × $2.00 = $20.00.**
- **Why:** ways = product of per-reel matches ([[product-spec]]).

### TV-07 — Wild substitution (base game, `wild_base` on reel 2)
**Then:** `wild_base` (reel 2, allowed) completes `cleopatra` on reels 1–3 → run 3, ways = 1. Actual band-3 rate is $5.00 at $2 bet (2.5× total bet). **Win = 2.5 × 1 × $2.00 = $5.00.**
### TV-08 — Scatter trigger (3 scatters)
- **Given:**
  ```
  scatter  K         Q       J          T
  9        cleopatra scatter K          9
  A        scarab    Q       cleopatra  scatter
  K        T         9       A          scarab
  ```
- **When:** base spin, bet $2.00.
- **Then:** scatterCount = 3 → **scatter pay = 1 × $2.00 = $2.00** and **award 10 free spins** (`fs_trigger`). No line win (cleopatra only on reels 2,4).
- **Why:** 3+ scatters trigger FS and pay anywhere ([[free_spins-mechanics]]).

### TV-09 — Free-Spins wild multiplier stacking
- **Given (FS board):**
  ```
  cleopatra  K                Q                J          cleopatra
  9          wild_multiplier  wild_multiplier  K          9
  A          scarab           Q                cleopatra  J
  K          T                9                A          T
  ```
- **When:** free spin, bet $2.00.
- **Then:** `cleopatra` run 5 (reels 1–5, wilds sub on reels 2 & 3), ways = 1; wilds in way = 2 → ×2² = ×4. **Win = 5 × 1 × $2.00 × 4 = $40.00.** (No wild on reel 1 ⇒ no independent wild line.)
- **Why:** multiplicative per-way stacking, once ([[wild_multiplier-mechanics]]).

### TV-10 — Vault accumulation & forfeit (round state)
**Given:** FS round start — vaultValue = 20 × $2 = $40.00, markedCount = 0 (the 8-position pre-mark on reels 2–4 is applied only after free spin 1 resolves, per paytable page 3 — not at round start). After spin 1: +8 marks (→8/20) plus any Cleopatra hits that spin; a wild adds +$10 (→$50). Round ends with markedCount = 16/20, vaultValue = $52.00.
**Then:** `vault_resolve{markedCount:16, paid:false, vaultPayout:$0.00}` — Vault forfeited; round pays only its line/scatter wins.
### TV-11 — Max-win cap clamp
- **Given:** a free spin whose computed total resolves to 13,000 × total bet.
- **When:** bet $2.00; cap = **12,500× — estimated (confidence: 0.50, sources: 5)**.
- **Then:** `payout = min(13000, 12500) × $2.00 = 12,500 × $2.00 = $25,000.00`; round ends immediately.
- **Why:** win-cap clamps the total ([[math-and-rtp]]). (Vector asserts the clamp *rule* min(total,cap); the cap value carries its estimated label.)

### TV-12 — Buy Feature cost arithmetic
- **Given:** balance $100,000.00; Buy Feature = 30 × total bet.
- **When:** confirm at bet $2.00 → cost = 30 × $2.00 = **$60.00**; balance → $99,940.00, grants 10 FS. At bet $0.20 → cost = 30 × $0.20 = **$6.00**.
- **Then:** exact debit and 10 free spins via a forced 3-scatter board.
- **Why:** cost = 30× total bet ([[buy_feature-mechanics]]).

### TV-13 — Bet-multiplication check (non-1 bets)
**Then:** win = 2.5 × bet → **$5.00 / $2.50 / $0.50** for bets $2.00 / $1.00 / $0.20 respectively (actual `cleopatra` band-3 rate is 2.5× total bet, not 1×).
## Coverage checklist
- 3+ reel run required → TV-01, TV-02
- Pay-band boundaries (3/4/5) → TV-02, TV-03, TV-04
- Ways multiplication → TV-06
- Two symbols simultaneously → TV-05
- Wild substitution (base, reels 2–4) → TV-07
- Scatter trigger + scatter pay → TV-08
- Wild-multiplier stacking (FS) → TV-09
- Vault accumulate + forfeit → TV-10
- Max-win cap clamp → TV-11
- Buy-feature cost arithmetic → TV-12
- Bet multiplication → TV-13
- No cascade/tumble (confirmed absent) → N/A by design; substituted with the FS Vault multi-spin state vector TV-10.

## References
- game-brief.md; live play-log [t36][t41][t43][t50][t57]
- https://www.bigwinboard.com/luxor-of-cleopatra-pragmatic-play-slot-review/