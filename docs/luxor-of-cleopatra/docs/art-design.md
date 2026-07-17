# Luxor of Cleopatra — Art Design DNA

> Art-DNA contract for the downstream `art-maker` agent. Every visual claim below is sampled from the real gameplay screenshots under `output/luxor-of-cleopatra/screenshots/` or narrated by the player-POV log (`[tNN]`). Values I had to choose for the build (dimensions, easings, frame counts I could not measure) are tagged `[ASSUMPTION]`. Symbol ids come from the spec only.

## Theme identity

- **Game name:** Luxor of Cleopatra (Pragmatic Play, `vswaysladythf`).
- **Theme keyword:** opulent Egyptian temple / Cleopatra treasure vault.
- **tile_style:** `floating` — in the base game symbols are rendered as free-standing gilded icons/letters directly on a flat deep-purple board with only thin gold column dividers; there is NO opaque per-symbol card (`01-loaded.webp`, `win-small-3ways.webp`). Note: during Free Spins each occupied cell gains a per-state fill tile — **crimson** when the position is "marked/collected" and **purple** when not (`multiplier-stacked-x2x2.webp`, `freespins-transition-flash.webp`) — but the default symbol art must read as a floating icon on transparent.
- **Mood/tone:** regal, warm, luxurious, gold-drenched; sultry temple-at-dusk glamour in the base game, cooler mysterious night-desert reverence in Free Spins. High-gloss "premium AAA slot" finish, not gritty or archaeological.

## Art DNA

- **Material / surface:** thick polished **gold** everywhere — frames, letters, symbol bodies — with mirror-bright specular hotspots and engraved relief. Gems are faceted translucent cabochons (ruby-red, amethyst-purple, emerald-green, turquoise). Symbols are opaque and dimensional (sculpted 3D-render look), never flat vector.
- **Lighting:** warm key from upper-front (temple torchlight); soft golden fill; strong **rim/edge light** picking out every gold contour. Symbols carry a subtle drop shadow to lift them off the purple board. Overall high dynamic range — deep shadows, blown-out gold highlights.
- **Camera angle:** straight-on, eye-level, orthographic-ish board; ambient scene has a slight one-point perspective into a temple hall / courtyard.
- **Rendering / finish:** painterly-photoreal 3D render, glossy, high-contrast, heavy bloom on gold and flame.
- **shape_language:** rounded-luxurious for premiums (scarab, coin, ring, lotus) balanced by hard geometric icons (pyramid wild, angular card letters). Ornament is symmetrical and heraldic.
- **Outline treatment:** every symbol and letter carries a **gold bevel-and-outline** (2-tone: bright gold edge + dark inner line) that separates it from the purple field.
- **Motifs:** lotus flowers, papyrus/lotus column capitals, falcon/Horus wings, ankh, Eye of Ra/Horus, scarab, pyramids, hieroglyph friezes, Anubis jackal statues, crescent moon, cloisonné gem inlay (red/blue/green triangles).
- **negative (a clone must AVOID):** flat matte "mobile-casual" vector icons; dusty desaturated sand tones as the primary palette; cartoon/chibi proportions; neon cyberpunk; realistic photographic mummies/gore; a non-purple play field (the royal-purple board is signature); losing the gold bevel outline.

## Color palette

Background-dominant hue is **royal purple** on the play surface (base board), wrapped by a warm-gold sandstone ambient scene (day) that swaps to a deep night-blue in Free Spins. Hex sampled from the frames noted.

