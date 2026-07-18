# Luxor of Cleopatra — Art Design DNA

> Art contract for the downstream `art-maker`. Every colour below was sampled from the actual gameplay frames listed in the brief; every effect is grounded in the PLAYER LOG (`[tNN]`) or the observations JSON. Values I had to choose for the pipeline (dimensions, easings I could not measure) are marked `[ASSUMPTION]`. Symbol ids come from the spec only.

## Theme identity
- **Game name:** Luxor of Cleopatra (Pragmatic Play, `vswaysladythf`).
- **Theme keyword:** opulent Ancient-Egypt / Cleopatra — a sun-lit palace of gold, lapis and carnelian.
- **tile_style:** `floating`. In the base game every pay symbol (royals, scarab, ring, coin, eye, pyramid Wild) sits directly on a flat royal-purple board with only thin gold vertical column dividers — no per-cell card/brick (`01-loaded.webp`, `base_spin-nowin.webp`). The one exception is the **Cleopatra** symbol, which carries its own maroon framed-portrait card as part of the art. During Free Spins the board switches to **red gold-framed tiles** as a *Vault-marking overlay state* (`free_spins-vault-progress.webp`), not the default presentation.
- **Mood/tone:** regal, warm, celebratory, luxurious; bright daylight opulence in base game flipping to a cooler, jewelled night-temple mystique in Free Spins.

## Art DNA
- **Material / surface:** high-gloss cast gold everywhere (frame, symbol outlines, coin/scarab/ring bodies) with sharp specular hotspots; inset gemstones (carnelian red, amethyst purple, faience turquoise) rendered as polished translucent cabochons; card royals are chunky faceted "gemmed metal" letters with a glassy top sheen. Cleopatra character art is soft painterly-realistic skin.
- **Lighting:** strong warm key from upper-front, warm amber fill bouncing off marble; crisp gold rim on every metal edge. Symbols cast a soft contact shadow onto the purple board. Base game = high-key golden daylight; Free Spins = low-key blue night with warm firelight accents (braziers, fire-lotus).
- **Camera angle:** straight-on, eye-level orthographic board; symbols face the viewer flat (no perspective tilt). Background rooms are painted in gentle one-point perspective.
- **Rendering / finish:** premium 3D-render-over-painted-illustration (Pragmatic house style); crisp anti-aliased edges, rich gradients, heavy bevels, no visible texture noise.
- **shape_language:** rounded-heavy forms — swollen gold bevels, cabochon gems, lotus curves — balanced against the hard triangle of the pyramid Wild and the angular gemmed letters.
- **Outline treatment:** every symbol carries a thick two-step gold outline (bright inner bevel `#E8BF3F` → dark contour `#7A521A`); royals additionally get a dark gem-coloured core edge.
- **Motifs:** winged sun-disk / scarab crest, lotus flower, ankh, Eye of Horus, pyramid, hieroglyph columns, papyrus/palmette capitals, Greek-key (meander) footer band, Anubis jackal, crescent moon + stars, fire-lotus.
- **negative (a clone MUST avoid):** dark/grungy tomb dungeon look; flat matte or cartoon-outline symbols; neon/candy colours; stone-block or wooden reel cards in base game; cluttered per-cell brick grid; cool desaturated palette in the base game (base game is warm-gold, only Free Spins goes cool-blue). Do NOT add tumble/cascade dissolve — this game has **no cascade** (observations `cascade.present:false`).

## Color palette
Background-dominant hue is **warm amber-gold** in base game (~35° H) and **deep night-blue** (~220° H) in Free Spins; the board itself is **royal purple** (~265° H). Symbol colours are bright and saturated (lum ≥120, HSV-sat ≥50%), clearly distinct from the purple board.

