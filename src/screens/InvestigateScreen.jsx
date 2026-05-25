import { useEffect, useRef, useState } from 'react'
import Header from '../components/Header.jsx'
import Button from '../components/Button.jsx'
import SkipTaskButton from '../components/SkipTaskButton.jsx'
import Milo from '../components/Milo.jsx'
import MiloSpeech from '../components/MiloSpeech.jsx'
import ClueReveal from '../components/ClueReveal.jsx'
import { CLUES, MILO_LINES } from '../data/caseData.js'
import { useGame } from '../context/GameContext.jsx'
import { playClue } from '../utils/audio.js'

export default function InvestigateScreen({ onNext, onBack }) {
  const { state, addClue, addBadge } = useGame()
  const [active, setActive] = useState(null) // clue object
  const [milo, setMilo] = useState(MILO_LINES.investigateIntro)
  const [spot, setSpot] = useState({ x: 50, y: 50, on: false })
  const [hintedClueId, setHintedClueId] = useState(null)
  const sceneRef = useRef(null)

  const found = new Set(state.foundClues || [])
  const allFound = CLUES.every((c) => found.has(c.id))
  const nextHiddenClue = CLUES.find((c) => !found.has(c.id))

  useEffect(() => {
    if (allFound) {
      setMilo(MILO_LINES.investigateAllFound)
      addBadge('skarpt-blik')
    }
  }, [allFound, addBadge])

  function handleHotspot(clue) {
    if (found.has(clue.id)) return
    addClue(clue.id)
    if (state.foundClues?.length === 0) addBadge('forste-spor')
    playClue()
    setActive(clue)
    setMilo(clue.miloLine)
    if (hintedClueId === clue.id) setHintedClueId(null)
  }

  function handleMove(e) {
    const el = sceneRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const point = e.touches ? e.touches[0] : e
    const x = ((point.clientX - rect.left) / rect.width) * 100
    const y = ((point.clientY - rect.top) / rect.height) * 100
    setSpot({ x, y, on: true })
  }

  function handleLeave() { setSpot((p) => ({ ...p, on: false })) }

  function showHint() {
    if (!nextHiddenClue) return
    setHintedClueId(nextHiddenClue.id)
    setMilo(`Tip: Kig efter noget ved "${nextHiddenClue.title}".`)
  }

  return (
    <div className="screen screen-pad">
      <Header eyebrow="Undersøg scenen" name="Spor i billedet" onBack={onBack} />

      <div className="milo-row" style={{ alignItems: 'flex-end' }}>
        <Milo pose={allFound ? 'thumbs' : 'watching'} size="sm" bob />
        <MiloSpeech>{milo}</MiloSpeech>
      </div>

      <div
        ref={sceneRef}
        className={`scene${spot.on ? ' is-touched' : ''}`}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onTouchMove={handleMove}
        onTouchEnd={handleLeave}
        role="group"
        aria-label="Et billede fra skolegården. Tryk på det, der virker mistænkeligt, eller brug Milos tip."
      >
        <SceneArt />
        <SceneAtmosphere />
        <div className="scene-frame" />
        <div
          className="scene-spotlight"
          style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
          aria-hidden="true"
        />
        {CLUES.map((c) => {
          const isFound = found.has(c.id)
          return (
            <button
              key={c.id}
              className={`hotspot${isFound ? ' is-found' : ''}${hintedClueId === c.id ? ' is-hinted' : ''}`}
              style={{ left: `${c.hotspot.x}%`, top: `${c.hotspot.y}%` }}
              onClick={() => handleHotspot(c)}
              aria-label={isFound ? `Spor fundet: ${c.title}` : `Undersøg punkt ${c.title}`}
              aria-pressed={isFound}
              disabled={isFound}
            >
              {isFound && <span className="pin-marker">{c.title}</span>}
            </button>
          )
        })}
      </div>

      <div className="paper clue-radar">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className="eyebrow">Spor fundet</span>
          <span className="tag tag-blue">{found.size}/{CLUES.length}</span>
        </div>
        <div className="clue-radar-track" aria-label={`${found.size} af ${CLUES.length} spor fundet`}>
          {CLUES.map((c) => (
            <span key={c.id} className={found.has(c.id) ? 'is-found' : hintedClueId === c.id ? 'is-hinted' : ''} />
          ))}
        </div>
        {!allFound && (
          <div className="clue-hint-row">
            <div>
              <strong>Mangler du et spor?</strong>
              <span>Milo kan pege dig i den rigtige retning.</span>
            </div>
            <Button variant="secondary" onClick={showHint}>
              Få et tip
            </Button>
          </div>
        )}
        <div className="clue-log" aria-label="Sporjournal">
          {CLUES.map((c) => (
            <div key={c.id} className={`clue-log-item${found.has(c.id) ? ' is-found' : ''}`}>
              <span className="clue-log-dot" aria-hidden="true" />
              <span className="clue-log-text">
                {found.has(c.id) ? c.text : 'Skjult spor'}
              </span>
              <span className="clue-log-status">{found.has(c.id) ? 'Fundet' : 'Skjult'}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="screen-bottom-bar">
        <SkipTaskButton screen="investigate" onSkip={onNext} />
        <Button variant="primary" block onClick={onNext} disabled={!allFound}>
          {allFound ? 'Afhør vidner' : `Find alle spor (${found.size}/${CLUES.length})`}
        </Button>
      </div>

      {active && <ClueReveal clue={active} onClose={() => setActive(null)} />}
    </div>
  )
}

// Billedscene med robust SVG-fallback, hvis assettet mangler.
function SceneArt() {
  const [imageErrored, setImageErrored] = useState(false)
  const imageSrc = `${import.meta.env.BASE_URL || '/'}assets/milo/find-spor.png`

  if (!imageErrored) {
    return (
      <img
        className="scene-image"
        src={imageSrc}
        alt=""
        aria-hidden="true"
        draggable="false"
        onError={() => setImageErrored(true)}
      />
    )
  }

  return (
    <>
      <svg className="scene-bg" viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden="true">
        <defs>
          <linearGradient id="isky" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1d263c" />
            <stop offset="55%" stopColor="#283354" />
            <stop offset="100%" stopColor="#3a4870" />
          </linearGradient>
          <linearGradient id="igr" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3a4870" />
            <stop offset="100%" stopColor="#1d263c" />
          </linearGradient>
          <radialGradient id="isun" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="rgba(247,201,72,0.95)" />
            <stop offset="60%" stopColor="rgba(247,201,72,0.2)" />
            <stop offset="100%" stopColor="rgba(247,201,72,0)" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="200" height="100" fill="url(#isky)" />
        <rect x="0" y="100" width="200" height="50" fill="url(#igr)" />
        <ellipse cx="100" cy="40" rx="56" ry="42" fill="url(#isun)" />

        {/* Distant skyline */}
        <g opacity="0.55">
          <rect x="0" y="78" width="14" height="22" fill="#4a5775" />
          <rect x="14" y="72" width="22" height="28" fill="#3f4c69" />
          <rect x="36" y="80" width="12" height="20" fill="#4a5775" />
          <rect x="48" y="68" width="20" height="32" fill="#3f4c69" />
          <rect x="68" y="76" width="18" height="24" fill="#4a5775" />
          <rect x="86" y="62" width="22" height="38" fill="#3f4c69" />
          <rect x="108" y="74" width="16" height="26" fill="#4a5775" />
          <rect x="124" y="68" width="22" height="32" fill="#3f4c69" />
          <rect x="146" y="80" width="14" height="20" fill="#4a5775" />
          <rect x="160" y="72" width="20" height="28" fill="#3f4c69" />
          <rect x="180" y="78" width="20" height="22" fill="#4a5775" />
        </g>

        {/* Fence */}
        <g stroke="#6e4a2a" strokeWidth="1" opacity="0.85">
          <line x1="0" y1="100" x2="200" y2="100" />
          {Array.from({ length: 22 }).map((_, i) => (
            <line key={i} x1={i * 9 + 4} y1="86" x2={i * 9 + 4} y2="100" />
          ))}
        </g>

        {/* Figure 1 (left, foreground) */}
        <g>
          <ellipse cx="56" cy="138" rx="22" ry="3" fill="#0f1626" opacity="0.55" />
          <rect x="46" y="92" width="20" height="44" fill="#4d5b7a" rx="8" />
          <circle cx="56" cy="86" r="9" fill="#4d5b7a" />
        </g>

        {/* Figure 2 (right, foreground, smaller) */}
        <g>
          <ellipse cx="142" cy="134" rx="14" ry="2.5" fill="#0f1626" opacity="0.5" />
          <rect x="135" y="100" width="14" height="32" fill="#3a4860" rx="6" />
          <circle cx="142" cy="95" r="6.5" fill="#3a4860" />
        </g>

        {/* Phone (one person holding) */}
        <rect x="60" y="100" width="6" height="10" rx="1.5" fill="#0f1626" />
        <rect x="60.7" y="100.7" width="4.6" height="6.2" fill="#357fc4" />

        {/* Long shadow stretching */}
        <ellipse cx="86" cy="140" rx="44" ry="6" fill="#060812" opacity="0.45" />

        {/* Mystery glow */}
        <circle cx="100" cy="60" r="50" fill="none" stroke="rgba(247,201,72,0.05)" strokeWidth="2" />
      </svg>
    </>
  )
}

// Atmosfærisk lag oven på scenen: sol-stråler, drivende støv, mild parallax.
function SceneAtmosphere() {
  // Faste positioner så React ikke re-randomiserer per render (hvilket ville flimre).
  const motes = [
    { left: 12, delay: 0, dur: 9.5, size: 5 },
    { left: 22, delay: 2.4, dur: 11, size: 4 },
    { left: 34, delay: 5.1, dur: 8.5, size: 6 },
    { left: 48, delay: 1.2, dur: 10, size: 4 },
    { left: 58, delay: 4.0, dur: 12, size: 5 },
    { left: 68, delay: 6.5, dur: 9, size: 4 },
    { left: 78, delay: 3.2, dur: 11.5, size: 5 },
    { left: 88, delay: 0.8, dur: 10.5, size: 4 },
  ]
  return (
    <div className="scene-atmosphere" aria-hidden="true">
      <span className="scene-sunrays" />
      <span className="scene-vignette" />
      {motes.map((m, i) => (
        <span
          key={i}
          className="scene-mote"
          style={{
            left: `${m.left}%`,
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.dur}s`,
            width: m.size,
            height: m.size,
          }}
        />
      ))}
    </div>
  )
}
