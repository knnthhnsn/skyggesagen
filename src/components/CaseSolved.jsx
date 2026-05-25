import { useEffect, useMemo } from 'react'
import Milo from './Milo.jsx'
import RewardStamp from './RewardStamp.jsx'
import Badge from './Badge.jsx'
import { BADGES, MILO_LINES } from '../data/caseData.js'
import { useGame } from '../context/GameContext.jsx'
import { playSolved } from '../utils/audio.js'

/**
 * Animation efter at skyggen er afsløret — fanfare, badges, og citat.
 */
export default function CaseSolved() {
  const { state } = useGame()

  useEffect(() => {
    playSolved()
  }, [])

  const newlyAwarded = useMemo(() => {
    const ids = ['skyggeopklarer', 'sporgsmalsmester']
    return ids.filter((id) => state.badges?.includes(id))
  }, [state.badges])

  return (
    <div className="paper-warm fade-up" style={{ position: 'relative', overflow: 'hidden' }}>
      <Confetti />
      <div className="center-col" style={{ position: 'relative', zIndex: 2 }}>
        <RewardStamp slam>Sag opklaret</RewardStamp>
        <Milo pose="flying" size="lg" bob pulse />
        <p className="lede" style={{ marginTop: 0, color: 'var(--ink)' }}>
          {MILO_LINES.revealDone}
        </p>
      </div>

      <div className="solved-takeaways" aria-label="Tre ting Milo husker fra sagen">
        <div>
          <span>1</span>
          <strong>Se igen</strong>
          <p>Et billede kan mangle vigtige vinkler.</p>
        </div>
        <div>
          <span>2</span>
          <strong>Spørg videre</strong>
          <p>Et godt spørgsmål gør gættet mindre.</p>
        </div>
        <div>
          <span>3</span>
          <strong>Del langsomt</strong>
          <p>Tjek spor, før en skygge bliver til et rygte.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10, marginTop: 14, position: 'relative', zIndex: 2 }}>
        {newlyAwarded.map((id) => (
          <Badge key={id} title={BADGES[id].label} desc={BADGES[id].desc} isNew />
        ))}
      </div>
    </div>
  )
}

function Confetti({ count = 30 }) {
  const pieces = Array.from({ length: count }, (_, i) => i)
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((i) => {
        const left = (i * 17) % 100
        const dx = ((i % 5) - 2) * 18
        const dur = 1.8 + ((i * 13) % 14) / 10
        const delay = ((i * 7) % 12) / 10
        const colors = ['#f7c948', '#357fc4', '#c96b6b', '#6ea96e', '#7161a8']
        const color = colors[i % colors.length]
        return (
          <span
            key={i}
            style={{
              left: `${left}%`,
              background: color,
              ['--dx']: `${dx}px`,
              ['--dur']: `${dur}s`,
              ['--delay']: `${delay}s`,
            }}
          />
        )
      })}
    </div>
  )
}
