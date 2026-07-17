# Plan: Luxor of Cleopatra — Build game trên PixiJS + React + TypeScript

Nguồn mechanic: các thông số **đã kiểm chứng bằng ảnh GAME RULES** (paytable-1→6) — xem
`plans/game-mechanics-implementation.md` mục 0–7 và `docs/ai-agent-problems.md` (phần
"Đã kiểm chứng ĐÚNG"). KHÔNG dùng số trong `game-spec.json` (paytable cũ, sai).

## 0. Scope & giả định

- **Trong scope:** client game hoàn chỉnh chạy browser — engine toán học deterministic,
  render PixiJS, HUD/controls React, đầy đủ mechanic đã chốt (base ways, free spins,
  wild multiplier, vault, buy feature, max-win cap early-termination).
- **Ngoài scope (tạm thời chưa cần):** art/audio final (dùng placeholder), backend/server
  RNG, real money, i18n, mobile portrait layout riêng.
- Demo balance khởi tạo $100,000 như bản gốc; mọi số tiền tính bằng cent (integer) để
  tránh lỗi floating point.

## 1. Tech stack

| Thành phần | Chọn | Lý do |
|---|---|---|
| Build | Vite + TypeScript strict | chuẩn hiện tại cho Pixi + React |
| Render | PixiJS v8 (`pixi.js`) | WebGL/WebGPU, sprite/particle tốt cho slot |
| UI | React 18 | HUD, modal, menu — phần DOM overlay |
| State bridge | zustand | store nhỏ, đọc được từ cả React lẫn Pixi ticker |
| Test | vitest | unit engine + golden snapshot |
| Sim | script Node (tsx) | chạy hàng triệu spin tune RTP |

Nguyên tắc kiến trúc số 1: **engine thuần TS, không import pixi/react** — engine nhận
`(seed, stake, mode)` trả về event stream; Pixi/React chỉ là consumer.

## 2. Cấu trúc thư mục

```
src/
  engine/                 # THUẦN TS — deterministic, test được headless
    types.ts              # SymbolId, Board, SpinResult, GameEvent, ...
    rng.ts                # mulberry32 + DrawOrder (thứ tự draw cố định, chỉ append)
    config/
      paytable.ts         # bảng pay ĐÃ XÁC MINH (mục 3 dưới)
      symbols.ts          # 14 symbol id + minCount + thuộc tính (wild/scatter/FS-only)
      strips.ts           # reel strips base + FS special reels (placeholder weights)
      vault.ts            # bảng increment theo số wild (1→6+), giá trị start 20×
      bets.ts             # bet levels $0.20–$240, coin value × bet multiplier
    ways.ts               # đánh giá 1024 ways (mục 4 dưới)
    spin.ts               # resolve 1 spin: board → wins → scatter → events
    freeSpins.ts          # subloop 10 spins + vault + cap early-termination
    buyFeature.ts         # trừ 30×, ép 3 scatter, vào FS
    round.ts              # orchestrator: base round / buy round, phát event stream
  game/                   # PixiJS presentation
    PixiStage.tsx         # React wrapper: tạo Application, resize, mount canvas
    scenes/ BaseScene.ts FreeSpinsScene.ts
    reels/  ReelView.ts SymbolSprite.ts spinAnimation.ts
    fx/     winHighlight.ts tierBanner.ts vaultMeter.ts transitions.ts
    presenter.ts          # queue: nhận GameEvent[] → play tuần tự theo timing
  ui/                     # React DOM overlay
    HUD.tsx  BetMenu.tsx  BuyFeatureModal.tsx  AutoplayMenu.tsx
    SettingsMenu.tsx  InfoPages.tsx  WinDisplay.tsx
  store/
    gameStore.ts          # zustand: balance, bet, phase, fsState, vault, settings
  assets/                 # placeholder textures (generated shapes/text)
scripts/
  simulate.ts             # RTP simulation CLI
tests/
  engine/ ways.test.ts vault.test.ts cap.test.ts buy.test.ts
  vectors/ testVectors.test.ts     # TV đã sửa theo paytable thật
  golden/ replay.test.ts           # snapshot event stream theo (seed, stake, mode)
```

## 3. Data engine — số liệu ĐÃ XÁC MINH (nguồn chuẩn, hệ số × tổng cược)