| token | hex | sampled from |
|---|---|---|
| `core` (gold) | `#E8BF3F` | grid frame & symbol outlines, base game |
| `spark` (highlight sheen) | `#FBE9A8` | specular hotspot on coin / gold letters |
| `bloom` (deep gold shadow) | `#9A6E22` | underside of scarab / frame shadow |
| `board` (royal purple) | `#43266F` | reel background, `01-loaded.webp` |
| `bg-day` (amber temple) | `#C58A44` | warm palace background |
| `bg-night` (FS sky) | `#132248` | night-temple sky, `free_spins-vault-progress.webp` |
| `panel` (crimson) | `#A81E2A` | Buy-Feature panel + FS marked tiles + win banner base |
| `accent-teal` (faience) | `#2BB8B4` | Cleopatra jewellery, goddess wings |

Supporting accents (also sampled): flame-orange `#F26A1B` (FS fire-lotus / braziers), win-banner magenta gradient `#B32050`→`#7A1030`, "you have won" lavender-pink `#E9B8E0`, moon/star cream `#E8E6D0`.

## Typography
- **Display font vibe:** chiselled Egyptian/Trajan-style ALL-CAPS serif with slab weight — used for the logo, "CONGRATULATIONS!", "FREE SPINS", "MEGA!", "WILD". Fill = brushed-gold vertical gradient (`#FBE9A8`→`#C9971F`); stroke = thick dark-bronze contour (`#5A3A10`, ~4-6px); drop-shadow = soft black at ~40% under a warm inner glow; sparkle glints on stroke corners. "MEGA!" is a heavier 3D-extruded variant with carnelian inlay flecks.
- **Number font:** matching faceted-gold gem numerals (same family as the `9`/`10` royals and all win values). Win-value figures: gold fill (`#F4D24A`) + bright white top sheen + dark contour, seated in a magenta banner. Credit/Bet HUD uses a condensed gold-orange sans (`#E7A22C` label, white value).
- Secondary UI labels ("YOU HAVE WON", "REMAINING SPINS") use a clean bold sans, lavender-pink or white, with a thin dark outline.

## Symbols
Ids are the spec engine ids. `body gradient` = fill of the symbol's primary body; sheen/rim/dominant are sampled hexes. visual_weight 1-5 (higher = higher pay, per `paytable-1.webp`: Cleopatra $10 > Scarab/Ring $8 > Coin/Eye $7 > A/K $6 > Q/J $5 > 10/9 $4). Pixel target ~256². Size multiplier is relative on-board footprint `[ASSUMPTION]`.