| token | hex | sampled from | role |
|---|---|---|---|
| `core` (gold) | `#E3AC3C` | gold frame/letters, `01-loaded.webp` | primary symbol & chrome metal |
| `spark` (gold-hi) | `#FBE9AC` | specular hotspots on frame, `buy-feature-panel.webp` | highlights, sparkles |
| `bloom` (win-magenta) | `#C41E56` | win-value pill, `freespins-intro.webp` | win callout / celebratory pink-red |
| `ray-cycle` (turquoise) | `#2FB2A6` | Cleopatra collar & pool, `win-small-3ways.webp` | jewel/accent + pool water |
| `bg` (board purple) | `#3D2168` | reel field, `01-loaded.webp` | dominant play-surface hue |
| `bg-night` (FS sky) | `#142A55` | night sky, `freespins-wildmultiplier.webp` | Free-Spins ambient |
| `panel` (crimson) | `#A31C2A` | FS marked cell / red UI, `multiplier-stacked-x2x2.webp` | marked-state tile, red plates |
| `panel-edge` (dark gold) | `#C7982F` | frame shadow line, `wintier-nice.webp` | panel borders / dividers |

Symbol face colours (all meet luminance ≥120, HSV-sat ≥50%, and read against the purple bg): gold `#E3AC3C`, ruby `#C0261F`, amethyst `#7E36A6`, emerald `#3FA45A`, turquoise `#2FB2A6`, and the letter hues below.

## Typography

- **Display / title font:** heavy Trajan-style Roman serif, all-caps, deep bevel, gold fill with a warm red-to-gold vertical gradient, thick dark-brown/black stroke and soft outer glow; used for the "LUXOR / CLEOPATRA" logo and "CONGRATULATIONS!" banner (`freespins-intro.webp`). "CONGRATULATIONS!" is bright gold `#F5C518` with a darker gold outline; "YOU HAVE WON" / "FREE SPINS" are lavender-pink `#E7B7E6` with a purple stroke.
- **Number font:** chunky rounded gold slab numerals with bevel + dark outline for win values (`WIN $18.20` on the magenta pill, gold digits `#F3C63E`). The bottom-bar readout (`CREDIT` / `BET` / `WIN`) uses a condensed sans: labels in muted gold small-caps, values in white/gold.
- **Symbol letters (9,10,J,Q,K,A):** bold condensed serif, each a distinct saturated colour with a gold bevel outline and inner sheen (see Symbols).
- Fill = colour gradient; stroke = 2px+ dark edge; drop-shadow = soft warm shadow beneath, tight.

## Symbols

Keyed by spec engine id. Gradient stops are `[[offset,hex]…]`. Sizes are relative multipliers (higher tier = larger on the board). Pixel target ~256².

