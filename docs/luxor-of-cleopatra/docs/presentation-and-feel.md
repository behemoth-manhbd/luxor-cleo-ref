# Presentation & Feel — Luxor of Cleopatra

> No math figures (RTP, pays, weights, max win) appear here — presentation values only.

## Sources & Confidence
- **Observed this session:** base spins, a small win, buy-feature purchase + trigger, 5 free-spins rounds, wild-multiplier landings, Vault animation, turbo autoplay, the "NICE!" win-tier banner, reel motion blur, free-spins golden-flash transition.
- **Not observed:** win tiers above "NICE!" (BIG/MEGA/etc.), a completed Vault unlock, free-spins retrigger, exact per-cue millisecond timings (game is canvas; timings estimated from narration).

## Reel Motion & Timing (incl. turbo diff)
- Reels scroll **downward**; symbols settle reel-by-reel left→right. Turbo mode shows pronounced vertical **motion blur** on the symbols, confirming fast scroll — `[t40]` (reel-motion-turbo.png).
- Three speed modes: Normal / Quick Spin / Turbo Spin; "HOLD SPACE FOR TURBO SPIN" prompt shown in base game `[t07]`.
- **[ASSUMPTION]** Normal spin ≈ 1.5–2.5 s to full stop; turbo ≈ 0.3–0.5 s (unmeasured on canvas).

## Anticipation
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- No explicit reel-slowdown/anticipation cue was clearly captured; scatter/near-miss anticipation is **not observed** — mark any anticipation reel-hold **[ASSUMPTION]**.

## Win Presentation Tiers
| tier | on-screen threshold | effects | ~duration | evidence |
|---|---|---|---|---|
| (small win) | — | value counts up, no named banner | short | `[t21]` ($1.00 win) |
| **NICE!** | not displayed as a numeric threshold (accompanied a large win) | winged-Cleopatra art overlay, sparkle FX, screen dims around banner | ~1.5–2 s **[ASSUMPTION]** | `[t41]` |
| BIG / MEGA / SUPER (or higher) | **not observed** | not observed | not observed | — |

## Cascade & Tumble Feel
- **Not applicable — no cascade.** The board stays static after a win; single evaluation confirmed `[t23]`. No dissolve/drop animation exists.

## Multiplier Effects
- `wild_multiplier` is confirmed by paytable text (paytable-2.png) to carry a fixed ×2 multiplier during free spins, applied to any winning combination it joins, multiplying with other WM on the same way. However, live reel captures this session (`multiplier-stacked-x2x2.png`, `freespins-wildmultiplier.png`) show the symbol rendered with the same gold-pyramid "WILD" art as the base-game wild — a visually distinct "gold coin ×2" graphic (as shown on the paytable's info-screen icon, paytable-2.png) was not observed on the actual reels this session.
- Stacked WM on one reel visibly combine; a winning value **leapt** (e.g. $10.50 → $48.50) as the combined multiplier resolved — `[t53]`,`[t54]` (player-log narration; the exact before/after frame was not independently screenshotted).
## Symbol Animations (idle vs win)
- Idle: static symbols on a purple (base) background. Win: contributing symbols highlight and the win value floats up. Specific per-symbol win animations **not itemised** — mark detailed idle/win loops **[ASSUMPTION]**.

## Ambient & Audio
- Speaker icon toggles sound/music `[t07]`. System Settings expose Ambient Music and Sound FX toggles `[t10]`. Specific track/SFX cues not transcribed — **not observed** in detail.

## Transitions
- Base → Free Spins: dramatic **golden-flash** "CONGRATULATIONS! YOU HAVE WON 10 FREE SPINS" overlay with a glowing Cleopatra face, flaming lotus decorations `[t28]`,`[t52]`. Background then shifts to a **night-desert** scene (moon) for the round `[t30]`.
- Free spins auto-advance without input `[t30]`; "Skip Screens" can bypass the intro `[t44]`.
- "LAST FREE SPIN" banner on the final spin `[t33]`.

## Presentation Event Timeline
| event id | presentation cue | ~duration/easing | evidence |
|---|---|---|---|
| `spin_start` | spin button press, reels begin downward scroll | ~0.1 s | `[t19]` |
| `reels_land` | reels settle left→right (blur in turbo) | ~1.5–2.5 s normal / ~0.3–0.5 s turbo **[ASSUMPTION]** | `[t40]` |
| `ways_evaluate`/`win_present` | winning symbols highlight, value floats up | ~1 s | `[t21]` |
| `win_present` (tiered) | "NICE!" winged-Cleopatra overlay, sparkles, dim bg | ~1.5–2 s **[ASSUMPTION]** | `[t41]` |
| `fs_trigger`/`fs_intro` | golden-flash + Congratulations overlay, glowing Cleopatra, flaming lotus | ~2–3 s **[ASSUMPTION]** | `[t28]`,`[t52]` |
| `fs_start` | background → night-desert; Vault panel + remaining-spins counter appear | ~1 s | `[t30]` |
| `wild_multiplier_apply` | WM "WILD x2" coin glows; big value jump on stacks | ~1 s | `[t33]`,`[t54]` |
| `vault_add` | increment animation ($ flying into the Vault total) | ~0.5–1 s | `[t53]` |
| `fs_last_spin` | "LAST FREE SPIN" banner | ~1 s | `[t33]` |
| `fs_end` | "YOU HAVE WON \$… IN 10 FREE SPINS" outro | ~2 s | `[t34]` |

## Juice Moments
- Golden-flash free-spins reveal with glowing Cleopatra face `[t52]`.
- WM "WILD x2" coin land + the visible value leap when multipliers stack `[t53]`,`[t54]`.
- Vault "$ flying into total" increment animation `[t53]`.
- "NICE!" winged-Cleopatra win-tier overlay with sparkle FX `[t41]`.

## References
- freespins-intro.png, freespins-wildmultiplier.png, reel-motion-turbo.png, win-small-3ways.png, freespins-outro.png
- Play-log `[t07]`,`[t21]`,`[t23]`,`[t28]`,`[t30]`,`[t33]`,`[t40]`,`[t41]`,`[t52]`,`[t53]`,`[t54]`