| id | display | subject / silhouette | shape_class | body gradient stops | sheen | rim | dominant | tier / weight | size× | px | material_note |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `cleopatra` | Cleopatra | queen portrait in maroon framed card, gold+turquoise collar | ORGANIC | `[[0,#B23A2A],[1,#6E1414]]` | `#F0D0A0` | `#E8BF3F` | `#8E1F1F` | high / 5 | 1.15 | 256 | painterly skin inside a gold-cornered maroon card; the only bricked symbol |
| `scarab` | Winged Scarab | gold scarab beetle, red oval carnelian centre | ORGANIC | `[[0,#F4D46A],[0.5,#D9A63A],[1,#9A6E22]]` | `#FBE7A6` | `#7A521A` | `#D9A63A` | high / 4.5 | 1.08 | 256 | cast-gold gloss, translucent red gem cabochon |
| `ring` | Ankh Ring | gold band, amethyst face bearing a pink ankh | ROUND | `[[0,#F2CE63],[1,#9E7024]]` | `#FCEDB0` | `#7A551C` | `#D9A63A` | high / 4.5 | 1.08 | 256 | polished gold + purple/pink jewel |
| `coin` | Cleopatra Coin | round gold coin, embossed queen profile | ROUND | `[[0,#F3D267],[0.5,#D6AE45],[1,#9A7220]]` | `#FCEEB2` | `#7C5A1E` | `#D6AE45` | high / 4 | 1.04 | 256 | struck-metal relief, rim milling |
| `eye_of_horus` | Eye of Horus | gold wedjat eye, purple/pink gem + green brow | ORGANIC | `[[0,#EFC85C],[1,#9A6E22]]` | `#FBE7A6` | `#7A521A` | `#D9A63A` | high / 4 | 1.04 | 256 | gold with faience-green + magenta inlay |
| `A` | Ace | faceted red letter A, gold outline | ANGULAR | `[[0,#E05A44],[1,#A5271C]]` | `#F6C8A0` | `#E8BF3F` | `#C0392B` | low / 3 | 1.0 | 256 | glassy gemmed metal letter |
| `K` | King | faceted blue letter K, gold outline | ANGULAR | `[[0,#4E93D0],[1,#245C96]]` | `#BFE0F5` | `#E8BF3F` | `#2F6FB0` | low / 3 | 1.0 | 256 | lapis-blue gem letter |
| `Q` | Queen | faceted purple letter Q, gold outline | ANGULAR | `[[0,#9A63C0],[1,#5E3488]]` | `#DCC0EE` | `#E8BF3F` | `#7D4BA8` | low / 2.5 | 1.0 | 256 | amethyst gem letter |
| `J` | Jack | faceted green letter J, gold outline | ANGULAR | `[[0,#5BB050],[1,#2E7A2C]]` | `#C6EBB8` | `#E8BF3F` | `#3F8F3A` | low / 2.5 | 1.0 | 256 | emerald gem letter |
| `T` | Ten | faceted orange "10", gold outline | ANGULAR | `[[0,#E89A3E],[1,#B5691E]]` | `#F8D8A0` | `#E8BF3F` | `#D9822A` | low / 2 | 1.0 | 256 | amber gem numerals |
| `9` | Nine | faceted teal "9", gold outline | ANGULAR | `[[0,#40C6C0],[1,#1E8A88]]` | `#BCEFEC` | `#E8BF3F` | `#2BB0B0` | low / 2 | 1.0 | 256 | turquoise gem numeral |
| `scatter` | Lotus Scatter | white/cream lotus, red gem centre, green leaves, gold base | ORGANIC | `[[0,#FBF3DE],[1,#E6CF9A]]` | `#FFFDF2` | `#C89A3A` | `#F5EAD0` | scatter / 5 | 1.12 | 256 | ceramic-white petals, carnelian core, gold+green base (`modal-bet-panel.webp`) |
| `wild_base` | Pyramid Wild | gold pyramid, purple aura, "WILD" gold text | ANGULAR | `[[0,#F0C24E],[1,#9A6E24]]` | `#FBE7A6` | `#7A521A` | `#E0B040` | wild / 5 | 1.15 | 256 | reels 2-4 only (base); purple radiant glow behind |
| `wild_multiplier` | Wild ×2 Coin | gold coin embossed "WILD", "×2" tag | ROUND | `[[0,#F3D267],[1,#9A7220]]` | `#FCEEB2` | `#7C5A1E` | `#D6AE45` | wild / 5 | 1.08 | 256 | Free-Spins only; struck gold, carries ×2 (`free_spins-wildmultiplier.webp`) |

## Background
- **Composition:** the board occupies the centre; its royal-purple field (`#43266F`, luminance ~55-70) is deliberately dark/muted so bright gold symbols read cleanly. Decorative richness lives at the edges — carved marble columns with papyrus/lotus capitals left & right, an ornate gold reel-frame, and a life-size Cleopatra character standing just outside the right edge.
- **Base variant (day):** warm amber palace interior — pale marble columns, round arches, a turquoise reflecting pool with floating pink lotus, warm god-ray lighting (`01-loaded.webp`). A **second daytime variant** (marble bathhouse/pool) cycles in the base game (log `[t78]`).
- **Free-Spins variant (`_fs`, darker/richer):** night-temple exterior — deep blue starfield sky (`#132248`) with a crescent moon, hieroglyph-carved walls, an Anubis jackal statue, fire braziers, palm silhouette, and Cleopatra holding a fire-wreathed golden ankh staff (`free_spins-vault-progress.webp`, `free_spins-wildmultiplier.webp`). Ambient touch: a shooting star crosses the sky (`[t73]`).
- **Portrait `_sp` variants:** not captured this session — all frames were landscape. `[ASSUMPTION]` recompose each background for portrait by keeping the board centred, stacking the Cleopatra character lower-right and cropping the room wider.
- **Target dims:** PC ~2400×1600 (3:2); SP ~1152×2048 (9:16) `[ASSUMPTION]`.
- **Zone / overlay geometry map** (fractions of canvas height, landscape):
  - Logo band: top-centre, ~0-12%.
  - Board (5×4 grid + gold frame): ~14-70%, horizontally centred ~24-77% width.
  - Win / breakdown text area: overlaps the footer sill, ~86-92% ("WIN $X.XX" + "NX PAYS $Y ON Z WAYS").
  - Controls band: ~90-100% (menu/info/sound left, spin+autoplay+/- right).
  - Character margin: right ~78-100% width; Vault panel occupies left ~0-18% width during Free Spins.

