import { useState } from 'react'
import Button from '../components/Button.jsx'
import DetectiveSymbol from '../components/DetectiveSymbol.jsx'
import Milo from '../components/Milo.jsx'
import MiloSpeech from '../components/MiloSpeech.jsx'
import MotionToggle from '../components/MotionToggle.jsx'
import SoundToggle from '../components/SoundToggle.jsx'
import StyleCarousel from '../components/StyleCarousel.jsx'
import { SYMBOLS, MILO_LINES } from '../data/caseData.js'
import { useGame } from '../context/GameContext.jsx'

const DEFAULT_DETECTIVE_NAME = 'Skyggespejder'
const MAX_NAME_LENGTH = 24

export default function ProfileScreen({ onDone, onBack }) {
  const { state, setProfile } = useGame()
  const [name, setName] = useState(state.detectiveName || '')
  const [symbol, setSymbol] = useState(state.symbol || SYMBOLS[0].id)
  const selectedSymbol = SYMBOLS.find((s) => s.id === symbol) || SYMBOLS[0]
  const cleanName = name.replace(/\s+/g, ' ').trim()
  const safeName = cleanName.slice(0, MAX_NAME_LENGTH)
  const previewName = safeName || DEFAULT_DETECTIVE_NAME
  const nameIsDefault = cleanName.length === 0
  const remainingLetters = Math.max(0, MAX_NAME_LENGTH - name.length)
  const nameStatus = nameIsDefault
    ? `Milo bruger "${DEFAULT_DETECTIVE_NAME}", hvis du ikke skriver et navn.`
    : `${previewName} er klar til sagen.`

  function handleSubmit(e) {
    e.preventDefault()
    setProfile(previewName, symbol)
    onDone()
  }

  return (
    <form className="screen screen-pad" onSubmit={handleSubmit}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button type="button" className="header-back" onClick={onBack} aria-label="Tilbage">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div className="topbar-toggles">
          <MotionToggle />
          <SoundToggle />
        </div>
      </div>

      <div className="milo-row" style={{ alignItems: 'flex-end' }}>
        <Milo pose="wave" size="md" bob />
        <MiloSpeech>{MILO_LINES.profileIntro}</MiloSpeech>
      </div>

      <div className="paper-warm fade-up">
        <label className="input-label" htmlFor="detective-name">Dit detektivnavn</label>
        <input
          id="detective-name"
          className="input"
          type="text"
          autoComplete="off"
          maxLength={MAX_NAME_LENGTH}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={DEFAULT_DETECTIVE_NAME}
          inputMode="text"
          aria-describedby="detective-name-help detective-name-count"
        />
        <div className="profile-name-row">
          <p id="detective-name-help" className="profile-name-help">Brug et kaldenavn, ikke dit fulde rigtige navn.</p>
          <p id="detective-name-count" className="profile-name-count">{remainingLetters} bogstaver tilbage</p>
        </div>
        <p className="profile-name-status" role="status" aria-live="polite">{nameStatus}</p>
      </div>

      <div className="paper-warm fade-up">
        <span className="input-label" id="symbol-picker-label">Vælg din detektivstil</span>
        <p className="profile-symbol-lead">Swipe eller brug pilene — dit valg opdaterer kortet nedenunder.</p>
        <StyleCarousel value={symbol} onChange={setSymbol} />
      </div>

      <div className="profile-pass fade-up" aria-label="Dit detektivkort">
        <div className="profile-pass-header">
          <span>Sags-ID</span>
          <strong>#001</strong>
        </div>
        <div className="profile-pass-body">
          <div
            className="profile-pass-portrait"
            style={{
              '--pass-focus': selectedSymbol.passFocus || '50% 74%',
              '--pass-accent': selectedSymbol.accent,
              '--pass-accent-soft': selectedSymbol.accentSoft,
            }}
            aria-hidden="true"
          >
            <div className="profile-pass-symbol">
              <DetectiveSymbol symbolId={selectedSymbol.id} size="pass" />
            </div>
          </div>
          <div>
            <span className="report-meta">Detektiv</span>
            <h2>{previewName}</h2>
            <span className="tag tag-yellow profile-pass-tag">{selectedSymbol.label}</span>
            <p className="profile-pass-tagline">{selectedSymbol.tagline}</p>
          </div>
        </div>
        <div className="profile-pass-footer">
          <span>Klar til Skyggesagen</span>
        </div>
      </div>

      <div className="screen-bottom-bar">
        <Button type="submit" variant="primary" block>Start efterforskningen</Button>
      </div>
    </form>
  )
}
