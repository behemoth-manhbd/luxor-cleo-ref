# Luxor of Cleopatra — Art Design DNA

> The "art DNA" contract for the downstream `art-maker`. Every visual fact below is sampled from the 25 gameplay screenshots or cited from the `[tNN]` player log. Values I had to choose for the pipeline are tagged `[ASSUMPTION]`. Symbol ids come from the spec.

## Theme identity

- **Game name:** Luxor of Cleopatra (Pragmatic Play, `vswaysladythf`).
- **Theme keyword:** Ancient-Egypt palace opulence — Cleopatra, gold, torch-lit temple, lotus, Eye of Horus, pyramid.
- **tile_style:** `floating` — in the base game the whole 5×4 grid is ONE continuous deep-purple field and the symbols are opaque/rendered icons floating on it with NO per-cell card (see `01-loaded`, `02-no-win-board`). NOTE for the maker: during **free spins** a red rounded-rectangle card plate appears *behind each occupied cell* (`06`, `07`, `10`, `13`), so the free-spins variant reads as `brick` on a red plate. Model symbols as transparent floating icons; supply the red plate as a separate free-spins cell-background asset.
- **Mood/tone:** regal, warm, luxurious, high-drama. Base game = golden daytime throne-room; free spins = cooler moonlit palace at night. Reverent-goddess grandeur on wins (winged Isis/Cleopatra), never cartoonish.

## Art DNA

- **Material:** heavy polished **gold** everywhere — beveled, high-gloss, with sharp specular hits. Gemstones (ruby-red, turquoise, amethyst-purple) are glassy and faceted. Card royals are 3D extruded metal letters with a colored enamel face. Surfaces are opaque and rich, not translucent.
- **Lighting:** strong warm **key** from upper-left (torch/sun), soft ambient **fill**, bright golden **rim** on every symbol edge; symbols cast a subtle drop shadow onto the purple/red field. Wins add a radiating warm backlight (orange-red sunburst behind the goddess, `11`, `17`).
- **Camera angle:** straight-on, eye-level, orthographic-feeling grid. Background rendered in shallow perspective (columns receding, pool in foreground).
- **Rendering/finish:** painterly-realistic 3D render (Pragmatic house style) — semi-photoreal figure of Cleopatra, stylized-realistic symbols, glossy PBR-gold.
- **shape_language:** rounded, ornamental, symmetrical. Egyptian motif geometry (winged sun-disc, lotus, papyrus-column capitals, hieroglyph friezes).
- **Outline treatment:** no hard vector outline; symbols are separated from the field by a bright gold rim-light + soft dark contact shadow.
- **Motifs:** winged sun-disc, lotus flower, Eye of Horus, pyramid, ankh, scarab, Anubis statues, hieroglyph friezes, papyrus/lotus columns, jeweled gold banding.
- **negative (a clone must AVOID):** flat/cel-shaded or cartoon look; neon/candy palette; cool desaturated gold (keep it warm amber); comic outlines; sci-fi or gemstone-candy (this is NOT a match-3 sweets game); modern/sans-serif signage; empty black voids where ornate gold framing belongs.

## Color palette

Background-dominant hue: **base game = warm amber gold** (temple interior); **free spins = deep night blue**. Symbol/board colors below are sampled by eye from the frames.

| token | hex | sampled from | role |
|---|---|---|---|
| gold-core | `#E9B53A` | logo/frame/coins, `01`,`04` | primary metal, letters, chrome |
| gold-bright (spark) | `#F6D566` | rim highlights, win text, `11` | sheen / spark |
| gold-deep | `#9A6A1B` | bevel shadows, `03` frame | metal shadow / edge |
| board-purple (bg-panel) | `#3A2668` | base grid field, `02` | base board fill |
| purple-deep (panel-edge) | `#241546` | grid vignette, `06` | board edge / divider |
| fs-red (bloom) | `#A81E22` | free-spins cell plates, `07`,`10` | free-spins card + win banner base |
| night-blue (bg) | `#132750` | free-spins sky, `04`,`12` | free-spins background |
| torch-orange (ray-cycle) | `#F0761E` | torch flame / win backlight, `11` | fire / big-win rays |
| turquoise-accent | `#25B7AE` | Cleopatra collar, column gems, `01` | jewel accent / contrast |
| amethyst-accent | `#8A34B4` | ankh ring, Eye of Horus gem, `06` | jewel accent |
| marble-cream | `#EDE4D0` | Cleopatra dress, day columns, `02` | neutral / figure |