## Grid frame
- **Material / ornament:** ornate cast-gold rectangular frame. Two flanking pilaster columns terminate in painted palmette/lotus capitals (green + lapis-blue + red gem inlay); a jewelled top rail runs blue-and-red cabochons between gold rivets; the bottom sill carries lotus buds, small teal diamonds and a Greek-key (meander) base band.
- **Void:** transparent rectangular centre so the purple board shows through; corners softly rounded.
- **Border budget:** ≤6% of canvas per side; the ornate capitals may bleed slightly above/below the void `[ASSUMPTION]`. Deliver as RGBA PNG/WebP with a fully transparent interior.

## Logo
- **Lettering:** "LUXOR" over "CLEOPATRA" stacked, chiselled gold serif caps with dark-bronze stroke and inner glow; a small Roman "II" / pillar mark below. Crowned by a **winged sun-disk / scarab crest** in gold with lapis-blue and red-gem feathers, set on a dark plaque.
- **Base variant:** as above (warm gold on dark).
- **Free-spins `_fs` variant:** fully-golden, brighter emissive glow version, rendered on a white/transparent matte at ~1024×512 for easy compositing.

## Particles
Fragments a shattering Egyptian tile would throw (for burst/impact effects):
1. **Gold coin fleck** — small spinning disc, gradient `#F3D267`→`#9A7220`, bright rim glint.
2. **Turquoise faience chip** — angular ceramic shard, `#2BB8B4` with a lighter edge.
3. **Red carnelian gem shard** — faceted translucent triangle, `#C8322A` core + `#F6C8A0` highlight.
4. **Gold ankh / hieroglyph glint** — tiny 4-point sparkle or ankh glyph, `#FBE9A8`, additive.

## UI chrome
- **Spin button:** twin circular-arrow glyph in gold (`#E8BF3F`) on a dark disc with a thin gold ring; "AUTOPLAY" label seated below; flanked by grey `−`/`+` bet circles. Base-plate disc ~256².
- **Digit / letter / multiplier glyph sheets (512² cells):** faceted-gold numerals `0-9`, `$`, `.`, `×`, `x2` tag; letters reuse the royal gem-letter treatment. Match the beveled-gold win-value style.
- **Win-tier wordmarks:** `MEGA!` confirmed (`wintier-mega.webp`) — 3D gold extruded caps with carnelian flecks and a star-sparkle burst. Other tiers (Big / Super / Epic) were **not observed** this session — generate as a matched family `[ASSUMPTION]`, do not claim they exist.
- **Payout panel frame + item:** red parchment field (`#A81E2A`) inside an ornate gold frame with a lotus crest at top-centre and blue winged accents at the bottom sill; item rows = gold value text over red (`modal-buy-feature.webp`). Modal chrome uses green toggles/buttons (`#2F9E5C`) and round red or grey `±` steppers.
- **Ambient overlay layers (soft, ~30-60% opacity, centre-clear):** (a) warm god-ray vignette + floating dust motes (day); (b) starfield + moon-glow + occasional shooting-star streak (Free Spins); (c) gentle gold-bloom around a winning cluster.