| id | display name | subject / silhouette | shape_class | body gradient | sheen | rim/edge | dominant | tier / weight | size× | material_note |
|---|---|---|---|---|---|---|---|---|---|---|
| `cleopatra` | Cleopatra | crowned queen portrait in a gold-framed red card | ANGULAR | `[[0,#7A1622],[1,#B0242E]]` | `#F3D68A` | `#E3AC3C` | `#B0242E` | high / 5 | 1.35 | framed portrait; black hair, turquoise beaded collar, gold headband; top premium & FS Vault "key" |
| `scarab` | Scarab Beetle | winged gold scarab, ruby oval set in body | ORGANIC | `[[0,#C98A2A],[1,#F4D26A]]` | `#FCEFB6` | `#B57E1E` | `#E3AC3C` | high / 4 | 1.22 | polished gold beetle, red cabochon `#C0261F` centre |
| `ring` | Ankh Ring | gold band ring with amethyst gem carrying a purple ankh | ROUND | `[[0,#C68F2C],[1,#F2D273]]` | `#FBE7A6` | `#B47E20` | `#7E36A6` | high / 4 | 1.15 | gold band, faceted amethyst face `#7E36A6`, pink glints |
| `coin` | Gold Coin | round gold coin with pharaoh/falcon profile relief | ROUND | `[[0,#B9821F],[1,#F0CE63]]` | `#FCEFB6` | `#8F6417` | `#E3AC3C` | high(mid) / 4 | 1.10 | struck-coin relief, milled edge |
| `eye_amulet` | Eye of Ra Amulet | curved gold Eye of Horus with purple gem + red drop | ANGULAR | `[[0,#C68C26],[1,#F2CE63]]` | `#FBE7A6` | `#8F6417` | `#7E36A6` | high(mid) / 4 | 1.10 | winged-eye amulet, amethyst pupil `#7E36A6`, ruby teardrop |
| `ace` | Ace (A) | serif "A" | ANGULAR | `[[0,#8E241C],[1,#D14A38]]` | `#F6C7A0` | `#E3AC3C` | `#C0362C` | low / 2 | 0.95 | red letter, gold bevel outline |
| `king` | King (K) | serif "K" | ANGULAR | `[[0,#1E4E86],[1,#3E86C6]]` | `#BFE0F5` | `#E3AC3C` | `#2E6FB0` | low / 2 | 0.95 | blue letter, gold bevel |
| `queen` | Queen (Q) | serif "Q" | ANGULAR | `[[0,#5A2A82],[1,#9B54C0]]` | `#E4C4F2` | `#E3AC3C` | `#7B3FA0` | low / 1.8 | 0.92 | purple letter, gold bevel |
| `jack` | Jack (J) | serif "J" | ANGULAR | `[[0,#2E7226],[1,#5FB84A]]` | `#CDEEBB` | `#E3AC3C` | `#4E9E3E` | low / 1.7 | 0.90 | green letter, gold bevel |
| `ten` | Ten (10) | serif "10" | ANGULAR | `[[0,#A66A1E],[1,#E4A238]]` | `#FBE1A0` | `#E3AC3C` | `#D8912E` | low / 1.5 | 0.90 | amber letter, gold bevel |
| `nine` | Nine (9) | serif "9" | ANGULAR | `[[0,#1C7E7A],[1,#3FBCB2]]` | `#BEF0EA` | `#E3AC3C` | `#2FA5A0` | low / 1.5 | 0.88 | teal letter, gold bevel |
| `wild` | WILD (pyramid) | gold pyramid with "WILD" band, purple radiant glow | ANGULAR | `[[0,#B8801E],[1,#F5DC85]]` | `#FCEFB6` | `#8F6417` | `#E3AC3C` | wild / 5 | 1.25 | base-game only (reels 2-4); purple `#7E36A6` starburst glow behind |
| `wild_multiplier` | WILD ×2 (coin) | gold coin, "WILD" text over falcon relief, golden aura | ROUND | `[[0,#B9821F],[1,#F3D46E]]` | `#FCF2C6` | `#8F6417` | `#E3AC3C` | wild / 5 | 1.20 | Free-Spins only; carries fixed ×2, stacks ×; distinct golden glow/sparkle on land (`[t33]`,`[t49]`,`multiplier-stacked-x2x2.webp`) |
| `scatter` | Lotus Scatter | open lotus, jeweled red+green centre on gold base | ORGANIC | `[[0,#F6ECDD],[1,#E6A6C2]]` | `#FFFFFF` | `#E3AC3C` | scatter / 5 | 1.30 | white-to-pink petals, ruby `#C42030` + emerald `#3FA45A` core, gold sepals; 3+ triggers FS |

## Background

- **Composition:** a symmetrical Egyptian temple scene wrapping the board. The **centre ~60%** is the deep-purple reel void (luminance ~40-60) so symbols read cleanly; all decoration lives at the edges. A full-body idle **Cleopatra** figure (white draped gown, gold + turquoise jewelry, gold headdress) stands to the **right** of the reels; **Anubis jackal statues**, torch braziers, potted palms, hieroglyph walls and a lotus reflecting pool fill the flanks (`win-small-3ways.webp`, `01-loaded.webp`).
- **Base variant:** warm sandstone temple interior — cream/gold columns, golden torch light, teal pool `#2FB2A6` with pink lotus, blue-sky arch (`win-small-3ways.webp`, `autoplay-panel.webp`).
- **Free-spins variant:** same architecture re-lit as **night desert courtyard** — deep blue sky `#142A55`, crescent moon, pyramid & palm silhouettes, glowing torches; darker and richer, Cleopatra in cooler moonlit tone (`freespins-wildmultiplier.webp`, `multiplier-stacked-x2x2.webp`). The intro/splash `01-loaded.webp` also shows this night mood.
- **Portrait `_sp` variant:** not observed this session (no mobile capture). `[ASSUMPTION]` — reflow to a vertical 9:16 frame: move Cleopatra + statues to top/bottom decorative bands, keep the pool foreground, board centred.
- **Target dims:** PC ~2400×1600 (3:2); SP ~1152×2048 (9:16) `[ASSUMPTION]`.
- **Zone / overlay geometry map (landscape):**
  - Logo band — top-centre, ~top 12%, winged crest above the frame.
  - Board — centred, ~62% width × ~72% height, purple void.
  - Left rail — VAULT panel + REMAINING-SPINS plate (Free Spins) / BUY FEATURE plate (base).
  - Right — Cleopatra character figure.
  - Win area — horizontal strip just below the board centre ("WIN $x — Nx symbol pays…").
  - Controls band — bottom ~12%: credit/bet readout left, spin/autoplay disc right, i/menu icons far-left.

