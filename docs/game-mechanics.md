# Luxor of Cleopatra — Tóm tắt Mechanics (bản đã implement)

Nguồn số liệu: ảnh GAME RULES in-game (paytable-1→6). Engine: `src/engine/`.

## Lưới & luật thắng
- Lưới **4 hàng × 5 cột**, **1024 ways**, không có cascade/tumble.
- Symbol thắng khi xuất hiện trên các **reel liền kề từ reel 1** (trái → phải).
- Công thức: `win = pay(số reel khớp) × tổng cược × ways`, với `ways = tích số symbol trên mỗi reel khớp`.
- Mỗi symbol chỉ trả **band cao nhất** (không cộng dồn band ngắn hơn); các symbol khác nhau cộng win với nhau.

## Paytable (hệ số × tổng cược)
| Symbol | 2 | 3 | 4 | 5 |
|---|---|---|---|---|
| Cleopatra | 0.25 | 2.5 | 3.75 | 5 |
| Bọ hung / Nhẫn | 0.1 | 2 | 3 | 4 |
| Đồng xu / Mắt Horus | — | 1 | 2.5 | 3.5 |
| A / K | — | 0.25 | 1.5 | 3 |
| Q / J | — | 0.15 | 1 | 2.5 |
| 10 | — | 0.15 | 0.5 | 2 |
| 9 | 0.1 | 0.15 | 0.5 | 2 |
| Wild ×2 (chỉ FS) | 0.5 | 5 | 12.5 | 25 |
| Scatter (anywhere) | — | 1 | 5 | 25 |

- Chỉ 4 symbol thường trả từ 2 reel: **Cleopatra, Bọ hung, Nhẫn, số 9**.

## Wild
- **Wild Pyramid** (base game): chỉ xuất hiện reels 2/3/4, thay mọi symbol trừ scatter, **không có pay riêng**.
- **Wild Multiplier ×2** (chỉ free spins): xuất hiện mọi reel, thay mọi symbol trừ scatter, **có pay riêng**, mỗi wild nhân ×2 cho way đi qua nó; nhiều wild cùng way thì **nhân với nhau** (2 wild = ×4).

## Free Spins
- **3/4/5 scatter** ở base game → trả 1×/5×/25× cược **và** tặng **10 free spins cố định**.
- Free spins dùng bộ reel riêng ("special reels").
- **Không retrigger**: scatter rơi trong FS chỉ cộng vào Vault (3/4/5 → 10×/50×/250× cược).

## Vault (trong free spins)
- Khởi đầu **20× tổng cược**. Thắng Vault **chỉ khi mark đủ 20 ô toàn màn hình** trước khi hết round; thiếu 1 ô là mất trắng.
- **Sau free spin đầu tiên**: 8 ô ngẫu nhiên trên reels 2/3/4 được mark sẵn.
- **Cleopatra rơi trúng ô chưa mark** → ô đó được mark.
- Mỗi spin có wild rơi → Vault cộng thêm 1 khoản **ngẫu nhiên** theo bảng phụ thuộc số wild cùng spin (1 wild: 1→50×; 2 wild: 5→2500×; … 6+ wild: 15→12500×).

## Buy Feature
- Giá **30× tổng cược** ($60 ở mức $2), xác nhận 2 bước (modal → CONFIRM BUY).
- Luôn ra **đúng 3 scatter**, trả kèm 1× scatter pay, vào free spins y hệt trigger tự nhiên.

## Max Win
- Trần **12,500× tổng cược**. Chạm trần là **round kết thúc ngay lập tức**: trả win tại trần, hủy toàn bộ free spins và Vault còn lại.

## Bet & RTP
- Cược: **$0.20 – $240.00**.
- RTP mục tiêu: **96.51%** (base) / **96.56%** (buy feature). Simulation hiện tại: ~96.9% cả hai (reel weights là placeholder, có thể tune tiếp).

## Điểm chưa chốt được từ rules (dùng config/placeholder)
- Trọng số reel strips và phân phối xác suất khoản cộng Vault — không công bố, đang dùng placeholder.
- Wild ×2 có tự nhân chính nó khi trả pay riêng không — mặc định **không** (config `wildSelfMultiplier`).
- Scatter trong FS không trả tiền mặt (chỉ cộng Vault) — theo câu chữ rules, để flag config.
