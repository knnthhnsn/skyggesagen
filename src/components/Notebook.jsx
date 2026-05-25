import { useEffect, useRef, useState } from 'react'
import { useGame } from '../context/GameContext.jsx'
import { CLUES, WITNESSES, TIMELINE_EVENTS, PHILOSOPHY_PAIRS, BADGES, SYMBOLS } from '../data/caseData.js'
import {
  TOTAL_CLUES,
  TOTAL_WITNESSES,
  TOTAL_TIMELINE_EVENTS,
  TOTAL_PHILOSOPHY_PAIRS,
  TOTAL_CAVE_STAGES,
  caseStatusFromState,
  caseStatusLabel,
  getCaseProgress,
  nextCaseStepLabel,
  isNodeDone,
} from '../utils/progress.js'
import { initAudio, playClick } from '../utils/audio.js'

/**
 * Skyggebogen — persistent FAB der altid har sagens overblik klar.
 * På desktop (>= 1024px) skjules FAB'en via CSS og <NotebookPanel> bruges
 * direkte som sidebar i AppShell.
 */
export default function Notebook({ go }) {
  const [open, setOpen] = useState(false)
  const closeRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const previousFocus = typeof document !== 'undefined' ? document.activeElement : null
    const t = window.setTimeout(() => closeRef.current?.focus(), 0)
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(t)
      if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus()
    }
  }, [open])

  function toggle() {
    initAudio()
    playClick()
    setOpen((o) => !o)
  }

  function navigateAndClose(target) {
    setOpen(false)
    setTimeout(() => go(target), 80)
  }

  return (
    <>
      <NotebookFab open={open} onToggle={toggle} />

      {open && (
        <div className="notebook-overlay" onClick={() => setOpen(false)} role="presentation">
          <div
            id="notebook-panel"
            className="notebook-panel notebook-panel--modal"
            role="dialog"
            aria-modal="true"
            aria-label="Skyggebogen — sagsoverblik"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="notebook-handle" aria-hidden="true" />
            <NotebookPanelContent
              go={navigateAndClose}
              onClose={() => setOpen(false)}
              closeRef={closeRef}
              showClose
            />
          </div>
        </div>
      )}
    </>
  )
}

/**
 * Selvstændig FAB-knap — viser progress-badge og symbol.
 * Skjules på desktop (>= 1024px) via CSS hvor sidebaren overtager.
 */
function NotebookFab({ open, onToggle }) {
  const { state } = useGame()
  const progress = getCaseProgress(state)
  return (
    <button
      type="button"
      className={`notebook-fab${open ? ' is-open' : ''}`}
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="notebook-panel"
      aria-label={open ? 'Luk skyggebogen' : 'Åbn skyggebogen'}
    >
      <span className="notebook-fab-icon" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 5.5C6 5 9 5 12 6.5 15 5 18 5 20 5.5v14c-2-.5-5-.5-8 1-3-1.5-6-1.5-8-1Z" />
          <path d="M12 6.5v14" />
        </svg>
      </span>
      <span className="notebook-fab-label">Skyggebog</span>
      {progress > 0 && progress < 100 && (
        <span className="notebook-fab-badge" aria-hidden="true">{progress}%</span>
      )}
    </button>
  )
}

/**
 * NotebookPanel — den persistente sidebar-version til desktop.
 * Renderes inde i AppShell ved siden af main-indholdet.
 */
export function NotebookPanel({ go }) {
  return (
    <aside className="notebook-panel notebook-panel--inline" aria-label="Skyggebogen — sagsoverblik">
      <NotebookPanelContent go={go} />
    </aside>
  )
}

/**
 * Indholdet i panelet — bruges både af modalen (mobil) og sidebaren (desktop).
 */
