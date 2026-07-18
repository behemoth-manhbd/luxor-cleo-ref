import { PAYTABLE } from '../../engine';
import { useGameStore } from '../../store/gameStore';

export function InfoModal() {
  const s = useGameStore();
  if (s.modal !== 'info') return null;

  const symbols = Object.entries(PAYTABLE).filter(([id]) => id !== 'scatter');

  return (
    <div className="modal-backdrop" onClick={() => s.patch({ modal: null })}>
      <div className="modal info" onClick={(e) => e.stopPropagation()}>
        <h2>GAME RULES</h2>
        <p>
          1024 ways: symbols pay left to right on adjacent reels from reel 1 — win = pay × ways ×
          total bet. Wild (pyramid) lands on reels 2–4 and substitutes all symbols except scatter.
        </p>
        <table>
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
            {symbols.map(([id, bands]) => (
              <tr key={id}>
                <td>{id}</td>
                {[2, 3, 4, 5].map((n) => (
                  <td key={n}>{bands[n as 2 | 3 | 4 | 5] ?? '—'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          3/4/5 scatters pay 1x/5x/25x and award 10 Free Spins (flat, no retrigger). In Free Spins
          the WILD x2 coin lands on any reel; each wild in a way doubles it (2x/4x/8x…). The Vault
          starts at 20x bet; after the first free spin 8 positions on reels 2–4 are marked;
          Cleopatra marks unmarked cells; wilds add a random amount (by wild count), scatters add
          10x/50x/250x. The Vault pays only if all 20 positions are marked — otherwise forfeited.
          Buy Feature = 30x bet (forces 3 scatters). Max win 12,500x bet — the round ends
          immediately when reached.
        </p>
        <div className="modal-row">
          <button onClick={() => s.patch({ modal: null })}>✕</button>
        </div>
      </div>
    </div>
  );
}