## Grid frame

- **Material + ornament:** heavy cast-gold frame. Top corners are **lotus/papyrus column capitals** (green + blue + gold banded) rising to short pillars; a jewelled header rail runs under the logo with alternating red/blue/green cloisonné triangles. Side pillars carry vertical **hieroglyph cartouches**; the bottom rail is a gold band studded with lotus buds and small **emerald diamonds** (`01-loaded.webp`, `wintier-nice.webp`).
- **Border spec:** an RGBA ring with a fully **transparent rectangular centre void** so the purple board shows through. Frame thickness ≤6% of canvas per side (thicker gold at top for the header, thinnest on the verticals).

## Logo

- **Lettering:** "LUXOR" (upper, arched) + "CLEOPATRA" (larger, below) in bevelled gold Trajan caps with a red-to-gold gradient fill and dark stroke, a small script "of" between; a pair of outstretched **golden falcon wings** crowns the wordmark, seated on a dark maroon heraldic shield with a scarab/ankh emblem at the base (`01-loaded.webp` header).
- **Base variant:** as above on the maroon crest.
- **Free-spins `_fs` variant:** all-gold, brighter, heavier bloom (matches the golden "CONGRATULATIONS!" celebratory treatment). Render at ~1024×512 on white for matting. `[ASSUMPTION]` — the session only showed the single logo lockup; the `_fs` gold-up is inferred from the gold celebration typography.

## Particles

Fragments a shattering Egyptian tile would throw:
1. **Gold flecks / sparks** — small diamond + 4-point star glints (`#FBE9AC`).
2. **Fire embers** — orange-red glowing motes with trailing tails (from the torches / flaming lotuses, `freespins-intro.webp`).
3. **Lotus petals** — soft white-to-pink teardrop petals (`#E6A6C2`).
4. **Gem shards** — faceted ruby / amethyst / turquoise triangle chips (`#C0261F` / `#7E36A6` / `#2FB2A6`).

## UI chrome

- **Spin button:** circular gold-rimmed disc, dark centre, two curved chevron/refresh arrows in white; ~256². "AUTOPLAY" label beneath; ± bet discs flank it (`win-small-3ways.webp`, `autoplay-panel.webp`).
- **Digit / letter / multiplier glyph sheets:** 512² cells — gold bevelled digits for win values, the coloured serif letter set, and a "×2 / ×4" multiplier glyph in gold-on-dark for Free Spins.
- **Win-tier wordmarks:** "NICE!" gold banner with a **winged-Cleopatra overlay** and sparkle burst, screen dimmed behind (`[t41]`; the captured `wintier-nice.webp` frame caught the reels mid-blur, so the banner art is taken from the play-log narration). Higher tiers (BIG/MEGA) not observed — generate on-theme escalations `[ASSUMPTION]`.
- **Payout panel frame + item:** VAULT plate — rounded dark-maroon plaque with a gold winged medallion header ("VAULT") and a value pill (`$92.00`) below; the REMAINING-SPINS plate is a matching maroon rounded-rect with gold digits (`freespins-wildmultiplier.webp`). BUY FEATURE base plate is a dark-maroon plaque with a green-jewelled gold border + lotus finial (`buy-feature-panel.webp`).
- **Ambient overlay layers:** soft golden vignette + dust-mote glimmer, ~30-60% opacity, centre-clear so the board stays legible; a warm torch-glow bloom at the lower corners.

