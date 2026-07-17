import { useState } from 'react'
import { BET_LEVELS_CENTS, BUY_COST_MULT } from '../engine'
import { fmt, useGameStore } from '../store/gameStore'
import { BetMenu, BuyModal, InfoModal, SettingsModal, AutoplayMenu } from './modals'

type ModalKind = 'buy' | 'bet' | 'info' | 'settings' | 'autoplay' | null

export function HUD() {
  const [modal, setModal] = useState<ModalKind>(null)
  const balance = useGameStore((s) => s.balanceCents)
  const betIndex = useGameStore((s) => s.betIndex)
  const winCents = useGameStore((s) => s.winCents)
  const phase = useGameStore((s) => s.phase)
  const speed = useGameStore((s) => s.speed)
  const autoplay = useGameStore((s) => s.autoplayRemaining)
  const spin = useGameStore((s) => s.spin)
  const cycleSpeed = useGameStore((s) => s.cycleSpeed)
  const setBetIndex = useGameStore((s) => s.setBetIndex)
  const setAutoplay = useGameStore((s) => s.setAutoplay)

  const betCents = BET_LEVELS_CENTS[betIndex]!
  const idle = phase === 'idle'
  const canBuy = idle && balance >= BUY_COST_MULT * betCents

  return (
    <>
      <div className="hud">
        <button className="btn buy" disabled={!canBuy} onClick={() => setModal('buy')}>
          BUY
          <br />
          FEATURE
          <br />
          <small>{fmt(BUY_COST_MULT * betCents)}</small>
        </button>

        <div className="meters">
          <div>
            <span className="meter-label">CREDIT</span>
            <span className="meter-value">{fmt(balance)}</span>
          </div>
          <div>
            <span className="meter-label">BET</span>
            <span className="meter-value">{fmt(betCents)}</span>
          </div>
          <div>
            <span className="meter-label">WIN</span>
            <span className="meter-value win">{winCents > 0 ? fmt(winCents) : '—'}</span>
          </div>
        </div>

        <div className="controls">
          <button className="btn round" title="Settings" onClick={() => setModal('settings')}>
            ≡
          </button>
          <button className="btn round" title="Info / Paytable" onClick={() => setModal('info')}>
            i
          </button>
          <button
            className="btn round"
            disabled={!idle}
            title="Decrease bet"
            onClick={() => setBetIndex(betIndex - 1)}
          >
            −
          </button>
          <button className="btn spin" disabled={!idle} onClick={() => spin()}>
            {idle ? 'SPIN' : '…'}
          </button>
          <button
            className="btn round"
            disabled={!idle}
            title="Increase bet / bet menu"
            onClick={() => setModal('bet')}
          >
            +
          </button>
          <button className="btn round" title={`Speed: ${speed}`} onClick={cycleSpeed}>
            {speed === 'normal' ? '»' : speed === 'quick' ? '»»' : '»»»'}
          </button>
          <button
            className={`btn autoplay ${autoplay > 0 ? 'active' : ''}`}
            onClick={() => (autoplay > 0 ? setAutoplay(0) : setModal('autoplay'))}
          >
            {autoplay > 0 ? `AUTO ${autoplay}` : 'AUTOPLAY'}
          </button>
        </div>
      </div>

      {modal === 'buy' && <BuyModal onClose={() => setModal(null)} />}
      {modal === 'bet' && <BetMenu onClose={() => setModal(null)} />}
      {modal === 'info' && <InfoModal onClose={() => setModal(null)} />}
      {modal === 'settings' && <SettingsModal onClose={() => setModal(null)} />}
      {modal === 'autoplay' && <AutoplayMenu onClose={() => setModal(null)} />}
      <div className="hint">HOLD SPACE FOR TURBO SPIN · SPACE/ENTER TO SPIN</div>
    </>
  )
}
