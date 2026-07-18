import { useEffect, useRef } from 'react';
import { Application } from 'pixi.js';
import { registerScene } from '../bus';
import { useGameStore } from '../store/gameStore';
import { BOARD_H, BOARD_W, BoardScene } from './scene/BoardScene';

const PAD = 40;

export function PixiStage() {
  const hostRef = useRef<HTMLDivElement>(null);
  const phase = useGameStore((s) => s.phase);

  useEffect(() => {
    const host = hostRef.current!;
    let app: Application | null = null;
    let destroyed = false;

    (async () => {
      const a = new Application();
      await a.init({
        width: BOARD_W + PAD * 2,
        height: BOARD_H + PAD * 2,
        backgroundAlpha: 0,
        antialias: true,
      });
      if (destroyed) {
        a.destroy(true);
        return;
      }
      app = a;
      host.appendChild(a.canvas);
      const scene = new BoardScene();
      scene.root.position.set(PAD, PAD);
      a.stage.addChild(scene.root);
      registerScene(scene);
    })();

    return () => {
      destroyed = true;
      app?.destroy(true, { children: true });
      host.innerHTML = '';
    };
  }, []);

  // day palace in base game, night temple during free spins (art-design.md)
  return <div ref={hostRef} className={`stage ${phase === 'fs' ? 'stage-night' : ''}`} />;
}
