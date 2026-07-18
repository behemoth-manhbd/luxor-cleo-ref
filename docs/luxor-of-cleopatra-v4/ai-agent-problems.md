# AI Agent Problems — Docs v4 sai/thiếu so với evidence thật

Các lỗi trong `docs/luxor-of-cleopatra-v4/` phát hiện khi đối chiếu toàn bộ 13 file docs md
với `game-spec.json`, `paytable-vision.json`, `browser-play-log.txt`,
`browser-observations.json`, 22 screenshot đặt tên (`screenshots/paytable-1→6.webp`,
`free_spins-*.webp`, `modal-*.webp`, …), 352 frame session và video `freespin-play.webm`
(trích frame 2fps). Screenshots + video là nguồn chuẩn cuối cùng. Ngày kiểm tra: 2026-07-18.

Quy đổi giá: ảnh paytable hiển thị tiền đô ở mức cược $2.00 → hệ số nhân cược = giá trên ảnh ÷ 2.

Lưu ý bối cảnh: pass verify tự động trước đó (`docs-verify.json`) đã sửa 15 section trong
docs md — vì vậy **paytable trong docs md hiện khớp ảnh 100%**. Các lỗi dưới đây là phần
pass đó bỏ sót, tập trung ở `game-spec.json` và các bảng/câu chưa được sync.

## 1. `game-spec.json` — `symbols[].pay` stale, mâu thuẫn với `math.paytable` cùng file

`paytable-vision.json` đã đọc 6 ảnh paytable và sửa 30 giá trị vào `math.paytable`
(docs md render từ đây nên đúng), nhưng mảng `symbols[].pay` (`game-spec.json:21-240`)
**không được cập nhật theo** — ai build engine từ `symbols[].pay` sẽ sai hàng loạt:

| Symbol | symbols[].pay (cũ, ×cược) | math.paytable = ảnh thật (×cược) | Lệch |
|---|---|---|---|
| cleopatra | [1, 2, 5] | [0.25, 2.5, 3.75, 5] (4 band) | thiếu 2-OAK; 3-OAK 1→2.5; 4-OAK 2→3.75 |
| scarab | [0.8, 1.5, 4] | [0.1, 2, 3, 4] (4 band) | thiếu 2-OAK; 3-OAK 0.8→2; 4-OAK 1.5→3 |
| ring | [0.5, 1, 3.5] | [0.1, 2, 3, 4] (4 band) | thiếu 2-OAK; sai cả 3 band còn lại |
| eye_of_horus | [0.6, 1.2, 4] | [1, 2.5, 3.5] | sai cả 3 band |
| coin | [0.5, 1, 3.5] | [1, 2.5, 3.5] | 3-OAK 0.5→1; 4-OAK 1→2.5 |
| A | [0.3, 0.6, 3] | [0.25, 1.5, 3] | 3-OAK 0.3→0.25; 4-OAK 0.6→1.5 |
| K | [0.3, 0.6, 2.5] | [0.25, 1.5, 3] | sai cả 3 band |
| Q | [0.25, 0.5, 2.5] | [0.15, 1, 2.5] | 3-OAK 0.25→0.15; 4-OAK 0.5→1 |
| J | [0.2, 0.5, 2] | [0.15, 1, 2.5] | sai cả 3 band |
| T | [0.2, 0.4, 2] | [0.15, 0.5, 2] | 3-OAK 0.2→0.15; 4-OAK 0.4→0.5 |
| 9 | [0.2, 0.4, 2] | [0.1, 0.15, 0.5, 2] (4 band) | thiếu 2-OAK; sai 3/4-OAK |
| wild_multiplier / scatter | khớp | khớp | ✅ |

- Gameplay corroborate: `base_spin-win1.webp` hiện "2X cleopatra PAYS $0.50" (0.25× — đúng
  band 2-OAK); `wintier-mega.webp` hiện "8X PAYS $67.50" = 3.75 × $2 × 9 ways (đúng band 4-OAK).
