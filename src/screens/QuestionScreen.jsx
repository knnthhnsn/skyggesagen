import { useState } from 'react'
import Header from '../components/Header.jsx'
import Button from '../components/Button.jsx'
import SkipTaskButton from '../components/SkipTaskButton.jsx'
import Milo from '../components/Milo.jsx'
import MiloSpeech from '../components/MiloSpeech.jsx'
import QuestionKeys from '../components/QuestionKeys.jsx'
import { useGame } from '../context/GameContext.jsx'

export default function QuestionScreen({ onNext, onBack }) {
  const { state } = useGame()
  const [solvedNow, setSolvedNow] = useState(false)
  const solved = solvedNow || state.questionSolved

  return (
    <div className="screen screen-pad">
      <Header eyebrow="Det gode spørgsmål" name="Filosofi-nøglen" onBack={onBack} />

      <div className="question-tool-card paper-warm">
        <div className="question-tool-icon" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="15" r="4" /><path d="M11 12l8-8" /><path d="M16 7l2 2" /><path d="M14 9l2 2" /></svg>
        </div>
        <div>
          <span className="eyebrow">Hvorfor spørgsmål?</span>
          <p style={{ marginTop: 8, fontWeight: 600 }}>
            Et godt spørgsmål hjælper os med at undersøge i stedet for bare at gætte. Test nøglerne, og find den der åbner sagen.
          </p>
        </div>
      </div>

      <div className="question-compass" aria-label="Kendetegn ved et godt spørgsmål">
        <span className="question-compass-title">Spørgsmålskompas</span>
        <div className="question-compass-grid">
          <span>Åbner sagen</span>
          <span>Kan undersøges</span>
          <span>Ser flere vinkler</span>
        </div>
      </div>

      <QuestionKeys onSolved={() => setSolvedNow(true)} />

      {solved && (
        <div className="milo-row fade-up" style={{ alignItems: 'flex-end' }}>
          <Milo pose="watching" size="sm" bob />
          <MiloSpeech>Du fandt et vigtigt spørgsmål!</MiloSpeech>
        </div>
      )}

      <div className="screen-bottom-bar">
        <SkipTaskButton screen="question" onSkip={onNext} />
        <Button variant="primary" block onClick={onNext} disabled={!solved}>
          {solved ? 'Byg forklaringen' : 'Find den rigtige nøgle først'}
        </Button>
      </div>
    </div>
  )
}