function NotebookPanelContent({ go, onClose, closeRef, showClose = false }) {
  const { state } = useGame()
  const progress = getCaseProgress(state)
  const status = caseStatusFromState(state)
  const nextStep = nextCaseStepLabel(state)
  const cluesFound = state.foundClues?.length || 0
  const witnessesAsked = Object.values(state.witnessAnswers || {}).reduce(
    (sum, list) => sum + list.length,
    0
  )
  const witnessesDone = state.witnessesDone ? TOTAL_WITNESSES : Math.min(
    Object.keys(state.witnessAnswers || {}).filter((id) => (state.witnessAnswers[id] || []).length >= 2).length,
    TOTAL_WITNESSES
  )
  const symbol = SYMBOLS.find((s) => s.id === state.symbol) || SYMBOLS[0]
  const badgeIds = state.badges || []
  const goodQuestions = state.goodQuestionCount || 0

  const philosophyMatched = Object.values(state.philosophyPairs || {}).filter(Boolean).length
  const caveStage = state.caveStage || 0

  const checklist = [
    { key: 'briefing', label: 'Briefing læst', done: isNodeDone('briefing', state) },
    { key: 'clues', label: `Spor i scenen (${cluesFound}/${TOTAL_CLUES})`, done: isNodeDone('spor1', state) },
    { key: 'witness', label: `Vidner afhørt (${witnessesDone}/${TOTAL_WITNESSES})`, done: isNodeDone('spor2', state) },
    { key: 'timeline', label: 'Tidslinjen sat sammen', done: isNodeDone('spor3', state) },
    { key: 'sort', label: 'Sporene sorteret', done: isNodeDone('sort', state) },
    { key: 'question', label: 'Det gode spørgsmål fundet', done: isNodeDone('question', state) },
    { key: 'explanation', label: 'Forklaringen bygget', done: isNodeDone('explanation', state) },
    { key: 'reveal', label: 'Skyggen afsløret', done: isNodeDone('reveal', state) },
    { key: 'philosophy', label: 'Platons to verdener forstået', done: isNodeDone('philosophy', state) },
    { key: 'report', label: 'Rapporten skrevet', done: isNodeDone('report', state) },
  ]

  return (
    <>
      <div className="notebook-head">
        <div>
          <span className="eyebrow">Skyggebogen</span>
          <h2 className="title-screen" style={{ marginTop: 4 }}>{state.detectiveName || 'Skyggespejder'}</h2>
          <p className="notebook-meta">
            Symbol: {symbol.label} · {caseStatusLabel(status)}
          </p>
        </div>
        {showClose && (
          <button
            ref={closeRef}
            type="button"
            className="notebook-close"
            onClick={onClose}
            aria-label="Luk skyggebogen"
          >×</button>
        )}
      </div>

      <div className="notebook-progress">
        <div className="notebook-progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="notebook-progress-row">
          <span>{progress}%</span>
          <span>{nextStep}</span>
        </div>
      </div>

      <NotebookSection title="Spor i scenen" badge={`${cluesFound}/${TOTAL_CLUES}`}>
        <ul className="notebook-list">
          {CLUES.map((c) => {
            const found = state.foundClues?.includes(c.id)
            return (
              <li key={c.id} className={found ? 'is-done' : ''}>
                <span aria-hidden="true">{found ? '●' : '○'}</span>
                <span>{found ? c.text : 'Skjult spor'}</span>
              </li>
            )
          })}
        </ul>
      </NotebookSection>

      <NotebookSection title="Vidneudsagn" badge={`${witnessesAsked} spørgsmål`}>
        {witnessesAsked === 0 ? (
          <p className="notebook-empty">Du har ikke afhørt nogen endnu.</p>
        ) : (
          <ul className="notebook-list">
            {WITNESSES.map((w) => {
              const asked = (state.witnessAnswers || {})[w.id] || []
              return (
                <li key={w.id} className={asked.length >= 2 ? 'is-done' : asked.length > 0 ? 'is-progress' : ''}>
                  <span aria-hidden="true">{asked.length >= 2 ? '●' : asked.length > 0 ? '◐' : '○'}</span>
                  <span><strong>{w.name}</strong> — {asked.length} spørgsmål stillet</span>
                </li>
              )
            })}
          </ul>
        )}
        {goodQuestions > 0 && (
          <p className="notebook-note">Gode (åbne) spørgsmål: {goodQuestions}</p>
        )}
      </NotebookSection>

      <NotebookSection title="Tidslinje" badge={state.timelineSolved ? 'Klar' : 'Ikke samlet'}>
        {state.timelineSolved ? (
          <ul className="notebook-list">
            {TIMELINE_EVENTS.map((ev) => (
              <li key={ev.id} className="is-done">
                <span aria-hidden="true">{ev.time}</span>
                <span>{ev.label}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="notebook-empty">Sæt begivenhederne i rigtig rækkefølge for at se hele dagen.</p>
        )}
      </NotebookSection>

      <NotebookSection
        title="Platons filosofi"
        badge={state.philosophyDone ? 'Forstået' : `${philosophyMatched}/${TOTAL_PHILOSOPHY_PAIRS} · hule ${caveStage}/${TOTAL_CAVE_STAGES}`}
      >
        {philosophyMatched === 0 && caveStage === 0 ? (
          <p className="notebook-empty">Lås Platons to verdener op efter afsløringen.</p>
        ) : (
          <ul className="notebook-list">
            <li className={philosophyMatched >= TOTAL_PHILOSOPHY_PAIRS ? 'is-done' : philosophyMatched > 0 ? 'is-progress' : ''}>
              <span aria-hidden="true">{philosophyMatched >= TOTAL_PHILOSOPHY_PAIRS ? '●' : philosophyMatched > 0 ? '◐' : '○'}</span>
              <span><strong>Idé og kopi</strong> — {philosophyMatched}/{TOTAL_PHILOSOPHY_PAIRS} par matchet</span>
            </li>
            <li className={caveStage >= TOTAL_CAVE_STAGES ? 'is-done' : caveStage > 0 ? 'is-progress' : ''}>
              <span aria-hidden="true">{caveStage >= TOTAL_CAVE_STAGES ? '●' : caveStage > 0 ? '◐' : '○'}</span>
              <span><strong>Hulelignelsen</strong> — {caveStage}/{TOTAL_CAVE_STAGES} trin gået</span>
            </li>
            {state.philosophyDone && (
              <li className="is-done">
                <span aria-hidden="true">●</span>
                <span><strong>Sjælen husker hjem</strong> — du forstår de to verdener.</span>
              </li>
            )}
          </ul>
        )}
      </NotebookSection>

      <NotebookSection title="Mærker" badge={`${badgeIds.length}/${Object.keys(BADGES).length}`}>
        {badgeIds.length === 0 ? (
          <p className="notebook-empty">Ingen mærker endnu.</p>
        ) : (
          <ul className="notebook-badges">
            {badgeIds.map((id) => BADGES[id] && (
              <li key={id}>
                <strong>{BADGES[id].label}</strong>
                <span>{BADGES[id].desc}</span>
              </li>
            ))}
          </ul>
        )}
      </NotebookSection>

      <h3 className="notebook-checklist-title">Sagens trin</h3>
      <ol className="notebook-checklist">
        {checklist.map((item) => (
          <li key={item.key} className={item.done ? 'is-done' : ''}>
            <span aria-hidden="true">{item.done ? '✓' : '○'}</span>
            {item.label}
          </li>
        ))}
      </ol>

      <div className="notebook-actions">
        <button type="button" className="btn btn-secondary btn-block" onClick={() => go('hub')}>
          Til sagsmappen
        </button>
      </div>
    </>
  )
}

function NotebookSection({ title, badge, children }) {
  return (
    <section className="notebook-section">
      <div className="notebook-section-head">
        <span className="eyebrow">{title}</span>
        {badge && <span className="tag tag-blue">{badge}</span>}
      </div>
      {children}
    </section>
  )
}