```ts
// paytable.ts — key = số reel liên tiếp từ reel 1
cleopatra:       { 2: 0.25, 3: 2.5,  4: 3.75, 5: 5   }
gold_scarab:     { 2: 0.1,  3: 2,    4: 3,    5: 4   }
ankh_ring:       { 2: 0.1,  3: 2,    4: 3,    5: 4   }
cleopatra_coin:  {          3: 1,    4: 2.5,  5: 3.5 }
eye_of_horus:    {          3: 1,    4: 2.5,  5: 3.5 }
sym_a, sym_k:    {          3: 0.25, 4: 1.5,  5: 3   }
sym_q, sym_j:    {          3: 0.15, 4: 1,    5: 2.5 }
sym_10:          {          3: 0.15, 4: 0.5,  5: 2   }
sym_9:           { 2: 0.1,  3: 0.15, 4: 0.5,  5: 2   }  // symbol thấp DUY NHẤT có band 2
wild_multiplier: { 2: 0.5,  3: 5,    4: 12.5, 5: 25  }  // FS only, có pay riêng
scatter_lotus:   {          3: 1,    4: 5,    5: 25  }  // anywhere, không theo ways
// wild_pyramid: KHÔNG có pay riêng — substitute mọi symbol trừ scatter, chỉ reels 2/3/4
```

- Min-count 2: cleopatra, gold_scarab, ankh_ring, sym_9, wild_multiplier. Còn lại: 3.
- KHÔNG có `ram_coin` (symbol ma trong game-spec.json — loại bỏ).
- Vault increment theo số wild cùng spin (đơn vị × cược):
  1→{1,1.5,2,2.5,5,12.5,25,50}; 2→{5,10,25,50,100,250,500,2500};
  3→{7.5,15,37.5,75,150,375,750,12500}; 4→{10,20,50,100,200,500,1000,12500};
  5→{12.5,25,62.5,125,250,625,1250,12500}; 6+→{15,30,75,150,300,750,1500,12500}.
- Hằng số: FS = 10 spins cố định, không retrigger (observation live 6 rounds — rules không
  ghi rõ); Vault start 20×, 20 ô = toàn lưới 4×5,
  8 ô mark random trên reels 2/3/4 SAU spin đầu; buy = 30×; max win 12,500×;
  bet $0.20–$240; RTP mục tiêu 96.51% base / 96.56% buy.

## 4. Engine — thuật toán chính

### 4.1 Ways evaluation (`ways.ts`)
Cho mỗi symbol trả tiền (trừ scatter), quét từ reel 1:
1. `effCount(reel, sym)` = số cell của `sym` + số cell wild trên reel đó
   (wild_pyramid ở base, wild_multiplier ở FS; wild không đếm cho scatter).
2. `matched` = số reel liên tiếp từ reel 1 có `effCount > 0`. Nếu `matched < minCount(sym)` → bỏ.
3. **Only highest win per way:** chỉ trả band `matched` (run dài nhất), không cộng band ngắn hơn.
4. Ways = tích `effCount` trên các reel matched; nhưng để nhân wild multiplier đúng
   per-way mà không cần liệt kê từng way, dùng **weight sum per reel**:
   `weight(reel) = Σ cell` với cell thường = 1, cell wild_multiplier = 2 (chính hệ số ×2 của nó).
   → `symbolWin = pay[matched] × totalBet × Π weight(reel)`.
   (Tương đương toán học với "mỗi way nhân 2^số-wild-trong-way rồi cộng các ways" —
   confirmed paytable-2: multipliers multiply each other. Ở base, wild_pyramid weight = 1.)
5. Tổng win spin = Σ symbolWin các symbol + scatter pay (nếu base).
6. **[AMBIGUOUS] wild_multiplier tự trả tiền:** rules chỉ nói multiplier áp cho combo "pass
   through" nó — không nói combo thuần wild có tự nhân ×2 không. Engine dùng config
   `wildSelfMultiplier` (default **false** = trả theo pay riêng, KHÔNG nhân ×2 chính nó);
   wild_pyramid không bao giờ ở reel 1 nên không có case này.

