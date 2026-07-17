# Presentation & Feel

## Sources & Confidence
- **Observed this session:** base spins (~170–190 manual+turbo), one bought free-spins round (full), two natural free-spins rounds, paytable screens, win-tier banners (NICE!, MEGA!), buy-feature modal, autoplay/turbo. Coverage = complete for base_spin, cascade(absent), win, free_spins, buy_feature, paytable.
- **Not observed / unverified:** actual audio (only toggles confirmed), a distinct "VAULT WON" screen, any win tier above MEGA!, precise reel stop easing (resolution near-instant vs screenshot cadence).
- No math figures appear in this doc — presentation only.

## Reel Motion & Timing (incl. turbo diff)
- Reels drop and resolve **left→right**; stop is effectively instant at screenshot cadence, no captured bounce/overshoot ([t18], [t21]).
- **Turbo:** vertical **motion blur** on symbols during autoplay ([t40]). [ASSUMPTION] normal-speed drop ≈ 400–600ms per reel cascade-in; turbo ≈ <150ms total.

## Anticipation
- Single scatter lands with a **glow effect** even below threshold ([t18]).
- **Near-miss:** high symbols stack densely on non-adjacent reels (e.g. reels 1,3,5 but not 2), visually implying a big win that pays $0 — a deliberate ways near-miss ([t22]).

## Win Presentation Tiers
| tier | on-screen threshold | effects | ~duration |
|---|---|---|---|
| standard win | any win | gold frame + sparkle on cells, WIN counter roll-up ([t19]) | [ASSUMPTION] ~1.0s |
| NICE! | mid-tier win | full-screen banner, winged-Cleopatra overlay, sparkle particles ([t31]) | [ASSUMPTION] ~2.0s |
| MEGA! | high-tier win | radiant orange/red burst, flying gold-coin particle rain, winged-Cleopatra motif, counter climb ([t33]) | [ASSUMPTION] ~2.5–3.0s |
| (above MEGA!) | unconfirmed | Not observed — ladder above MEGA! not reached ([anomalies]) | — |

## Cascade & Tumble Feel
- **Not observed as a mechanic — none exists.** Every spin resolves symbols in place once; no dissolve/refill ([t20], [t21]).

## Multiplier Effects
- `wild-multiplier` renders a **"WILD x2" gold-coin** label on the symbol ([t29]).
- Per-combo breakdown text shows the multiplied pay, e.g. "4X 9 PAYS $0.60 X2 = $1.20 ON 2 WAYS" ([t33]).

## Symbol Animations (idle vs win)
- **Idle:** `wild-pyramid` idle-pulses with a **purple glow** ([wins log]).
- **Win:** matched cells get a **gold frame + sparkle** ([t19]); scatters get a **blue glow** ([t41]).

## Ambient & Audio
- **Not verified** — only Ambient Music and Sound FX **toggle controls** confirmed in settings ([t10]); actual audio not captured ([anomalies]).

## Transitions
- Free-spins entry: screen dims to a **night scene** with rising **orange ember/fire particles**, "CONGRATULATIONS! YOU HAVE WON 10 FREE SPINS" banner, then VAULT gauge + remaining-spins counter appear ([t26], [t28]).
- Free-spins outro: radiant golden-burst summary banner "YOU HAVE WON $X IN 10 FREE SPINS", then "FREE SPINS COMPLETED" → return to base ([t34], [t36]).

## Presentation Event Timeline
`vault_award` DOES have a distinct presentation cue: reaching 20/20 marked positions triggers a full-screen 'ROYAL TRIBUTE UNLOCKED!' banner (golden treasure/key-unlock animation) during the final free spin, separate from the later round-total summary banner.
## Juice Moments
- Winged-Cleopatra character overlay flying across MEGA! wins with coin-particle rain ([t33]).
- Night-scene ember-particle free-spins transition ([t26]).
- Marked vault cells morphing to ornate red/gold with a corner icon as 0/20 → 20/20 climbs ([t29], [t32]).
- Scatter blue-glow anticipation even on a single below-threshold lotus ([t18]).

## References
- PLAYER LOG [t10],[t17]–[t36],[t40],[t41]; OBSERVED GAMEPLAY presentation & anomalies blocks
- spec.presentation (winTiers, anticipation, notes), spec.audio
<<<END>>>

This is all the response, Coder