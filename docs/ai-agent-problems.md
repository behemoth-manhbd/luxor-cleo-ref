# AI Agent Problems — Docs v3 sai/thiếu so với Game Rules thật

Các lỗi trong `docs/luxor-of-cleopatra-v3/` phát hiện khi đối chiếu với ảnh chụp GAME RULES
(`docs/luxor-of-cleopatra/screenshots/paytable-1→6.webp`). Screenshots là nguồn chuẩn
cuối cùng; các con số bất thường (cột symbol 9, hàng premium) đã được crop + phóng to để
xác nhận. Ngày kiểm tra: 2026-07-16 (re-check lần 2 cùng ngày).

Quy đổi giá: ảnh hiển thị tiền đô ở mức cược $2.00 → hệ số nhân cược = giá trên ảnh ÷ 2.

## 1. `game-spec.json` — paytable cũ chưa đồng bộ, là GỐC RỄ của các test vector sai

`index.md` tuyên bố docs "Generated deterministically from game-spec.json", nhưng JSON vẫn
giữ số ước tính cũ trong khi docs md đã sửa theo ảnh:

| Symbol | game-spec.json (×cược) | Ảnh thật (×cược) | Lệch |
|---|---|---|---|
| ankh_ring / gold_scarab | [0.5, 2, 4] (3 band) | [0.1, 2, 3, 4] (4 band) | 3-OAK 0.5→2; 4-OAK 2→3; thiếu 2-OAK |
| cleopatra_coin / eye_of_horus | [1, 2, 3.5] | [1, 2.5, 3.5] | 4-OAK 2→2.5 |
| sym_q / sym_j | [0.2, 1, 2.5] | [0.15, 1, 2.5] | 3-OAK 0.2→0.15 |
| sym_10 | [0.15, 0.8, 2] | [0.15, 0.5, 2] | 4-OAK 0.8→0.5 |
| sym_9 | [0.15, 0.8, 2] | [0.1, 0.15, 0.5, 2] (4 band) | thiếu 2-OAK; 4-OAK 0.8→0.5 |
| ram_coin | [0.75, 2, 3.75] | KHÔNG TỒN TẠI | symbol ma (xem mục 5) |
| wild_multiplier | [] (rỗng) | [0.5, 5, 12.5, 25] | thiếu cả bảng giá |
| cleopatra / sym_a / sym_k / scatter | khớp | khớp | ✅ |

- Ai build game từ `game-spec.json` thay vì docs md sẽ sai paytable hàng loạt.
- TV-03/TV-04/TV-06 sai (mục 4, 5) chính là do sinh từ các số cũ trong JSON này.
- **Việc cần làm:** cập nhật `symbols[].pay` + `math.paytable` theo ảnh, xóa `ram_coin`,
  bổ sung pay cho `wild_multiplier`, rồi regenerate docs.

## 2. `product-spec.md` + `math-and-rtp.md` — win rule và bảng giá thiếu các band 2-of-a-kind

- **Sai (`product-spec.md:21`):** "Cleopatra pays from 2 adjacent reels; all other regular
  symbols pay from 3".
- **Đúng (paytable-1, đã crop xác nhận):** có **4 symbol thường trả từ 2 reel**:
  - cleopatra 2=$0.50 (0.25×)
  - gold_scarab 2=$0.20 (0.1×)
  - ankh_ring 2=$0.20 (0.1×)
  - **sym_9 2=$0.20 (0.1×)** — cột 9 có 4 dòng giá, cột 10 chỉ 3 dòng (đã zoom 4× xác nhận)
  - (wild_multiplier trong FS cũng trả từ 2: $1.00)
- **Sai kèm theo (`math-and-rtp.md:31`):** gộp "sym_10 / sym_9" một dòng → mất band 2-OAK
  của sym_9.
- Tự mâu thuẫn nội bộ: chính `math-and-rtp.md:27` có ankh_ring/gold_scarab 2=$0.20 nhưng
  win rule lại phủ nhận.
- **Hậu quả nếu code theo win rule:** bỏ sót tiền trả khi scarab/ring/9 dừng ở 2 reel đầu.

## 3. Thiếu rule MAX WIN early-termination

- **Thiếu:** grep toàn bộ docs v3 các từ "immediately / remaining free spins / remaining
  features" → 0 kết quả. Docs chỉ có bước clamp `win_cap_clamp`
  (`event-order-and-determinism.md:20,61`).
- **Đúng (paytable-3, paytable-6):** khi tổng win của round **chạm 12,500× bet**, round
  **kết thúc NGAY LẬP TỨC**: win trả tại cap, toàn bộ free spins còn lại và mọi feature
  (kể cả Vault chưa trả) bị **hủy**.
- **Khác biệt bản chất:** cùng số tiền trả nhưng luồng game khác hẳn — engine phải check
  cap **sau mỗi spin/award**, không phải chỉ clamp một lần ở cuối round.

## 4. `test-vectors.md` TV-06 — sai giá gold_scarab 3-of-a-kind

- **Sai (`test-vectors.md:85`):** tính `0.5 × 2.0 × 1 = $1.00`.
- **Đúng (paytable-1):** scarab 3-OAK = **$4.00** (2× cược). Expected value đúng:
  `2.0 × 2.0 × 1 = $4.00`.
- Nguồn gốc: số 0.5 lấy từ `game-spec.json` cũ (mục 1).

## 5. `ram_coin` — symbol ma, kéo theo TV-03/TV-04 không tin được