- **Việc cần làm:** đồng bộ `symbols[].pay` + `payCounts` theo `math.paytable`
  (thêm band 2 cho cleopatra/scarab/ring/9), sửa các note "estimated from market range" đi kèm.

## 2. `game-spec.json` — Vault pre-mark ghi "at round start", sai với paytable p3 và video

- **Sai (`game-spec.json:348`):** "Eight positions on reels 2-4 are pre-marked with keys
  **at round start**".
- **Đúng (paytable-3, in nguyên văn):** "When the round starts, **after the first free
  spin**, 8 random positions on the screen on reels 2, 3 or 4 are marked."
- **Video xác nhận (`freespin-play.webm` t≈129–131.5s; frames 0116/0171/0214/0293):**
  counter giữ **0/20 suốt free spin 1** (kể cả khi splash đã đóng và reels đang quay);
  marks + counter chỉ nhảy lên (8/20 hoặc 10/20 nếu có cleopatra rơi cùng spin) **khi spin 1
  resolve**. Không có frame nào 8/20 trước spin 1.
- Các docs md (`vault_bonus-mechanics.md:11,18`, `free_spins-mechanics.md:23`) đã ghi ĐÚNG —
  chỉ spec JSON chưa sửa.

## 3. `game-spec.json` — 2 note provenance stale phủ nhận chính dữ liệu đã confirmed

- **Sai (`game-spec.json:316`, `math.paytable._note`):** "all regular-symbol figures are
  ESTIMATES from market-research ranges … captured only in paytable screenshots, **not
  transcribed**" — trong khi `paytable-vision.json` đã transcribe + sửa vào chính bảng này,
  và `estimationMethod."math.paytable"` cùng file (`game-spec.json:430`) ghi
  "screenshot-confirmed (paytable-*.png)".
- **Sai (`game-spec.json:238`, note của scatter):** "4/5 pays (5x/25x) **estimated** from
  market research" — paytable-2 in nguyên văn "4x SCATTER symbols pay 5x total bet / 5x
  SCATTER symbols pay 25x total bet" → phải là confirmed.

## 4. `event-order-and-determinism.md` — 2 bảng chưa sync với thân doc về pre-mark

Thân doc đã sửa đúng (step 2 `vault_init … markedCount = 0 — no positions are pre-marked
yet` dòng 46; pre-mark nằm trong spin 1 ở step 3d dòng 51), nhưng:

- **Sai (dòng 17, bảng Canonical Event IDs):** `vault_init | payload … preMarked=8 | at
  fs_start` — mâu thuẫn trực tiếp với step 2 ngay bên dưới.
- **Sai (dòng 78, bảng RNG draw order):** draw #6 "Vault pre-mark selection (8 positions) |
  **at `vault_init`**" — pre-mark phải là draw thuộc free spin 1, sau khi board spin 1 resolve.
- **Việc cần làm:** sửa payload `vault_init` thành `preMarked=0`, chuyển draw #6 xuống vị trí
  sau board-fill của free spin 1.

## 5. Thiếu mechanic: pyramid WILD xuất hiện cả TRONG Free Spins

- **Evidence:** `free_spins-vault-progress.webp` (pyramid WILD reel 4, nền đêm FS, vault
  đang chạy); frames 0090 (reel 4), 0217/0220 (reel 4), 0293 (reel 3); video t≈134s
  (reel 3). Mọi lần xuất hiện đều nằm trong reels 2–4 — khớp restriction của paytable-1.
- **Thiếu/Sai:**
  - `free_spins-mechanics.md:15` chỉ ghi "Wild present in FS: `wild_multiplier`" → người
    đọc hiểu FS chỉ có 1 loại wild. Thực tế FS có **cả hai**: pyramid wild (reels 2–4,
    không pay riêng) + wild_multiplier (mọi reel, ×2).
  - `browser-observations.json:22` ghi "restricted to reels 2, 3, 4 **in base game only**"
    — chữ "only" sai (paytable-1 cũng không hề giới hạn wild vào base game).
  - `art-design.md:59` ghi "reels 2-4 only (base)" — cần bỏ "(base)".
