import Header from '../components/Header.jsx'
import Button from '../components/Button.jsx'
import SkipTaskButton from '../components/SkipTaskButton.jsx'
import Milo from '../components/Milo.jsx'
import MiloSpeech from '../components/MiloSpeech.jsx'
import { MILO_LINES } from '../data/caseData.js'
import { useGame } from '../context/GameContext.jsx'
import { useEffect } from 'react'

export default function BriefingScreen({ onNext, onBack }) {
  const { completeScreen } = useGame()

  useEffect(() => {
    // Briefing er passivt — markér som læst når brugeren har set skærmen i et øjeblik
    const t = setTimeout(() => completeScreen('briefing'), 200)
    return () => clearTimeout(t)
  }, [completeScreen])

  return (
    <div className="screen screen-pad">
      <Header eyebrow="Briefing" name="Sagen begynder" onBack={onBack} />

      <div className="paper-warm fade-up">
        <span className="eyebrow">Hvad vi ved</span>
        <p style={{ marginTop: 8, fontWeight: 600, lineHeight: 1.5 }}>
          Et billede fra skolegården er blevet delt. Mange tror, at billedet viser hele sandheden. Men Milo har opdaget noget mærkeligt: <strong>billedet viser kun én vinkel.</strong>
        </p>
      </div>

      <div className="polaroid fade-up" style={{ maxWidth: 320, margin: '0 auto', transform: 'rotate(-2deg)' }}>
        <span className="tape" style={{ top: -8, left: '40%' }} />
        <div className="polaroid-frame">
          <PoolyardScene />
          <div className="scene-haze" style={{ borderRadius: 2 }} />
        </div>
        <span className="polaroid-caption">“Skolegården, kl. 11:42”</span>
        <span className="stamp" style={{ right: 8, top: 8, fontSize: 10 }}>1 vinkel</span>
      </div>

      <div className="briefing-lens fade-up" aria-label="Billedets ledetråde">
        <div className="briefing-lens-card is-seen">
          <span>Vi ser</span>
          <strong>Et øjeblik</strong>
          <p>To personer og en skygge på jorden.</p>
        </div>
        <div className="briefing-lens-card is-missing">
          <span>Vi mangler</span>
          <strong>Resten</strong>
          <p>Hvad skete før, efter og uden for billedet?</p>
        </div>
      </div>

      <div className="briefing-checklist fade-up" aria-label="Milos billedtjek">
        <span className="briefing-checklist-title">Milos billedtjek</span>
        <div>
          <span>Kilde</span>
          <span>Vinkel</span>
          <span>Tid</span>
        </div>
      </div>

      <div className="milo-row" style={{ alignItems: 'flex-end' }}>
        <Milo pose="watching" size="sm" bob />
        <MiloSpeech>{MILO_LINES.briefing}</MiloSpeech>
      </div>

      <div className="paper">
        <span className="eyebrow">Din mission</span>
        <p style={{ marginTop: 8, fontWeight: 700 }}>Undersøg sporene og find ud af, hvad vi egentlig ved.</p>
      </div>

      <div className="briefing-philosophy-primer fade-up" aria-label="Platons trick">
        <span className="eyebrow">Platons trick</span>
        <p>
          For 2400 år siden tænkte Platon: <strong>Måske ser vi kun skygger af virkeligheden?</strong> Han kaldte det
          <em> hulelignelsen</em>. I denne sag prøver vi at gå samme vej som ham — fra skygger til sandhed.
        </p>
      </div>

      <div className="screen-bottom-bar">
        <SkipTaskButton screen="briefing" onSkip={onNext} />
        <Button variant="primary" block onClick={onNext}>Undersøg første spor</Button>
      </div>
    </div>
  )
}

// Et lille SVG-baseret "billede" af skolegården — to figurer, sol, skygge
function PoolyardScene() {
  return (
    <svg viewBox="0 0 200 150" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="bsky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#a9c4e2" />
          <stop offset="100%" stopColor="#dbe7f4" />
        </linearGradient>
        <linearGradient id="bgr" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#d6b389" />
          <stop offset="100%" stopColor="#a87445" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="200" height="100" fill="url(#bsky)" />
      <rect x="0" y="100" width="200" height="50" fill="url(#bgr)" />
      <circle cx="160" cy="32" r="16" fill="#f7c948" opacity="0.9" />
      <rect x="0" y="86" width="200" height="20" fill="#3a4860" opacity="0.18" />
      {/* fence */}
      <g stroke="#6e4a2a" strokeWidth="2">
        <line x1="0" y1="100" x2="200" y2="100" />
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1={i * 17 + 6} y1="80" x2={i * 17 + 6} y2="100" />
        ))}
      </g>
      {/* figure 1 */}
      <g>
        <ellipse cx="78" cy="132" rx="22" ry="3" fill="#1f2933" opacity="0.35" />
        <rect x="68" y="86" width="20" height="42" fill="#3a4860" rx="8" />
        <circle cx="78" cy="80" r="9" fill="#3a4860" />
      </g>
      {/* figure 2 */}
      <g>
        <ellipse cx="132" cy="132" rx="18" ry="3" fill="#1f2933" opacity="0.3" />
        <rect x="124" y="92" width="16" height="36" fill="#4d5b7a" rx="7" />
        <circle cx="132" cy="86" r="7.5" fill="#4d5b7a" />
      </g>
    </svg>
  )
}