- **Sai:** TV-03 (`test-vectors.md:46`, pay 0.75×) và TV-04 (`:58`, pay 2.0×) xây trên
  `ram_coin`.
- **Thực tế (paytable-1):** trang symbol chỉ có 11 symbol thường (cleopatra, scarab, ring,
  coin, eye, A, K, Q, J, 10, 9) + wild pyramid + scatter + wild multiplier — **không có
  ram_coin**, và pay 0.75×/2.0× không khớp cột nào.
- Chính `product-spec.md:24` thừa nhận "ram_coin's icon mapping remains unconfirmed"
  nhưng vẫn dùng làm golden vector. Nguồn gốc: `game-spec.json symbols[5]` (mục 1).
- **Việc cần làm:** xóa ram_coin khỏi spec; thay TV-03/TV-04 bằng symbol thật
  (vd cleopatra_coin 3=$2.00 / 4=$5.00).

## 6. `test-vectors.md` TV-08 — sai Vault increment của wild hit

- **Sai (`test-vectors.md:109`):** ghi "`vault_update`: +10× bet from the wild hit"
  (cố định).
- **Đúng (paytable-2, và chính `vault-mechanics.md:11` cùng bộ docs):** increment là
  **random draw** từ bảng theo số wild hit cùng spin; 1 wild → tập giá trị
  {1, 1.5, 2, 2.5, 5, 12.5, 25, 50}× — **10× thậm chí không nằm trong tập 1-wild**
  (10× chỉ xuất hiện từ tập 2-wild trở lên).
- Phần tính win của TV-08 ($0.50 × 2 = $1.00) vẫn đúng — chỉ sai phần Vault.

## 7. `event-order-and-determinism.md` — RNG Contract tham chiếu bảng không tồn tại

- **Sai (`event-order-and-determinism.md:65`):** mở đầu "The draw-order table's step …"
  nhưng cả file (74 dòng) **không có bảng draw-order nào** (bản v1 có bảng 8 draw
  positions; v3 làm mất khi viết lại).
- **Việc cần làm:** khôi phục bảng draw-order đầy đủ, thêm draw riêng cho Vault increment
  (random theo số wild hit) đúng như đoạn correction yêu cầu.

## 8. Nhãn provenance tự mâu thuẫn / quá dè dặt với số liệu đã hiển thị in-game

- `math-and-rtp.md:40` ghi paytable "estimated (confidence: 0.4) — market research, not
  exact" trong khi `:34` cùng file khẳng định "All of the above **match the in-game
  paytable exactly** (paytable-1.webp)". → paytable phải là **confirmed**.
- RTP 96.51%/96.56% in rõ trên paytable-4; max win 12,500× in trên paytable-3/6 →
  nên là confirmed thay vì estimated (`math-and-rtp.md:6-9`).
- `free_spins-mechanics.md:5` gắn scatter pay 1×/5×/25× "estimated (confidence: 0.4)"
  dù paytable-2 in nguyên văn → phải là confirmed.

## 9. Thiếu rule "Only the highest win is paid per way"

- **Thiếu:** grep "highest" toàn docs v3 → 0 kết quả. Paytable-4 ghi rõ rule này.
- **Ý nghĩa:** mỗi way chỉ trả MỘT lần theo combo cao nhất. Ví dụ wild giúp một way đọc
  được thành cả 4-OAK ($6.00) lẫn 3-OAK ($4.00) → chỉ trả $6.00, không cộng dồn.
  Không có rule này engine dễ trả trùng.

## 10. Rác generate cuối file

- `presentation-and-feel.md:69-71` dính `<<<END>>>` + "This is all the response, Coder" —
  artifact của phiên AI generate, cần xóa. (File cùng tên bên `docs v1` cũng dính y hệt,
  dòng 53–55.)

## Đã kiểm chứng ĐÚNG — giữ nguyên, không đụng

- **Công thức ways:** `win = pay(reelsMatched) × totalBet × ways`, ways = tích số symbol
  mỗi reel — corroborate live (4× A = $3.00). TV-02, TV-05, TV-09, TV-11, TV-12 đều khớp ảnh.
- **Paytable md:** trừ dòng sym_9, toàn bộ bảng trong `math-and-rtp.md:24-32` khớp ảnh
  từng con số.
- **Vault:** khởi đầu 20× cược; 20 ô = toàn màn hình; 8 ô mark trên reels 2/3/4 **sau**
  free spin đầu; cleopatra rơi trúng ô chưa mark thì mark; bảng increment theo số wild
  (1→6+ wild) khớp paytable-2 từng giá trị; scatter trong FS cộng 10×/50×/250×.
- **Buy feature:** 30× cược, luôn đúng 3 scatter, trả kèm scatter pay 1× — khớp paytable-3,
  xác nhận live $60 trên cược $2.
- **Free spins:** 10 spins cố định cho 3/4/5 scatter; wild multiplier ×2 cố định, nhân
  với nhau khi cùng combo; wild pyramid không pay riêng, reels 2/3/4.
- **Bet model:** min $0.20 / max $240; RTP 96.51% / buy 96.56% — khớp paytable-4.

## Không sửa được từ ảnh (gaps hợp lệ, không phải lỗi docs)

- Symbol weights của reel strips (base + FS "special reels") — proprietary.
- Phân phối xác suất của Vault increment (chỉ biết tập giá trị, không biết weight).
- Hit frequency — không có trên info screen; con số ~32% trong docs là placeholder 0 nguồn.
- Thang win-tier đầy đủ (NICE/MEGA/SENSATIONAL/…) — rules không liệt kê; chỉ có quan sát.
