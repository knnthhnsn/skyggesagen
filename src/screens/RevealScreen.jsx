import { useState } from 'react'
import Header from '../components/Header.jsx'
import Button from '../components/Button.jsx'
import SkipTaskButton from '../components/SkipTaskButton.jsx'
import Milo from '../components/Milo.jsx'
import MiloSpeech from '../components/MiloSpeech.jsx'
import CaseSolved from '../components/CaseSolved.jsx'
import { useGame } from '../context/GameContext.jsx'
import { MILO_LINES } from '../data/caseData.js'

export default function RevealScreen({ onNext, onBack }) {
  const { state, revealShadow, addBadge } = useGame()
  const [revealed, setRevealed] = useState(state.shadowRevealed)

  function reveal() {
    if (revealed) return
    setRevealed(true)
    revealShadow()
    addBadge('skyggeopklarer')
    addBadge('sporgsmalsmester')
  }

  return (
    <div className="screen screen-pad">
      <Header eyebrow="Klimaks" name="Afslør skyggen" onBack={onBack} />

      {!revealed && (
        <div className="milo-row" style={{ alignItems: 'flex-end' }}>
          <Milo pose="watching" size="sm" bob />
          <MiloSpeech>{MILO_LINES.revealIntro}</MiloSpeech>
        </div>
      )}

      <div className={`reveal-stage${revealed ? ' is-revealed' : ''}`}>
        <div className="reveal-light" aria-hidden="true" />
        <div className="reveal-shadow" aria-hidden="true">
          <div className="shadow-blob" />
          <div className="case-mini" />
        </div>

        {!revealed ? (
          <Button variant="yellow" onClick={reveal} className="glow-pulse" ariaLabel="Afslør skyggen">
            Afslør skyggen
          </Button>
        ) : (
          <div className="reveal-insight fade-up">
            <p>
              Skyggen var ikke en løgn. <br />Den var bare ikke hele sandheden.
            </p>
            <div className="reveal-insight-grid" aria-label="Fra skygge til indsigt">
              <div>
                <span>Skyggen</span>
                <strong>Et billede så nok ud</strong>
              </div>
              <div>
                <span>Indsigten</span>
                <strong>Vi måtte undersøge mere</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {revealed && <CaseSolved />}

      {revealed && (
        <div className="reveal-philosophy-teaser fade-up" aria-label="Næste skridt — Platons filosofi">
          <span className="eyebrow">Platons spørgsmål til dig</span>
          <p>
            Hvis et billede kan være en skygge — hvad er så den <em>rigtige</em> virkelighed? Platon havde et bud.
            Han troede, at der findes <strong>to verdener</strong>: den vi sanser, og den vi tænker.
          </p>
          <p className="reveal-philosophy-teaser-cta">Klar til at gå med ud af hulen?</p>
        </div>
      )}

      <div className="screen-bottom-bar">
        <SkipTaskButton screen="reveal" onSkip={onNext} />
        <Button variant="primary" block onClick={onNext} disabled={!revealed}>
          {revealed ? 'Gå ud af hulen med Platon' : 'Tryk for at afsløre'}
        </Button>
      </div>
    </div>
  )
}
