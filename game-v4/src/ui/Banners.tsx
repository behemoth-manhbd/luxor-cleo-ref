import { dismissBanner } from '../bus';
import { useGameStore } from '../store/gameStore';

const fmt = (n: number) => `$${n.toFixed(2)}`;

export function Banners() {
  const banner = useGameStore((s) => s.banner);
  if (!banner) return null;

  return (
    <div className="banner-backdrop" onClick={() => dismissBanner()}>
      {banner.kind === 'fsTrigger' && (
        <div className="banner">
          <h1>CONGRATULATIONS!</h1>
          <p>YOU HAVE WON</p>
          <div className="banner-value">{banner.spins}</div>
          <p className="banner-sub">FREE SPINS</p>
          <p className="banner-hint">PRESS ANYWHERE TO CONTINUE</p>
        </div>
      )}
      {banner.kind === 'fsOutro' && (
        <div className="banner">
          <h1>CONGRATULATIONS!</h1>
          <p>YOU HAVE WON</p>
          <div className="banner-value">{fmt(banner.amount)}</div>
          <p className="banner-sub">IN 10 FREE SPINS</p>
          <p className="banner-hint">PRESS ANYWHERE TO CONTINUE</p>
        </div>
      )}
      {banner.kind === 'mega' && (
        <div className="banner mega">
          <h1>MEGA!</h1>
          <div className="banner-value">{fmt(banner.amount)}</div>
          <p className="banner-hint">PRESS ANYWHERE TO CONTINUE</p>
        </div>
      )}
    </div>
  );
}