Symbol colors clear the luminance≥120 / sat≥50% target (gold ~L200, enamel letters saturated). The board purple and night-blue are deliberately dark (L~50–70) so icons read — kept intentionally low per the dark-background allowance.

## Typography

- **Display font vibe:** ornate, chunky **beveled serif** with an Egyptian flavor. Two treatments seen:
  - Titles ("CONGRATULATIONS", "YOU HAVE WON", `04`,`05`): warm-white → soft-pink vertical gradient fill, thick gold stroke, dark drop shadow, slight condensed caps.
  - Win-tier wordmarks ("SENSATIONAL!", "NICE!", `11`,`17`): solid **gold** faces with a carved hieroglyph texture inside the letters, dark-gold stroke, strong bottom drop shadow, chromatic sparkle glints on corners.
- **Number font:** heavy bold gold numerals with a dark stroke and drop-shadow, sitting inside a maroon/magenta lozenge banner (`$161.42`, `$49.47`). Vault/counter digits are the same gold-on-dark style.
- **Fill / stroke / shadow default:** fill = `gold-core→gold-bright` gradient; stroke = `gold-deep` 3–5% of glyph height; drop-shadow = `#00000099`, offset down ~4% [ASSUMPTION on exact offsets].

## Symbols

Keyed by spec engine id. Gradient stops as `[[offset,hex]…]` top→bottom. Pixel target ~256². Size multiplier scales visual weight (higher pay = bigger).

