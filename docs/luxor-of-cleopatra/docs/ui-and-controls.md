# UI & Controls — Luxor of Cleopatra

> No math figures in this doc. Behaviour from `ui.controls` + the live play-log; unobserved detail reads "Not observed".

| control | function | states | open/close flow | evidence |
|---|---|---|---|---|
| **Spin** | Start a spin | idle / spinning | Center circular button; also SPACE / ENTER keys | `[t07]`,`[t19]` |
| **Bet +/-** | Open bet menu (Bet Multiplier, Bet, Coin Value, Total Bet, Bet Max) | menu open/closed | `+`/`-` open the bet panel; adjust; close panel | `[t07]`,`[t59]` |
| **Bet selector (in panel)** | Set total bet within range 0.20–240.00 (min/max per paytable) | stepped values | Inside bet panel; "Bet Max" jumps to top | `[t14]`,`[t59]` |
| **Ante / special bet** | **None** — confirmed absent (standard Bet Multiplier/Bet/Coin Value/Total Bet/Bet Max only) | n/a | Checked via bet panel, no ante mode | `[t59]` |
| **Autoplay** | Open Autoplay Settings; run/stop auto spins | idle / running | AUTOPLAY button opens panel; click again to stop mid-run | `[t35]`,`[t37]`,`[t38]` |
| **Autoplay Settings panel** | Set spin count (up to 100) + Turbo Spin / Quick Spin / Skip Screens toggles | toggles on/off; slider 1–100 | Opened from AUTOPLAY; stop conditions beyond count/toggles **Not observed** | `[t37]` |
| **Spin-speed toggle** | Cycle Normal Speed / Quick Spin / Turbo Spin | 3 states | Cycling icon; also "HOLD SPACE FOR TURBO SPIN" | `[t07]`,`[t40]` |
| **Sound** | Toggle sound/music | on / off | Speaker icon | `[t07]`,`[t09]` |
| **Info / (i) — Game Rules / Paytable** | Open the 6-page Game Rules/Paytable overlay | open/closed, pages 1–6 | (i) icon opens; page through 1→6; paytable is pages 1–3; close overlay | `[t11]`–`[t16]` |
| **Menu / System Settings** | Hamburger menu: Total Bet, Intro Screen toggle, Ambient Music, Sound FX, Game History | menu open/closed | Hamburger icon opens System Settings; close | `[t10]` |
| **Buy Feature** | Purchase free spins (30× total bet) via guaranteed 3-scatter trigger | button + confirm dialog | Persistent bottom-left button → cost panel → Yes/No confirm | `[t17]`,`[t18]`,`[t26]` |
| **Balance / Credit display** | Show player credit | live value | Read-only readout | `[t07]`,`[t20]` |
| **Win / Total-bet display** | Show current win and total bet | live values | Read-only readout | `[t20]`,`[t21]` |
| **Free-spins counter** | Show remaining free spins + Vault during round | live during FS | Appears on `fs_start`, hides on `fs_end` | `[t30]`,`[t31]` |

- **Help/paytable pagination:** 6 pages — 1 symbol pays, 2 WM/scatter/FS trigger, 3 Vault/max-win/Buy, 4 RTP/volatility/bet range, 5 how-to-play controls, 6 settings + max-win restatement `[t11]`–`[t16]`.
- **Autoplay stop conditions** beyond spin count and the three toggles were **Not observed**.

## References
- paytable-5.png, paytable-6.png, autoplay-panel.png, buy-feature-panel.png
- Play-log `[t07]`,`[t09]`,`[t10]`,`[t11]`–`[t18]`,`[t35]`–`[t38]`,`[t59]`