## Effect and animation vocabulary

Techniques: **baked sprite-sheet** for repeatable symbol/tier bursts, **procedural-PIL** for glows/particles/vault, **AI image-to-video** for the character-driven celebration overlays. Blend `add` = additive-on-black glow. Timings tagged per mode `{normal, quick, turbo}`; `[ASSUMPTION]` on any un-measured frame count / easing.

### 1. Reel drop (spin & settle)
- **Trigger:** every spin. **Technique:** procedural-PIL vertical motion-blur streak over stacked symbols; **blend:** normal; **loops:** while spinning.
- **Sheet params:** `{frames:12, frameWidth:256, frameHeight:1024, cols:1, rows:12, fps:30, durationMs:{normal:600,quick:360,turbo:200}, anchor:{x:0.5,y:0.5}, loop:true, contentScale:1.0}` `[ASSUMPTION]`.
- **Knobs:** `blurStrength` scales with mode (turbo shows pronounced vertical streaking, `reel-motion-turbo.webp`).
- **Timing/easing:** drop-in `power2.in`, settle bounce `back.out(1.7)`; squash on land 6% / stretch mid-fall 8% `[ASSUMPTION]`.
- **Fallback:** draw each symbol offset downward with a semi-transparent smear copy; snap to grid with a 2px overshoot.

### 2. Win symbol highlight + value callout
- **Trigger:** any winning way resolves. **Technique:** procedural-PIL glow pulse on winning symbols + a floating text readout ("WIN $x.xx" and "Nx <symbol> pays $x on N ways", `win-small-3ways.webp`); **blend:** `add` for the glow, normal for text; **loops:** glow loops until next spin.
- **Sheet params (glow):** `{frames:16, frameWidth:256, frameHeight:256, cols:4, rows:4, fps:24, durationMs:660, anchor:{x:0.5,y:0.5}, loop:true, contentScale:1.15}` `[ASSUMPTION]`.
- **Knobs:** `glowColor:#FBE9AC`, `haloRadius`, small sparkle count 4-6.
- **Timing/easing:** value text pop `back.out(1.6)` in, `sine.out` hold; symbol pulse `sine.inOut`. Quick/turbo shorten the hold (~50% / ~30%).
- **Fallback:** brighten the winning symbol +30% and draw a gold ring; render the win string in bevelled gold on the bottom strip.

### 3. Win-tier banner ("NICE!" escalation)
- **Trigger:** win ≥ ~20× bet (observed "NICE!" at 22.5×, `[t41]`). **Technique:** AI image-to-video (winged-Cleopatra overlay) or baked sprite-sheet; **blend:** normal over a dimmed board; **loops:** no (plays once, holds).
- **Sheet params:** `{frames:24, frameWidth:512, frameHeight:512, cols:6, rows:4, fps:24, durationMs:1600, anchor:{x:0.5,y:0.5}, loop:false, contentScale:1.0}` `[ASSUMPTION]`.
- **Knobs:** `screenDimAlpha:0.55`, sparkle burst `count:30`, `wordmark:NICE!`.
- **Timing/easing:** wordmark `back.out(2.0)` scale-in, sparkles `power2.out`; screen dim `sine.inOut`.
- **Palette:** gold `#E3AC3C` / spark `#FBE9AC` / magenta `#C41E56`.
- **Fallback:** dim board to 55%, draw the gold "NICE!" wordmark scaling 0→1 with a radial sparkle ring.

