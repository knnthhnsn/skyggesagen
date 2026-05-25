import { useEffect, useRef, useState } from 'react'
import Button from '../components/Button.jsx'
import Milo from '../components/Milo.jsx'
import MotionToggle from '../components/MotionToggle.jsx'
import SoundToggle from '../components/SoundToggle.jsx'
import CaseFolder from '../components/CaseFolder.jsx'
import { APP_TITLE, CASE_SUBTITLE } from '../data/caseData.js'
import { useGame } from '../context/GameContext.jsx'
import { initAudio, playFolderOpen } from '../utils/audio.js'
import { TOTAL_CLUES, caseStatusFromState, caseStatusLabel, getCaseProgress } from '../utils/progress.js'

export default function StartScreen({ onOpenCase, onTeacher }) {
  const { state, reset } = useGame()
  const [opening, setOpening] = useState(false)
  const [confirmingReset, setConfirmingReset] = useState(false)
  const keepButtonRef = useRef(null)
  const returningDetective = !!state.detectiveName
  const progress = getCaseProgress(state)
  const status = caseStatusFromState(state)
  const cluesFound = state.foundClues?.length || 0

  useEffect(() => {
    if (confirmingReset) keepButtonRef.current?.focus()
  }, [confirmingReset])

  function handleOpen() {
    if (confirmingReset) return
    initAudio()
    setOpening(true)
    playFolderOpen()
    setTimeout(() => onOpenCase(), 720)
  }

  function doReset() {
    reset()
    setConfirmingReset(false)
    setOpening(false)
  }

  return (
    <div className="screen start-screen">
      <div className="start-glow" aria-hidden="true" />
      <div className="start-topbar">
        <span className="eyebrow" style={{ color: 'var(--milo-yellow)' }}>Sandhedsdetektiv</span>
        <div className="topbar-toggles">
          <MotionToggle />
          <SoundToggle />
        </div>
      </div>

      <div className="start-layout">
        <div className="start-layout-visual">
          <div className="center-col start-hero-copy">
            <div className="start-case-chip" aria-label={returningDetective ? 'Gemt sag' : 'Ny sag'}>
              <span aria-hidden="true">#001</span>
              <span>{returningDetective ? 'Gemt sag' : 'Ny sag'}</span>
            </div>
            <h1 className="title-display start-title">
              {APP_TITLE.split(':')[0]}:
              <br />
              <span className="start-title-accent">Skyggesagen</span>
            </h1>
            <p className="lede start-lede">
              {CASE_SUBTITLE} om sandhed, skygger og gode spørgsmål.
            </p>
          </div>

          <div className="start-case-stage">
            <CaseFolder state={opening ? 'opening' : 'closed'} />
            <div className="start-milo">
              <Milo pose={opening ? 'run' : 'wave'} size="lg" bob={!opening} pulse={opening} />
            </div>
            <div className="start-shadow-card start-shadow-card-left" aria-hidden="true">
              Kun én vinkel
            </div>
            <div className="start-shadow-card start-shadow-card-right" aria-hidden="true">
              Hvad mangler?
            </div>
          </div>
        </div>

        <div className="start-layout-panel">
          <div className="start-panel">
            {returningDetective ? (
              <div className="start-resume-card fade-up" aria-label="Din gemte sag">
                <div>
                  <span className="eyebrow">Velkommen tilbage</span>
                  <h2>{state.detectiveName}</h2>
                  <p>{caseStatusLabel(status)} · {progress}% klaret · {cluesFound}/{TOTAL_CLUES} spor</p>
                </div>
                <div
                  className="start-resume-progress"
                  role="progressbar"
                  aria-label={`${progress} procent af sagen er klaret`}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={progress}
                >
                  <span style={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : (
              <div className="start-brief fade-up">
                <span className="start-brief-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="6.5" /><path d="m20 20-3.6-3.6" /></svg>
                </span>
                <p>
                  Et mystisk billede har startet et rygte. Milo tror, der gemmer sig en skygge i sagen.
                </p>
              </div>
            )}

            <div className="start-mini-steps" aria-label="Sagens trin">
              <span>1. Find spor</span>
              <span>2. Stil spørgsmål</span>
              <span>3. Afslør skyggen</span>
            </div>

            <div className="start-actions">
              {confirmingReset && (
                <div className="start-reset-confirm teacher-reset-confirm" role="alert">
                  <strong>Nulstil sagen?</strong>
                  <p>Det sletter detektivnavn, spor, mærker og rapport i denne browser.</p>
                  <div className="teacher-reset-actions">
                    <Button variant="secondary" onClick={() => setConfirmingReset(false)} ref={keepButtonRef}>
                      Behold spillet
                    </Button>
                    <Button variant="yellow" onClick={doReset}>Ja, nulstil</Button>
                  </div>
                </div>
              )}
              <Button variant="primary" block onClick={handleOpen} disabled={opening || confirmingReset}>
                {opening ? 'Åbner sagen…' : returningDetective ? 'Fortsæt sagen' : 'Åbn sagen'}
              </Button>
              <Button variant="secondary" block onClick={onTeacher} disabled={confirmingReset}>
                Til læreren
              </Button>
              {returningDetective && !confirmingReset && (
                <button type="button" className="start-reset-btn start-reset-btn--panel" onClick={() => setConfirmingReset(true)}>
                  Nulstil sagen
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