## Effect and animation vocabulary
Effects below are grounded in the PLAYER LOG / observations. Sheet params list what the build scripts expect; timings are GSAP strings per mode. Where a value was not directly measurable it is `[ASSUMPTION]`.

### 1. Reel drop (top-down staggered stop)
- **Trigger:** every spin. **Technique:** procedural-PIL blur strip + engine tween (no sprite sheet). **Blend:** normal. **Loops:** no.
- Observed: reels 1-5 stop left→right with fast motion blur under turbo; no heavy anticipation "thud" beyond blur/settle (`[t34]`, observations `presentationNotes`).
- **Sheet params:** n/a (engine-driven column translate). Motion-blur strip `{frameWidth:256, frameHeight:256, contentScale:1.0}`.
- **Timing/easing** `{normal:"back.out(1.2)" ~120ms settle bounce per column, staggered ~80ms; quick:"back.out(1.1)" ~70ms/40ms; turbo:"power3.out" ~40ms/20ms}` `[ASSUMPTION on ms]`. squash on land ~0.94→1.0 y, no wobble.
- **Fallback:** hard cut into position with a 1-frame 4px downward overshoot.

### 2. Symbol win highlight + pulse
- **Trigger:** symbol is part of a winning way. **Technique:** procedural-PIL glow ring / additive bloom. **Blend:** `add` (glow on black). **Loops:** yes while win shown.
- Grounded in the itemised win presentation (`[t50]` "5X 9 PAYS $2.00 X 2 = $4.00 ON 2 WAYS"); exact pulse curve `[ASSUMPTION]`.
- **Sheet params:** `{frames:16, frameWidth:288, frameHeight:288, cols:4, rows:4, fps:24, durationMs:666, anchor:{x:0.5,y:0.5}, loop:true, contentScale:1.1}`, glow-softness knob, seed n/a.
- **Timing:** `{normal:"sine.inOut" 1.0→1.08→1.0 scale pulse; quick/turbo:"sine.inOut" faster 400ms}`. wobble ±1°.
- **Palette:** `#FBE9A8` core → `#E8BF3F` → transparent.
- **Fallback:** draw a 6px `#FBE9A8` @55% additive rounded-rect halo behind the symbol, breathing 1.0↔1.06.

### 3. Floating win-value callout + way-breakdown ticker
- **Trigger:** win resolves. **Technique:** baked text sprite + engine tween. **Blend:** normal. **Loops:** no.
- Observed: flat "WIN $X.XX" gold banner rises at the footer, with itemised "NX [sym] PAYS $Y ON Z WAYS" line beneath (`[t24]`, `[t50]`).
- **Sheet params:** value rendered live; banner plate `{frameWidth:512, frameHeight:160, anchor:{x:0.5,y:0.5}}`.
- **Timing:** `{normal:"back.out(1.6)" pop-in 220ms + count-up "power1.out"; quick:"back.out(1.4)" 140ms; turbo:"power2.out" 80ms, count-up skipped}`. squash 1.15→1.0.
- **Palette:** gold `#F4D24A` on magenta `#B32050` plate, gold rim.
- **Fallback:** static gold number, fade-in 150ms, no count-up.

### 4. Wild-multiplier land + glow + ×2 apply (Free Spins)
- **Trigger:** `wild_multiplier` coin lands in FS (`[t49]` "$22.00 win", `free_spins-wildmultiplier.webp`). **Technique:** baked sprite-sheet flare + engine. **Blend:** `add`. **Loops:** land no, idle-glow yes.
- **Sheet params:** `{frames:20, frameWidth:320, frameHeight:320, cols:5, rows:4, fps:30, durationMs:666, anchor:{x:0.5,y:0.5}, loop:false, contentScale:1.2}` + starburst-rays knob, particle-size, seed.
- **Timing:** land `{normal:"back.out(2.0)" 260ms drop-slam; quick:"back.out(1.6)" 160ms; turbo:"power3.out" 90ms}`; "×2" tag pop `back.out(3)` overshoot 1.4→1.0. multiplicative-combine flash when 2+ join a way.
- **Particle:** gold coin flecks, per-cell 8-12, lifetime 500ms, gravity +260px/s.
- **Palette:** `#FCEEB2`/`#E8BF3F` gold, warm rim.
- **Fallback:** radial gold gradient flash + a bold "×2" tag scaling in.

