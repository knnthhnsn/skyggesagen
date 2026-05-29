import { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header.jsx'
import Button from '../components/Button.jsx'
import SkipTaskButton from '../components/SkipTaskButton.jsx'
import Milo from '../components/Milo.jsx'
import MiloSpeech from '../components/MiloSpeech.jsx'
import { TIMELINE_EVENTS, MILO_LINES } from '../data/caseData.js'
import { useGame } from '../context/GameContext.jsx'
import { playTimelineTick, playCorrect, playInsight } from '../utils/audio.js'

const CORRECT_TIMELINE_ORDER = TIMELINE_EVENTS
  .slice()
  .sort((a, b) => a.order - b.order)
  .map((e) => e.id)

export default function TimelineScreen({ onNext, onBack }) {
  const { state, setTimelineOrder, solveTimeline, addBadge } = useGame()
  const [order, setOrder] = useState(() => {
    if (Array.isArray(state.timelineOrder) && state.timelineOrder.length === TIMELINE_EVENTS.length) {
      return state.timelineOrder
    }
    if (state.timelineSolved) return CORRECT_TIMELINE_ORDER
    return shuffle(CORRECT_TIMELINE_ORDER)
  })
  const [solved, setSolved] = useState(state.timelineSolved)
  const [milo, setMilo] = useState(state.timelineSolved ? MILO_LINES.timelineCorrect : MILO_LINES.timelineIntro)

  const items = useMemo(() => order.map((id) => TIMELINE_EVENTS.find((e) => e.id === id)).filter(Boolean), [order])
  const correctCount = useMemo(() => order.filter((id, idx) => {
    const ev = TIMELINE_EVENTS.find((e) => e.id === id)
    return ev && ev.order === idx + 1
  }).length, [order])

  const isCorrect = correctCount === TIMELINE_EVENTS.length
  const focusedHour = items[Math.min(items.length - 1, Math.max(0, Math.floor(items.length / 2)))]

  useEffect(() => {
    if (isCorrect && !solved) {
      setSolved(true)
      solveTimeline()
      addBadge('tidsdetektiv')
      setMilo(MILO_LINES.timelineCorrect)
      playCorrect()
      setTimeout(() => playInsight(), 250)
    }
  }, [isCorrect, solved, solveTimeline, addBadge])

  function move(idx, dir) {
    const j = idx + dir
    if (j < 0 || j >= order.length) return
    const next = order.slice()
    ;[next[idx], next[j]] = [next[j], next[idx]]
    setOrder(next)
    setTimelineOrder(next)
    playTimelineTick()
    if (!isCorrect && correctCount + 1 < TIMELINE_EVENTS.length) {
      setMilo(MILO_LINES.timelineWrong)
    }
  }

  // Sol-position baseret på antal korrekt placerede (0..1)
  const sunPos = TIMELINE_EVENTS.length === 0 ? 0 : correctCount / TIMELINE_EVENTS.length

  return (
    <div className="screen screen-pad">
      <Header eyebrow="Tidslinje" name="Hvad skete der?" onBack={onBack} />

      <div className="milo-row" style={{ alignItems: 'flex-end' }}>
        <Milo pose={solved ? 'thumbs' : 'run'} size="sm" bob={!solved} pulse={solved} />
        <MiloSpeech>{milo}</MiloSpeech>
      </div>

      <div className={`timeline-stage${solved ? ' is-solved' : ''}`} aria-label="Sol-bue der følger med korrekt placering">
        <SunArc progress={sunPos} solved={solved} />
        <div className="timeline-axis" aria-hidden="true">
          <span>Før</span>
          <span>Under</span>
          <span>Efter</span>
        </div>
      </div>

      <div className="paper-warm">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className="eyebrow">Sæt begivenhederne i rigtig rækkefølge</span>
          <span className="tag tag-blue">{correctCount}/{TIMELINE_EVENTS.length}</span>
        </div>
        <ol className="timeline-list" aria-label="Begivenheder">
          {items.map((ev, idx) => {
            const correctSpot = ev.order === idx + 1
            return (
              <li key={ev.id} className={`timeline-piece${correctSpot ? ' is-correct' : ''}${ev.anchor ? ' is-anchor' : ''}`}>
                <span className="timeline-time" aria-hidden="true">{ev.time}</span>
                <div className="timeline-piece-copy">
                  <strong>{ev.label}</strong>
                  <span>{ev.desc}</span>
                </div>
                <div className="timeline-piece-actions">
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => move(idx, -1)}
                    disabled={idx === 0 || solved}
                    aria-label={`Flyt "${ev.label}" tidligere`}
                  >▲</button>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => move(idx, 1)}
                    disabled={idx === order.length - 1 || solved}
                    aria-label={`Flyt "${ev.label}" senere`}
                  >▼</button>
                </div>
              </li>
            )
          })}
        </ol>
      </div>

      {solved && (
        <div className="paper fade-up timeline-insight">
          <span className="eyebrow">Indsigt</span>
          <p>
            Billedet blev taget kl. <strong>{focusedHour?.time || '11:42'}</strong>. Men dagen havde mange minutter både før og efter. Et frosset øjeblik er ikke en hel sandhed.
          </p>
        </div>
      )}

      <div className="screen-bottom-bar">
        <SkipTaskButton screen="timeline" onSkip={onNext} />
        <Button variant="primary" block onClick={onNext} disabled={!solved}>
          {solved ? 'Sorter sporene' : `Sæt begivenhederne (${correctCount}/${TIMELINE_EVENTS.length})`}
        </Button>
      </div>
    </div>
  )
}

function SunArc({ progress, solved }) {
  // Sol bevæger sig fra venstre til højre langs en bue
  const angle = (progress * 180) - 180 // -180 til 0
  const cx = 140 + Math.cos((angle * Math.PI) / 180) * 104
  const cy = 66 + Math.sin((angle * Math.PI) / 180) * 46

  return (
    <svg viewBox="0 0 280 90" className="sun-arc" aria-hidden="true">
      <defs>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff7d9" />
          <stop offset="60%" stopColor="#f7c948" />
          <stop offset="100%" stopColor="rgba(247,201,72,0)" />
        </radialGradient>
        <linearGradient id="arcSky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#a9c4e2" />
          <stop offset="100%" stopColor="#dbe7f4" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="280" height="90" fill="url(#arcSky)" rx="10" />
      <path d="M36 66 A 104 46 0 0 1 244 66" stroke="rgba(31,41,51,0.18)" strokeWidth="2" fill="none" strokeDasharray="6 10" />
      <circle cx={cx} cy={cy} r="18" fill="url(#sunGlow)" />
      <circle cx={cx} cy={cy} r="9" fill="#f7c948" />
      {solved && (
        <g opacity="0.85">
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2
            const rx = cx + Math.cos(a) * 23
            const ry = cy + Math.sin(a) * 23
            return <circle key={i} cx={rx} cy={ry} r="2.2" fill="#fff7d9" />
          })}
        </g>
      )}
    </svg>
  )
}

function shuffle(arr) {
  const a = arr.slice()
  let scrambled = false
  // Sørg for at outputtet ikke er identisk med input
  while (!scrambled) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    scrambled = a.some((id, idx) => id !== arr[idx])
  }
  return a
}
