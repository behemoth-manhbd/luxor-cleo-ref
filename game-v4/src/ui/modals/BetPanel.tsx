import { BET_LEVELS, COIN_VALUES, MAX_TOTAL_BET, MIN_TOTAL_BET, totalBet } from '../../engine';
import { useGameStore } from '../../store/gameStore';

const fmt = (n: number) => `$${n.toFixed(2)}`;

export function BetPanel() {
  const s = useGameStore();
  if (s.modal !== 'bet') return null;

  const step = (levelDelta: number, coinDelta: number) => {
    const li = Math.min(Math.max(BET_LEVELS.indexOf(s.betLevel) + levelDelta, 0), BET_LEVELS.length - 1);
    const ci = Math.min(Math.max(COIN_VALUES.indexOf(s.coinValue) + coinDelta, 0), COIN_VALUES.length - 1);
    const next = totalBet(BET_LEVELS[li], COIN_VALUES[ci]);
    if (next >= MIN_TOTAL_BET && next <= MAX_TOTAL_BET) s.setBet(BET_LEVELS[li], COIN_VALUES[ci]);
  };

  const betMax = () => s.setBet(BET_LEVELS[BET_LEVELS.length - 1], COIN_VALUES[COIN_VALUES.length - 1]);

  return (
    <div className="modal-backdrop" onClick={() => s.patch({ modal: null })}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>BET MULTIPLIER 20x</h2>
        <div className="stepper">
          <label>BET</label>
          <button onClick={() => step(-1, 0)}>−</button>
          <span>{s.betLevel}</span>
          <button onClick={() => step(1, 0)}>+</button>
        </div>
        <div className="stepper">
          <label>COIN VALUE</label>
          <button onClick={() => step(0, -1)}>−</button>
          <span>{fmt(s.coinValue)}</span>
          <button onClick={() => step(0, 1)}>+</button>
        </div>
        <div className="stepper">
          <label>TOTAL BET</label>
          <span className="total">{fmt(s.totalBet)}</span>
        </div>
        <div className="modal-row">
          <button className="confirm" onClick={betMax}>
            BET MAX
          </button>
          <button onClick={() => s.patch({ modal: null })}>✕</button>
        </div>
      </div>
    </div>
  );
}
