import { useId } from 'react'
import { useGame } from '../context/GameContext.jsx'
import { initAudio, playClick, setSoundEnabled } from '../utils/audio.js'

export default function SoundToggle() {
  const { state, setSound } = useGame()
  const enabled = state.soundEnabled !== false
  const statusId = useId()
  const statusText = enabled ? 'Lyd er slået til' : 'Lyd er slået fra'

  function toggle() {
    initAudio()
    const next = !enabled
    setSoundEnabled(next)
    setSound(next)
    if (next) playClick()
  }

  return (
    <>
      <button
        type="button"
        className={`sound-toggle${enabled ? '' : ' off'}`}
        onClick={toggle}
        aria-pressed={enabled}
        aria-label={enabled ? 'Slå lyd fra' : 'Slå lyd til'}
        aria-describedby={statusId}
        title={enabled ? 'Lyd til' : 'Lyd fra'}
      >
        <span className="dot" aria-hidden="true">
          {enabled ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10v4a1 1 0 0 0 1 1h3l4 4V5L7 9H4a1 1 0 0 0-1 1Z"/><path d="M16 9a4 4 0 0 1 0 6"/><path d="M19 6a8 8 0 0 1 0 12"/></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10v4a1 1 0 0 0 1 1h3l4 4V5L7 9H4a1 1 0 0 0-1 1Z"/><path d="m17 9 4 6"/><path d="m21 9-4 6"/></svg>
          )}
        </span>
        <span aria-hidden="true">{enabled ? 'Lyd til' : 'Lyd fra'}</span>
      </button>
      <span id={statusId} className="sr-only" role="status" aria-live="polite">
        {statusText}
      </span>
    </>
  )
}
