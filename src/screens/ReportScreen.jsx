import { useState } from 'react'
import Header from '../components/Header.jsx'
import Button from '../components/Button.jsx'
import SkipTaskButton from '../components/SkipTaskButton.jsx'
import Milo from '../components/Milo.jsx'
import RewardStamp from '../components/RewardStamp.jsx'
import Badge from '../components/Badge.jsx'
import ThoughtReport from '../components/ThoughtReport.jsx'
import { useGame } from '../context/GameContext.jsx'
import { BADGES, SYMBOLS, CASE_TITLE, QUESTION_KEYS } from '../data/caseData.js'

export default function ReportScreen({ onDone, onBack }) {
  const { state, completeScreen } = useGame()
  const hasReport = !!(state.report?.situation || state.report?.action || state.report?.rule || state.report?.note)
  const [submitted, setSubmitted] = useState(hasReport || state.completedScreens?.includes('report'))

  function handleSubmit() {
    completeScreen('report')
    setSubmitted(true)
  }

  function handleSkipReport() {
    setSubmitted(true)
  }

  if (submitted) {
    return <FinalReport onDone={onDone} onBack={onBack} onEdit={() => setSubmitted(false)} />
  }

  return (
    <div className="screen screen-pad">
      <Header eyebrow="Detektivrapport" name="Min refleksion" onBack={onBack} />
      <ThoughtReport onSubmit={handleSubmit} />
      <div className="screen-bottom-bar">
        <SkipTaskButton
          screen="report"
          onSkip={handleSkipReport}
          label="Spring rapporten over"
        />
      </div>
    </div>
  )
}

function FinalReport({ onDone, onBack, onEdit }) {
  const { state } = useGame()
  const symbol = SYMBOLS.find((s) => s.id === state.symbol) || SYMBOLS[0]
  const detective = state.detectiveName || 'Skyggespejder'
  const bestQuestion = QUESTION_KEYS.find((key) => key.correct)?.text || 'Hvordan ved vi, om billedet viser hele sandheden?'
  const badgeCount = (state.badges || []).filter((id) => BADGES[id]).length
  const nextTimeRule = state.report?.rule || 'Se efter flere vinkler'

  return (
    <div className="screen screen-pad">
      <Header eyebrow="Sagen er opklaret" name="Min detektivrapport" onBack={onBack} />

      <div className="report-card fade-up">
        <span className="stamp" style={{ right: 14, top: 14, transform: 'rotate(8deg)' }}>Sag #001</span>
        <div className="row" style={{ gap: 14 }}>
          <Milo pose="thumbs" size="md" />
          <div style={{ flex: 1 }}>
            <span className="report-meta">Detektiv</span>
            <h2 className="title-screen" style={{ marginTop: 4 }}>{detective}</h2>
            <span className="tag tag-yellow" style={{ marginTop: 6 }}>Symbol: {symbol.label}</span>
          </div>
        </div>

        <div className="report-section">
          <span className="report-meta">Sagsnavn</span>
          <span style={{ fontWeight: 800, fontSize: 16 }}>{CASE_TITLE}</span>
        </div>

        <div className="report-section">
          <span className="report-meta">Spor fundet</span>
          <span style={{ fontWeight: 700 }}>{state.foundClues?.length || 0} af 5</span>
        </div>

        <div className="report-learning-grid" aria-label="Det lærte jeg">
          <LearningCard label="Mit bedste spørgsmål" text={bestQuestion} accent="purple" />
          <LearningCard label="Min detektivregel" text={state.report?.rule || 'Se efter flere vinkler'} accent="blue" />
          <LearningCard label="Mærker samlet" text={`${badgeCount} mærker`} accent="yellow" />
        </div>

        <div className="report-section">
          <span className="report-meta">Mine mærker</span>
          <div className="col" style={{ marginTop: 8, gap: 8 }}>
            {(state.badges || []).map((id) => BADGES[id] && (
              <Badge key={id} title={BADGES[id].label} desc={BADGES[id].desc} />
            ))}
          </div>
        </div>

        {(state.report?.situation || state.report?.action || state.report?.note) && (
          <div className="report-section">
            <span className="report-meta">Min refleksion</span>
            {state.report?.situation && (
              <p className="report-quote" style={{ marginTop: 6 }}>“Jeg har oplevet en skygge: {state.report.situation}.”</p>
            )}
            {state.report?.action && (
              <p className="report-quote" style={{ marginTop: 4 }}>“Næste gang vil jeg: {state.report.action}.”</p>
            )}
            {state.report?.rule && (
              <p className="report-quote" style={{ marginTop: 4 }}>“Min regel er: {state.report.rule}.”</p>
            )}
            {state.report?.note && (
              <p className="report-quote" style={{ marginTop: 4 }}>“{state.report.note}”</p>
            )}
          </div>
        )}

        <div className="report-philosophy">
          <span className="report-meta">Filosofisk værktøj — Platons to verdener</span>
          <p>
            <strong>Sanseverdenen</strong> er det vi ser, hører og rører — den ændrer sig hele tiden. <strong>Ideernes
            verden</strong> er de perfekte tanker bag: en perfekt cirkel, et perfekt venskab, ægte retfærdighed.
          </p>
          <p style={{ marginTop: 6 }}>
            Platon mente, at hverdagens ting bare er kopier af ideerne — og at vores sjæl husker hjem til ideernes
            verden, når vi tænker dybt. Når jeg spørger “er det her hele sandheden?”, gør jeg lige som filosoffen, der
            går ud af hulen.
          </p>
        </div>

        <div className="report-next-time">
          <span className="report-meta">Næste gang jeg ser en skygge</span>
          <strong>{nextTimeRule}</strong>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
          <RewardStamp slam>Sag opklaret</RewardStamp>
        </div>
      </div>

      <div className="screen-bottom-bar">
        <Button variant="secondary" block onClick={onEdit}>Ret rapport</Button>
        <Button variant="primary" block onClick={onDone}>Tilbage til sagsmappen</Button>
      </div>
    </div>
  )
}

function LearningCard({ label, text, accent }) {
  return (
    <div className="report-learning-card" data-accent={accent}>
      <span>{label}</span>
      <strong>{text}</strong>
    </div>
  )
}
