import { PixiStage } from './game/PixiStage';
import { Banners } from './ui/Banners';
import { BuyModalGate, HUD } from './ui/HUD';
import { AutoplayModal } from './ui/modals/AutoplayModal';
import { BetPanel } from './ui/modals/BetPanel';
import { InfoModal } from './ui/modals/InfoModal';

export function App() {
  return (
    <div className="app">
      <div className="logo">LUXOR OF CLEOPATRA</div>
      <PixiStage />
      <HUD />
      <Banners />
      <BetPanel />
      <AutoplayModal />
      <BuyModalGate />
      <InfoModal />
    </div>
  );
}
