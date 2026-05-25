import { useRef, useState } from 'react'
import { useGame } from '../context/GameContext.jsx'

const POSE_TO_FILE = {
  wave: 'milo-waving.png',
  neutral: 'milo.png',
  adore: 'milo-adore.png',
  thumbs: 'milo-thumbs-hover.png',
  glitter: 'milo-glitter.png',
  side: 'milo-side.png',
  poses: 'milo-poses.png',
  watching: 'milo-watching.png',
  run: 'milo-run.png',
  flying: 'milo-flying.png',
}

const POSE_ALT = {
  wave: 'Milo mågen vinker',
  neutral: 'Milo mågen som detektiv',
  adore: 'Milo mågen ser undrende ud',
  thumbs: 'Milo mågen giver tommel op',
  glitter: 'Milo mågen fejrer',
  side: 'Milo mågen i profil',
  poses: 'Milo mågen i forskellige positurer',
  watching: 'Milo mågen holder øje med sagen',
  run: 'Milo mågen løber videre i sagen',
  flying: 'Milo mågen flyver af sted med en indsigt',
}

/**
 * Milo komponent — robust med fallback hvis billede mangler.
 * Tryk x5 låser easter-egg op (kun sjov, ingen progression-konsekvens).
 * Brug:  <Milo pose="wave" size="lg" bob />
 */
export default function Milo({
  pose = 'neutral',
  size = 'md',
  bob = false,
  pulse = false,
  decorative = false,
  className = '',
  style,
}) {
  const [errored, setErrored] = useState(false)
  const [nudge, setNudge] = useState(false)
  const miloRef = useRef(null)
  const nudgeTimerRef = useRef(null)
  const ctx = useGame()
  const tapMilo = ctx?.tapMilo
  const eggUnlocked = ctx?.state?.miloEggUnlocked || false

  const file = POSE_TO_FILE[pose] || POSE_TO_FILE.neutral
  const src = `${import.meta.env.BASE_URL || '/'}assets/milo/${file}`
  const alt = decorative ? '' : (POSE_ALT[pose] || 'Milo mågen')
  const tapLabel = eggUnlocked
    ? `${alt}. Tryk for at høre Milos hvisken igen.`
    : `${alt}. Tryk på Milo og se hvad der sker.`

  function handleTap(e) {
    if (decorative || !tapMilo) return
    e.stopPropagation()
    tapMilo(() => miloRef.current)
    if (nudgeTimerRef.current) window.clearTimeout(nudgeTimerRef.current)
    setNudge(true)
    nudgeTimerRef.current = window.setTimeout(() => setNudge(false), 380)
  }

  function handleKeyDown(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return
    e.preventDefault()
    handleTap(e)
  }

  return (
    <div
      ref={miloRef}
      className={`milo size-${size} pose-${pose}${bob ? ' bob' : ''}${pulse ? ' pulse' : ''}${nudge ? ' milo-nudge' : ''} ${className}`}
      style={style}
      aria-hidden={decorative ? 'true' : undefined}
      aria-label={decorative ? undefined : tapLabel}
      role={decorative ? undefined : 'button'}
      tabIndex={decorative ? undefined : 0}
      onClick={decorative ? undefined : handleTap}
      onKeyDown={decorative ? undefined : handleKeyDown}
    >
      {errored ? (
        <div className="milo-fallback" role="img" aria-label={decorative ? undefined : alt}>
          MILO
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="eager"
          draggable="false"
          onError={() => setErrored(true)}
        />
      )}
    </div>
  )
}