- **Hậu quả nếu build theo docs:** FS reel strips sẽ thiếu pyramid wild → math FS lệch.

## 6. `game-features.md` — win rule tóm tắt sai "3+ consecutive reels"

- **Sai (`game-features.md:5`):** base_game "a symbol pays when it lands on **3+**
  consecutive reels from the left".
- **Đúng (`product-spec.md:16` + paytable-1 + `base_spin-win1.webp`):** cleopatra, scarab,
  ring, 9 trả từ **2** reel liên tiếp (đã thấy trả thật $0.50 cho 2 cleopatra).
- Sót tương tự: câu "Why" của TV-01 (`test-vectors.md:22`) vẫn ghi "win rule requires a 3+
  reel run from the left" (board TV-01 cho kết quả $0 đúng, nhưng lý do nêu sai rule).

## 7. `math-and-rtp.md` — nhãn provenance tự mâu thuẫn với chính Provenance Note

- Dòng 6 ghi Base RTP 96.51% "estimated (confidence: 0.50)", dòng 9 ghi max win 12,500×
  "estimated (confidence: 0.50)" — nhưng dòng 44 cùng file liệt kê cả hai là
  "**Exact / screenshot-confirmed** … (paytable-3, paytable-4)", và thực tế paytable-4 in
  "The theoretical RTP of this game is 96.51%", paytable-3/6 in rule 12,500× đầy đủ.
- TV-11 (`test-vectors.md:85`) cũng mang nhãn "12,500× — estimated" thừa kế từ đây.
- **Việc cần làm:** đổi nhãn RTP (số in-game) + max win thành confirmed/screenshot-confirmed;
  giữ "estimated" cho hit frequency và RTP tiers (đúng là không có trong game).

## 8. `test-vectors.md` — 2 vết stale còn sót sau pass sửa

- **TV-04 (`test-vectors.md:37`):** "(Contrast **TV-03's $4.00** — band 5 ≠ band 4.)" —
  TV-03 đã được sửa thành **$7.50** (dòng 27); câu đối chiếu chưa update.
- **TV-10 (`test-vectors.md:81`):** vault nhảy $50 → "Round ends with … vaultValue =
  **$52.00**" không có increment nào được nêu cho +$2 (hợp lệ — increment 1× = $2 tồn tại
  trong bảng 1-wild — nhưng vector phải khai báo tường minh để dùng làm golden test).

## 8b. `test-vectors.md` TV-09 — board tự sinh side-wins không được tính trong "Then"

- **Sai (TV-09, dòng 68-78):** "Then" chỉ tính cleopatra run-5 ×4 = **$40.00**, nhưng board
  GIVEN còn tạo thêm các run khác đi QUA 2 wild (reels 2-3) theo đúng win rule của chính docs:
  A chạy 4 reel (A c1 → wild → wild → A c4, weighted 4) = $12.00; K chạy 4 reel (weighted 6)
  = $18.00; 9 chạy 3 reel (weighted 6) = $1.80. Tổng đúng của board = **$71.80**, không phải $40.
- **Việc cần làm:** đổi các ô đệm quanh wild để không symbol nào khác nối được run
  (hoặc cập nhật expected total thành $71.80). Phát hiện khi build game-v4 từ docs —
  vector này fail nếu assert tổng.

## 9. Rác generate cuối file

- `game-features.md:15-17` dính `<<<END>>>` + "This is all the response, Coder".
- `art-design.md:227-229` dính y hệt (`` `<<<END>>>` `` + câu kết response).
- Artifact của phiên AI generate, cần xóa (v3 từng dính cùng lỗi ở presentation-and-feel.md).

