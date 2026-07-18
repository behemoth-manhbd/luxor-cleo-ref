import { useState } from 'react';
import { startAutoplay } from '../../bus';
import { useGameStore } from '../../store/gameStore';

const COUNTS = [10, 25, 50, 100, 250, 500, 1000];

export function AutoplayModal() {
  const s = useGameStore();
  const [count, setCount] = useState(100);
  if (s.modal !== 'autoplay') return null;

  return (
    <div className="modal-backdrop" onClick={() => s.patch({ modal: null })}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>AUTOPLAY SETTINGS</h2>
        <label className="check">
          <input type="checkbox" checked={s.turbo} onChange={(e) => s.patch({ turbo: e.target.checked })} />
          TURBO SPIN
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={s.skipScreens}
            onChange={(e) => s.patch({ skipScreens: e.target.checked })}
          />
          SKIP SCREENS
        </label>
        <div className="stepper">
          <label>NUMBER OF AUTOSPINS</label>
          <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
            {COUNTS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="modal-row">
          <button className="confirm" onClick={() => void startAutoplay(count)}>
            START AUTOPLAY ({count})
          </button>
          <button onClick={() => s.patch({ modal: null })}>✕</button>
        </div>
      </div>
    </div>
  );
}
