import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Button from './Button.jsx'
import Milo from './Milo.jsx'
import MiloSpeech from './MiloSpeech.jsx'
import { BADGES } from '../data/caseData.js'
import { useGame } from '../context/GameContext.jsx'
import { playAchievementStamp } from '../utils/audio.js'

const MILO_BADGE_LINES = {
  'forste-spor': 'Dit første spor er stemplet i sagsmappen.',
  'skarpt-blik': 'Du fandt alle spor. Det var skarpt set.',
  'tre-vinkler': 'Tre vinkler gør sagen større end et billede.',
  tidsdetektiv: 'Nu kan du se før, under og efter.',
  'godt-sporgsmal': 'Det spørgsmål åbnede døren til sagen.',
  skyggeopklarer: 'Skyggen blev afsløret. Flot detektivarbejde.',
  sporgsmalsmester: 'Du spørger som en filosof-detektiv.',
  'idernes-ven': 'Du så forskel på ideen og kopien.',
  huleudfrier: 'Du gik fra skygge til lys.',
  'sjaelens-detektiv': 'Du fandt Platons værktøjer.',
  'maagens-ven': 'Du fandt min hemmelige hilsen.',
}

const BURST_BITS = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  style: {
    '--angle': `${i * (360 / 28)}deg`,
    '--delay': `${120 + i * 9}ms`,
  },
}))
const CONFETTI_BITS = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  style: {
    '--x': `${((i % 8) - 3.5) * 76}px`,
    '--y': `${-150 - (i % 5) * 22}px`,
    '--r': `${(i * 29) % 180 - 90}deg`,
    '--d': `${80 + (i % 6) * 44}ms`,
    '--s': `${0.78 + (i % 4) * 0.12}`,
  },
}))

export default function AchievementPopup() {
  const { state } = useGame()
  const badgeEvents = state.badgeEvents || []
  const seenEventIdsRef = useRef(new Set())
  const closeRef = useRef(null)
  const [queue, setQueue] = useState([])

  useEffect(() => {
    const nextEvents = badgeEvents.filter((event) => (
      event?.id &&
      event?.eventId &&
      BADGES[event.id] &&
      !seenEventIdsRef.current.has(event.eventId)
    ))
    if (nextEvents.length === 0) return
    nextEvents.forEach((event) => seenEventIdsRef.current.add(event.eventId))
    setQueue((current) => [...current, ...nextEvents.map((event) => event.id)])
  }, [badgeEvents])

  const activeId = queue[0]
  const badge = activeId ? BADGES[activeId] : null

  useEffect(() => {
    if (!badge) return undefined
    playAchievementStamp()
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 220)

    function handleKeyDown(event) {
      if (event.key === 'Escape') dismiss()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [badge])

  function dismiss() {
    setQueue((current) => current.slice(1))
  }

  if (!badge) return null

  const miloLine = MILO_BADGE_LINES[activeId] || 'Nyt mærke i sagsmappen.'

  const popup = (
    <div className="achievement-overlay" role="dialog" aria-modal="true" aria-labelledby="achievement-title" aria-describedby="achievement-desc">
      <div className="achievement-flash" aria-hidden="true" />
      <div className="achievement-rays" aria-hidden="true" />
      <div className="achievement-shockwave" aria-hidden="true">
        <span />
        <span />
      </div>

      <div className="achievement-burst" aria-hidden="true">
        {BURST_BITS.map((bit) => (
          <span key={bit.id} style={bit.style} />
        ))}
      </div>

      <div className="achievement-confetti" aria-hidden="true">
        {CONFETTI_BITS.map((bit) => (
          <span key={bit.id} style={bit.style} />
        ))}
      </div>

      <section className="achievement-card" aria-label="Nyt mærke">
        <span className="achievement-wow" aria-hidden="true">Wauw!</span>
        <div className="achievement-folder" aria-hidden="true">
          <span className="achievement-folder-tab" />
          <div className="achievement-folder-paper">
            <span className="achievement-stamp">Nyt mærke</span>
          </div>
        </div>

        <div className="achievement-medal" aria-hidden="true">
          <span>★</span>
        </div>

        <div className="achievement-copy">
          <span className="eyebrow">Mærke låst op</span>
          <h2 id="achievement-title">{badge.label}</h2>
          <p id="achievement-desc">{badge.desc}</p>
        </div>

        <div className="achievement-milo">
          <Milo pose="flying" size="sm" bob pulse />
          <MiloSpeech>{miloLine}</MiloSpeech>
        </div>

        <Button ref={closeRef} variant="primary" block onClick={dismiss}>
          Stempel i sagsmappen
        </Button>
      </section>
    </div>
  )

  return typeof document !== 'undefined' ? createPortal(popup, document.body) : popup
}
