# Plan: Luxor of Cleopatra — Game Mechanics Implementation

Nguồn: `docs/` (product-spec, math-and-rtp, free-spins, wild-multiplier, vault-award, buy-feature, event-order-and-determinism, test-vectors, game-spec.json) + **xác minh trực tiếp từ screenshots** (paytable-1→6, 05-small-win, 12-vault-20of20). Ảnh/art không thuộc scope plan này.

## 0. Nguồn chuẩn (source of truth) & các mâu thuẫn ĐÃ CHỐT bằng screenshot

`game-spec.json` chứa paytable ƯỚC TÍNH cũ; các file `.md` chứa paytable từ info screen. Screenshots là nguồn chuẩn cuối cùng:

| Điểm mâu thuẫn | Kết luận (đã xác minh bằng ảnh) | Bằng chứng |
|---|---|---|
| Công thức ways (blocker cũ) | **ĐÃ CHỐT — công thức chuẩn đúng:** `win = pay[soReelLienTiep] × soWays` (pay là giá trị per-way tại mức bet). Quan sát "$1.00 / 3 cleopatra / 2 ways" thực chất là win **2-of-a-kind** (cleopatra chỉ trên reel 1–2): $0.50 × 2 ways = $1.00. Nhãn "3X" trong breakdown = **tổng số symbol tham gia**, không phải số reel liên tiếp | 05-small-win.webp (board + "3X PAYS $1.00 ON 2 WAYS"), paytable-4 ("All wins are multiplied by bet per way… Only the highest win is paid per way… multiple payways are added") |
| Paytable symbol 9 | Docs `.md` chép SAI. Thật: **9: 2=$0.20 (0.1x) / 3=$0.30 (0.15x) / 4=$1.00 (0.5x) / 5=$4.00 (2x)** — 9 CÓ pay 2-OAK, 3-OAK là 0.15x (không phải 0.1x). Khớp luôn log "[t33] 4X 9 PAYS $0.60 X2 = $1.20 ON 2 WAYS" (= 3-OAK, 2 ways, 4 symbol 9: $0.30×2×2) | paytable-1 (zoom cột 9) |
| wild-pyramid | KHÔNG có pay riêng — thuần substitute (trừ scatter), chỉ xuất hiện reels 2–4. JSON sai | paytable-1 |
| wild-multiplier | CÓ pay riêng: 2=$1.00 (0.5x) / 3=$10 (5x) / 4=$25 (12.5x) / 5=$50 (25x). JSON sai | paytable-2 |
| Vault "20 vị trí trên reels 2–4" | Docs SAI (reels 2–4 chỉ có 12 ô). Thật: **20 vị trí = toàn bộ màn hình 4×5**; 8 mark ngẫu nhiên ban đầu nằm trên reels 2/3/4, đánh dấu SAU free spin đầu tiên; cleopatra rơi **đúng ô chưa mark** thì ô đó được mark (marking theo vị trí, không phải "1 mark/cleopatra") | paytable-3 |
| Max win cap | **CONFIRMED 12,500× bet.** Khi tổng win của round chạm 12,500×: **round kết thúc NGAY LẬP TỨC**, trả win (clamp tại cap), hủy toàn bộ spins/features còn lại — không phải "clamp lúc round_end" như assumption cũ | paytable-3, paytable-6 |

→ Khi implement: dùng paytable trong plan này (mục 1), bỏ số trong `game-spec.json`; sửa lại `docs/` (math-and-rtp, product-spec, vault-award, test-vectors) theo bảng trên.

## 1. Game Rules (base game)

- **Grid:** 4 hàng × 5 cột, ways-to-win **1024** (4^5). KHÔNG có cascade/tumble (xác nhận).
- **Win rule:** symbol thắng khi xuất hiện trên các reel liền kề từ reel 1; mỗi way chỉ trả band cao nhất; các ways cộng nhau, các symbol thắng cộng nhau. `wayWin = pay[count] × totalBet-multiplier`.
- **Paytable chuẩn (total-bet multiplier, đã xác minh từ paytable-1/2):**

| Symbol | 2 | 3 | 4 | 5 |
|---|---|---|---|---|
| cleopatra | 0.25x | 2.5x | 3.75x | 5x |
| scarab | 0.1x | 2x | 3x | 4x |
| ring | 0.1x | 2x | 3x | 4x |
| coin | — | 1x | 2.5x | 3.5x |
| eye-of-horus | — | 1x | 2.5x | 3.5x |
| A, K | — | 0.25x | 1.5x | 3x |
| Q, J | — | 0.15x | 1x | 2.5x |
| 10 | — | 0.15x | 0.5x | 2x |
| 9 | 0.1x | 0.15x | 0.5x | 2x |
| wild-multiplier (FS) | 0.5x | 5x | 12.5x | 25x |
| scatter-lotus | — | 1x | 5x | 25x |

  - Min-count = 2 cho cleopatra/scarab/ring/9/wild-multiplier; = 3 cho phần còn lại.