| id | display name | subject / silhouette | shape_class | body gradient | sheen | rim/edge | dominant | tier / weight | size× | material_note |
|---|---|---|---|---|---|---|---|---|---|---|
| `cleopatra` | Cleopatra | framed portrait bust, black hair, gold headdress, turquoise collar, on red backing in gold frame | ORGANIC | `[[0,#F2D27A],[0.5,#C9A24A],[1,#8A5E1C]]` (frame) | `#FFF3C8` | `#7A4E12` | `#C9A24A` | high / 5 | 1.30 | painted portrait inside a jeweled gold frame; top payer, also VAULT marker in FS |
| `ankh_ring` | Ankh Ring | gold band ring, amethyst stone bearing a purple ankh | ROUND | `[[0,#F6D77A],[0.5,#D2A544],[1,#8A5E1C]]` | `#FFF0BE` | `#6E4A12` | `#D2A544` | high / 4 | 1.18 | glossy gold ring, faceted `amethyst-accent` gem |
| `gold_scarab` | Gold Scarab | golden scarab beetle, red cabochon on back, curved horns | ORGANIC | `[[0,#F4CE63],[0.55,#C89430],[1,#7E5414]]` | `#FFEFB0` | `#6A4610` | `#C89430` | high / 4 | 1.18 | sculpted metal beetle, ruby-red center gem |
| `cleopatra_coin` | Cleopatra Coin | round gold coin, falcon/eagle profile relief, "1" | ROUND | `[[0,#F0CB5E],[0.5,#C1902E],[1,#7A5012]]` | `#FFE9A6` | `#66430F` | `#C1902E` | high / 3 | 1.10 | struck-coin relief, warm gold |
| `eye_of_horus` | Eye of Horus | Wedjat eye charm in gold, amethyst brow gem | ANGULAR | `[[0,#F2CE66],[0.5,#C59333],[1,#7C5314]]` | `#FFECAF` | `#684410` | `#C59333` | high / 3 | 1.10 | jeweled gold charm, purple + green inlay |
| `ram_coin` | Ram Coin | round gold coin with ram/buffalo-head relief | ROUND | `[[0,#EFC957],[0.5,#BE8C2C],[1,#785010]]` | `#FFE7A0` | `#634110` | `#BE8C2C` | high / 3 | 1.12 | horned-ram medallion; seen `01`,`04` top-right |
| `sym_a` | A | 3D extruded letter A, red enamel face | GEOMETRIC | `[[0,#E6533C],[1,#9E2318]]` | `#FFD9A0` | `#E9B53A` | `#C93A2A` | low / 2 | 0.95 | gold-beveled metal letter, red fill |
| `sym_k` | K | letter K, blue enamel face | GEOMETRIC | `[[0,#3E7DD6],[1,#1C3E86]]` | `#CFE4FF` | `#E9B53A` | `#2E5DB0` | low / 2 | 0.95 | gold bevel, royal-blue fill |
| `sym_q` | Q | letter Q, purple/magenta enamel face | GEOMETRIC | `[[0,#B152C8],[1,#6A1E8E]]` | `#F2CCFF` | `#E9B53A` | `#8A34B4` | low / 1 | 0.90 | gold bevel, amethyst fill |
| `sym_j` | J | letter J, green enamel face | GEOMETRIC | `[[0,#5FBF57],[1,#237A2E]]` | `#D6FFC6` | `#E9B53A` | `#3E9A46` | low / 1 | 0.90 | gold bevel, emerald fill |
| `sym_10` | 10 | numerals 10, orange/gold enamel face | GEOMETRIC | `[[0,#F2B347],[1,#B5701A]]` | `#FFE6B0` | `#E9B53A` | `#D08A2A` | low / 1 | 0.88 | gold bevel, amber fill |
| `sym_9` | 9 | numeral 9, teal/cyan enamel face | GEOMETRIC | `[[0,#38C6C0],[1,#127E86]]` | `#C6FFFB` | `#E9B53A` | `#25B7AE` | low / 1 | 0.88 | gold bevel, turquoise fill |
| `wild_pyramid` | WILD | gold pyramid glyph, "WILD" band, purple glow behind | ANGULAR | `[[0,#F4D06A],[0.5,#C89A38],[1,#7E5A18]]` | `#FFF1C0` | `#6E4C12` | `#C89A38` | wild / 5 | 1.25 | reels 2–4 base; magenta aura, `02`,`06` |
| `wild_multiplier` | WILD ×2 | gold coin/pyramid with "WILD x2" badge | ANGULAR | `[[0,#F6C955],[0.5,#C48E2A],[1,#7A5012]]` | `#FFE79E` | `#634110` | `#C48E2A` | wild / 5 | 1.25 | FS-only; persistent `x2` badge glows gold (`07`,`13`); log t26/t40 |
| `scatter_lotus` | Lotus Scatter | white water-lily, red+emerald center jewel, gold tips | ORGANIC | `[[0,#FFFFFF],[0.6,#F0E6D0],[1,#CBb98F]]` petals | `#FFFFFF` | `#E9B53A` | `#F2ECDC` | scatter / 5 | 1.28 | white bloom, idle shimmer; `06`,`10`; triggers FS |

## Background

