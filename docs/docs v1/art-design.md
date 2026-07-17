# Luxor of Cleopatra — Art & Effect Design DNA

Art-DNA contract derived from live gameplay screenshots + player-log of Pragmatic Play's *Luxor of Cleopatra* (`luxor-of-cleopatra`, 5×4, 1024-ways). Every colour is sampled from the actual frames; inferred build targets are marked `[ASSUMPTION]`.

## Theme identity

- **Game name:** Luxor of Cleopatra
- **Theme keyword:** Ancient Egypt / Cleopatra — opulent temple-treasure luxury.
- **tile_style:** `brick` — every symbol sits inside an **opaque, rounded-corner rectangular card**. In the base game each reel cell is a deep-violet panel; in free spins the panel is crimson-red (`09`, `11`, `16`). Card ranks and premiums are lit dimensional objects seated on that opaque cell, NOT transparent icons floating on the board.
- **Mood/tone:** Warm, regal, gold-drenched and sun-lit in the base game (a marble temple beside a lotus reflecting-pool, `02`/`03`); shifts to a cooler, richer night scene under a crescent moon with living fire braziers during free spins (`08`/`09`/`14`). Aspirational, glamorous, treasure-vault greed. Confident, not spooky.

## Art DNA

- **Material / surface:** High-gloss cast-gold everything — premiums and card ranks are 3D bevelled metal with a mirror-bright specular hot-spot and gem inlays (ruby cabochons, turquoise, amethyst). Reel panels are flat matte fabric-violet so the glossy symbols pop. Painterly-realistic Cleopatra character render (semi-photographic skin, cloth, feathered wings).
- **Lighting:** Strong warm **key from upper-front-left** (note the sheen on every symbol's top-left and the sun-glow behind the temple arch, `02`). Cool fill from the sky. Bright **gold rim-light** traces every card edge and letter. Symbols cast a soft contact shadow into their cell; drop-shadow is subtle, not heavy.
- **Camera angle:** Head-on, eye-level, orthographic board (no perspective skew on the reels). The scene behind (columns, pool, statues) recedes with mild atmospheric perspective.
- **Rendering / finish:** Glossy AAA mobile-slot render — thick baked highlights, saturated jewel tones, heavy gold. Painterly backgrounds, product-render symbols.
- **shape_language:** Rounded-rectangle cards; premiums are chunky rounded gold forms; letters are fat serif-ish 3D glyphs with generous bevels. Ornament uses lotus, papyrus-capital, ankh, scarab and cobra motifs.
- **Outline treatment:** Every symbol/letter carries a continuous **polished-gold outer bevel** (2-tone: bright top edge, dark under-edge). Winning cells gain a brighter gold frame + sparkle.
- **Motifs:** Lotus flower, winged sun-disc (in logo), ankh, Eye of Horus, scarab, pyramid, cobra/uraeus, Anubis jackal statue, hieroglyph column-carvings, Greek-key floor band.
- **negative (avoid to stay on-theme):** No dusty/desaturated "ruins" palette; no flat 2D cartoon symbols; no neon/sci-fi or candy colours; no transparent floating icons; no cool grey stone as the dominant tone; don't lose the violet base-reel / crimson free-spin-reel distinction; don't make Cleopatra grimdark or horror.

## Color palette

Background-dominant hue: **deep royal violet** on the base reel field (the symbols read against it); warm gold ornament surrounds it.

| token | hex | sampled from |
|---|---|---|
| core (reel violet) | `#3C2470` | base reel panel `02`/`03` |
| reel-crimson (FS field) | `#A81C1C` | free-spins reel cells `09`/`11` |
| gold-core | `#E7B23E` | frame + letter body `02` |
| gold-bright (spark/sheen) | `#FFE08A` | letter highlight, win banner rim `11` |
| turquoise (bloom/jewel) | `#2BA9B6` | Cleopatra collar, scarab wings, `09` |
| ray-cycle (win burst) | `#F6871F` | NICE!/MEGA! radiant burst `11`/`13` |
| bg-night | `#16244F` | free-spins sky `08`/`14` |
| bg-day | `#D9A56A` | base temple warm wash `02` |
| panel (banner magenta) | `#8E1E52` | win-value pill `11`/`13` |
| panel-edge | `#F2C94C` | gold pill border `13` |

Note: premium symbol colours (gold `#E7B23E`, turquoise `#2BA9B6`, ruby `#C21F27`) all exceed luminance ≥120 / HSV-sat ≥50% and are distinct from the violet background. The violet reel field itself is a deliberately mid-dark hue (~luma 60) so the glossy symbols read — this is intentional, not a palette error.

## Typography

- **Display font (banners / logo / WIN):** Fat 3D **gold serif-display**, heavy bevel, warm-gold gradient fill (`#FFE08A`→`#C88A22`), dark-brown stroke + soft outer glow. "CONGRATULATIONS!", "NICE!", "MEGA!", "YOU HAVE WON" all use it (`08`,`11`,`13`). Slight italic energy on the tier words.
- **Number font (win values / credit):** Bold rounded sans, bright gold `#FFD24A` fill on win values inside the magenta pill; white for credit/bet readouts in the footer. Drop-shadow: soft dark, ~2-3px down.
- **Card ranks:** Custom fat 3D letters, gold bevel outline, per-rank coloured face (see Symbols). Applies fill + gold stroke + inner sheen + contact shadow.

## Symbols

Engine ids from spec. Body-gradient stops are the symbol's dominant material read; sheen = top hot-spot; rim = gold bevel edge. Pixel target ~256².

| id | display | subject/silhouette | shape_class | body gradient `[[offset,hex]…]` | sheen | rim/edge | dominant | tier / weight | size mult | material_note |
|---|---|---|---|---|---|---|---|---|---|---|
| `cleopatra` | Cleopatra Portrait | queen bust, black bob, gold headdress, on red card | ORGANIC | `[[0,#7A0F0F],[0.5,#C21F27],[1,#5A0C0C]]` | `#FFE7C2` | `#E7B23E` | `#C21F27` | high / 5 | 1.30 | painterly portrait on crimson field, gold frame corners |
| `scarab` | Winged Scarab | golden beetle, spread wings, red gem back | ROUND | `[[0,#F4D06A],[0.5,#E0A22E],[1,#9C6A16]]` | `#FFF2C0` | `#F4D06A` | `#E0A22E` | high / 5 | 1.20 | cast gold, central ruby cabochon `#C21F27` |
| `ring` | Ankh Gem Ring | gold band, amethyst ankh stone | ROUND | `[[0,#F4D06A],[0.5,#D69E2E],[1,#8A5E12]]` | `#FFF2C0` | `#F4D06A` | `#D69E2E` | high / 4 | 1.15 | polished gold band, purple `#7A3FB0` ankh gem |
| `coin` | Cleopatra Coin | round gold coin, embossed profile | ROUND | `[[0,#F2CB60],[0.5,#D19A2A],[1,#8C5F14]]` | `#FFF3C4` | `#E7B23E` | `#D19A2A` | high / 4 | 1.10 | struck-medal relief, warm gold |
| `eye-of-horus` | Eye of Horus | gold wedjat eye, green + purple gems | ANGULAR | `[[0,#F4D06A],[0.5,#CF9A2C],[1,#7E5411]]` | `#FFF2C0` | `#F4D06A` | `#CF9A2C` | high / 4 | 1.10 | gold outline, emerald `#2E9E57` + amethyst inlay |
| `a` | Ace | fat 3D "A" | GEOMETRIC | `[[0,#E0532A],[1,#9B2E12]]` | `#FFD9B0` | `#E7B23E` | `#D5451F` | low / 3 | 1.00 | red-orange face, gold bevel |
| `k` | King | fat 3D "K" | GEOMETRIC | `[[0,#3E7BD4],[1,#1E4C94]]` | `#BFE0FF` | `#E7B23E` | `#2E6FBF` | low / 3 | 1.00 | royal-blue face, gold bevel |
| `q` | Queen | fat 3D "Q" | GEOMETRIC | `[[0,#9464CC],[1,#5E3A94]]` | `#E4CCFF` | `#E7B23E` | `#7A4FB0` | low / 2 | 0.95 | violet face, gold bevel |
| `j` | Jack | fat 3D "J" | GEOMETRIC | `[[0,#4CA64C],[1,#276B27]]` | `#CFF0C0` | `#E7B23E` | `#3E8E3E` | low / 2 | 0.95 | green face, gold bevel |
| `10` | Ten | fat 3D "10" | GEOMETRIC | `[[0,#E3982E],[1,#A5661A]]` | `#FFE3B0` | `#E7B23E` | `#D98A2B` | low / 1 | 0.90 | amber-orange face, gold bevel |
| `9` | Nine | fat 3D "9" | GEOMETRIC | `[[0,#33B2BC],[1,#1B7E88]]` | `#C8F2F6` | `#E7B23E` | `#2AA9B0` | low / 1 | 0.90 | teal face, gold bevel |
| `wild-pyramid` | Wild (Pyramid) | gold pyramid, "WILD" band, purple glow | ANGULAR | `[[0,#F2CE6A],[0.5,#C89A34],[1,#7A5416]]` | `#FFF3C4` | `#F4D06A` | `#C89A34` | wild / 5 | 1.25 | base-game only; idle purple `#7A3FB0` radiant aura |
| `wild-multiplier` | Wild ×2 (Coin) | gold coin, "WILD x2" text | ROUND | `[[0,#F4D06A],[0.5,#D19A2A],[1,#8A5E12]]` | `#FFF3C4` | `#F4D06A` | `#D19A2A` | wild / 5 | 1.20 | free-spins only; red "×2" flag, bright coin |
| `scatter-lotus` | Lotus Scatter | white/pink lotus, ruby center | ORGANIC | `[[0,#FBF1E8],[0.6,#F2C9D0],[1,#C77A8A]]` | `#FFFFFF` | `#E7B23E` | `#F5E6DF` | scatter / 5 | 1.25 | pale lotus petals, ruby `#C21F27` core, emerald bracts, purple back-glow |

## Background

- **Composition:** Centre ~60% is the reel field (violet base / crimson FS), kept mid-dark (luma ~50–80) so glossy symbols read. Decorative edges: an ornate gold temple-arch frame with lotus-capital papyrus columns, a jewelled top band, and a marble base plinth. Left third: sandstone temple wall with hieroglyph relief, an Anubis jackal statue and a lit fire brazier. Right third: full-body standing Cleopatra character illustration (black bob, gold headdress, white gown, turquoise-and-gold jewellery) — a persistent scene actor, NOT a reel symbol.
- **Base variant (`_day`):** Warm daytime — marble columns, turquoise lotus reflecting-pool, sun-glow through the arch, gold hieroglyph panels (`02`/`03`). Dominant warm sand-gold `#D9A56A`.
- **Free-spins variant (`_sp`/night):** Same architecture but night — deep-blue sky `#16244F`, crescent moon + stars, torches/braziers with live orange fire, palm trees, Anubis statues flanking, richer saturation (`08`/`09`/`14`). Reel cells turn crimson.
- **Portrait `_sp` (SP):** Not directly observed — `[ASSUMPTION]` recompose to 9:16 by stacking: logo band top, board centre, Cleopatra + brazier as side vignettes, controls docked bottom.
- **Target dims:** PC ~2400×1600 (3:2); SP ~1152×2048 (9:16). `[ASSUMPTION]` on exact px.
- **Zone / overlay map:**
  - Logo band: top-centre, winged-disc logo straddling the frame crown (~top 12%).
  - Board: centred, ~62% width × ~72% height, inside the gold frame.
  - Win area: overlays board centre (banner + magenta pill) on wins.
  - Vault UI: left gutter — gold medallion gauge + "N REMAINING SPINS" plaque (FS only).
  - Controls band: bottom ~14% — credit/bet readout, spin disc + autoplay right, info/menu/sound left.

## Grid frame

- **Material + ornament:** Cast, polished gold arch. Vertical papyrus columns with green/teal lotus-bud capitals cap each side; a jewelled lintel across the top set with alternating red + blue cabochons and small gold rivets; hieroglyph-etched inner pilasters; a marble base plinth with a lotus/scarab frieze and green gem studs.
- **Border spec:** RGBA border, **transparent rectangular centre void** so the violet/crimson board shows through. Per-side thickness ≤6% of canvas; heavier at top (lintel + logo seat) and base (plinth). Column dividers between reels are thin translucent gold seams.

## Logo

- **Lettering:** Two-line stacked wordmark — "LUXOR" (smaller, top) over "CLEOPATRA" (larger) — fat 3D gold serif letters with red-inset "LUXOR" plaque, dark outline, warm-gold gradient. Crowned by a **spread winged sun-disc** in gold with teal-tipped feathers; a small ankh/cobra ornament hangs below the wordmark.
- **base:** Warm gold-on-dark as seen atop every frame.
- **`_fs` variant:** Brighter, fully golden radiant treatment (`[ASSUMPTION]` extrapolated from the gold-heavy free-spins celebration styling), ~1024×512, rendered on white for matting.

## Particles

Fragments a shattering gold-card tile would throw:

1. **Gold coin disc** — round struck coin, spinning (matches MEGA! coin-rain `13`).
2. **Gold sparkle / 4-point star** — bright twinkle, the win-highlight sparkle (`11`).
3. **Ember flake** — small glowing orange-to-red flame mote rising (torch/brazier + FS-intro embers, `08`).
4. **Turquoise gem shard** — angular teal/amethyst chip (jewel inlays fracturing).

## UI chrome

- **Spin button:** Circular reload/rotation icon (two curved arrows) in white on a dark disc rimmed with thin gold; ~256². Flanked by "AUTOPLAY" pill and −/+ bet steppers.
- **Digit / letter / multiplier glyph sheets:** 512² cells. Digits + currency use the bold gold rounded-sans (win-value style). Multiplier glyph = "×2" red-flagged as on the wild coin.
- **Win-tier wordmarks:** `NICE!` and `MEGA!` (only tiers observed, `11`/`13`) — fat 3D gold display letters with dark outline + glow. Higher tiers above MEGA unconfirmed — do not fabricate; leave the ladder extensible.
- **Payout panel frame + item:** Buy-Feature/paytable modal = crimson-red inset field inside a thick gold jewelled frame with green corner accents, lotus crown, red close-button (`07`). Item rows = gold-outlined red plaques.
- **Ambient overlay layers:** Soft warm vignette + faint floating gold dust; ~30–60% opacity, centre-clear so the board reads.

## Effect and animation vocabulary

No cascade/tumble mechanic exists (confirmed absent — `[t20]`/`[t21]`). Reels resolve in place. Effects observed:

### 1. Reel drop / spin resolve
- **trigger:** SPIN pressed. **technique:** baked sprite-sheet blur strip + procedural stop. **blend:** normal. **loops:** no.
- Turbo shows strong **vertical motion-blur streaks** on symbols (`[t40]`); normal-speed easing not captured frame-by-frame.
- **sheet params:** `{frames:12, frameWidth:256, frameHeight:256, cols:12, rows:1, fps:30, durationMs:400, anchor:{x:0.5,y:0.5}, loop:false, contentScale:1.0}` `[ASSUMPTION]`.
- **timing/easing:** `{normal:"power2.out", quick:"power3.out", turbo:"power4.out"}`; column stagger ~60/40/20ms; land squash 0.06, no observed overshoot `[t18]`.
- **fallback:** procedural vertical blur (motion-blur the tile by 40px, ease-out to sharp).

### 2. Winning-cell highlight + sparkle
- **trigger:** a winning way resolves. **technique:** procedural-PIL frame + baked sparkle sheet. **blend:** `add` for sparkle. **loops:** yes (until roll-up ends).
- Winning cells gain a **brighter gold frame** and scattered gold star-sparkles (`05`/`11`).
- **sheet params (sparkle):** `{frames:16, frameWidth:128, frameHeight:128, cols:4, rows:4, fps:24, durationMs:660, anchor:{x:0.5,y:0.5}, loop:true, contentScale:1.0}`; knobs `{particle-size:6-14px, seed:per-cell}`.
- **easing:** frame pulse `sine.inOut`, 1.0→1.08→1.0 scale.
- **particles:** per-cell 4–6 sparkles, lifetime 500ms, gravity 0. **palette:** `#FFE08A`,`#FFD24A`.
- **fallback:** draw a 3px `#FFE08A` inner glow rect + 4 additive star quads.

### 3. Floating win-value callout (roll-up)
- **trigger:** win credited. **technique:** procedural (magenta pill + counting text). **blend:** normal. **loops:** no.
- Magenta pill `#8E1E52` with gold `#F2C94C` winged border; gold number rolls up (`11`/`13`). Breakdown line beneath ("4X 9 PAYS $0.60 ×2 = $1.20 ON 2 WAYS", `[t33]`).
- **easing:** `{normal:"power1.out over 900ms", quick:"600ms", turbo:"300ms"}`; pill pop-in `back.out(1.7)`.
- **fallback:** static gold number on magenta rounded-rect.

### 4. Wild-multiplier symbol (land + label)
- **trigger:** WILD ×2 coin lands (free spins, `[t29]`/`10`). **technique:** baked sheet. **blend:** `add` glow. **loops:** idle pulse yes.
- Gold coin with red "×2" flag; its effect is shown **inline in the breakdown text**, not a separate flying multiplier (`[t33]`). Adds random value to the Vault meter on land.
- **sheet params:** `{frames:20, frameWidth:256, frameHeight:256, cols:5, rows:4, fps:24, durationMs:830, anchor:{x:0.5,y:0.5}, loop:false, contentScale:1.1}`; knobs `{particle-size:8px, filaments:6}`.
- **easing:** land `back.out(2.0)`, glow pulse `sine.inOut` loop; wobble ±3°.
- **fallback:** coin tile + additive gold ring + red "×2" text badge.

### 5. Base-game wild-pyramid idle glow
- **trigger:** pyramid wild present in base game (`04`/`09`, `[t36]`). **technique:** procedural. **blend:** `add`. **loops:** yes.
- Golden pyramid pulses a **purple `#7A3FB0` radiant aura**.
- **easing:** `sine.inOut`, 1.6s period, alpha 0.4→0.8.
- **fallback:** radial purple gradient behind tile, additive.

### 6. Win-tier escalation banner (NICE! / MEGA!)
- **trigger:** win crosses tier threshold (NICE ~24×, MEGA ~30–66× observed). **technique:** AI image-to-video hero + baked burst/coin sheets. **blend:** `add` for rays/coins. **loops:** rays loop during roll-up.
- Full-screen: gold 3D wordmark drops in, **winged-Cleopatra hero** (teal/blue feathered wings, gold ring halo) rises over a radiant orange `#F6871F` sunburst; NICE = calmer sparkle field, MEGA = hotter red-orange burst + **falling gold-coin rain** (`11` vs `13`).
- **sheet params (burst):** `{frames:24, frameWidth:512, frameHeight:512, cols:6, rows:4, fps:24, durationMs:1000, anchor:{x:0.5,y:0.5}, loop:true, contentScale:1.4}`. **coin-rain:** `{frames:16, frameWidth:96, frameHeight:96, cols:4, rows:4, fps:20, loop:true}`.
- **easing:** wordmark `back.out(1.6)` in over 350ms; hero rise `power2.out`; hold; dismiss `power1.in`.
- **particles (MEGA coin-rain):** ~14/frame, lifetime 1400ms, gravity +900px/s². **palette:** `#F6871F`,`#FFD24A`,`#F4D06A`.
- **fallback:** static gold wordmark + radial orange gradient + hero PNG, no coin rain.

### 7. Scatter land + free-spins portal transition
- **trigger:** 3+ lotus scatters (`[t25]`/`[t41]`,`16`). **technique:** baked sheet + AI scene cross-dissolve. **blend:** `add` glow. **loops:** no.
- Scatter cells get a **glow highlight** (blue-ish, `[t41]`); scene **cross-fades day→night**, orange **ember/lotus-fire particles** rise along the columns, gold "CONGRATULATIONS! / YOU HAVE WON 10 FREE SPINS" scroll banner drops in (`08`).
- **sheet params (scatter glow):** `{frames:18, frameWidth:256, frameHeight:256, cols:6, rows:3, fps:24, durationMs:750, anchor:{x:0.5,y:0.5}, loop:false, contentScale:1.15}`.
- **easing:** scene dissolve 800ms `sine.inOut`; banner in `back.out(1.4)`.
- **particles (embers):** spawn along column edges, lifetime 1800ms, gravity −120px/s² (rise), flicker. **palette:** `#F6871F`,`#FFB347`,`#C21F27`.
- **fallback:** darken overlay to night tint + static gold banner.

### 8. Vault meter + position-mark
- **trigger:** wild-mult/scatter lands (grow gauge) or Cleopatra lands on unmarked cell (mark position, `[t29]`/`[t32]`). **technique:** procedural. **blend:** normal + `add` flash on tick. **loops:** no.
- Left gold **VAULT medallion gauge** ticks value up; "N/20" counter near Cleopatra's key increments; a marked cell flips from plain field to crimson + gold **ankh-key corner icon** (`09`). 20/20 fires a **"ROYAL TRIBUTE UNLOCKED!" gold fire-burst** overlay (`12`).
- **easing:** value roll `power1.out` 600ms; mark-flip `back.out(1.7)` scale-pop + additive gold flash 200ms.
- **particles (unlock):** gold-coin + ember spray, ~30, lifetime 1200ms, gravity +600. **palette:** `#FFD24A`,`#F6871F`.
- **fallback:** instant gauge value swap + static ankh icon on cell.

### 9. Free-spins outro / round-total
- **trigger:** last free spin resolves (`14`/`[t34]`). **technique:** procedural banner over AI golden-burst bg. **blend:** `add`. **loops:** rays loop.
- Radiant golden full-screen, "CONGRATULATIONS! / YOU HAVE WON $X IN 10 FREE SPINS" gold scroll banner, magenta total pill.
- **easing:** banner `back.out(1.5)` in, `power1.in` dismiss on tap.
- **fallback:** static gold banner + total on magenta pill.

### 10. Anticipation slowdown
- **NOT observed** — no distinct reel slowdown/tease when 1–2 scatters landed (`[t18]`, presentation note). Do not fabricate; if built, keep a subtle scatter-cell glow + minor last-reel deceleration `[ASSUMPTION]`.

## Render constants

Feed `presentation_config.json` (measured from `02`/`09`, `[ASSUMPTION]` on exact ratios):

```json
{
  "tile_size_ratio": 0.145,
  "col_gap_frac": 0.010,
  "row_gap_frac": 0.012,
  "grid_area_ratio": 0.62,
  "column_divider_alpha": 0.25,
  "grid_overlay": {"hue": "#3C2470", "alpha": 0.0, "base_field": "#3C2470", "fs_field": "#A81C1C"},
  "grid_glow": {"color": "#E7B23E", "alpha": 0.30, "win_only": true},
  "footer_chrome": {"bg": "#1A140E", "credit_label": "#E7B23E", "value_text": "#FFFFFF", "win_text": "#FFD24A", "greek_key_band": "#0E0A06"}
}
```

## Target build pipeline

### Asset pipeline — `/Users/macos/apps/kerberos/slot-game/slot-sugar-rush/pipeline`
Follow the executor recipe / FidelityDoctrine / `_seed_configs.py` contract: emit **WebP assets + JSON atlas sidecars** into `tiles/ chrome/ specials/ particles/ gridBackgrounds/`. Per-step generation config:
`{recipe, variants:[{logical_name, prompt_suffix, color_mode, aspect_ratio, processor_chain}], encode:{format:"webp", quality:90}}`.
- Symbol prompts: opaque rounded-card, glossy cast-gold with jewel inlays, warm upper-left key light, gold bevel rim, on transparent (card baked in), ~256², `color_mode:"rgba"`.
- Backgrounds: `gridBackgrounds/` day + night (`_sp`) variants, `aspect_ratio` 3:2 (PC) and 9:16 (SP portrait).

### Effect-build showcases — `/Users/macos/apps/kerberos/slot-game/slot-showcases`
Use the procedural `gen_*.py` effect scripts + `demo-sugar-rush/src/render/animation-timings.ts` (timing DB) + `asset-manifest.ts` naming: `tile_<id>.webp`, `spritesheet_<name>.{webp,json}`, `winning_text_<tier>.webp`. Register the sheet params + GSAP easings from the Effect vocabulary above; win-tier wordmarks `winning_text_nice.webp`, `winning_text_mega.webp`.

### Per-symbol `logical_name` → target filename
| logical_name | target file |
|---|---|
| cleopatra | `tile_cleopatra.webp` |
| scarab | `tile_scarab.webp` |
| ring | `tile_ring.webp` |
| coin | `tile_coin.webp` |
| eye-of-horus | `tile_eye.webp` |
| a | `tile_a.webp` |
| k | `tile_k.webp` |
| q | `tile_q.webp` |
| j | `tile_j.webp` |
| 10 | `tile_10.webp` |
| 9 | `tile_9.webp` |
| wild-pyramid | `tile_wild.webp` |
| wild-multiplier | `tile_wildmult.webp` |
| scatter-lotus | `tile_scatter.webp` |

Chrome/specials: `chrome/logo.webp`, `chrome/logo_fs.webp`, `chrome/grid_frame.webp`, `chrome/spin_button.webp`, `chrome/vault_gauge.webp`, `specials/winning_text_nice.webp`, `specials/winning_text_mega.webp`, `specials/winged_cleopatra_hero.webp`; particles `particles/coin.webp`, `particles/sparkle.webp`, `particles/ember.webp`, `particles/gem_shard.webp`.
<<<END>>>

This is all the response, Coder