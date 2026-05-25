import { useId } from 'react'
import { useGame } from '../context/GameContext.jsx'
import { initAudio, playClick } from '../utils/audio.js'

export default function MotionToggle() {
  const { state, setMotionEffects } = useGame()
  const enabled = state.motionEffectsEnabled !== false
  const statusId = useId()
  const statusText = enabled ? 'Effekter er slået til' : 'Effekter er slået fra'

  function toggle() {
    initAudio()
    const next = !enabled
    setMotionEffects(next)
    if (next && state.soundEnabled !== false) playClick()
  }

  return (
    <>
      <button
        type="button"
        className={`sound-toggle motion-toggle${enabled ? '' : ' off'}`}
        onClick={toggle}
        aria-pressed={enabled}
        aria-label={enabled ? 'Slå effekter fra' : 'Slå effekter til'}
        aria-describedby={statusId}
        title={enabled ? 'Effekter til' : 'Effekter fra'}
      >
        <span className="dot" aria-hidden="true">
          {enabled ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h8l-1 8 11-13h-8l0-7Z"/></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h8l-1 8 11-13h-8l0-7Z"/><path d="m3 3 18 18"/></svg>
          )}
        </span>
        <span aria-hidden="true">{enabled ? 'Effekter til' : 'Effekter fra'}</span>
      </button>
      <span id={statusId} className="sr-only" role="status" aria-live="polite">
        {statusText}
      </span>
    </>
  )
}