- **Composition:** ornate gold grid frame is centered; the reel field itself is dark/muted (base purple `#3A2668` L~55, free-spins per-cell red plus purple gutters) so symbols read against it. Decorative richness lives on the EDGES: a full-height **Cleopatra figure** stands on the right, papyrus/lotus columns flank the grid, torch braziers + Anubis statues + a lotus pool sit at lower-left.
- **Base variant (`_base`):** warm daytime **throne-room interior** — cream marble columns, gold furniture, teal reflecting pool with pink lotus pads in foreground, bright sky through arches (`02`,`10`).
- **Free-spins variant (`_fs`):** darker/richer **moonlit palace exterior** — deep night-blue sky, crescent moon upper-right, palm silhouettes, distant pyramid, warm torch glow left; Cleopatra figure lit cooler (`04`,`06`,`07`,`12`). This is the darker/richer mood per log t24.
- **Portrait `_sp` variants:** not directly observed in a 9:16 crop this session — `[ASSUMPTION]` reflow the same scene to SP by moving the Cleopatra figure to a lower band and stacking the vault/logo above the grid.
- **Target dims:** PC ~2400×1600 (3:2); SP ~1152×2048 (9:16). Source frames are 1280×640-ish 2:1 crops — extend vertically for both targets.
- **Zone / overlay geometry map (base, fractions of canvas):**
  - Logo band: top-center, y 0–0.14, winged-disc title.
  - Vault panel: left, x 0–0.14, y 0.15–0.55 (FS only shows dollar meter + REMAINING SPINS box).
  - Board: x 0.20–0.78, y 0.14–0.86.
  - Cleopatra figure: right, x 0.78–1.0, full height.
  - Win area: centered under board, y 0.86–0.95 (roll-up text) / full-screen for tier banners.
  - Controls band: bottom, y 0.90–1.0 (credit/bet left, spin/autoplay right, BUY FEATURE left of grid in base).

## Grid frame

- **Material + ornament:** thick polished-gold frame. Top rail carries the winged sun-disc **logo cartouche**; the two vertical sides are **papyrus-bundle columns** with green+red jeweled capitals; the bottom rail is a **lotus-and-lozenge frieze** (alternating gold lotus + emerald diamonds, `01`,`02`). Corner posts have blue/red gem inlays.
- **RGBA border spec:** opaque ornate gold border with a fully **transparent rectangular center void** (the purple/red board shows through). Border thickness ≤6% of canvas per side; corners thicker for the capital ornaments. Deliver as a single PNG/WebP with alpha.

## Logo

- **Lettering:** "LUXOR of CLEOPATRA" in ornate gold beveled serif caps, "LUXOR" stacked over "CLEOPATRA", flanked/topped by outstretched **turquoise-and-gold falcon wings + sun disc**; small red cartouche detail below (`01`,`04`). Warm gold with dark stroke and inner hieroglyph texture.
- **Base variant:** as above on transparent bg.
- **Free-spins `_fs` variant:** same lettering pushed to a **brighter/richer gold** with stronger glow and slightly warmer wings, ~1024×512, rendered on white for matting. `[ASSUMPTION]` on exact glow radius.

## Particles

Fragments a shattering tile / the win FX would throw (all observed):
1. **Gold coin** — round coin stamped with a small red star/emblem, tumbling with rim-light (coin-shower on SENSATIONAL, `11`, log t43).
2. **Gold spark / ember** — small four-point star glints and warm embers (win sparkle, `11`,`17`).
3. **Fire-lotus** — a glowing orange lotus bloom on a flaming stem (rises up the frame sides in transitions/congrats, `04`,`05`).
4. **Gemstone chip** — small faceted ruby/turquoise/amethyst shard (from jeweled symbols; `[ASSUMPTION]` for shatter fragments).

## UI chrome

- **Spin button:** circular gold-rimmed dark disc with two curved **rotating arrows** icon (`02`,`10`); base-plate ~256², concentric gold ring, dark-navy center. Autoplay = same disc with a red square (stop) when running (`06`,`07`).
- **Digit / letter / multiplier glyph sheets:** 512² cells. Digits = gold beveled numerals w/ dark stroke (credit/win/vault). Letters = the enamel-face royals. Multiplier glyph = "x2" gold badge on a small red disc (`07`,`13`).
- **Win-tier wordmarks:** "NICE!" and "SENSATIONAL!" gold hieroglyph-textured caps (`11`,`17`); reserve slots for higher unseen tiers `[ASSUMPTION]` (e.g. BIG/MEGA/EPIC) in the same style.
- **Payout panel frame + item:** dark-navy rounded modal with an ornate **gold+green+red jeweled border**, header on a red plaque, values on red gradient bars (`03` Buy Feature, `01` GAME RULES). Item row = symbol thumbnail + gold "5- / 4- / 3-" pay lines.
- **Ambient overlay layers:** soft warm vignette + faint gold dust motes, ~30–60% opacity, center-clear so the board stays legible; a **golden light-ray burst** behind the frame at free-spins start (`12`, log t64).