### 4. Scatter → Free-Spins portal (golden flash + intro card)
- **Trigger:** 3+ scatters (natural or Buy Feature). **Technique:** AI image-to-video golden full-screen flash "CONGRATULATIONS!" (`[t52]`) → baked/procedural intro card; **blend:** `add` for the flash; **loops:** no.
- **Intro card art:** purple hieroglyph scroll with gold winged-edge banner, **flaming orange lotus** decorations flanking, "CONGRATULATIONS!" gold, "YOU HAVE WON / 10 / FREE SPINS" (gold "10" on a magenta pill), plus a VAULT plaque + "10 REMAINING SPINS" plate sliding in from the left (`freespins-intro.webp`, `freespins-trigger.webp`).
- **Sheet params (flash):** `{frames:20, frameWidth:1280, frameHeight:640, cols:5, rows:4, fps:30, durationMs:{normal:700,quick:500,turbo:0}, anchor:{x:0.5,y:0.5}, loop:false, contentScale:1.0}` `[ASSUMPTION]` — with "Skip Screens" on, turbo bypasses the card (`[t44]`).
- **Timing/easing:** flash `power2.out` bloom then `power2.in` fade; card `back.out(1.4)` scale-in; flaming-lotus embers loop `sine.inOut`.
- **Palette:** gold `#F5C518`, purple `#3D2168`, ember-orange `#F07A1E`.
- **Fallback:** white-gold radial wipe, then the static intro card PNG.

### 5. Wild-Multiplier land + glow (+ stack)
- **Trigger:** WILD ×2 coin lands in Free Spins (`freespins-wildmultiplier.webp`, `multiplier-stacked-x2x2.webp`). **Technique:** procedural-PIL golden aura + sparkle; **blend:** `add`; **loops:** aura loops while on board.
- **Sheet params:** `{frames:18, frameWidth:256, frameHeight:256, cols:6, rows:3, fps:24, durationMs:750, anchor:{x:0.5,y:0.5}, loop:true, contentScale:1.25}` `[ASSUMPTION]`.
- **Knobs:** `glowColor:#FCF2C6`, `filaments:8`, `particleSize:3-6`, `seed:varies`; stacked pair intensifies aura (×2·×2=×4, `[t53]`).
- **Timing/easing:** land `back.out(1.8)`, aura pulse `sine.inOut`, sparkle `power2.out`.
- **Fallback:** gold radial-gradient halo behind the coin + 6 star glints.

### 6. Vault fill / increment
- **Trigger:** wild-multiplier or extra-scatter hit adds to the Vault (`[t53]` "$10 flying into $40"). **Technique:** procedural-PIL flying-value + counter roll; **blend:** `add` on the trail; **loops:** no.
- **Sheet params:** `{frames:14, frameWidth:256, frameHeight:128, cols:7, rows:2, fps:24, durationMs:560, anchor:{x:0.5,y:0.5}, loop:false, contentScale:1.0}` `[ASSUMPTION]`.
- **Knobs:** `coinTrail:true`, `counterRoll`, value text gold-on-maroon.
- **Timing/easing:** value flies to plaque `power2.inOut`, counter roll `sine.out`, plaque flash `sine.out`.
- **Fallback:** animate a gold coin sprite along a bezier into the VAULT plate; tween the number.

### 7. Vault "key" mark (cell state flip)
- **Trigger:** a Cleopatra "key" lands on an unmarked position; cell background flips **purple→crimson** and a small gold ankh-key badge appears bottom-right of the cell (`multiplier-stacked-x2x2.webp`, `17/20` counter). **Technique:** procedural-PIL crossfade + stamp; **blend:** normal; **loops:** no.
- **Timing/easing:** fill wipe `power1.out` ~300ms, key-badge stamp `back.out(2.2)` with a spark.
- **Fallback:** swap the cell fill to `#A31C2A` and blit the ankh-key icon with a 1-frame gold flash.

### 8. Anticipation slowdown
- **Trigger:** near-miss scatter. **Status:** **unobserved this session** (`presentation.anticipation = "unobserved"`). `[ASSUMPTION]` if built: hold the last reel(s), add a pulsing gold glow + low rumble; ease `sine.out` on the slow-down.

