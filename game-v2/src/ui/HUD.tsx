import { buyFeature, spinOnce, stopAutoplay } from '../bus';
import { buyCost } from '../engine';
import { useGameStore } from '../store/gameStore';

const fmt = (n: number) => `$${n.toFixed(2)}`;

export function HUD() {
  const s = useGameStore();
  const busy = s.phase !== 'idle';

  return (
    <>
      <div className="topbar">
        <button
          className="buy-btn"
          disabled={busy || s.autoplayActive || s.balance < buyCost(s.totalBet)}
          onClick={() => s.patch({ modal: 'buy' })}
        >
          BUY FEATURE
          <span>{fmt(buyCost(s.totalBet))}</span>
        </button>
        {s.vault.active && (
          <div className="vault-panel">
            <div className="vault-title">VAULT</div>
            <div className="vault-value">{s.vault.value === null ? '—' : fmt(s.vault.value)}</div>
            <div className="vault-keys">{s.vault.markedCount}/20</div>
            {s.fsSpinsLeft !== null && (
              <div className="fs-left">
                {s.fsSpinsLeft === 0 ? 'LAST FREE SPIN' : `${s.fsSpinsLeft} REMAINING SPINS`}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="msgbar">
        {s.winMessage ?? (s.lastWin > 0 ? `WIN ${fmt(s.lastWin)}` : 'PLACE YOUR BETS!')}
      </div>

      <div className="controls">
        <div className="readout">
          <label>CREDIT</label>
          <span>{fmt(s.balance)}</span>
        </div>
        <div className="readout">
          <label>BET</label>
          <span>{fmt(s.totalBet)}</span>
        </div>
        <button className="round-btn" disabled={busy} onClick={() => s.patch({ modal: 'bet' })}>
          +
        </button>
        <button className="spin-btn" disabled={busy || s.balance < s.totalBet} onClick={() => void spinOnce()}>
          {busy ? '···' : 'SPIN'}
        </button>
        {s.autoplayActive ? (
          <button className="auto-btn active" onClick={() => stopAutoplay()}>
            AUTO SPINS LEFT {s.autoplayLeft}
          </button>
        ) : (
          <button className="auto-btn" disabled={busy} onClick={() => s.patch({ modal: 'autoplay' })}>
            AUTOPLAY
          </button>
        )}
        <button className="round-btn" disabled={busy} onClick={() => s.patch({ modal: 'info' })}>
          i
        </button>
        <div className="readout">
          <label>WIN</label>
          <span>{fmt(s.lastWin)}</span>
        </div>
      </div>
    </>
  );
}

export function BuyModalGate() {
  const s = useGameStore();
  if (s.modal !== 'buy') return null;
  return (
    <div className="modal-backdrop" onClick={() => s.patch({ modal: null })}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>BUY FEATURE</h2>
        <p className="buy-cost">
          FREE SPINS
          <br />
          <b>{fmt(buyCost(s.totalBet))}</b>
        </p>
        <p>Trigger Free Spins with 3 scatters</p>
        <div className="modal-row">
          <button
            className="confirm"
            onClick={() => {
              s.patch({ modal: null });
              void buyFeature();
            }}
          >
            YES
          </button>
          <button onClick={() => s.patch({ modal: null })}>✕</button>
        </div>
      </div>
    </div>
  );
}