### 4.2 Spin resolve (`spin.ts`) — event order chuẩn
```
spin_start → bet_deduct(base/buy) → reels_land(board 4×5)
→ ways_evaluate → [FS] wild_multiplier_apply → scatter_check → win_detect
→ [FS] vault_update → win_present → [base, scatter≥3] fs_trigger → round_end
```
Draw order cố định (chỉ được APPEND, không chèn giữa — giữ golden snapshots):
`d1..d5` stop index reel 1→5 · `d6` buy: chọn vị trí 3 scatter · `d7` vault: increment
draw khi có wild hit · `d8` vault: chọn 8 ô init · `d9` vault: chọn ô khi cần random khác.

### 4.3 Free spins + Vault (`freeSpins.ts`)
- Vào FS: `vault = 20 × bet`, `marked = bộ rỗng`, `remaining = 10`, dùng **FS special strips**.
- Sau spin 1 resolve: mark 8 ô random thuộc reels 2/3/4 (12 ô → chọn 8).
- Mỗi spin: cleopatra rơi TRÚNG Ô chưa mark → mark ô đó (marking theo vị trí, toàn lưới);
  ≥1 wild hit → vault += draw từ bảng theo SỐ wild; 3/4/5 scatter → vault += 10/50/250×
  (không retrigger, không cash [assumption]); clamp vault ≤ 12,500× bet.
- Hết 10 spin: `marked == 20` → trả vault (event `vault_award`, banner ROYAL TRIBUTE);
  ngược lại mất trắng. Rồi `fs_end` → `round_end`.

### 4.4 Max-win cap — early termination (`round.ts`)
Sau MỖI spin/award: nếu tổng win round ≥ `12,500 × bet` → clamp về cap, emit
`win_cap_clamp`, **kết thúc round NGAY** (hủy spins còn lại + vault chưa trả) → `round_end`.
Đây là điểm khác biệt quan trọng nhất so với "clamp cuối round" — có test riêng.

### 4.5 Buy feature (`buyFeature.ts`)
Modal → CONFIRM BUY → trừ `30 × bet` (chặn nếu thiếu balance [assumption]) → board ép
đúng 3 scatter (vị trí từ d6) → trả scatter pay 1× [assumption] → vào FS như natural.
Cancel: không trừ tiền.

## 5. Presentation — PixiJS

- `PixiStage.tsx`: một `Application` duy nhất, canvas fit container 16:9 (tỉ lệ là lựa chọn
  thiết kế — ảnh gốc không chốt tỉ lệ khung game), React chỉ mount/
  unmount; KHÔNG re-render React theo frame — Pixi tự chạy ticker, đọc store khi cần.
- **Presenter queue** (`presenter.ts`): engine trả về `GameEvent[]` NGAY (toán học tách
  khỏi animation); presenter play tuần tự từng event với timing map
  (mọi duration dưới đây là **[ASSUMPTION]** placeholder — docs chỉ có ước lượng 400–600ms):

| Event | Hiệu ứng (placeholder trước, art sau) | Normal / Turbo |
|---|---|---|
| reels_land | 5 cột drop lệch pha trái→phải, ease-out | 450ms/reel · <150ms tổng |
| win_present | highlight vàng ô thắng + counter roll-up + dòng breakdown | ~1s · skip |
| tier banner | NICE / MEGA / SENSATIONAL (tên + thứ tự thang là suy luận từ observation v1+v3, rules không liệt kê; ngưỡng đặt config — chưa confirmed) | 2–4s, tap-to-skip |
| fs_trigger | glow scatter + Cleopatra burst | 1.5s |
| fs_intro | day→night, banner "10 FREE SPINS", press-anywhere | chờ input |
| vault_update | "+$X" bay vào Vault meter; ô marked đổi khung đỏ/vàng + icon key | 0.5s |
| vault_award | banner ROYAL TRIBUTE UNLOCKED + roll-up vault | 3s |
| win_cap_clamp | banner MAX WIN (chưa từng quan sát — trình bày tự thiết kế) | 3s |
| fs_end | "YOU HAVE WON $X IN 10 FREE SPINS" → về base scene | 2s |

- Symbol placeholder: `Graphics` khung màu + text id (cleopatra đỏ, scarab/ring vàng,
  royals xanh, wild tím, scatter hồng) — thay texture atlas sau không đổi code logic.
- FS scene: nền đêm, Vault meter (giá trị + tiến độ n/20), counter "FREE SPINS LEFT n",
  reel 4/5 nền "special reel" đỏ.

## 6. UI React (DOM overlay trên canvas)