## Effect and animation vocabulary

Effects the play actually showed. No cascade/tumble exists (log t18–t19, confirmed absent) — do NOT build a tile-dissolve. Blend `add` on black for all glow/particle sheets. Timings not measured are `[ASSUMPTION]`.

### 1. Reel drop / spin (base)
- **Trigger:** SPIN pressed / autoplay. **Technique:** procedural-PIL blur strip + engine transform. **Blend:** normal. **Loop:** no.
- Reels blur vertically then snap left→right with a slight bounce (log presentation "snaps to rest… slight bounce"; motion blur `10`,`16`).
- Sheet params: `{frames:1, use engine tween}` — supply a per-symbol **motion-blur streak** variant.
- Timing/easing: `{normal:"power2.out", quick:"power3.out", turbo:"power4.out"}`; per-reel stagger normal 90ms / quick 55ms / turbo 15ms `[ASSUMPTION]`; land bounce `back.out(1.6)` normal → `back.out(1.2)` turbo; squash 0.90/stretch 1.08.
- Fallback: engine y-translate + a semi-transparent vertical-smear rect over the column.

### 2. Winning-symbol glow + pulse
- **Trigger:** a paying way resolves. **Technique:** baked sprite-sheet (additive glow ring) + engine scale-pulse. **Blend:** add. **Loop:** yes while win shown.
- Winning icons glow gold and pulse in place; the red FS plate brightens (`06`,`07`, log presentation "Winning symbols glow gold and pulse").
- Sheet: `{frames:16, frameWidth:256, frameHeight:256, cols:4, rows:4, fps:24, durationMs:667, anchor:{x:0.5,y:0.5}, loop:true, contentScale:1.15}`; knobs: particle-size small, seed per-cell.
- Easing: `{normal:"sine.inOut", quick:"sine.inOut", turbo:"sine.out"}`; pulse scale 1.0↔1.12, wobble ±2°.
- Fallback: draw a radial gold gradient halo behind the cell + engine scale 1.0→1.12→1.0.

### 3. Floating win-value roll-up (small win)
- **Trigger:** any win under the tier threshold. **Technique:** procedural-PIL text + engine counter. **Blend:** normal. **Loop:** no.
- Gold amount + "PAYS $X / WINNER" rolls up under the reels (`06` WIN $19.50; log t45 "3x J PAYS $0.30").
- Params: counter roll `durationMs {normal:800, quick:500, turbo:250}`; text pop `back.out(1.7)` then hold; drift up 6% and fade.
- Fallback: gold number label, scale 0.6→1.0 `back.out`, alpha 0→1.

### 4. Win-tier escalation banner (NICE / SENSATIONAL)
- **Trigger:** win ≥ tier threshold (log t43 SENSATIONAL, t76 NICE). **Technique:** AI image-to-video (winged-goddess hero) + baked coin/spark sheets. **Blend:** add for particles, normal for hero. **Loop:** hero idle loops until dismissed.
- Full-screen: **winged Isis/Cleopatra** illustration (teal+gold wings, blue halo) over an orange-red sunburst; gold wordmark drops in; **coin shower** + sparks rain; magenta lozenge counter rolls up fast (`11`,`17`).
- Wordmark sheet: `{frames:20, frameWidth:1024, frameHeight:384, cols:5, rows:4, fps:30, durationMs:667, anchor:{x:0.5,y:0.35}, loop:false, contentScale:1.0}`.
- Coin-shower sheet: `{frames:30, frameWidth:512, frameHeight:512, cols:6, rows:5, fps:30, durationMs:1000, anchor:{x:0.5,y:0}, loop:true}`; knobs: particle-size 24–48px, count 40/cell, seed varied.
- Easing: wordmark in `back.out(1.8)`, coins `power1.in` (gravity fall); counter roll `{normal:1400ms, quick:900ms, turbo:500ms}` linear→`sine.out` finish; hero breathe scale 1.0↔1.03 `sine.inOut`.
- Particle spec: coins lifetime 1.4s, gravity +900px/s², spawn top edge full width; sparks lifetime 0.5s, no gravity, additive.
- Palette: `gold-core`, `gold-bright`, `torch-orange`, banner `fs-red→#7B1E52`.
- Fallback: static winged-goddess PNG + procedurally spawned gold circles falling with gravity + gold number roll-up.

