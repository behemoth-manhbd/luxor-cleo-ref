// Pixi presentation layer. Consumes the engine's event stream sequentially — all
// durations are [ASSUMPTION] placeholders (docs only estimate reel timing 400–600ms).

import { useEffect, useRef } from 'react'
import { Application, Container, Graphics, Text } from 'pixi.js'
import type { Board, CellPos, GameEvent, SymbolId, SymbolWin } from '../engine'
import { REELS, ROWS, winningCells } from '../engine'
import { SPEED_FACTOR, useGameStore } from '../store/gameStore'
import { bus, emitSkip } from './bus'

const W = 1200
const H = 640
const CELL_W = 128
const CELL_H = 104
const GAP = 10
const BOARD_X = 300
const BOARD_Y = 70

const SYMBOL_STYLE: Record<SymbolId, { color: number; label: string }> = {
  cleopatra: { color: 0xb3123f, label: 'CLEO' },
  gold_scarab: { color: 0xa87400, label: 'SCARAB' },
  ankh_ring: { color: 0xc08a1e, label: 'RING' },
  cleopatra_coin: { color: 0x8f6b00, label: 'COIN' },
  eye_of_horus: { color: 0x5b3fa8, label: 'EYE' },
  sym_a: { color: 0x2f6db3, label: 'A' },
  sym_k: { color: 0x2f9c58, label: 'K' },
  sym_q: { color: 0x9c2f8a, label: 'Q' },
  sym_j: { color: 0x3fa8a0, label: 'J' },
  sym_10: { color: 0x7a7a2f, label: '10' },
  sym_9: { color: 0x496b7a, label: '9' },
  wild_pyramid: { color: 0x6a1fb0, label: 'WILD' },
  wild_multiplier: { color: 0xd9a300, label: 'WILD ×2' },
  scatter_lotus: { color: 0xd9548f, label: 'SCATTER' },
}

const TIER_THRESHOLDS = [
  // [ASSUMPTION] tier names observed live; thresholds are config placeholders
  { name: 'SENSATIONAL!', minX: 50, color: 0xffd24a },
  { name: 'MEGA WIN!', minX: 20, color: 0xff7b3d },
  { name: 'NICE WIN!', minX: 5, color: 0x7bd94a },
]

interface CellView {
  bg: Graphics
  label: Text
  highlight: Graphics
  badge: Graphics
}

// Fixed no-win layout shown before the first spin
const IDLE_BOARD: Board = [
  ['sym_a', 'sym_9', 'sym_k', 'sym_j'],
  ['gold_scarab', 'sym_q', 'cleopatra', 'sym_10'],
  ['sym_k', 'eye_of_horus', 'sym_q', 'sym_9'],
  ['sym_j', 'sym_10', 'cleopatra_coin', 'sym_a'],
  ['ankh_ring', 'sym_k', 'sym_9', 'sym_q'],
]

export function PixiStage() {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    let destroyed = false
    let app: Application | null = null
    let unsubscribe = () => {}
    const skipCtl = makeSkippable()

    void (async () => {
      const application = new Application()
      await application.init({ width: W, height: H, background: 0x1c1408, antialias: true })
      if (destroyed) {
        application.destroy(true)
        return
      }
      app = application
      host.appendChild(application.canvas)
      application.canvas.style.width = '100%'
      application.canvas.style.height = 'auto'
      application.canvas.addEventListener('pointerdown', emitSkip)

      const scene = buildScene(application)
      scene.setBoard(IDLE_BOARD)
      const speed = () => SPEED_FACTOR[useGameStore.getState().speed]
      const sleep = (ms: number) => skipCtl.sleep(ms * speed())

      async function play(events: GameEvent[]) {
        let lastBoard: Board | null = null
        let lastWins: SymbolWin[] = []
        let mode: 'base' | 'freeSpins' = 'base'
        const betCents = useGameStore.getState().pendingRound
          ? useGameStore.getState().history[0]?.betCents ?? 200
          : 200

        for (const e of events) {
          switch (e.type) {
            case 'spin_start':
              skipCtl.reset()
              scene.clearHighlights()
              if (e.mode === 'base') useGameStore.getState().setWin(0)
              break
            case 'reels_land': {
              lastBoard = e.board
              await animateLand(scene, e.board, sleep)
              break
            }
            case 'ways_evaluate':
              lastWins = e.wins
              break
            case 'win_present': {
              if (e.spinWinCents > 0 && lastBoard) {
                scene.showHighlights(winningCells(lastBoard, lastWins, mode))
                await rollup(e.spinWinCents, sleep)
                const tier = TIER_THRESHOLDS.find((t) => e.spinWinCents >= t.minX * betCents)
                if (tier) await scene.banner(tier.name, fmtC(e.spinWinCents), sleep, 1600)
                await sleep(500)
              } else {
                await sleep(150)
              }
              break
            }
            case 'fs_trigger':
              await scene.banner('CONGRATULATIONS!', `YOU HAVE WON ${e.spinsAwarded} FREE SPINS`, sleep, 2200)
              break
            case 'fs_intro':
              mode = 'freeSpins'
              scene.enterFreeSpins(e.vaultCents)
              await sleep(600)
              break
            case 'fs_spin':
              scene.setSpinsLeft(e.remaining + 1)
              await sleep(120)
              break
            case 'vault_init_marks':
              scene.markCells(e.positions)
              await sleep(500)
              break
            case 'vault_update':
              scene.markCells(e.newMarks)
              scene.setVault(e.vaultCents, e.marked)
              if (e.wildAddCents + e.scatterAddCents > 0) {
                await scene.vaultFly(e.wildAddCents + e.scatterAddCents, sleep)
              }
              break
            case 'vault_award':
              await scene.banner('ROYAL TRIBUTE UNLOCKED!', fmtC(e.vaultCents), sleep, 2600)
              break
            case 'win_cap_clamp':
              await scene.banner('MAX WIN!', `${fmtC(e.cappedCents)} — 12,500×`, sleep, 2400)
              break
            case 'fs_end':
              await scene.banner('FREE SPINS COMPLETED', `YOU HAVE WON ${fmtC(e.fsWinCents)}`, sleep, 2200)
              scene.exitFreeSpins()
              mode = 'base'
              break
            case 'round_end':
              useGameStore.getState().setWin(e.totalWinCents)
              break
            default:
              break
          }
        }
        useGameStore.getState().presentDone()
      }

      unsubscribe = useGameStore.subscribe((state, prev) => {
        if (state.pendingRound && state.pendingRound !== prev.pendingRound) {
          void play(state.pendingRound.events)
        }
      })
      const initial = useGameStore.getState().pendingRound
      if (initial) void play(initial.events)
    })()

    return () => {
      destroyed = true
      unsubscribe()
      skipCtl.dispose()
      if (app) {
        app.canvas.removeEventListener('pointerdown', emitSkip)
        // destroy display objects while the renderer still exists, then the app —
        // reversed order crashes pixi v8's texture pool on Text teardown
        app.stage.destroy({ children: true })
        app.destroy(true)
      }
      host.innerHTML = ''
    }
  }, [])

  return <div ref={hostRef} className="stage" />
}