## 10. `browser-observations.json` — file evidence tự mâu thuẫn / thiếu dữ liệu

- **Đếm round sai (`:74-75`):** `"roundsObserved": 5` nhưng breakdown ngay dòng dưới ghi
  "3 naturally triggered + 1 triggered via Buy Feature" (= 4). Play-log thật có **5 round**:
  natural [t36], natural [t47], buy [t60], natural [t72], natural [t89].
- **`roundTotals` (`:96-130`) thiếu hẳn round natural #2** ($26.00, vault forfeit $70 —
  [t51] trong `browser-play-log.txt:55`; bằng chứng ảnh là chính
  `free_spins-waybreakdown.webp`). $26 lại bị ghi nhầm trong `wins` thành
  "base game, largest plain WIN banner".
- **Peak vault misattributed (`:92`):** "16/20 reached twice, in the **buy-feature round**
  and in the 4th/final natural round" — log cho thấy 16/20 thuộc round 1 natural [t40] và
  round 4 natural [t94]; buy round chỉ ghi nhận tới 15/20 [t62].
- **Coverage block tự mâu thuẫn (`:349-371`):** `missing: ["paytable"]` trong khi 6
  screenshot paytable nằm ngay trong `screenshots` cùng file (`:264-286`).

## 11. Screenshot đặt tên sai — khoảnh khắc way-breakdown không có ảnh

- `screenshots/free_spins-waybreakdown.webp` thực chất là **outro card** "YOU HAVE WON
  $26.00 IN 10 FREE SPINS" (vault $70), không phải dòng breakdown
  "5X 9 PAYS $2.00 X 2 = $4.00 ON 2 WAYS" của [t50].
- Hệ quả: format way-breakdown chỉ còn tồn tại dưới dạng text trong play-log, không có
  ảnh chứng — các doc trích format này (`presentation-and-feel.md:51`,
  `art-design.md:111,119`) đang dựa 100% vào log.

## 12. Presentation lệch nhỏ so với video

- **Vault panel không hiển thị $ value lúc round start:** thanh vault **trống** qua splash
  và suốt free spin 1 (frames 0081-0085/0116/0171/0214; video t≈129–130.5s); "$40.00"
  (hoặc $4.00 ở cược $0.20) chỉ hiện **cùng lúc** với đợt mark đầu sau spin 1.
  `presentation-and-feel.md:55` ("Vault panel shows 0–8/20" tại `fs_start`) và payload
  `vault_init{vaultValue=20×bet}` chỉ đúng về internal state, sai về hiển thị.
- **MEGA "observed at 8.49× bet" (`presentation-and-feel.md:22`, `game-spec.json:365`):**
  $16.98 là giá trị **đầu count-up**, không phải win thật — dòng breakdown trong
  `wintier-mega.webp` cho thấy riêng một combo đã pay $67.50 (33.75×). Nhãn "exact
  threshold not shown" nên giữ, nhưng con số 8.49× không dùng được làm threshold.

## 13. Các lỗi nhỏ còn lại

- `wild_multiplier-mechanics.md:13`: reel restriction ghi "[ASSUMPTION: unrestricted on FS
  reels]" — thừa: paytable-2 in nguyên văn "It **can appear on all reels** only during the
  FREE SPINS feature" → là confirmed, cần cite paytable p2 thay vì assumption.
- `ui-and-controls.md:26`: autospin slider "verified ≥100" — log [t33] cho thấy phiên chạy
  thật với "AUTO SPINS LEFT 997" → slider đã lên ~1000, doc dè dặt quá mức cần thiết.
- `video-doc-audit.json:2-3`: `status: "skipped", reason: "no_api_key"` — bước audit video
  của pipeline **chưa từng chạy**; mọi kết luận video trong báo cáo này là do kiểm tra
  thủ công frame/video ngày 2026-07-18, không phải từ pipeline.