### 5. WILD ×2 multiplier land + glow + apply
- **Trigger:** wild-multiplier lands in FS (log t26,t40,t65). **Technique:** baked sprite-sheet flash. **Blend:** add. **Loop:** badge glow loops.
- Golden flash on land; persistent "x2" gold badge glows on the symbol through win eval (presentation "golden flash and an x2 badge overlay that persists").
- Sheet: `{frames:12, frameWidth:256, frameHeight:256, cols:4, rows:3, fps:24, durationMs:500, anchor:{x:0.5,y:0.5}, loop:false, contentScale:1.2}` + separate 2-frame looping badge-glow.
- Easing: land `back.out(1.5)`, flash `power2.out`; badge pulse `sine.inOut` scale 1.0↔1.08.
- Fallback: white radial flash quad fading over 300ms + static x2 badge.

### 6. VAULT increment ("+$10 fly-up")
- **Trigger:** wild-multiplier / scatter feeds the vault in FS (log t26 "+$10", t40 "+$10.00 flying up"). **Technique:** procedural-PIL + engine tween. **Blend:** add. **Loop:** no.
- A gold "+$X" flies from the triggering cell up into the left VAULT meter; meter digits roll and a gold glint pops on the winged-disc vault badge; the "/20" marker count increments with small red key badges appearing on marked cells (`06` 13/20, `07`,`10`).
- Easing: fly-up `power2.inOut` ~600ms; meter roll `sine.out`; marker stamp `back.out(2.0)`.
- Fallback: gold label lerped from cell→meter, then meter text swap + a 4-point sparkle.

### 7. Scatter anticipation slowdown
- **Trigger:** 2 scatters already on board (presentation "slow the remaining reels"). **Technique:** engine + procedural glow. **Blend:** add. **Loop:** pulse loops during slowdown.
- Landed lotus scatters pulse/shimmer; remaining reels slow with a brightening glow band.
- Easing: reel-slow ease `power1.out` with extended duration ×2.0 `[ASSUMPTION]`; scatter pulse `sine.inOut` scale 1.0↔1.15.
- Fallback: extend the reel-stop tween + additive halo on scatter cells.

### 8. Free-spins portal / transition
- **Trigger:** 3+ scatters or Buy Feature (log t22–t23,t37,t64). **Technique:** AI image-to-video (Cleopatra close-up wipe) → baked ray + fire-lotus sheets. **Blend:** add. **Loop:** no.
- Full-screen **golden Cleopatra portrait wipe** with radiating sparkle (log t22), then a **CONGRATULATIONS scroll**: purple hieroglyph-papyrus panel with gold winged-lotus corners, **flaming fire-lotus vines** climbing both sides, "YOU HAVE WON 10 FREE SPINS" (`04`,`05`). Golden light-ray burst behind the frame at round start (`12`).
- Ray sheet: `{frames:24, frameWidth:1024, frameHeight:1024, cols:6, rows:4, fps:24, durationMs:1000, anchor:{x:0.5,y:0.5}, loop:false}`; fire-lotus vine sheet `{frames:16,256,512,4,4,20fps,loop:true}`.
- Easing: portrait wipe `power2.inOut` ~700ms; scroll in `back.out(1.4)`; number pop `back.out(1.7)`.
- Palette: `gold-core`,`gold-bright`,`torch-orange`, panel `board-purple`.
- Fallback: gold radial wipe + static congrats panel PNG + drifting gold particles.

