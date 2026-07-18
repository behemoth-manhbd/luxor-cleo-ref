// PixiJS v8 board scene: 5x4 grid of placeholder symbol tiles (palette from
// docs v4 art-design.md), staggered spin animation, win highlight, vault marking.

import { Container, Graphics, Text, Ticker } from 'pixi.js';
import type { Board, SymbolId } from '../../engine';

const CELL = 110;
const GAP = 6;
export const BOARD_W = 5 * CELL + 4 * GAP;
export const BOARD_H = 4 * CELL + 3 * GAP;

const SYMBOL_STYLE: Record<string, { color: number; label: string }> = {
  cleopatra: { color: 0x8e1f1f, label: 'CLEO' },
  scarab: { color: 0xd9a63a, label: 'SCAR' },
  eye_of_horus: { color: 0xb8860b, label: 'EYE' },
  coin: { color: 0xd6ae45, label: 'COIN' },
  ring: { color: 0x9e7024, label: 'RING' },
  A: { color: 0xc0392b, label: 'A' },
  K: { color: 0x2f6fb0, label: 'K' },
  Q: { color: 0x7d4ba8, label: 'Q' },
  J: { color: 0x3f8f3a, label: 'J' },
  T: { color: 0xd9822a, label: '10' },
  '9': { color: 0x2bb0b0, label: '9' },
  scatter: { color: 0xf5ead0, label: 'LOTUS' },
  wild_base: { color: 0xe0b040, label: 'WILD' },
  wild_multiplier: { color: 0xffd700, label: 'W x2' },
};

const SYMBOL_IDS = Object.keys(SYMBOL_STYLE) as SymbolId[];
// mid-spin flicker pool: regulars only, so restricted symbols never flash on wrong reels
const FLICKER_IDS = SYMBOL_IDS.filter((s) => s !== 'wild_base' && s !== 'wild_multiplier' && s !== 'scatter');

class Cell {
  root = new Container();
  private bg = new Graphics();
  private label: Text;
  private markOverlay = new Graphics();

  constructor() {
    this.label = new Text({
      text: '',
      style: { fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 'bold', fill: 0xfbe9a8, stroke: { color: 0x5a3a10, width: 3 } },
    });
    this.label.anchor.set(0.5);
    this.label.position.set(CELL / 2, CELL / 2);
    this.markOverlay.visible = false;
    this.root.addChild(this.bg, this.markOverlay, this.label);
  }

  set(symbol: SymbolId) {
    const s = SYMBOL_STYLE[symbol];
    this.bg.clear();
    this.bg.roundRect(4, 4, CELL - 8, CELL - 8, 10).fill(s.color).stroke({ color: 0xe8bf3f, width: 2 });
    this.label.text = s.label;
    this.label.style.fill = symbol === 'scatter' ? 0x8e1f1f : 0xfbe9a8;
  }

  setMarked(marked: boolean) {
    this.markOverlay.clear();
    if (marked) {
      this.markOverlay.roundRect(0, 0, CELL, CELL, 10).stroke({ color: 0xe8bf3f, width: 4 }).fill({ color: 0xa81e2a, alpha: 0.45 });
      this.markOverlay.circle(CELL - 18, CELL - 18, 10).fill(0xe8bf3f);
    }
    this.markOverlay.visible = marked;
  }

  highlight(on: boolean) {
    this.root.alpha = 1;
    this.root.scale.set(on ? 1.06 : 1);
    if (on) this.root.pivot.set(CELL * 0.03, CELL * 0.03);
    else this.root.pivot.set(0, 0);
  }

  dim(on: boolean) {
    this.root.alpha = on ? 0.45 : 1;
  }
}

export class BoardScene {
  root = new Container();
  private cells: Cell[][] = [];
  private board: Board | null = null;
  private rand = 12345;

  constructor() {
    const frame = new Graphics();
    frame.roundRect(-14, -14, BOARD_W + 28, BOARD_H + 28, 18).fill(0x43266f).stroke({ color: 0xe8bf3f, width: 6 });
    this.root.addChild(frame);
    for (let row = 0; row < 4; row++) {
      const rowCells: Cell[] = [];
      for (let col = 0; col < 5; col++) {
        const cell = new Cell();
        cell.root.position.set(col * (CELL + GAP), row * (CELL + GAP));
        this.root.addChild(cell.root);
        rowCells.push(cell);
      }
      this.cells.push(rowCells);
    }
    this.setBoard(
      Array.from({ length: 4 }, (_, r) =>
        Array.from({ length: 5 }, (_, c) => SYMBOL_IDS[(r * 5 + c * 3) % 11]),
      ),
    );
  }

  setBoard(board: Board) {
    this.board = board;
    for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) this.cells[r][c].set(board[r][c]);
  }

  clearDecorations() {
    for (const row of this.cells) for (const cell of row) {
      cell.highlight(false);
      cell.dim(false);
    }
  }

  setMarks(marked: boolean[][]) {
    for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) this.cells[r][c].setMarked(marked[r][c]);
  }

  clearMarks() {
    for (const row of this.cells) for (const cell of row) cell.setMarked(false);
  }

  highlightSymbols(symbols: Set<string>) {
    if (!this.board) return;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 5; c++) {
        const sym = this.board[r][c];
        const inWin = symbols.has(sym) || sym === 'wild_base' || sym === 'wild_multiplier';
        this.cells[r][c].highlight(inWin);
        this.cells[r][c].dim(!inWin && symbols.size > 0);
      }
    }
  }

  // staggered left->right stop; resolves when the last reel settles
  spinTo(finalBoard: Board, turbo: boolean): Promise<void> {
    this.clearDecorations();
    return new Promise((resolve) => {
      const spinMs = turbo ? 120 : 500;
      const staggerMs = turbo ? 30 : 110;
      const start = performance.now();
      let frameAcc = 0;
      const tick = () => {
        const now = performance.now();
        frameAcc++;
        let allStopped = true;
        for (let col = 0; col < 5; col++) {
          const stopAt = start + spinMs + col * staggerMs;
          if (now < stopAt) {
            allStopped = false;
            if (frameAcc % 2 === 0) {
              for (let row = 0; row < 4; row++) {
                this.rand = (this.rand * 1103515245 + 12345) & 0x7fffffff;
                this.cells[row][col].set(FLICKER_IDS[this.rand % FLICKER_IDS.length]);
              }
            }
          } else {
            for (let row = 0; row < 4; row++) this.cells[row][col].set(finalBoard[row][col]);
          }
        }
        if (allStopped) {
          this.board = finalBoard;
          Ticker.shared.remove(tick);
          resolve();
        }
      };
      Ticker.shared.add(tick);
    });
  }
}
