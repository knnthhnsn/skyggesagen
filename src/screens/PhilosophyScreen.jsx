import { useEffect, useMemo, useRef, useState } from 'react'
import OptimizedImage from '../components/OptimizedImage.jsx'
import Header from '../components/Header.jsx'
import Button from '../components/Button.jsx'
import SkipTaskButton from '../components/SkipTaskButton.jsx'
import Milo from '../components/Milo.jsx'
import MiloSpeech from '../components/MiloSpeech.jsx'
import {
  TWO_WORLDS,
  PHILOSOPHY_PAIRS,
  CAVE_STAGES,
  SOUL_INSIGHT,
  PHILOSOPHY_TAKEAWAYS,
  MILO_LINES,
} from '../data/caseData.js'
import { useGame } from '../context/GameContext.jsx'
import { TOTAL_PHILOSOPHY_PAIRS, TOTAL_CAVE_STAGES } from '../utils/progress.js'
import {
  playClick,
  playCorrect,
  playWrong,
  playInsight,
  playUnlock,
  playSolved,
} from '../utils/audio.js'

const CAVE_STAGE_IMAGES = {
  1: 'i-hulen.png',
  2: 'vender-sig.png',
  3: 'mod-udgangen.png',
  4: 'ude-i-solen.png',
}

/**
 * PhilosophyScreen — Platons filosofi i fire trin:
 *   1. To verdener (sanseverden vs. idéverden)
 *   2. Match idéer med deres hverdagskopier (mini-spil)
 *   3. Vejen ud af hulen (4-trins hulelignelse)
 *   4. Sjælen husker hjem (afsluttende indsigt)
 */
export default function PhilosophyScreen({ onNext, onBack }) {
  const {
    state,
    matchPhilosophyPair,
    advanceCaveStage,
    completePhilosophy,
    addBadge,
  } = useGame()

  const matchedPairs = state.philosophyPairs || {}
  const matchedCount = Object.values(matchedPairs).filter(Boolean).length
  const allPairsDone = matchedCount >= TOTAL_PHILOSOPHY_PAIRS
  const caveStage = state.caveStage || 0
  const caveDone = caveStage >= TOTAL_CAVE_STAGES

  const [milo, setMilo] = useState(
    state.philosophyDone ? MILO_LINES.philosophyDone : MILO_LINES.philosophyIntro
  )

  useEffect(() => {
    if (allPairsDone && caveDone && !state.philosophyDone) {
      completePhilosophy()
      addBadge('sjaelens-detektiv')
      playSolved()
      setMilo(MILO_LINES.philosophyDone)
    }
  }, [allPairsDone, caveDone, state.philosophyDone, completePhilosophy, addBadge])

  useEffect(() => {
    if (allPairsDone) addBadge('idernes-ven')
  }, [allPairsDone, addBadge])

  useEffect(() => {
    if (caveDone) addBadge('huleudfrier')
  }, [caveDone, addBadge])

  return (
    <div className="screen screen-pad">
      <Header eyebrow="Platons filosofi" name="To verdener" onBack={onBack} />

      <div className="milo-row" style={{ alignItems: 'flex-end' }}>
        <Milo pose={state.philosophyDone ? 'flying' : caveDone ? 'flying' : allPairsDone ? 'run' : 'adore'} size="sm" bob pulse={state.philosophyDone} />
        <MiloSpeech>{milo}</MiloSpeech>
      </div>

      <TwoWorldsSection onPeek={() => setMilo(MILO_LINES.philosophyTwoWorlds)} />

      <PhilosophyMatching
        matched={matchedPairs}
        onMatch={(pairId) => {
          matchPhilosophyPair(pairId)
          setMilo(MILO_LINES.philosophyMatchHit)
        }}
        onMiss={() => setMilo(MILO_LINES.philosophyMatchMiss)}
        allDone={allPairsDone}
        intro={MILO_LINES.philosophyMatchIntro}
      />

      <CaveJourney
        stage={caveStage}
        onAdvance={(next) => {
          advanceCaveStage(next)
          if (next >= TOTAL_CAVE_STAGES) {
            setMilo(MILO_LINES.philosophyCaveDone)
            playInsight()
          } else {
            setMilo(MILO_LINES.philosophyCaveStep)
            playUnlock()
          }
        }}
      />

      {caveDone && allPairsDone && (
        <SoulSection onSoul={() => setMilo(MILO_LINES.philosophySoul)} />
      )}

      <div className="screen-bottom-bar">
        <SkipTaskButton screen="philosophy" onSkip={onNext} />
        <Button
          variant="primary"
          block
          onClick={onNext}
          disabled={!(allPairsDone && caveDone)}
        >
          {allPairsDone && caveDone
            ? 'Skriv detektivrapporten'
            : !allPairsDone
              ? `Match idéerne (${matchedCount}/${TOTAL_PHILOSOPHY_PAIRS})`
              : `Gå hele vejen ud af hulen (${caveStage}/${TOTAL_CAVE_STAGES})`}
        </Button>
      </div>
    </div>
  )
}