// ---------------------------------------------------------------- scene setup

function buildScene(app: Application) {
  const root = new Container()
  app.stage.addChild(root)

  const bg = new Graphics().rect(0, 0, W, H).fill(0x2a1d0c)
  root.addChild(bg)

  const title = new Text({
    text: 'LUXOR OF CLEOPATRA',
    style: { fill: 0xd9b34a, fontSize: 26, fontWeight: '700', letterSpacing: 4 },
  })
  title.anchor.set(0.5, 0)
  title.position.set(W / 2, 18)
  root.addChild(title)

  const cells: CellView[][] = []
  const boardC = new Container()
  boardC.position.set(BOARD_X, BOARD_Y)
  root.addChild(boardC)

  for (let reel = 0; reel < REELS; reel++) {
    const col: CellView[] = []
    for (let row = 0; row < ROWS; row++) {
      const cell = new Container()
      cell.position.set(reel * (CELL_W + GAP), row * (CELL_H + GAP))
      const bgG = new Graphics()
      const label = new Text({
        text: '',
        style: { fill: 0xffffff, fontSize: 20, fontWeight: '700', align: 'center' },
      })
      label.anchor.set(0.5)
      label.position.set(CELL_W / 2, CELL_H / 2)
      const highlight = new Graphics()
        .roundRect(2, 2, CELL_W - 4, CELL_H - 4, 10)
        .stroke({ width: 5, color: 0xffe14a })
      highlight.visible = false
      const badge = new Graphics().roundRect(CELL_W - 26, 6, 20, 20, 5).fill(0xc22b2b)
      badge.visible = false
      cell.addChild(bgG, label, highlight, badge)
      boardC.addChild(cell)
      col.push({ bg: bgG, label, highlight, badge })
    }
    cells.push(col)
  }

  // FS side panel
  const panel = new Container()
  panel.position.set(24, 90)
  panel.visible = false
  const panelBg = new Graphics().roundRect(0, 0, 250, 190, 12).fill({ color: 0x0d0d2a, alpha: 0.9 })
  const vaultTitle = new Text({ text: 'VAULT', style: { fill: 0xd9b34a, fontSize: 22, fontWeight: '700' } })
  vaultTitle.position.set(20, 14)
  const vaultValue = new Text({ text: '$0.00', style: { fill: 0xffffff, fontSize: 26, fontWeight: '700' } })
  vaultValue.position.set(20, 46)
  const vaultMarked = new Text({ text: '0 / 20 MARKED', style: { fill: 0xff9d9d, fontSize: 16 } })
  vaultMarked.position.set(20, 86)
  const spinsLeft = new Text({ text: '', style: { fill: 0x9dd6ff, fontSize: 18, fontWeight: '700' } })
  spinsLeft.position.set(20, 128)
  panel.addChild(panelBg, vaultTitle, vaultValue, vaultMarked, spinsLeft)
  root.addChild(panel)

  // banner overlay
  const overlay = new Container()
  overlay.visible = false
  const dim = new Graphics().rect(0, 0, W, H).fill({ color: 0x000000, alpha: 0.72 })
  const bannerMain = new Text({
    text: '',
    style: { fill: 0xffd24a, fontSize: 56, fontWeight: '900', align: 'center' },
  })
  bannerMain.anchor.set(0.5)
  bannerMain.position.set(W / 2, H / 2 - 34)
  const bannerSub = new Text({
    text: '',
    style: { fill: 0xffffff, fontSize: 30, fontWeight: '700', align: 'center' },
  })
  bannerSub.anchor.set(0.5)
  bannerSub.position.set(W / 2, H / 2 + 34)
  const bannerHint = new Text({ text: 'PRESS ANYWHERE TO CONTINUE', style: { fill: 0x8a8a8a, fontSize: 14 } })
  bannerHint.anchor.set(0.5)
  bannerHint.position.set(W / 2, H - 46)
  overlay.addChild(dim, bannerMain, bannerSub, bannerHint)
  root.addChild(overlay)

  const flyText = new Text({ text: '', style: { fill: 0x7bd94a, fontSize: 26, fontWeight: '900' } })
  flyText.visible = false
  flyText.position.set(160, 300)
  root.addChild(flyText)

  const setCell = (reel: number, row: number, sym: SymbolId) => {
    const view = cells[reel]![row]!
    const style = SYMBOL_STYLE[sym]
    view.bg.clear().roundRect(0, 0, CELL_W, CELL_H, 10).fill(style.color)
      .stroke({ width: 2, color: 0x000000, alpha: 0.4 })
    view.label.text = style.label
  }

  return {
    setCell,
    setBoard(board: Board) {
      board.forEach((col, reel) => col.forEach((sym, row) => setCell(reel, row, sym)))
    },
    clearHighlights() {
      cells.forEach((col) => col.forEach((c) => (c.highlight.visible = false)))
    },
    showHighlights(positions: CellPos[]) {
      positions.forEach((p) => (cells[p.reel]![p.row]!.highlight.visible = true))
    },
    markCells(positions: CellPos[]) {
      positions.forEach((p) => (cells[p.reel]![p.row]!.badge.visible = true))
    },
    clearMarks() {
      cells.forEach((col) => col.forEach((c) => (c.badge.visible = false)))
    },
    enterFreeSpins(vaultCents: number) {
      bg.clear().rect(0, 0, W, H).fill(0x0d1030) // night scene
      panel.visible = true
      vaultValue.text = fmtC(vaultCents)
      vaultMarked.text = '0 / 20 MARKED'
    },
    exitFreeSpins() {
      bg.clear().rect(0, 0, W, H).fill(0x2a1d0c)
      panel.visible = false
      this.clearMarks()
    },
    setVault(cents: number, marked: number) {
      vaultValue.text = fmtC(cents)
      vaultMarked.text = `${marked} / 20 MARKED`
    },
    setSpinsLeft(n: number) {
      spinsLeft.text = n === 1 ? 'LAST FREE SPIN' : `FREE SPINS LEFT: ${n}`
    },
    async vaultFly(cents: number, sleep: (ms: number) => Promise<void>) {
      flyText.text = `+${fmtC(cents)}`
      flyText.visible = true
      await sleep(420)
      flyText.visible = false
    },
    async banner(main: string, sub: string, sleep: (ms: number) => Promise<void>, ms: number) {
      bannerMain.text = main
      bannerSub.text = sub
      overlay.visible = true
      await sleep(ms)
      overlay.visible = false
    },
  }
}