> No cascade/tumble effect exists — every spin is a single static evaluation (`cascade.present=false`, `[t23]`); do not build a dissolve/re-drop.

## Render constants

Feed `presentation_config.json` (`[ASSUMPTION]` on fractions — estimated from board proportions in `01-loaded.webp`):

```json
{
  "grid": { "cols": 5, "rows": 4 },
  "tile_size_ratio": 0.185,
  "col_gap_frac": 0.012,
  "row_gap_frac": 0.010,
  "grid_area_ratio": 0.60,
  "column_divider_alpha": 0.35,
  "grid_overlay": { "color": "#2A1550", "alpha": 0.25 },
  "grid_glow": { "color": "#7E36A6", "alpha": 0.18 },
  "board_fill": "#3D2168",
  "marked_cell_fill": "#A31C2A",
  "footer_chrome": {
    "bar_fill": "#120A22",
    "label_gold": "#E3AC3C",
    "value_white": "#F3ECDE",
    "win_gold": "#F3C63E"
  }
}
```

## Target build pipeline

**A. Asset pipeline** — `/Users/macos/apps/kerberos/slot-game/slot-sugar-rush/pipeline` (executor recipe / FidelityDoctrine / `_seed_configs.py`): emit **WebP assets + JSON atlas sidecars** into `tiles/ chrome/ specials/ particles/ gridBackgrounds/`. Per-step generation config shape:

```json
{
  "recipe": "symbol_tile",
  "variants": [
    { "logical_name": "cleopatra", "prompt_suffix": "crowned Cleopatra portrait on a gold-framed red card, turquoise beaded collar, glossy 3D render", "color_mode": "RGBA", "aspect_ratio": "1:1", "processor_chain": ["trim","gold_bevel_outline","drop_shadow"] }
  ],
  "encode": { "format": "webp", "quality": 92 }
}
```

**B. Effect-build showcases** — `/Users/macos/apps/kerberos/slot-game/slot-showcases`: procedural `gen_*.py` effect scripts + `demo-sugar-rush/src/render/animation-timings.ts` (timing DB, feed the `{normal,quick,turbo}` values above) + `asset-manifest.ts` naming: `tile_<id>.webp`, `spritesheet_<name>.{webp,json}`, `winning_text_<tier>.webp`.

**Per-symbol `logical_name` → target filename (emit these recipe variants directly):**

| logical_name | tile file |
|---|---|
| cleopatra | `tile_cleopatra.webp` |
| scarab | `tile_scarab.webp` |
| ring | `tile_ring.webp` |
| coin | `tile_coin.webp` |
| eye_amulet | `tile_eye_amulet.webp` |
| ace | `tile_ace.webp` |
| king | `tile_king.webp` |
| queen | `tile_queen.webp` |
| jack | `tile_jack.webp` |
| ten | `tile_ten.webp` |
| nine | `tile_nine.webp` |
| wild | `tile_wild.webp` |
| wild_multiplier | `tile_wild_multiplier.webp` |
| scatter | `tile_scatter.webp` |

**Effect / chrome files:** `spritesheet_reel_drop.{webp,json}`, `spritesheet_win_glow.{webp,json}`, `spritesheet_wild_glow.{webp,json}`, `spritesheet_scatter_portal.{webp,json}`, `spritesheet_vault_fill.{webp,json}`, `winning_text_nice.webp`; chrome: `chrome_frame.webp`, `chrome_logo.webp`, `chrome_logo_fs.webp`, `chrome_spin_button.webp`, `chrome_vault_panel.webp`, `chrome_buyfeature_plate.webp`; backgrounds: `gridBackground_base.webp`, `gridBackground_freespins.webp`, `gridBackground_base_sp.webp`, `gridBackground_freespins_sp.webp`; particles: `particle_goldfleck.webp`, `particle_ember.webp`, `particle_lotuspetal.webp`, `particle_gemshard.webp`.
<<<END>>>

This is all the response, Coder