/* ---------- Sektion 1: To verdener ---------- */

function TwoWorldsSection({ onPeek }) {
  return (
    <section className="two-worlds" aria-label="Platons to verdener">
      <div className="two-worlds-head">
        <span className="eyebrow">Platons trick</span>
        <h2 className="two-worlds-title">Verden er delt i to</h2>
        <p className="two-worlds-lead">
          Platon troede, at virkeligheden består af <strong>to verdener</strong>. Den ene kan vi sanse — den anden kan vi
          kun tænke.
        </p>
      </div>

      <div className="two-worlds-grid">
        <article className="world-card world-card-ideas" onClick={onPeek}>
          <div className="world-card-icon" aria-hidden="true">
            <SunIcon />
          </div>
          <span className="world-card-eyebrow">{TWO_WORLDS.ideas.subtitle}</span>
          <h3>{TWO_WORLDS.ideas.title}</h3>
          <ul>
            {TWO_WORLDS.ideas.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </article>

        <div className="two-worlds-bridge" aria-hidden="true">
          <span />
          <strong>kopier af</strong>
          <span />
        </div>

        <article className="world-card world-card-senses" onClick={onPeek}>
          <div className="world-card-icon" aria-hidden="true">
            <ShadowIcon />
          </div>
          <span className="world-card-eyebrow">{TWO_WORLDS.senses.subtitle}</span>
          <h3>{TWO_WORLDS.senses.title}</h3>
          <ul>
            {TWO_WORLDS.senses.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </article>
      </div>

      <p className="two-worlds-bridge-line">{TWO_WORLDS.bridge}</p>
    </section>
  )
}

function SunIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="8" fill="#f7c948" />
      <g stroke="#f7c948" strokeWidth="2" strokeLinecap="round">
        <line x1="20" y1="3" x2="20" y2="9" />
        <line x1="20" y1="31" x2="20" y2="37" />
        <line x1="3" y1="20" x2="9" y2="20" />
        <line x1="31" y1="20" x2="37" y2="20" />
        <line x1="7" y1="7" x2="11" y2="11" />
        <line x1="29" y1="29" x2="33" y2="33" />
        <line x1="7" y1="33" x2="11" y2="29" />
        <line x1="29" y1="11" x2="33" y2="7" />
      </g>
    </svg>
  )
}

function ShadowIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <ellipse cx="20" cy="32" rx="14" ry="3" fill="#1f2933" opacity="0.35" />
      <rect x="14" y="10" width="12" height="18" rx="4" fill="#4d5b7a" />
      <circle cx="20" cy="8" r="5" fill="#4d5b7a" />
    </svg>
  )
}

/* ---------- Sektion 2: Match idéer og kopier ---------- */