type Scene = ReturnType<typeof buildScene>

async function animateLand(scene: Scene, board: Board, sleep: (ms: number) => Promise<void>) {
  const symbols = Object.keys(SYMBOL_STYLE) as SymbolId[]
  // brief flicker, then columns settle left→right
  for (let step = 0; step < 2; step++) {
    for (let reel = 0; reel < REELS; reel++) {
      for (let row = 0; row < ROWS; row++) {
        scene.setCell(reel, row, symbols[(step * 5 + reel * 3 + row * 7) % symbols.length]!)
      }
    }
    await sleep(70)
  }
  for (let reel = 0; reel < REELS; reel++) {
    board[reel]!.forEach((sym, row) => scene.setCell(reel, row, sym))
    await sleep(90)
  }
}

async function rollup(target: number, sleep: (ms: number) => Promise<void>) {
  const steps = 8
  for (let i = 1; i <= steps; i++) {
    useGameStore.getState().setWin(Math.round((target * i) / steps))
    await sleep(70)
  }
}

function fmtC(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function makeSkippable() {
  let skipped = false
  let resolvers: Array<() => void> = []
  const onSkip = () => {
    skipped = true
    resolvers.forEach((r) => r())
    resolvers = []
  }
  bus.addEventListener('skip', onSkip)
  return {
    sleep(ms: number): Promise<void> {
      if (skipped) return Promise.resolve()
      return new Promise<void>((resolve) => {
        const t = setTimeout(() => resolve(), ms)
        resolvers.push(() => {
          clearTimeout(t)
          resolve()
        })
      })
    },
    reset() {
      skipped = false
    },
    dispose() {
      bus.removeEventListener('skip', onSkip)
    },
  }
}