### 5. Vault-mark sparkle burst (Cleopatra → key medallion)
- **Trigger:** a Cleopatra symbol lands on an unmarked cell in FS and marks a Vault position; cell flips to red gold-framed tile with an ankh/key medallion, counter increments (`[t39]`, `[t40]` "gold sparkle-burst"). **Technique:** procedural-PIL sparkle + tile crossfade. **Blend:** `add` over the tile. **Loops:** no.
- **Sheet params:** `{frames:14, frameWidth:256, frameHeight:256, cols:7, rows:2, fps:28, durationMs:500, anchor:{x:0.5,y:0.5}, loop:false, contentScale:1.0}` + spark-count knob, seed.
- **Timing:** `{normal:"power2.out" 380ms + tile tint crossfade "sine.inOut" 250ms; quick 240ms; turbo 130ms}`. tiny 1.06 pop on the medallion.
- **Particle:** gold ankh/hieroglyph glints, 10-16, lifetime 450ms, slight upward drift.
- **Palette:** gold `#E8BF3F`/`#FBE9A8`, tile turns `#A81E2A` with gold frame.
- **Fallback:** swap tile to red-framed sprite + one static 8-point gold star.

### 6. Free-spins portal / trigger card
- **Trigger:** 3+ scatters land (`[t36]`); "CONGRATULATIONS! YOU HAVE WON 10 FREE SPINS" purple hieroglyph card with gold scroll frame, blue winged accents, fire-lotus flanking (`free_spins-trigger.webp`, `free_spins-buytrigger.webp`). **Technique:** AI image-to-video (cinematic card reveal) or baked sheet. **Blend:** normal + additive sparkle layer. **Loops:** the fire-lotus flicker loops; card reveal no.
- **Sheet params (sparkle layer):** `{frames:24, frameWidth:1280, frameHeight:640, cols:6, rows:4, fps:24, durationMs:1000, anchor:{x:0.5,y:0.5}, loop:false, contentScale:1.0}`.
- **Timing:** card `{normal:"back.out(1.4)" scale-up 400ms + "power2.out" darken bg; quick 260ms; turbo skipped when Skip Screens on (`[t96]`)}`. "10" value pops `back.out(2)`.
- **Particle:** gold flecks + fire embers from the lotus torches (orange `#F26A1B`).
- **Palette:** purple `#43266F` field, gold frame `#E8BF3F`, lavender-pink title `#E9B8E0`, magenta value banner `#B32050`.
- **Fallback:** static purple card fades in 300ms with gold "10 FREE SPINS".

### 7. Win-tier escalation — MEGA (winged-goddess + coin shower + count-up)
- **Trigger:** win crosses the MEGA threshold (~8.49× observed, `[t86]`/`[t88]`, `wintier-mega.webp`). **Technique:** AI image-to-video hero (winged-Cleopatra goddess) + baked coin-shower sheet + count-up. **Blend:** hero normal, sparks/rays `add`. **Loops:** background fire-burst loops during count-up.
- **Sheet params (coin shower):** `{frames:30, frameWidth:1280, frameHeight:720, cols:6, rows:5, fps:30, durationMs:1000, anchor:{x:0.5,y:1.0}, loop:true, contentScale:1.0}` + coin-count knob, seed. Wordmark `MEGA!` as its own baked `winning_text_mega.webp`.
- **Timing:** wordmark slam `{normal:"back.out(2.2)" 320ms; quick 200ms; turbo 110ms}`; value count-up "power1.out" ~1.5s (observed $16.98→$44.57→$63.04). squash 1.25→1.0, ±2° wobble on impact.
- **Particle:** falling gold coins, ~24 concurrent, lifetime 1.4s, gravity +420px/s, plus radial gold sparks.
- **Palette:** gold `#F4D24A` wordmark, turquoise+lapis+gold goddess wings (`#2BB8C0`/`#2F5FC0`/`#E8C04A`), radial fire-orange `#F26A1B`→`#B31E10` backdrop, blue halo `#22357A`, magenta value banner.
- **Fallback:** static `MEGA!` wordmark + count-up number, gold radial gradient behind, no goddess.

