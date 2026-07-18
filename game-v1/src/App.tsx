import { useEffect } from 'react'
import { PixiStage } from './game/PixiStage'
import { HUD } from './ui/HUD'
import { useGameStore } from './store/gameStore'
import { emitSkip } from './game/bus'

export function App() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space' && e.code !== 'Enter') return
      if (e.repeat) return
      e.preventDefault()
      const s = useGameStore.getState()
      if (s.phase === 'idle') s.spin()
      else emitSkip() // SPACE/ENTER also stops/skips the presentation
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="app">
      <PixiStage />
      <HUD />
    </div>
  )
}
