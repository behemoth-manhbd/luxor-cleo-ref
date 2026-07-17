import { useState } from 'react'
import type { SymbolId } from '../engine'
import { BET_LEVELS_CENTS, BUY_COST_MULT, PAY_X100, SCATTER_PAY_X100 } from '../engine'
import { fmt, useGameStore } from '../store/gameStore'

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="btn round" onClick={onClose}>
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

/** Two-step confirm, matching the real flow: cost modal → CONFIRM BUY (Cancel / Yes). */
export function BuyModal({ onClose }: { onClose: () => void }) {
  const [confirming, setConfirming] = useState(false)
  const betIndex = useGameStore((s) => s.betIndex)
  const spin = useGameStore((s) => s.spin)
  const cost = BUY_COST_MULT * BET_LEVELS_CENTS[betIndex]!

  return (
    <Modal title={confirming ? 'CONFIRM BUY' : 'BUY FEATURE'} onClose={onClose}>
      {!confirming ? (
        <>
          <p>
            TRIGGER FREE SPINS WITH 3× SCATTERS
            <br />
            Cost: <b>{fmt(cost)}</b> (30× total bet)
          </p>
          <div className="modal-actions">
            <button className="btn" onClick={onClose}>
              CANCEL
            </button>
            <button className="btn primary" onClick={() => setConfirming(true)}>
              BUY
            </button>
          </div>
        </>
      ) : (
        <>
          <p>
            Pay <b>{fmt(cost)}</b> to trigger the FREE SPINS feature?
          </p>
          <div className="modal-actions">
            <button className="btn" onClick={onClose}>
              CANCEL
            </button>
            <button
              className="btn primary"
              onClick={() => {
                onClose()
                spin(true)
              }}
            >
              YES
            </button>
          </div>
        </>
      )}
    </Modal>
  )
}

export function BetMenu({ onClose }: { onClose: () => void }) {
  const betIndex = useGameStore((s) => s.betIndex)
  const setBetIndex = useGameStore((s) => s.setBetIndex)
  return (
    <Modal title="BET MENU" onClose={onClose}>
      <p className="muted">Min $0.20 · Max $240.00</p>
      <div className="bet-grid">
        {BET_LEVELS_CENTS.map((cents, i) => (
          <button
            key={cents}
            className={`btn ${i === betIndex ? 'primary' : ''}`}
            onClick={() => {
              setBetIndex(i)
              onClose()
            }}
          >
            {fmt(cents)}
          </button>
        ))}
      </div>
    </Modal>
  )
}

const SYMBOL_NAMES: Record<string, string> = {
  cleopatra: 'Cleopatra',
  gold_scarab: 'Gold Scarab',
  ankh_ring: 'Ankh Ring',
  cleopatra_coin: 'Cleopatra Coin',
  eye_of_horus: 'Eye of Horus',
  sym_a: 'A',
  sym_k: 'K',
  sym_q: 'Q',
  sym_j: 'J',
  sym_10: '10',
  sym_9: '9',
  wild_multiplier: 'Wild ×2 (Free Spins)',
}

export function InfoModal({ onClose }: { onClose: () => void }) {
  const betIndex = useGameStore((s) => s.betIndex)
  const bet = BET_LEVELS_CENTS[betIndex]!
  const val = (x100: number) => fmt(Math.round((x100 * bet) / 100))

  return (
    <Modal title="GAME RULES" onClose={onClose}>
      <div className="info-scroll">
        <p>
          All symbols pay from left to right on adjacent reels starting from the leftmost
          reel. 1024 ways. Win = pay × ways.
        </p>
        <table className="paytable">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>2</th>
              <th>3</th>
              <th>4</th>
              <th>5</th>
            </tr>
          </thead>
          <tbody>
            {(Object.keys(SYMBOL_NAMES) as SymbolId[]).map((sym) => {
              const pays = PAY_X100[sym]
              if (!pays) return null
              return (
                <tr key={sym}>
                  <td>{SYMBOL_NAMES[sym]}</td>
                  {[2, 3, 4, 5].map((n) => (
                    <td key={n}>{pays[n] !== undefined ? val(pays[n]!) : '—'}</td>
                  ))}
                </tr>
              )
            })}
            <tr>
              <td>Scatter (anywhere)</td>
              <td>—</td>
              {[3, 4, 5].map((n) => (
                <td key={n}>{val(SCATTER_PAY_X100[n]!)}</td>
              ))}
            </tr>
          </tbody>
        </table>
        <p>
          <b>WILD</b> substitutes for all symbols except SCATTER; appears on reels 2, 3, 4.
          <br />
          <b>FREE SPINS</b>: hit 3, 4 or 5 SCATTER symbols to win 10 free spins. The WILD
          MULTIPLIER (×2) appears on all reels only during free spins; multipliers in the
          same combination multiply each other.
          <br />
          <b>VAULT</b>: starts at 20× total bet. Won at round end only if all 20 positions
          are marked. After the first free spin, 8 random positions on reels 2, 3 or 4 are
          marked; CLEOPATRA hitting an unmarked position marks it. Wild hits add a random
          amount; 3/4/5 scatters add 10×/50×/250×.
          <br />
          <b>BUY FEATURE</b>: pay 30× total bet — always lands exactly 3 scatters.
          <br />
          <b>MAX WIN</b>: 12,500× bet. Reaching it ends the round immediately; remaining
          free spins and features are forfeited.
          <br />
          RTP targets: 96.51% (base) · 96.56% (buy).
        </p>
      </div>
    </Modal>
  )
}

export function SettingsModal({ onClose }: { onClose: () => void }) {
  const settings = useGameStore((s) => s.settings)
  const toggle = useGameStore((s) => s.toggleSetting)
  const history = useGameStore((s) => s.history)
  return (
    <Modal title="SETTINGS" onClose={onClose}>
      <label className="setting">
        <input type="checkbox" checked={settings.introScreen} onChange={() => toggle('introScreen')} />
        INTRO SCREEN
      </label>
      <label className="setting">
        <input type="checkbox" checked={settings.ambient} onChange={() => toggle('ambient')} />
        AMBIENT (stub — no audio assets yet)
      </label>
      <label className="setting">
        <input type="checkbox" checked={settings.soundFx} onChange={() => toggle('soundFx')} />
        SOUND FX (stub — no audio assets yet)
      </label>
      <h3>GAME HISTORY</h3>
      <div className="info-scroll small">
        {history.length === 0 && <p className="muted">No rounds yet.</p>}
        {history.map((h, i) => (
          <div key={i} className="history-row">
            <span>{h.buy ? 'BUY' : 'SPIN'}</span>
            <span>bet {fmt(h.betCents)}</span>
            <span className={h.totalWinCents > 0 ? 'win' : ''}>win {fmt(h.totalWinCents)}</span>
          </div>
        ))}
      </div>
    </Modal>
  )
}

export function AutoplayMenu({ onClose }: { onClose: () => void }) {
  const setAutoplay = useGameStore((s) => s.setAutoplay)
  const spin = useGameStore((s) => s.spin)
  return (
    <Modal title="AUTOPLAY" onClose={onClose}>
      <div className="modal-actions">
        {[10, 25, 50, 100].map((n) => (
          <button
            key={n}
            className="btn"
            onClick={() => {
              setAutoplay(n - 1)
              onClose()
              spin()
            }}
          >
            {n}
          </button>
        ))}
      </div>
    </Modal>
  )
}