## Đã kiểm chứng ĐÚNG — giữ nguyên, không đụng

- **Paytable md (`product-spec.md:18-32`, `math-and-rtp.md:19-33`):** khớp paytable-1/2
  **từng con số**, gồm cả 4 band 2-OAK (cleopatra 0.25×, scarab/ring/9 0.1×), wild_multiplier
  [0.5, 5, 12.5, 25] và scatter [1, 5, 25].
- **Vault:** start 20× cược ($40 @ $2 — [t48] + outro screenshots); bảng wild-increment 6
  dòng (1→6+ wild) khớp paytable-2 **từng giá trị**; scatter trong FS +10×/50×/250× (p3);
  chỉ pay khi 20/20, forfeit xác nhận 5 lần ($6 vs vault $113; $13.20 vs $83; $14.20 vs $56;
  video); pre-mark 8 ô reels 2–4 **sau** free spin 1 (p3 + video); cleopatra mark ô chưa
  mark, ô marked đỏ + medallion key vàng, ô thường tím (frames 0086/0119/0178).
- **Free spins:** 10 spins cố định cho 3/4/5 scatter (p2 + 2 trigger screenshots); **không
  retrigger** — counter chỉ đếm xuống trong mọi round quan sát, scatter giữa round chỉ cộng
  vault; scatter trigger pay 1× ($2.00 hiển thị trên trigger screen); outro bị ẩn khi Skip
  Screens bật [t96].
- **Wild ×2:** chỉ trong FS, mọi reel (p2 + frame 0090 wild trên reel 1), nhân multiplicative
  khi cùng way (p2 nguyên văn "their multipliers multiply each other").
- **Buy feature:** 30× cược = $60 @ $2 (modal + p3); forced đúng 3 scatter (p3 nguyên văn);
  sổ sách chính xác đến cent ($99,700.60 + $14.20 = $99,714.80 — buytrigger/buyoutro);
  không có super-buy/rebuy.
- **Max win 12,500× + round ends immediately** — in nguyên văn trên p3 và p6.
- **Bet model:** min $0.20 / max $240 (p4); Total Bet = Bet × Coin Value × 20 — xác thực
  bằng `modal-bet-panel.webp` (3 × $0.05 × 20 = $3.00); không có ante-bet [t100].
- **RTP 96.51% / buy 96.56%** in trên p4; volatility "Medium" text + splash 5-bolt
  (frame-0001) — mâu thuẫn in-game được docs ghi trung thực.
- **UI/modals:** 4 modal khớp docs từng toggle (Autoplay: Turbo/Quick mutually-exclusive +
  Skip Screens + slider; Settings: Battery Saver/Ambient/Sound FX/Intro/Game History/Total
  Bet; Bet Multiplier 20x; Buy Feature).
- **Không có cascade/tumble, không paylines** — xác nhận qua toàn session + p1.

## Không sửa được từ evidence (gaps hợp lệ, không phải lỗi docs)

- Reel-strip weights (base + FS special reels) — proprietary, docs đã ghi "not-derivable".
- Phân phối xác suất Vault increment và số spin tối thiểu để đạt 20/20 — chỉ biết tập giá
  trị; 20/20 chưa từng quan sát được (peak 16/20).
- Hit frequency 25% và RTP tiers 94.56%/95.51% — không có trong game, docs đã gắn estimated.
- Win tiers ngoài MEGA (Big/Super/Epic) — chưa quan sát; docs ghi đúng "unconfirmed, NOT
  confirmed absent".
- Số bolt **sáng** chính xác trên badge volatility paytable-4 — ảnh không đủ phân giải
  (splash thì rõ 5 bolt).
- Video round cược $0.20 hiện 10/20 ngay sau spin 1 — nhất quán với "8 pre-mark + 2
  cleopatra cùng spin" ([t48] mô tả y hệt) nhưng không tách bạch được từ video ô nào là
  pre-mark, ô nào do cleopatra.