### 8. Free-spins outro card
- **Trigger:** FS round ends (unless Skip Screens on) — "CONGRATULATIONS / YOU HAVE WON $X IN 10 FREE SPINS" (`free_spins-outro.webp`, `free_spins-outro2.webp`, `free_spins-buyoutro.webp`). Same frame family as #6. **Technique:** baked card + engine. **Blend:** normal. **Loops:** fire-lotus flicker loops.
- **Timing:** `{normal:"back.out(1.4)" 400ms + value count-up; quick 240ms; turbo/SkipScreens: card omitted (`[t96]`)}`.
- **Palette / fallback:** as #6, value in magenta banner.

### 9. Ambient loops (Free-Spins atmosphere)
- **Trigger:** always during FS. **Technique:** procedural-PIL / looped sheet. **Blend:** `add` for star + fire glow. **Loops:** yes.
- Elements: shooting-star streak crossing the sky (`[t73]`), soft moon-glow, twinkling starfield, flickering fire-lotus torches + braziers (orange `#F26A1B`).
- **Sheet params (shooting star):** `{frames:18, frameWidth:512, frameHeight:256, cols:6, rows:3, fps:24, durationMs:750, anchor:{x:0,y:0}, loop:false (fires intermittently), contentScale:1.0}`.
- **Timing:** star `"power1.in"` diagonal ~700ms; torch flicker `"sine.inOut"` random 300-600ms.
- **Fallback:** static starfield + a slow `#F26A1B` opacity pulse on torch sprites.

### 10. Cleopatra portrait transition (FS exit)
- **Trigger:** exiting Free Spins back to base game — cinematic Cleopatra portrait wipe (`[t77]`). **Technique:** AI image-to-video or baked sheet wipe. **Blend:** normal. **Loops:** no.
- **Sheet params:** `{frames:24, frameWidth:1280, frameHeight:720, cols:6, rows:4, fps:24, durationMs:1000, anchor:{x:0.5,y:0.5}, loop:false, contentScale:1.0}`.
- **Timing:** `{normal:"power2.inOut" 900ms; quick 500ms; turbo/SkipScreens: skipped}`.
- **Fallback:** 350ms cross-fade between FS and base backgrounds.

### 11. Anticipation slowdown (weak / near-absent)
- **Trigger:** would fire on scatter tease. Observed as **minimal** — no strong reel-stop escalation beyond blur/settle (observations `presentationNotes`; near-miss noted `[t35]`).
- **Technique:** procedural (last-reel slowdown). **Blend:** normal. **Loops:** no.
- **Timing:** `{normal:"power2.in" +150ms on reel 5 when 2 scatters already shown; quick +80ms; turbo none}` `[ASSUMPTION]`. Optional soft gold rim-pulse on landed scatters.
- **Fallback:** none (standard stop).

## Render constants
Feed `presentation_config.json` (fractions unless noted; measured from `01-loaded.webp`, refined values `[ASSUMPTION]`):
- `grid_cols`: 5, `grid_rows`: 4, `ways`: 1024.
- `grid_area_ratio`: 0.53 (board width ÷ canvas width).
- `tile_size_ratio`: 0.92 (symbol footprint within its cell).
- `col_gap_frac`: 0.018, `row_gap_frac`: 0.006 (symbols stack nearly flush vertically; reels separated by thin gold dividers).
- `column_divider_alpha`: 0.35 (thin gold vertical lines `#E8BF3F`).
- `grid_overlay`: `#43266F` @ 1.0 base-game board; Free-Spins per-cell overlay = purple (unmarked) / `#A81E2A` gold-framed (marked).
- `grid_glow`: `#8A3FBF` @ 0.15 soft inner glow around the board rim.
- `board_hue_base`: royal-purple `#43266F`; `board_hue_fs_marked`: crimson `#A81E2A`.
- `footer_chrome`: base-plate marble/gold `#CBB98A` with Greek-key band `#1E140A`/`#E8BF3F`; credit label `#E7A22C`, bet label `#E8BF3F`, values white `#F5F0E6`.
- `character_margin_right`: reserve ~0.20 canvas width for the Cleopatra figure (do not overlap the board).

