import { useEffect, useRef, useState } from 'react'
import Button from './Button.jsx'
import Milo from './Milo.jsx'
import MiloSpeech from './MiloSpeech.jsx'
import { TEACHER_INFO } from '../data/caseData.js'
import { useGame } from '../context/GameContext.jsx'
import { TOTAL_CLUES, caseStatusFromState, caseStatusLabel, getCaseProgress, nextCaseStepLabel } from '../utils/progress.js'

export default function TeacherView({ onBack }) {
  const { state, reset } = useGame()
  const [confirmingReset, setConfirmingReset] = useState(false)
  const keepButtonRef = useRef(null)
  const progress = getCaseProgress(state)
  const status = caseStatusFromState(state)
  const nextStep = nextCaseStepLabel(state)
  const cluesFound = state.foundClues?.length || 0
  const badgeCount = state.badges?.length || 0
  const hasReport = !!(state.report?.situation || state.report?.action || state.report?.rule || state.report?.note)

  useEffect(() => {
    if (confirmingReset) keepButtonRef.current?.focus()
  }, [confirmingReset])

  function confirmReset() {
    setConfirmingReset(true)
  }

  function doReset() {
    reset()
    setConfirmingReset(false)
  }

  return (
    <div className="teacher-view">
      <div className="milo-row teacher-hero">
        <Milo pose="side" size="sm" />
        <MiloSpeech>Til læreren: hurtigt overblik, minimal opsætning og klar faglig retning.</MiloSpeech>
      </div>

      <section className="teacher-summary">
        <div>
          <span className="eyebrow">Forløb</span>
          <h2 className="title-screen">Klar til brug i timen</h2>
          <p>{TEACHER_INFO.description}</p>
        </div>
        <div className="teacher-meta-grid" aria-label="Kort overblik">
          <TeacherMeta label="Alder" value={TEACHER_INFO.audience} />
          <TeacherMeta label="Tid" value={TEACHER_INFO.duration} />
          <TeacherMeta label="Opsætning" value="Ingen login" />
        </div>
      </section>

      <section className="teacher-current">
        <div className="teacher-current-head">
          <div>
            <span className="eyebrow">Aktuel enhed</span>
            <h2 className="title-screen">{caseStatusLabel(status)}</h2>
          </div>
          <strong>{progress}%</strong>
        </div>
        <div className="teacher-current-bar" aria-label={`${progress} procent af sagen er klaret`}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="teacher-next-step">
          <span>Næste i forløbet</span>
          <strong>{nextStep}</strong>
        </div>
        <div className="teacher-current-grid">
          <TeacherMeta label="Detektiv" value={state.detectiveName || 'Ikke valgt'} />
          <TeacherMeta label="Spor" value={`${cluesFound}/${TOTAL_CLUES}`} />
          <TeacherMeta label="Mærker" value={`${badgeCount}`} />
        </div>
      </section>

      <section className="teacher-report-card">
        <span className="eyebrow">Elevrapport</span>
        {hasReport ? (
          <div className="teacher-report-lines">
            <TeacherReportLine label="Skygge" value={state.report?.situation || 'Ikke valgt'} />
            <TeacherReportLine label="Handling" value={state.report?.action || 'Ikke valgt'} />
            <TeacherReportLine label="Regel" value={state.report?.rule || 'Ikke valgt'} />
            {state.report?.note && <TeacherReportLine label="Egen tanke" value={state.report.note} />}
          </div>
        ) : (
          <p>Rapporten er ikke skrevet endnu. Brug næste mission til at se, hvor eleven skal fortsætte.</p>
        )}
      </section>

      <section className="teacher-card">
        <span className="eyebrow">Sådan starter du</span>
        <div className="teacher-steps">
          {TEACHER_INFO.quickStart.map((step, i) => (
            <div className="teacher-step" key={step}>
              <span aria-hidden="true">{i + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="teacher-card">
        <span className="eyebrow">Læringsmål</span>
        <div className="teacher-goals">
          {TEACHER_INFO.goals.map((goal) => (
            <div className="teacher-goal" key={goal}>
              <span aria-hidden="true">✓</span>
              <p>{goal}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="teacher-card">
        <span className="eyebrow">Klassesamtale</span>
        <p className="teacher-note">{TEACHER_INFO.classActivity}</p>
        <div className="teacher-questions">
          {TEACHER_INFO.discussionQuestions.map((question) => (
            <div className="teacher-question" key={question}>{question}</div>
          ))}
        </div>
      </section>

      <section className="teacher-card teacher-privacy">
        <span className="eyebrow">Privatliv</span>
        <p>{TEACHER_INFO.privacy}</p>
      </section>

      <div className="col" style={{ gap: 10 }}>
        {confirmingReset && (
          <div className="teacher-reset-confirm" role="alert">
            <strong>Nulstil denne enhed?</strong>
            <p>Det sletter detektivnavn, spor, mærker og rapport i denne browser.</p>
            <div className="teacher-reset-actions">
              <Button variant="secondary" onClick={() => setConfirmingReset(false)} ref={keepButtonRef}>Behold spillet</Button>
              <Button variant="yellow" onClick={doReset}>Ja, nulstil</Button>
            </div>
          </div>
        )}
        {!confirmingReset && (
          <Button variant="secondary" block onClick={confirmReset}>Nulstil spil</Button>
        )}
        <Button variant="ghost" block onClick={onBack}>Tilbage</Button>
      </div>
    </div>
  )
}

function TeacherMeta({ label, value }) {
  return (
    <div className="teacher-meta">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function TeacherReportLine({ label, value }) {
  return (
    <div className="teacher-report-line">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}
