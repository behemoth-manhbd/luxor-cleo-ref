# Presentation & Feel

## Sources & Confidence
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- **Observed this session:** base spin timing, staggered reel stop, turbo blur, scatter near-miss, Free Spins entry/exit, Vault marking sparkle, WILD x2 landing, one named win-tier banner ("MEGA"), ambient backgrounds, portrait exit transition. Evidence = play-log `[tNN]` moments.
- **Not observed:** cascade/tumble (confirmed absent), win tiers other than MEGA (Big/Super/Epic unconfirmed), exact per-effect durations (mostly unstated → chosen values marked [ASSUMPTION]).
- No math figures appear in this doc — only on-screen presentation values.

## Reel Motion & Timing (incl. turbo diff)
- Reels stop **staggered left→right**; mid-spin, reels 1–2 blurred while 3–5 already stopped [t34].
- **Turbo:** "HOLD SPACE FOR TURBO SPIN" [t08]; turbo engages fast blur and rapid resolution [t34]. **Quick Spin** and **Turbo** are mutually exclusive [t28][t81]. A base spin resolves "quickly" with a win callout [t24].
- **[ASSUMPTION]** Normal reel spin-down ≈ 0.6 s/reel with ~120 ms stagger; turbo ≈ 0.15 s total.

## Anticipation
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- Two scatters visible on non-triggering boards register as a **near-miss tease** [t35]; scatters on reels 1/3/5 flagged as likely triggers [t52][t71].
- **[ASSUMPTION]** A scatter-anticipation reel-slow/glow plays when 2 scatters are already showing.

## Win Presentation Tiers
| tier | on-screen threshold | effects | ~duration |
|---|---|---|---|
| MEGA | observed at 8.49× bet (exact threshold not shown) [t86] | winged-Cleopatra goddess graphic, falling coin particles, count-up | count-up settles to final value [t88] (~[ASSUMPTION] 2–3 s) |
| Big / Super / Epic | not observed — unconfirmed thresholds | not observed | not observed |

## Cascade & Tumble Feel
- **Not applicable — no cascade/tumble mechanic exists** (confirmed absent) [t43]. Wins resolve in place with no symbol removal/refill.

## Multiplier Effects
- **WILD x2** gold-coin symbol lands during Free Spins and contributes a multiplied way win [t49].
- **[ASSUMPTION]** A brief glow/coin-shimmer plays on each WILD x2 land (~0.4 s).

## Symbol Animations (idle vs win)
- **Vault marking:** a **gold sparkle-burst** plays where a `cleopatra` lands and marks a Vault position [t40]; marked cells shift from plain purple to a red background with an ankh/scroll icon [t39].
- **[ASSUMPTION]** Winning symbols pulse/highlight on evaluation; idle symbols are static.

## Ambient & Audio
- Egyptian ambient music pack; toggles: **Ambient Music**, **Sound FX** [t65].
- Base game cycles multiple **day** backgrounds (e.g. bathhouse scene) [t78]; Free Spins uses a **night-temple** scene with ambient touches — a **shooting star** crosses the sky [t73].

## Transitions
- **Free Spins entry:** "CONGRATULATIONS — YOU HAVE WON 10 FREE SPINS" screen [t36], then night-temple scene [t38].
- **Free Spins exit:** cinematic **Cleopatra portrait** transition back to base game [t77].
- **Outro:** round-summary card ("YOU HAVE WON $X IN 10 FREE SPINS") [t41]; **suppressed when "Skip Screens" is enabled** [t96].

## Presentation Event Timeline
| event id | presentation cue | ~duration / easing | evidence |
|---|---|---|---|
| `spin_start` | spin button → active; reels blur in | ~0.1 s | [t23] |
| `reels_spin` | staggered reel motion, turbo fast-blur | [ASSUMPTION] 0.6 s/reel (turbo 0.15 s) | [t34] |
| `reels_land` | reels snap left→right | ~120 ms stagger [ASSUMPTION] | [t34] |
| `ways_evaluate` / `win_present` | itemized win callout ("5X 9 PAYS $2.00 X 2 = $4.00 ON 2 WAYS") + count-up | [ASSUMPTION] 1 s | [t50] |
| `win_tier_banner` | MEGA goddess graphic + falling coins, count-up | ~2–3 s [ASSUMPTION] | [t86][t88] |
| `scatter_check` | scatter symbols glow; near-miss tease at 2 | [ASSUMPTION] 0.5 s | [t35] |
| `fs_trigger` | "10 FREE SPINS" congratulations screen | dismiss-to-continue | [t36] |
| `fs_start` / `vault_init` | night-temple scene; Vault panel shows 0–8/20 | scene fade [ASSUMPTION] 1 s | [t38] |
| `cleopatra_mark` | gold sparkle-burst; cell turns red + ankh icon | ~0.5 s [ASSUMPTION] | [t40][t39] |
| `wild_multiplier_apply` | WILD x2 coin glow contributes to way win | [ASSUMPTION] 0.4 s | [t49] |
| `vault_increment` | Vault value ticks up | [ASSUMPTION] 0.3 s | [t48][t49] |
| `vault_resolve` / `fs_end` | outro summary card (or skipped) → portrait transition | [t77]; skipped if Skip Screens | [t41][t96] |
| `round_end` | balance/credit updates; ambient background may swap | instant | [t78] |

## Juice Moments
- Gold **sparkle-burst** on each Vault key mark [t40].
- **WILD x2** coin land during Free Spins [t49].
- **MEGA** winged-Cleopatra goddess with falling coins [t86].
- Ambient **shooting star** in the night-temple Free Spins scene [t73].
- Cinematic **Cleopatra portrait** exit transition [t77].

## References
- Live play-log [t23][t34][t35][t36][t38][t39][t40][t41][t49][t50][t73][t77][t78][t86][t88][t96]