### 9. Free-spins outro
- **Trigger:** last free spin resolves (log t27,t69). **Technique:** same scroll asset reused, "YOU HAVE WON $X IN 10 FREE SPINS" (`07`). **Blend:** normal.
- Easing: scroll `back.out(1.4)`; total roll-up `sine.out` 1000ms. Fallback: reuse #8 panel with total number.

## Render constants

Feed `presentation_config.json` (fractions unless noted; `[ASSUMPTION]` where not directly measurable, tuned to the frames):

```json
{
  "tile_size_ratio": 0.92,
  "col_gap_frac": 0.010,
  "row_gap_frac": 0.010,
  "grid_area_ratio": 0.58,
  "column_divider_alpha": 0.35,
  "grid_overlay": { "color": "#241546", "alpha": 0.20 },
  "grid_glow": { "color": "#E9B53A", "alpha": 0.30, "blur": 24 },
  "board_fill_base": "#3A2668",
  "board_cell_fill_fs": "#A81E22",
  "footer_chrome": {
    "credit_label": "#E9B53A",
    "value_text": "#FFFFFF",
    "bar_bg": "#0E0A1E",
    "accent": "#E9B53A"
  }
}
```

## Target build pipeline

### Asset pipeline
Executor recipe at `/Users/macos/apps/kerberos/slot-game/slot-sugar-rush/pipeline` (FidelityDoctrine + `_seed_configs.py` contract): emit **WebP** assets + **JSON atlas sidecars** into `tiles/ chrome/ specials/ particles/ gridBackgrounds/`. Per-step generation config:
`{recipe, variants:[{logical_name, prompt_suffix, color_mode, aspect_ratio, processor_chain}], encode:{format:"webp", quality:90}}`.
- `color_mode`: symbols = warm-gold PBR on transparent; backgrounds = full-scene; particles = additive-on-black.
- `processor_chain`: trim → rim-light → drop-shadow → atlas-pack for symbols; scene-composite for backgrounds.

### Effect-build showcases
Procedural `gen_*.py` scripts at `/Users/macos/apps/kerberos/slot-game/slot-showcases` + `demo-sugar-rush/src/render/animation-timings.ts` (timing DB from the §"Effect and animation vocabulary" GSAP strings) + `asset-manifest.ts` naming: `tile_<id>.webp`, `spritesheet_<name>.{webp,json}`, `winning_text_<tier>.webp`.

### Per-symbol logical_name → target filename mapping

| logical_name | target filename |
|---|---|
| cleopatra | `tile_cleopatra.webp` |
| ankh_ring | `tile_ankh_ring.webp` |
| gold_scarab | `tile_gold_scarab.webp` |
| cleopatra_coin | `tile_cleopatra_coin.webp` |
| eye_of_horus | `tile_eye_of_horus.webp` |
| ram_coin | `tile_ram_coin.webp` |
| sym_a | `tile_sym_a.webp` |
| sym_k | `tile_sym_k.webp` |
| sym_q | `tile_sym_q.webp` |
| sym_j | `tile_sym_j.webp` |
| sym_10 | `tile_sym_10.webp` |
| sym_9 | `tile_sym_9.webp` |
| wild_pyramid | `tile_wild_pyramid.webp` |
| wild_multiplier | `tile_wild_multiplier.webp` |
| scatter_lotus | `tile_scatter_lotus.webp` |

Effect / chrome assets: `spritesheet_win_glow.{webp,json}`, `spritesheet_wildx2_flash.{webp,json}`, `spritesheet_coin_shower.{webp,json}`, `spritesheet_fs_rays.{webp,json}`, `spritesheet_fire_lotus.{webp,json}`, `winning_text_nice.webp`, `winning_text_sensational.webp`, `chrome_grid_frame.webp`, `chrome_spin_button.webp`, `chrome_vault_panel.webp`, `logo_base.webp`, `logo_fs.webp`, `gridBackground_base.webp`, `gridBackground_fs.webp`, `cell_plate_fs_red.webp`, `particle_coin.webp`, `particle_spark.webp`, `particle_fire_lotus.webp`, `particle_gem_chip.webp`.

<<<END>>>

This is all the response, Coder