Theo paytable-5/6: SPIN (Space/Enter, giữ Space = turbo), stop-spin, BUY FEATURE
(modal 2 bước: cost 30× → CONFIRM BUY Cancel/Yes), bet +/− mở Bet Menu (BET multiplier
× COIN VALUE, range $0.20–$240), AUTOPLAY (menu — nội dung menu là ngoại suy, rules chỉ nói "opens the automatic play menu"; bấm lại để dừng), speed cycle
normal/quick/turbo, Settings (INTRO SCREEN / AMBIENT / SOUND FX / GAME HISTORY stub),
Info 6 trang (render lại từ config — tự khớp paytable engine), CREDIT/BET click đổi
coins↔cash, WIN display + per-way breakdown
(format: `<n>X <symbol> PAYS $<pay×ways> X<mult> = $<total> ON <ways> WAYS`).

Store phases: `idle → spinning → presenting → fsIntro → fsSpinning → fsOutro → idle`;
input bị khóa theo phase; autoplay/turbo là modifier.

## 7. Milestones

| # | Deliverable | Acceptance |
|---|---|---|
| M0 | Scaffold Vite+React+TS strict+Pixi+vitest, cấu trúc thư mục, CI lint/test | `pnpm dev` chạy canvas trống + HUD khung |
| M1 | Engine base: rng, strips placeholder, ways eval, scatter, paytable | TV-01/02/05/06(sửa)/07/12 pass; test min-count 2 cho scarab/ring/9; test highest-band-only |
| M2 | Engine FS: wild ×2, vault đầy đủ, buy, cap early-termination | TV-08(sửa)/09/11 pass; test 19/20 forfeit, 20/20 award, cap giữa FS → end ngay; golden replay: cùng seed ⇒ cùng event stream |
| M3 | Pixi base: reels spin/land, win highlight, counter, turbo | chơi được base game bằng mắt, seed cố định tái hiện đúng |
| M4 | React HUD đầy đủ (mục 6) + bet model + balance | thao tác đủ các control; buy trừ đúng $60 trên bet $2 |
| M5 | FS presentation: transition, vault meter/marking, banners, outro | chạy trọn 1 round FS mua bằng buy giống flow bản gốc |
| M6 | Simulation CLI + RTP tuning | sim ≥10M spins; base RTP 96.51% ±0.1, buy 96.56% ±0.1; max win không vượt 12,500× |
| M7 | Polish: resize, tap-to-skip, autoplay hoàn chỉnh, QA checklist các docs mechanics | pass QA checklist trong 4 file *-mechanics.md (bản đã sửa) |

Thứ tự phụ thuộc: M1→M2 (engine xong mới render), M3 có thể song song M2 (dùng board giả),
M6 chỉ cần M2.

## 8. Testing

- **Unit (vitest):** ways evaluator (bảng case: wild bridge, min-count 2, highest-band,
  weight-sum vs liệt kê ways — property test đối chiếu 2 cách tính), vault marking/increment,
  cap, buy.
- **Test vectors:** dùng bộ TV đã SỬA theo paytable thật (TV-03/04 thay ram_coin bằng
  cleopatra_coin; TV-06 = $4.00; TV-08 vault increment là draw, assert thuộc tập 1-wild).
- **Golden snapshots:** serialize event stream của ~20 seed cố định (base/FS/buy/cap);
  thay đổi rule nào cũng phải regenerate có chủ đích.
- **Simulation:** RTP, hit frequency, phân phối win, tần suất FS/vault-complete — output
  bảng để tune strips.

## 9. Gaps & cách xử lý trong code

| Gap (không có trong rules) | Xử lý |
|---|---|
| Reel strip weights (base + FS) | `strips.ts` placeholder, đánh dấu `// TUNABLE`, tune bằng M6 |
| Phân phối xác suất vault increment | uniform trên tập giá trị làm placeholder, `// TUNABLE` |
| Ngưỡng win tier (NICE/MEGA/SENSATIONAL) | config `winTiers` ước lượng (vd 5×/20×/50× bet), chỉnh sau |
| Scatter trong FS có trả cash? | KHÔNG trả (theo câu chữ paytable-3), flag config để đổi |
| Buy có trả scatter pay 1×? | CÓ (theo hành vi natural + live $2.00), flag config |
| Hit frequency mục tiêu | không cam kết — chỉ report từ simulation |