## Target build pipeline
Tell the `art-maker` to produce assets via:

**Asset pipeline** — `/Users/macos/apps/kerberos/slot-game/slot-sugar-rush/pipeline`
- Follow the executor recipe / FidelityDoctrine / `_seed_configs.py` contract: emit **WebP** assets with **JSON atlas sidecars**.
- Target dirs: `tiles/`, `chrome/`, `specials/`, `particles/`, `gridBackgrounds/`.
- Per-step generation config shape:
  `{recipe, variants:[{logical_name, prompt_suffix, color_mode, aspect_ratio, processor_chain}], encode:{format:"webp", quality:90}}`.
- `color_mode:"rgba"` for tiles/chrome/particles (transparent), `"rgb"` for backgrounds; `aspect_ratio` `1:1` for tiles, `3:2` (PC) / `9:16` (SP) for backgrounds, `2:1` for logo.

**Effect-build showcases** — `/Users/macos/apps/kerberos/slot-game/slot-showcases`
- Use the procedural `gen_*.py` effect scripts + `demo-sugar-rush/src/render/animation-timings.ts` (timing DB) + `asset-manifest.ts` naming: `tile_<id>.webp`, `spritesheet_<name>.{webp,json}`, `winning_text_<tier>.webp`.
- Register the sheets from §Effect vocabulary (`spritesheet_win_glow`, `spritesheet_wildmult_land`, `spritesheet_vault_mark`, `spritesheet_coin_shower`, `spritesheet_shooting_star`, `spritesheet_portrait_wipe`) with the `{frames, frameWidth, frameHeight, cols, rows, fps, durationMs, anchor, loop, contentScale}` params above.

**Per-symbol `logical_name` → target filename** (spec id → file):
| spec id | logical_name | filename |
|---|---|---|
| `cleopatra` | cleopatra | `tiles/tile_cleopatra.webp` |
| `scarab` | scarab | `tiles/tile_scarab.webp` |
| `ring` | ring | `tiles/tile_ring.webp` |
| `coin` | coin | `tiles/tile_coin.webp` |
| `eye_of_horus` | eye_of_horus | `tiles/tile_eye_of_horus.webp` |
| `A` | royal_a | `tiles/tile_A.webp` |
| `K` | royal_k | `tiles/tile_K.webp` |
| `Q` | royal_q | `tiles/tile_Q.webp` |
| `J` | royal_j | `tiles/tile_J.webp` |
| `T` | royal_t | `tiles/tile_T.webp` |
| `9` | royal_9 | `tiles/tile_9.webp` |
| `scatter` | scatter_lotus | `specials/tile_scatter.webp` |
| `wild_base` | wild_pyramid | `specials/tile_wild.webp` |
| `wild_multiplier` | wild_multiplier | `specials/tile_wild_multiplier.webp` |

Chrome/specials also emit: `chrome/logo.webp` + `chrome/logo_fs.webp`, `chrome/grid_frame.webp`, `chrome/spin_button.webp`, `chrome/vault_panel.webp`, `winning_text_mega.webp`, `gridBackgrounds/bg_day.webp` + `gridBackgrounds/bg_bathhouse.webp` + `gridBackgrounds/bg_fs_night.webp` (+ `_sp` portrait variants), and the four `particles/` fragments from §Particles.
`<<<END>>>`

This is all the response, Coder