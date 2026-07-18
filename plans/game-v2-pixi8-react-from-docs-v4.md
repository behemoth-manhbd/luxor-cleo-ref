# Plan: Game v2 — Luxor of Cleopatra từ docs v4 (PixiJS v8 + TypeScript + React)

Code mới hoàn toàn trong `game-v2/`. Nguồn tham chiếu DUY NHẤT: `docs/luxor-of-cleopatra-v4/`
(docs md + game-spec.json phần `math.paytable` + screenshots). Áp dụng các correction đã
verify trong `docs/luxor-of-cleopatra-v4/ai-agent-problems.md`.

## Nguyên tắc

1. **Mechanics đúng là ưu tiên #1** — engine thuần TypeScript, deterministic, không phụ
   thuộc Pixi/React, phát ra event stream theo đúng contract của
   `event-order-and-determinism.md`. UI chỉ consume events.
2. Paytable lấy từ `game-spec.json math.paytable` (đã được paytable-vision sửa theo ảnh),
   KHÔNG dùng `symbols[].pay` (stale — problems #1).
3. Reel-strip weights là not-derivable (docs) → strips là config [ASSUMPTION], RNG stub
   uniform theo đúng RNG Contract; mọi con số pay/rule khác phải khớp docs 100%.

## Mechanics chốt (từ docs v4 + corrections)

| Rule | Giá trị | Nguồn |
|---|---|---|
| Grid | 5 reels × 4 rows, 1024 ways | product-spec, paytable p1 |
| Win rule | run liên tiếp từ reel 1; `win = pay[sym][run] × ways × totalBet`; ways = tích số match/reel | product-spec:16 |
| 2-OAK bands | cleopatra 0.25×, scarab 0.1×, ring 0.1×, 9 0.1× (các symbol khác từ 3) | paytable p1, problems #6 |
| Paytable | đúng bảng `math.paytable` 13 symbol | game-spec.json:244-316 |
| wild_base (pyramid) | reels 2–4, **cả base lẫn FS**, thay mọi symbol trừ scatter, không pay riêng | paytable p1, problems #5 |
| wild_multiplier | CHỈ trong FS, mọi reel, ×2/wild trong way, stack nhân (2^k), có bảng pay riêng 0.5/5/12.5/25× | paytable p2 |
| Scatter | pay anywhere 3/4/5 = 1/5/25×; ≥3 trigger 10 FS flat; **không retrigger** | paytable p2, video |
| Vault init | value = 20× bet (internal tại fs_start; UI hiện sau spin 1), marked = 0 | paytable p3, video |
| Vault pre-mark | 8 ô random trên reels 2–4, **SAU khi free spin 1 resolve** | paytable p3, video, problems #2/#4 |
| Vault mark | cleopatra rơi ô chưa mark → mark (cap 20) | paytable p3 |
| Vault increment (wild) | 1 lần/spin theo SỐ wild rơi: bảng exact 6 dòng paytable p2 | vault doc:13 |
| Vault increment (scatter FS) | +10×/50×/250× cho 3/4/5 | paytable p3 |
| Vault resolve | pay CHỈ khi 20/20 lúc hết round, else forfeit | paytable p3, 5 outro |
| Buy feature | 30× bet, forced đúng 3 scatter, disabled khi autoplay | paytable p3, modal |
| Max win | 12,500× bet — chạm là round **kết thúc ngay**, forfeit spins + features còn lại | paytable p3/p6 |
| Bet model | totalBet = bet × coinValue × 20; min $0.20, max $240 | paytable p4, modal-bet-panel |

Quyết định ghi chú (docs mâu thuẫn nội bộ): Vault wild-increment là **một draw/spin theo
wild-count** (đúng nguyên văn paytable p2 "every time one or more WILD… hit, **a random
amount** is added") — không phải mỗi wild một draw như event-order draw-table cũ.

## Determinism / RNG

- PRNG: mulberry32(seed). Cùng `(seed, stake, mode)` → cùng event stream + outcome.
- Draw order cố định: 1–5 reel stops (trái→phải) → [FS spin 1] 8 vị trí pre-mark →
  [mỗi FS spin] 1 draw increment nếu có wild → draw phụ mới luôn append cuối, có document.
- Event IDs đúng bảng canonical (`vault_init` payload sửa thành `preMarked=0`).

## Stack & cấu trúc thư mục

pnpm + Vite + TypeScript strict + React 18 + PixiJS v8 + zustand + vitest.

```
game-v2/
  index.html  package.json  tsconfig.json  vite.config.ts
  src/
    engine/               # thuần TS, KHÔNG import pixi/react — testable, tách được ra package
      config/
        symbols.ts        # ids, loại, tier
        paytable.ts       # bảng ×bet từ math.paytable (kèm 2-OAK bands)
        strips.ts         # reel strips base + FS [ASSUMPTION weights]
        bets.ts           # bet steps, coin values, ×20, min/max
        vault.ts          # increment tables, pre-mark count, scatter adds
        rules.ts          # maxWinX, fsCount, buyCostX, grid size
      rng.ts              # mulberry32 + draw-order helpers
      types.ts            # Board, SpinResult, RoundResult, VaultState, GameEvent…
      events.ts           # canonical event ids + payload types
      ways.ts             # đánh giá 1024-ways + wild sub + 2^k multiplier (FS)
      spin.ts             # 1 spin: fill board từ strips, evaluate, scatter check
      vault.ts            # state machine Vault (pre-mark/mark/increment/resolve)
      freeSpins.ts        # vòng FS 10 spin + vault + cap early-termination
      buy.ts              # buy feature: charge, forced 3-scatter board
      round.ts            # orchestrator base round → FS → events ra ngoài
      index.ts            # public API của engine
    game/                 # PixiJS v8 — render từ event stream
      PixiStage.tsx       # mount pixi Application vào React
      scene/              # board, reels, symbols, vault panel, banners
      anim/               # spin/land/win/mark timings
    ui/                   # React HUD
      HUD.tsx             # credit/bet/win, spin, autoplay, buy
      modals/             # BetPanel, Autoplay, BuyConfirm, Paytable/Info
    store/
      gameStore.ts        # zustand: balance, bet, phase, autoplay, settings
    bus.ts                # engine events → pixi/ui
    App.tsx  main.tsx  styles.css
  tests/
    engine/
      vectors.test.ts     # TV-01…TV-13 từ test-vectors.md (golden)
      ways.test.ts        # 2-OAK bands, ways product, wild sub, pure-wild line
      freespins.test.ts   # 10 flat, no-retrigger, premark-sau-spin-1
      vault.test.ts       # mark/increment/forfeit/20-20 pay
      cap.test.ts         # 12,500× early termination
      buy.test.ts         # cost, forced 3 scatter, balance guard
      determinism.test.ts # same seed → same event stream
```

## Thứ tự thực hiện

1. Scaffold dự án (vite + react + ts + vitest + pixi v8).
2. Engine config + rng + types + events.
3. `ways.ts` (khó nhất: ways + wild sub + FS 2^k + pure-wild line) — viết test trước từ TV.
4. `spin/vault/freeSpins/buy/round` + toàn bộ tests engine xanh.
5. Store + bus + HUD tối thiểu (spin/bet/balance/win).
6. PixiStage v8: board render, spin anim staggered, vault panel FS, banners (FS trigger/outro).
7. Modals (bet, autoplay, buy) + autoplay + skip screens.
8. `pnpm test` + `pnpm build` xanh; chạy thử flow: base win, FS natural, buy, cap.

## Test acceptance (mechanics)

- 13 test vector TV-01…TV-13 pass với giá trị ĐÃ SỬA (TV-02 $5.00, TV-03 $7.50…).
- FS: mọi trigger 3/4/5 scatter → đúng 10 spin; scatter giữa FS không cộng spin.
- Vault: 0 mark trước khi spin 1 resolve; 8 pre-mark đúng reels 2–4; forfeit khi <20.
- Determinism: 2 lần chạy cùng seed → event stream byte-identical.
- Cap: round dừng ngay tại 12,500×, vault/spins còn lại bị hủy.