function PhilosophyMatching({ matched, onMatch, onMiss, allDone, intro }) {
  // Skift ikke rækkefølgen efter første render — det er distraherende.
  const ideas = useMemo(() => shuffle(PHILOSOPHY_PAIRS.map((p) => ({ id: p.id, text: p.idea, hint: p.ideaHint }))), [])
  const copies = useMemo(() => shuffle(PHILOSOPHY_PAIRS.map((p) => ({ id: p.id, text: p.copy, hint: p.copyHint }))), [])

  const [selectedCopy, setSelectedCopy] = useState(null) // pairId
  const [wrongShake, setWrongShake] = useState(null) // pairId der vibrerer kortvarigt

  function pickCopy(id) {
    if (matched[id]) return
    playClick()
    setSelectedCopy((cur) => (cur === id ? null : id))
  }

  function pickIdea(id) {
    if (matched[id]) return
    if (!selectedCopy) {
      // Hjælp: man skal vælge en kopi først
      playClick()
      return
    }
    if (selectedCopy === id) {
      onMatch(id)
      playCorrect()
      setSelectedCopy(null)
    } else {
      // Forkert match — kort blød vibration, ingen straf
      setWrongShake(id)
      onMiss()
      playWrong()
      window.setTimeout(() => setWrongShake(null), 400)
      setSelectedCopy(null)
    }
  }

  return (
    <section className="philosophy-match" aria-label="Match idé med kopi">
      <div className="philosophy-match-head">
        <span className="eyebrow">Mini-spil · Idé og kopi</span>
        <h2 className="philosophy-match-title">Alt vi ser er en kopi</h2>
        <p>{intro}</p>
      </div>

      <div className="philosophy-match-grid">
        <div className="philosophy-match-col" aria-label="Hverdagens kopier">
          <span className="philosophy-match-col-title">Sanseverdenen</span>
          {copies.map((c) => {
            const isMatched = !!matched[c.id]
            const isSelected = selectedCopy === c.id
            return (
              <button
                key={c.id}
                type="button"
                className={`philosophy-chip philosophy-chip-copy${isMatched ? ' is-matched' : ''}${isSelected ? ' is-selected' : ''}`}
                onClick={() => pickCopy(c.id)}
                disabled={isMatched}
                aria-pressed={isSelected}
              >
                <strong>{c.text}</strong>
                <span>{c.hint}</span>
              </button>
            )
          })}
        </div>

        <div className="philosophy-match-col" aria-label="De perfekte idéer">
          <span className="philosophy-match-col-title">Idéernes verden</span>
          {ideas.map((idea) => {
            const isMatched = !!matched[idea.id]
            const isShaking = wrongShake === idea.id
            return (
              <button
                key={idea.id}
                type="button"
                className={`philosophy-chip philosophy-chip-idea${isMatched ? ' is-matched' : ''}${isShaking ? ' is-shake' : ''}`}
                onClick={() => pickIdea(idea.id)}
                disabled={isMatched}
              >
                <strong>{idea.text}</strong>
                <span>{idea.hint}</span>
              </button>
            )
          })}
        </div>
      </div>

      {allDone && (
        <div className="philosophy-match-insights fade-up">
          <span className="eyebrow">Sådan hænger idé og kopi sammen</span>
          <ul>
            {PHILOSOPHY_PAIRS.map((p) => (
              <li key={p.id}>{p.insight}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

function shuffle(arr) {
  const copy = arr.slice()
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/* ---------- Sektion 3: Vejen ud af hulen ---------- */

function CaveJourney({ stage, onAdvance }) {
  const isDone = stage >= CAVE_STAGES.length
  const maxViewIndex = isDone ? CAVE_STAGES.length - 1 : Math.min(stage, CAVE_STAGES.length - 1)
  const progressIndex = isDone ? CAVE_STAGES.length - 1 : maxViewIndex
  const [viewIndex, setViewIndex] = useState(maxViewIndex)
  const prevStageRef = useRef(stage)

  useEffect(() => {
    if (stage > prevStageRef.current) {
      setViewIndex(Math.min(stage, CAVE_STAGES.length - 1))
    }
    prevStageRef.current = stage
  }, [stage])

  useEffect(() => {
    if (viewIndex > maxViewIndex) setViewIndex(maxViewIndex)
  }, [maxViewIndex, viewIndex])

  const shown = CAVE_STAGES[viewIndex]
  const isReviewing = viewIndex < progressIndex
  const isAtProgress = viewIndex === progressIndex && !isDone

  function step() {
    onAdvance(stage + 1)
  }

  function openStep(idx) {
    if (idx > maxViewIndex) return
    setViewIndex(idx)
    playClick()
  }

  return (
    <section className={`cave-journey cave-stage-${shown.step}${isDone ? ' is-done' : ''}`} aria-label="Hulelignelsen">
      <div className="cave-journey-head">
        <span className="eyebrow">Hulelignelsen · 4 trin</span>
        <h2 className="cave-journey-title">Vejen ud af hulen</h2>
        <p>{MILO_LINES.philosophyCaveIntro}</p>
      </div>

      <div className="cave-stepper" role="tablist" aria-label="Trin i hulelignelsen">
        {CAVE_STAGES.map((s, idx) => {
          const unlocked = idx <= maxViewIndex
          const passed = idx < stage
          const viewing = idx === viewIndex
          const atProgress = idx === progressIndex && !isDone
          const className = [
            'cave-step',
            passed ? ' is-passed' : '',
            viewing ? ' is-viewing' : '',
            atProgress && !viewing ? ' is-progress' : '',
            unlocked ? ' is-unlocked' : ' is-locked',
          ].join('')

          if (!unlocked) {
            return (
              <div key={s.id} role="presentation" className={className} aria-hidden="true">
                <span className="cave-step-dot">{s.step}</span>
                <span className="cave-step-label">{s.title}</span>
              </div>
            )
          }

          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              className={className}
              aria-selected={viewing}
              aria-controls={`cave-stage-panel-${s.id}`}
              id={`cave-stage-tab-${s.id}`}
              onClick={() => openStep(idx)}
            >
              <span className="cave-step-dot" aria-hidden="true">{passed && !viewing ? '✓' : s.step}</span>
              <span className="cave-step-label">{s.title}</span>
            </button>
          )
        })}
      </div>

      <div
        className="cave-stage-card"
        id={`cave-stage-panel-${shown.id}`}
        role="tabpanel"
        aria-labelledby={`cave-stage-tab-${shown.id}`}
      >
        <CaveArt step={shown.step} />
        <div className="cave-stage-text">
          <span className="eyebrow">Trin {shown.step} af 4</span>
          <h3>{shown.title}</h3>
          <p className="cave-stage-summary">{shown.summary}</p>
          <p className="cave-stage-detail">{shown.detail}</p>
          <p className="cave-stage-case"><strong>I sagen:</strong> {shown.case}</p>
        </div>
      </div>

      {isAtProgress ? (
        <Button variant="yellow" onClick={step} className="cave-step-btn">
          {stage === 0 ? 'Træd ind i hulen' : stage === CAVE_STAGES.length - 1 ? 'Gå helt ud i solen' : 'Et skridt nærmere lyset'}
        </Button>
      ) : isReviewing ? (
        <Button variant="secondary" onClick={() => openStep(progressIndex)} className="cave-step-btn">
          Fortsæt rejsen
        </Button>
      ) : null}

      {isDone && (
        <div className="cave-done fade-up">
          <span className="eyebrow">Vejen er gået</span>
          <p>Du har set, hvad Platon mente: filosofien fører os fra <strong>skygger</strong> til <strong>sandhed</strong> — og tilbage til de andre.</p>
        </div>
      )}
    </section>
  )
}

function CaveArt({ step }) {
  const [erroredStep, setErroredStep] = useState(null)
  const image = CAVE_STAGE_IMAGES[step]

  if (image && erroredStep !== step) {
    return (
      <div className="cave-art" aria-hidden="true">
        <OptimizedImage
          className="cave-art-image"
          file={image}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={() => setErroredStep(step)}
        />
      </div>
    )
  }

  // SVG-fallback hvis et af hulebillederne mangler.
  return (
    <div className="cave-art" aria-hidden="true">
      <svg viewBox="0 0 200 120" width="100%" height="auto" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <linearGradient id={`cave-bg-${step}`} x1="0" x2="1" y1="0.5" y2="0.5">
            <stop offset="0%" stopColor={step >= 4 ? '#fde68a' : step >= 3 ? '#d6c08a' : step >= 2 ? '#5a4630' : '#1a1410'} />
            <stop offset="100%" stopColor={step >= 4 ? '#a9c4e2' : step >= 3 ? '#f7c948' : step >= 2 ? '#3a2615' : '#0a0708'} />
          </linearGradient>
          <radialGradient id={`cave-light-${step}`} cx="0.95" cy="0.5" r="0.6">
            <stop offset="0%" stopColor="rgba(255,235,150,0.9)" />
            <stop offset="100%" stopColor="rgba(255,235,150,0)" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="200" height="120" fill={`url(#cave-bg-${step})`} />

        {/* Skygger på væggen (trin 1) */}
        {step === 1 && (
          <g opacity="0.85">
            <ellipse cx="60" cy="58" rx="14" ry="20" fill="#000" opacity="0.65" />
            <ellipse cx="100" cy="62" rx="11" ry="22" fill="#000" opacity="0.6" />
            <ellipse cx="138" cy="60" rx="13" ry="20" fill="#000" opacity="0.55" />
            <rect x="20" y="84" width="160" height="6" fill="#000" opacity="0.4" />
          </g>
        )}

        {/* Bål + figurer + skygger (trin 2) */}
        {step === 2 && (
          <g>
            <ellipse cx="60" cy="60" rx="10" ry="18" fill="#000" opacity="0.5" />
            <ellipse cx="100" cy="64" rx="8" ry="20" fill="#000" opacity="0.45" />
            <g>
              <rect x="116" y="48" width="6" height="22" fill="#1a1410" />
              <circle cx="119" cy="46" r="4" fill="#1a1410" />
            </g>
            <g>
              <rect x="135" y="50" width="6" height="22" fill="#1a1410" />
              <circle cx="138" cy="48" r="4" fill="#1a1410" />
            </g>
            <g>
              <path d="M165 88 Q170 70 175 88 Q180 74 175 92 Z" fill="#ff9b3d" opacity="0.95" />
              <path d="M168 90 Q172 78 176 90 Z" fill="#ffd166" />
            </g>
          </g>
        )}

        {/* Tunnel ud (trin 3) */}
        {step === 3 && (
          <g>
            <ellipse cx="160" cy="60" rx="32" ry="36" fill={`url(#cave-light-${step})`} />
            <g>
              <rect x="40" y="50" width="6" height="30" fill="#1a1410" />
              <circle cx="43" cy="48" r="4" fill="#1a1410" />
            </g>
            <g stroke="#fde68a" strokeWidth="1" opacity="0.55">
              <line x1="80" y1="40" x2="160" y2="56" />
              <line x1="80" y1="80" x2="160" y2="68" />
              <line x1="60" y1="60" x2="158" y2="60" />
            </g>
          </g>
        )}

        {/* I solen (trin 4) */}
        {step === 4 && (
          <g>
            <circle cx="160" cy="34" r="14" fill="#ffd166" />
            <g stroke="#ffd166" strokeWidth="1.4" opacity="0.7">
              <line x1="160" y1="14" x2="160" y2="20" />
              <line x1="160" y1="48" x2="160" y2="54" />
              <line x1="140" y1="34" x2="146" y2="34" />
              <line x1="174" y1="34" x2="180" y2="34" />
            </g>
            <path d="M0 90 Q40 70 80 88 T160 92 T200 90 V120 H0 Z" fill="#6e8c4f" />
            <g>
              <rect x="86" y="60" width="6" height="30" fill="#4d5b7a" />
              <circle cx="89" cy="58" r="4" fill="#4d5b7a" />
            </g>
          </g>
        )}

        {step === 0 && (
          <g opacity="0.8">
            <text x="100" y="64" textAnchor="middle" fontSize="10" fill="#fde68a" fontFamily="serif" fontStyle="italic">
              Tryk for at træde ind…
            </text>
          </g>
        )}
      </svg>
    </div>
  )
}

/* ---------- Sektion 4: Sjælen husker hjem ---------- */

function SoulSection({ onSoul }) {
  return (
    <section className="soul-section fade-up" aria-label="Sjælen husker hjem">
      <div className="soul-card" onClick={onSoul}>
        <div className="soul-card-shine" aria-hidden="true" />
        <span className="eyebrow">Platons sidste tanke</span>
        <h2>{SOUL_INSIGHT.title}</h2>
        <p>{SOUL_INSIGHT.text}</p>
        <p className="soul-case-link"><strong>{SOUL_INSIGHT.caseLink}</strong></p>
      </div>

      <div className="philosophy-takeaways" aria-label="Sådan bruger jeg filosofien">
        <span className="eyebrow">Tag det med dig</span>
        <ul>
          {PHILOSOPHY_TAKEAWAYS.map((t) => (
            <li key={t.id}>
              <strong>{t.label}</strong>
              <span>{t.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