- **Symbols:** 11 symbol thường + `wild-pyramid` (base, reels 2–4, substitute tất cả trừ scatter, không pay riêng) + `wild-multiplier` (chỉ FS) + `scatter-lotus`.
- **Bet model:** min $0.20 / max $240 (confirmed paytable-4). Không ante-bet. Bet menu có 2 trường: BET multiplier + COIN VALUE.
- **RTP:** base 96.51%, buy 96.56% (confirmed paytable-4); các config 94.56/95.51/96.51. Trọng số reel-strip KHÔNG derivable → placeholder weights + tune bằng simulation.
- **Determinism:** cùng `(seed, stake, mode)` ⇒ cùng event stream. PRNG stub mulberry32, thứ tự draw cố định (reel 1→5, scatter-force buy, vault contribution, vault init marks). Draw mới chỉ được append cuối.

## 2. Scatter (`scatter-lotus`)

- Đếm **anywhere**, chỉ base/buy mode mới trigger FS.
- **Base:** 3/4/5 scatter → trả 1×/5×/25× total bet **và** trigger free spins (confirmed paytable-2).
- **Trong FS:** 3/4/5 scatter → cộng Vault 10×/50×/250× total bet (confirmed paytable-3); KHÔNG retrigger. [ASSUMPTION còn lại: trong FS scatter không trả thêm tiền mặt — paytable-3 chỉ nói cộng Vault]
- Presentation: blue glow anticipation kể cả khi mới 1 scatter.

## 3. Free Spins

- **Trigger:** 3/4/5 scatter ở base spin (hoặc buy) → cố định **10 spins** (confirmed paytable-2). Không retrigger.
- **Flow:** night-scene transition → banner "YOU HAVE WON 10 FREE SPINS" → 10 spins → nếu 20/20 marked thì vault_award ("ROYAL TRIBUTE UNLOCKED!" — confirmed 12-vault-20of20) → banner tổng kết → về base.
- FS dùng **special reels** ("Special reels are in play during the feature" — paytable-3): reel strip FS khác base, có wild-multiplier trên mọi reel.
- **State:** `freeSpinsRemaining`, `vaultValue`, `markedPositions[4][5]`, tổng win round.

### Vault (thuộc FS) — đã chốt theo paytable-3
- `vaultValue` khởi tạo 20× bet khi vào FS.
- **20 vị trí = toàn bộ lưới 4×5.** Sau free spin ĐẦU TIÊN: mark 8 vị trí ngẫu nhiên trên reels 2/3/4.
- Mỗi khi **cleopatra rơi vào ô chưa mark** → ô đó được mark (theo vị trí ô).
- Wild-multiplier land → cộng Vault ngẫu nhiên theo bảng (theo SỐ wild land trong spin): 1 wild → {1, 1.5, 2, 2.5, 5, 12.5, 25, 50}×; 2 → {5,10,25,50,100,250,500,2500}×; 3 → {7.5,15,37.5,75,150,375,750,12500}×; 4 → {10,20,50,100,200,500,1000,12500}×; 5 → {12.5,25,62.5,125,250,625,1250,12500}×; 6+ → {15,30,75,150,300,750,1500,12500}× (confirmed paytable-2; weights phân phối chưa biết → placeholder + tune).
- Scatter trong FS cộng Vault 10×/50×/250×.
- **All-or-nothing:** kết thúc round 20/20 → trả toàn bộ Vault (sau win spin cuối, trước round_end); 19/20 → mất trắng.

## 4. Multiplier Logic (`wild-multiplier`)

- Chỉ trong FS, xuất hiện được mọi reel. Substitute tất cả trừ scatter. Có pay riêng (bảng mục 1).
- `wayMultiplier = 2^(số wild trong way)` — **nhân**, không cộng (2 wild cùng way = ×4; khác way giữ multiplier riêng, không nhân chéo). Confirmed paytable-2: "their multipliers multiply each other".
- Áp dụng ngay trong bước ways-evaluate, hiển thị per-way breakdown (format: `<tổng symbol>X <symbol> PAYS $<pay×ways> X<mult> = $<total> ON <n> WAYS`).
- Wild không thuộc way thắng vẫn cộng Vault.

## 5. Max Win — đã chốt theo paytable-3/6

- **Cap 12,500× total bet (CONFIRMED).**
- **Hành vi khi chạm cap (khác assumption cũ):** ngay khi tổng win của round đạt 12,500× bet → round **kết thúc ngay lập tức**, win trả tại cap, **toàn bộ free spins còn lại và features (kể cả Vault chưa trả) bị hủy**.
- Engine phải check cap sau MỖI spin/award, không chỉ tại round_end.

## 6. Buy Feature

