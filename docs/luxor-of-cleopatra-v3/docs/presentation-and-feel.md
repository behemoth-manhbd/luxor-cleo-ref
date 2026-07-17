# Presentation & Feel

## Sources & Confidence
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
- Observed live this session: base spin, no-cascade resolution, natural + bought free-spins entry, VAULT progress, wild-multiplier orbs, two win tiers (NICE, SENSATIONAL), day→night transition, turbo autoplay, paytable screens.
- NOT observed: full VAULT completion payout, retriggers, win tiers above SENSATIONAL, wild-multiplier values above ×2, exact per-effect durations.
- No math figures appear in this doc — presentation values only.

## Reel Motion & Timing (incl. turbo diff)
- Normal spin: reels drop and settle once; static "ways" resolve, no cascade [t18][t19].
- Speed cycling: normal / quick / turbo available [t12]. Turbo shows heavy motion blur and auto-advances multiple spins rapidly [t33].
- [ASSUMPTION] normal reel settle ~400–600 ms per column, staggered left→right; turbo ~<150 ms — timings not measured.

## Anticipation
- Free-spins entry is heralded by a golden Cleopatra close-up with radiating sparkle particles [t22][t37][t64].
- [ASSUMPTION] scatter anticipation (slow-down on 2 scatters landed) likely but not explicitly observed.

## Win Presentation Tiers
| tier | on-screen threshold | effects | ~duration |
|---|---|---|---|
| Small win | small pays (e.g. $3 on $2) | gold-sparkle highlight on winning symbols, no banner [t16] | ~1 s [ASSUMPTION] |
| NICE! | mid big-win (e.g. $11.47 on $2) | winged-goddess artwork + sparkle particles [t76] | ~2–3 s [ASSUMPTION] |
| SENSATIONAL! | higher big-win (e.g. ~$210 cumulative on $2) | winged Cleopatra/Isis art, full-screen gold coin-shower, fast counter roll-up [t43][t44][t45] | ~3–5 s [ASSUMPTION] |
| (higher tiers) | not observed | likely exist [t-anomaly] | — |

## Cascade & Tumble Feel
- Not observed — no gameplay evidence captured (game has no cascade; board resolves once [t18][t19]).

## Multiplier Effects
`wild_multiplier` lands as a gold-coin orb showing x2; on landing the VAULT value animates upward with a flying "+$" amount. The amount is NOT a fixed +$10 — the in-game rules state it is a random draw from a fixed table of possible values, and the table depends on how many wild_multiplier symbols hit in the same spin (e.g. one hit: 1x/1.5x/2x/2.5x/5x/12.5x/25x/50x bet). The observed +$10 (5x on a $2 bet) was one specific outcome of that draw, not the standard amount.
## Symbol Animations (idle vs win)
- Idle: static symbols on the reel grid [t15].
- Win: winning symbols get a gold-sparkle highlight [t16]; free-spins reel 4/5 can stack cleopatra on a distinct red-bordered "special reel" background [t24][t53].

## Ambient & Audio
- Ambient Music and Sound FX toggles exist in System Settings [t07].
- Base game is a daytime desert scene; free spins shift to nighttime with a visible moon [t24].
- [ASSUMPTION] escalating music sting on NICE/SENSATIONAL banners — not separately confirmed.

## Transitions
- Base → Free spins: golden Cleopatra face fills screen with sparkle particles [t22]; then a parchment/hieroglyph "CONGRATULATIONS! YOU HAVE WON 10 FREE SPINS" scroll with lit torches, "PRESS ANYWHERE TO CONTINUE" [t23].
- Free spins → Base: "LAST FREE SPIN" tag then "FREE SPINS COMPLETED" confirmation [t27][t29]; under turbo the outro can be skipped [t48][t63].

## Presentation Event Timeline
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
| event id | presentation cue | ~duration/easing | evidence |
|---|---|---|---|
| `spin_start` | spin button press, reels release | ~100 ms | [t15] |
| `reels_land` | columns settle left→right, thud | ~400–600 ms ease-out [ASSUMPTION] | [t16] |
| `ways_evaluate` | winning symbols gold-sparkle highlight | ~800 ms | [t16] |
| `win_detect` | win value callout appears | ~500 ms | [t16] |
| `win_present` (small) | sparkle highlight, no banner | ~1 s [ASSUMPTION] | [t16] |
| `win_present` (NICE) | winged-goddess art + sparkles | ~2–3 s [ASSUMPTION] | [t76] |
| `win_present` (SENSATIONAL) | full-screen coin-shower, fast roll-up | ~3–5 s [ASSUMPTION] | [t43][t44][t45] |
| `fs_trigger` | golden Cleopatra sparkle burst | ~1.5 s | [t22][t37] |
| `fs_intro` | parchment scroll + torches, day→night | ~2 s, press-to-continue | [t23][t24] |
| `fs_spin` | auto-advance, remaining counter ticks | auto | [t26] |
| `wild_multiplier_apply` | ×2 gold orb land + glow | ~500 ms | [t26][t40] |
| `vault_update` | +$ value flies up into VAULT meter, mark badge on cell | ~500 ms | [t26][t40] |
| `vault_resolve` | (completion payout not observed) | — | [t41][t78] |
| `fs_end` | "LAST FREE SPIN" → "FREE SPINS COMPLETED" | ~1.5 s (skippable in turbo) | [t27][t29][t48] |
| `round_end` | balance count-up | ~500 ms | [t16] |

## Juice Moments
VAULT "+$ flies into the meter" moment with red key-badge marking of grid cells — the flown-in amount is a random draw from a table (not a fixed +$10); see [[wild_multiplier-mechanics]] for the exact value table.
## References
- Live play-log [t07][t12][t15][t16][t18][t19][t22][t23][t24][t26][t27][t33][t37][t40][t41][t43][t44][t45][t48][t53][t63][t76][t78]
- spec.presentation.winTiers; spec.presentation.anticipation
<<<END>>>

This is all the response, Coder