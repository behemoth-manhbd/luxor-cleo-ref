# Math & RTP

## Base RTP
- **Base RTP: 96.51% — estimated (confidence: 0.5, sources: 4).**
- Alternate RTP configurations available: **94.56% / 95.51% / 96.51%** — estimated (confidence: 0.5, sources: 4).
- **RTP with Buy Free Spins: 96.56% — estimated (confidence: 0.5, sources: 4).**

### How RTP is achieved
RTP is driven by the reel-strip symbol weights/distribution, which are proprietary and NOT derivable from any evidence (confidence: 0.05) — no weights are shown on any info screen. The paytable in the next section, however, is the REAL paytable read directly from the in-game info screens (paytable-1/paytable-2), not an estimate; a codegen implementation must still supply placeholder reel-strip weights and tune them until simulated return matches the confirmed 96.51%/96.56% RTP figures.
## Full Paytable
Actual paytable (paytable-1/paytable-2, at $2.00 total bet, converted to total-bet multiplier): cleopatra 2=0.25x/3=2.5x/4=3.75x/5=5x; scarab 2=0.1x/3=2x/4=3x/5=4x; ring 2=0.1x/3=2x/4=3x/5=4x; coin 3=1x/4=2.5x/5=3.5x; eye-of-horus 3=1x/4=2.5x/5=3.5x; a 3=0.25x/4=1.5x/5=3x; k 3=0.25x/4=1.5x/5=3x; q 3=0.15x/4=1x/5=2.5x; j 3=0.15x/4=1x/5=2.5x; 10 3=0.15x/4=0.5x/5=2x; 9 3=0.1x/4=0.5x/5=2x. `wild-pyramid` has no own paytable (pure substitute). The wild-multiplier symbol carries its own paytable instead: 2=0.5x/3=5x/4=12.5x/5=25x.
## Volatility, Max Win, Hit Frequency
| Field | Value |
|---|---|
| Volatility | **Medium** (derivable, confidence: 0.9) |
| Max win | **12,500× total bet — estimated (confidence: 0.5, sources: 4)** |
| Hit frequency | **~42% — estimated (confidence: 0.5, sources: 2)** |

## Provenance / Derivability Note
| Figure | Derivability | Confidence |
|---|---|---|
| Volatility (medium) | derivable | 0.9 |
| Grid type/rows/cols/symbols | derivable | 0.9 |
| baseRTP 96.51% / Buy Free Spins RTP 96.56% | **confirmed** (in-game info screen) | 0.95 |
| maxWinX 12,500× | **confirmed** (in-game info screen) | 0.95 |
| hitFrequency 42% | estimated | 0.5 |
| paytable pays | **confirmed** (in-game paytable screens) | 0.95 |
| symbol weights | not-derivable | 0.05 |
## References
- spec.math (baseRTP, maxWinX, hitFrequency, volatility, paytable, rtpConfigurations)
- https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vswaysladythf (paytable screen: 96.51% base / 96.56% buy)
- https://www.bigwinboard.com/luxor-of-cleopatra-pragmatic-play-slot-review/
- https://newslotgames.net/pragmatic-play/luxor-of-cleopatra.html
- https://casino.guru/cleopatra-slot-math
- https://www.freeslots99.com/blog/what-is-cleopatra-volatility-level-and-what-does-it-mean-for-your-gameplay/
- https://slots.info/pragmatic-play/luxor-of-cleopatra/