- Nút **BUY FEATURE** → modal xác nhận (cost 30× bet) → CONFIRM BUY.
- Confirm: trừ `30 × totalBet`, spin trigger **luôn cho đúng 3 scatter** (confirmed paytable-3), trả scatter prize 1× bet [ASSUMPTION], vào FS y hệt natural.
- Cancel: không trừ tiền. Balance < 30× bet → chặn buy [ASSUMPTION].

## 7. Buttons / UI Controls — đã xác minh từ paytable-5/6 + screenshots

| Control | Ghi chú |
|---|---|
| SPIN (⟳) | "starts the game"; SPACE/ENTER trên bàn phím start/stop spin; giữ SPACE = turbo spin |
| Stop spin | nút SPIN biến thành nút vuông khi đang quay (ảnh 12) |
| BUY FEATURE | panel bên trái; modal + CONFIRM BUY (Confirm/Cancel) |
| Bet +/− | đổi bet và mở **bet menu** (2 trường: BET multiplier, COIN VALUE); range $0.20–$240 |
| AUTOPLAY | mở menu autoplay; bấm lại để dừng |
| Spin speed (»») | cycle 3 mức: normal / quick spin / turbo spin |
| Settings (≡) | INTRO SCREEN toggle, AMBIENT toggle, SOUND FX toggle, GAME HISTORY |
| Sound (🔊) | toggle nhanh toàn bộ sound + music |
| Info (i) | 6 trang info/paytable, điều hướng ◄ ►, đóng ✕ |
| CREDIT / BET labels | click để đổi hiển thị coins ↔ cash |
| WIN display | counter roll-up + dòng breakdown per-way |
| FS HUD | Vault gauge + tiến độ key, "FREE SPINS LEFT n", panel "LAST FREE SPIN" (ảnh 12) |

## 8. Thứ tự triển khai

1. **Engine core:** PRNG stub mulberry32 + draw order cố định; board fill 4×5 (base strips / FS special strips); ways evaluation (min-count 2 cho cleopatra/scarab/ring/9, wild-pyramid substitution reels 2–4); scatter check; paytable mục 1.
2. **Event stream:** đúng thứ tự canonical trong `event-order-and-determinism.md` (spin_start → reels_drop → reels_land → ways_evaluate → [FS] multiplier_apply → scatter_check → win_present → [base] fs_trigger → round_end).
3. **Free spins + wild-multiplier:** subloop 10 spins, multiplier logic, state FS.
4. **Vault:** mark 8 vị trí (reels 2–4) sau spin đầu, cleopatra marking theo vị trí ô trên toàn lưới 4×5, bảng contribution, all-or-nothing, ROYAL TRIBUTE event.
5. **Buy feature:** modal flow, ép 3 scatter, trừ tiền, chặn khi thiếu balance.
6. **Max-win cap:** check sau mỗi spin/award; chạm cap → kết thúc round ngay, hủy phần còn lại.
7. **UI controls** (mục 7) + FS HUD.
8. **Sửa docs:** cập nhật math-and-rtp/product-spec (symbol 9), vault-award (20 ô toàn màn hình), test-vectors (bỏ note "công thức chưa xác nhận", viết lại TV-02→TV-06 theo công thức đã chốt), free-spins/event-order (cap behavior).
9. **Test:** golden snapshots theo `(seed, stake, mode)`; test vectors TV-01→TV-14 (đã có công thức chốt); QA checklist từng file mechanics; thêm test: chạm cap giữa FS → round end ngay.
10. **RTP tuning:** placeholder weights → simulation → tune về 96.51% base / 96.56% buy, hit frequency ~42%, verify max win 12,500×.

## 9. Assumptions / gaps còn lại

- Symbol weights (base + FS special reels) proprietary → placeholder + tune. (không thể chốt từ ảnh)
- Weights phân phối Vault contribution — chỉ biết các mức giá trị, chưa biết xác suất. (không thể chốt từ ảnh)
- Scatter trong FS: chỉ cộng Vault, không trả cash — theo câu chữ paytable-3, giữ là assumption nhẹ.
- Scatter prize khi buy feature (3 scatter ép có trả 1× bet không) — assumption.
- Buy bị chặn khi thiếu balance — assumption.
- Win tier trên MEGA! chưa quan sát được.

### Đã giải quyết (không còn là gap)
- ~~Công thức ways~~ → chốt bằng 05-small-win + paytable-4.
- ~~Paytable thật vs json~~ → chốt bằng paytable-1/2 (kèm sửa symbol 9).
- ~~Vault 20 vị trí ở đâu~~ → toàn màn hình 4×5 (paytable-3).
- ~~Cleopatra marking~~ → theo vị trí ô rơi trúng, không phải đếm symbol (paytable-3).
- ~~Cap áp lúc nào~~ → chạm cap là round end ngay lập tức (paytable-3/6).
