# Session Summary — 2026-07-18/19

Mô tả từng thay đổi trong session: verify docs v4 → ghi vấn đề → push GitHub → plan →
code `game-v4/` (PixiJS v8 + TypeScript + React). Chi tiết prompt gốc: [[session-prompts]].

## 1. Verify docs v4 (không sửa docs gốc)

Đối chiếu 13 file `docs/*.md` với `game-spec.json`, `paytable-vision.json`,
`browser-play-log.txt`, `browser-observations.json`, 22 screenshot đặt tên, 352 frame
session và video `freespin-play.webm` (trích frame 2fps). Kết quả chính:

- **Paytable trong docs md khớp ảnh 100%** (kể cả band 2-OAK của cleopatra/scarab/ring/9).
- **Pre-mark Vault 8 ô SAU free spin 1** được video xác nhận (0/20 suốt spin 1).
- **Không retrigger** — mọi round đếm 10→0, scatter giữa FS chỉ cộng vault.
- Phát hiện các lỗi/mâu thuẫn: `game-spec.json` stale (symbols[].pay, vault "at round
  start", 2 note provenance), 2 bảng trong event-order chưa sync, pyramid WILD xuất hiện
  cả trong FS nhưng docs thiếu, TV-04/TV-09/TV-10 có vết stale/side-wins,
  `browser-observations.json` sai số round, artifact `<<<END>>>` trong 2 file.
- 13 file docs gốc **giữ nguyên** — mọi phát hiện ghi vào file mới (mục 2).

## 2. Thay đổi theo từng file

### Files mới trong `docs/luxor-of-cleopatra-v4/`
| File | Nội dung |
|---|---|
| `ai-agent-problems.md` | 15 mục lỗi (1–13 + 8b) theo format bản v3: lỗi game-spec.json, docs md chưa sync, evidence files sai số liệu, kèm mục "Đã kiểm chứng ĐÚNG" và gaps hợp lệ. Mục 8b (TV-09 side-wins $71.80 ≠ $40) bổ sung sau khi build engine phát hiện thêm. |
| `session-prompts.md` | Nguyên văn 5 prompt của người dùng trong session. |
| `session-summary.md` | File này. |

### Files thay đổi ở repo root
| File | Thay đổi |
|---|---|
| `.gitignore` | Thêm `docs/**/*.webm` — 2 video (~700MB) vượt giới hạn 100MB/file của GitHub nên không track. |
| `game-v1/` | Commit phần rename đã staged từ trước (toàn bộ code cũ chuyển vào `game-v1/`). |
| `plans/game-v4-pixi8-react-from-docs-v4.md` | Plan mới: bảng mechanics chốt từ docs v4 + corrections, RNG contract, cấu trúc thư mục, thứ tự thực hiện, acceptance tests. (Tên gốc `game-v2-...`, đổi thành `game-v4-...` khi đồng bộ tên.) |

### `game-v4/` — game mới (tên gốc `game-v2/`, đổi thành `game-v4/` để đồng bộ docs)
| Thành phần | Mô tả |
|---|---|
| `src/engine/config/` | paytable từ `math.paytable` (bản vision-fix, KHÔNG dùng symbols[].pay stale), strips [ASSUMPTION weights], bảng vault increment exact p2, bets 20×, rules (10 FS, 30× buy, cap 12500×). |
| `src/engine/` | rng (mulberry32), ways (1024-ways + wild sub + 2^k per-way + loại pure-wild), spin, vault, freeSpins (pre-mark sau spin 1, no retrigger, cap early-termination), buy (forced 3 scatter), round (event stream đúng thứ tự canonical, `vault_init preMarked=0`). |
| `src/game/` | PixiJS v8: BoardScene (spin staggered, highlight, vault marks), PixiStage. |
| `src/ui/` + `src/store/` | React HUD, modals (Bet 20x / Autoplay / Buy / Info), Banners (FS trigger/outro/MEGA), zustand store, bus presenter. |
| `tests/` | 35 test: TV-01…TV-13, ways (2-OAK, pure-wild, ways product), freespins (10 flat, premark-sau-spin-1, no-retrigger, cap), vault (increment tables, 20/20), buy, determinism — **tất cả xanh**. |

Verify runtime bằng Playwright: spin base thắng band 2-OAK ($0.20), buy $60 → MEGA $54 →
10 FS → outro, vault forfeit ở 15/20 và 18/20, số dư khớp từng cent
(100,000 − 60 + 154.20 = 100,094.20).

## 3. Commits đã push (`origin/main`)

| Commit | Nội dung |
|---|---|
| `3d90ec4` | Move game code into game-v1/, ignore docs webm recordings |
| `5be9beb` | Add luxor-of-cleopatra docs v4 (398 files, không kèm webm) |
| `625ab60` | docs v4: add TV-09 side-wins finding to ai-agent-problems |
| `2276d92` | Add game (engine + pixi v8/react client + tests) từ docs v4, kèm plan |
| (commit này) | Rename game-v2 → game-v4, thêm session-prompts.md + session-summary.md |

## 4. Ghi chú cho người tiếp theo

- Nguồn tham chiếu duy nhất của `game-v4/` là `docs/luxor-of-cleopatra-v4/`; các con số
  không có trong docs được đánh dấu `[ASSUMPTION]` ngay trong code (strips, bet steps,
  ngưỡng MEGA 8×).
- Trước khi build tiếp từ `game-spec.json`, đọc `ai-agent-problems.md` — đặc biệt mục 1
  (symbols[].pay stale) và mục 2 (vault pre-mark timing).
- Chạy game: `cd game-v4 && pnpm install && pnpm dev` (port 5210); test: `pnpm test`.
