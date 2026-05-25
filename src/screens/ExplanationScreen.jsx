import { useState } from 'react'
import Header from '../components/Header.jsx'
import Button from '../components/Button.jsx'
import SkipTaskButton from '../components/SkipTaskButton.jsx'
import Milo from '../components/Milo.jsx'
import MiloSpeech from '../components/MiloSpeech.jsx'
import ExplanationPuzzle from '../components/ExplanationPuzzle.jsx'
import { useGame } from '../context/GameContext.jsx'

export default function ExplanationScreen({ onNext, onBack }) {
  const { state } = useGame()
  const [solvedNow, setSolvedNow] = useState(false)
  const solved = solvedNow || state.explanationSolved

  return (
    <div className="screen screen-pad">
      <Header eyebrow="Byg forklaringen" name="Den røde tråd" onBack={onBack} />

      <div className="milo-row" style={{ alignItems: 'flex-end' }}>
        <Milo pose="watching" size="sm" bob />
        <MiloSpeech>Læg brikkerne, så de fortæller sagen i rigtig rækkefølge.</MiloSpeech>
      </div>

      <div className="explanation-thread-map" aria-label="Forklaringens fire trin">
        <span>1. Billede</span>
        <span>2. Vinkel</span>
        <span>3. Skygge</span>
        <span>4. Indsigt</span>
      </div>

      <div className="paper-warm">
        <ExplanationPuzzle onSolved={() => setSolvedNow(true)} />
      </div>

      {solved && (
        <div className="case-note case-note--success fade-up">
          <span className="eyebrow" style={{ color: 'var(--success)' }}>Filosofisk pointe</span>
          <p style={{ marginTop: 6, fontWeight: 600 }}>
            Det første vi ser, kan være en skygge. Undersøgelse hjælper os tættere på sandheden.
          </p>
        </div>
      )}

      <div className="screen-bottom-bar">
        <SkipTaskButton screen="explanation" onSkip={onNext} />
        <Button variant="primary" block onClick={onNext} disabled={!solved}>
          {solved ? 'Afslør skyggen' : 'Saml brikkerne i rigtig rækkefølge'}
        </Button>
      </div>
    </div>
  )
}
