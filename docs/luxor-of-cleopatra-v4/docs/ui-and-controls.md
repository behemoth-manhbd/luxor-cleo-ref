# UI & Controls

## Controls
| control | function | states | open/close flow | evidence |
|---|---|---|---|---|
| Spin (circular arrows, bottom-center) | start a spin | idle / spinning (red stop icon during autoplay) | tap to spin; HOLD SPACE for turbo | [t08][t23][t33] |
| Autoplay (label/icon below spin) | run N auto spins | idle / running ("AUTO SPINS LEFT n"); tap label to cancel | click AUTOPLAY → settings modal → Start; click label to stop | [t27][t33][t55][t56] |
| Buy Feature (top-left button) | buy Free Spins entry (30× bet) | enabled (idle) / **disabled during autoplay** | click → Buy Feature modal | [t08][t55][t57] |
| Bet +/- (flanking spin) | adjust bet | min $0.20 / max $240.00 | tap +/-; '+' opens Bet Multiplier panel | [t08][t99][t100] |
| Bet Multiplier panel | set Bet / Coin Value / Total Bet (×20) | stepper values; Bet Max | open via '+' bet icon; close X | [t100] |
| Sound (bottom-left icon) | toggle audio | on / off | tap toggles; granular toggles in System Settings | [t08][t65] |
| Info / Paytable ("i" icon) | show game rules (6 pages) | pages 1–6 | tap "i" → paginate via green arrows → X to close | [t09][t10][t21][t22] |
| Menu / System Settings (hamburger) | settings & history | modal open/closed | tap hamburger → modal → X | [t64][t65] |
| Spin-speed cycle / Turbo | faster spins | Turbo / Quick Spin (mutually exclusive) | in Autoplay Settings; HOLD SPACE for turbo | [t08][t28][t81] |
| Credit / Balance display | show balance | live value (e.g. $100,000.00) | passive | [t08][t24] |
| Win display | show last win | value / idle "PLACE YOUR BETS!" | passive | [t24][t26] |
| Bet display | show current total bet | value (e.g. $2.00) | passive | [t08] |

## Buttons
> [UNVERIFIED] Not corroborated by gameplay screenshots or observations; retained from spec/research.
**Not observed — no `ui inventory — buttons` block captured.** Individual buttons are documented above in the ## Controls table from the play-log (spin, autoplay, buy feature, bet +/-, sound, info, hamburger). No per-button icon/location inventory was enumerated by the probe.

## Modals
| modal | trigger | contents | inner controls | close method | screenshot |
|---|---|---|---|---|---|
| Autoplay Settings | click AUTOPLAY label/icon while idle | Turbo Spin / Quick Spin / Skip Screens checkboxes (Turbo & Quick Spin mutually exclusive); autospin slider (verified ≥100; instructions up to 1000); Start Autoplay | 3 checkboxes, count slider, Start button | X icon or Start Autoplay | not saved (canvas) [t28][t30] |
| Buy Feature panel | click Buy Feature button | Cost display ($60.00 at $2.00 bet), confirm/cancel | Confirm (YES) / Cancel | X icon or confirm purchase | not saved [t57] |
| System Settings | click hamburger menu icon | Battery Saver toggle, Ambient Music toggle, Sound FX toggle, Intro Screen toggle, Game History link, Total Bet control | 4 toggles, Game History link, Total Bet control | X icon | not saved [t65] |
| Bet Multiplier panel | click '+' bet icon | Bet stepper, Coin Value stepper, Total Bet stepper, Bet Max; header "BET MULTIPLIER 20x" (Total Bet = Bet × Coin Value × 20) | 3 steppers, Bet Max button | X icon | not saved [t100] |
| Info / Paytable | click "i" icon | 6 pages: rules, symbols/multiplier wild, Vault, RTP/volatility/bet range, how-to-play, settings/bet menu | green ◀ ▶ pagination | X icon | paytable-1..6.png [t10–t21] |

**Notes:** No ante-bet/special-bet mode exists (the "+" opens a Bet Multiplier panel, not an ante toggle) [t100]. No native browser dialogs were triggered. Game History modal was not opened (time budget) [t64].

## References
- Live play-log [t08][t10][t21][t22][t27][t28][t55][t57][t64][t65][t99][t100]