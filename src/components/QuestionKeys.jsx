import { useState } from 'react'
import { QUESTION_KEYS, MILO_LINES } from '../data/caseData.js'
import { useGame } from '../context/GameContext.jsx'
import { playUnlock, playWrong } from '../utils/audio.js'

export default function QuestionKeys({ onSolved }) {
  const { state, solveQuestion, bumpQuestionAttempt, addBadge } = useGame()
  const [opened, setOpened] = useState(state.questionSolved)
  const [tried, setTried] = useState(null)
  const [triedKeys, setTriedKeys] = useState([])
  const [milo, setMilo] = useState(state.questionSolved ? MILO_LINES.questionCorrect : MILO_LINES.questionIntro)
  const [hint, setHint] = useState(null)
  const correctKey = QUESTION_KEYS.find((key) => key.correct)

  function tryKey(key) {
    if (opened) return
    if (key.correct) {
      setOpened(true)
      setMilo(MILO_LINES.questionCorrect)
      playUnlock()
      solveQuestion()
      addBadge('godt-sporgsmal')
      setTimeout(() => {
        if (typeof onSolved === 'function') onSolved()
      }, 1100)
    } else {
      setTried(key.id)
      setTriedKeys((prev) => prev.includes(key.id) ? prev : [...prev, key.id])
      setMilo(MILO_LINES.questionWrong)
      setHint(key.hint)
      bumpQuestionAttempt()
      playWrong()
      setTimeout(() => setTried(null), 600)
    }
  }

  return (
    <div className="lock-stage">
      <p className="lede" style={{ color: 'rgba(243, 234, 219, 0.85)', textAlign: 'center', margin: '0 0 14px' }}>
        {milo}
      </p>
      <div style={{ position: 'relative' }}>
        <div className={`lock-folder${opened ? ' is-open' : ''}`} aria-hidden="true">
          <div className="lock-folder-body">
            <div className="lock-folder-keyhole" />
          </div>
          <div className="lock-glow" />
        </div>
      </div>

      <div className="keys-row">
        {QUESTION_KEYS.map((k) => {
          const hasTried = triedKeys.includes(k.id)
          return (
            <button
              key={k.id}
              type="button"
              className={`key${tried === k.id ? ' is-wrong' : ''}${opened && k.correct ? ' is-right' : ''}${opened && !k.correct ? ' is-muted' : ''}${hasTried ? ' is-tried' : ''}`}
              onClick={() => tryKey(k)}
              disabled={opened && !k.correct}
              aria-describedby="key-feedback"
              aria-label={hasTried ? `${k.text}. Prøvet før.` : k.text}
            >
              <span className="key-shape" aria-hidden="true" />
              <span>{k.text}</span>
              {hasTried && <span className="key-tried-label">Prøvet</span>}
            </button>
          )
        })}
      </div>

      <div
        id="key-feedback"
        className={`key-feedback${opened ? ' is-right' : hint ? ' is-wrong' : ''}`}
        role="status"
        aria-live="polite"
      >
        <span className="key-feedback-label">Nøgletest</span>
        {opened ? (
          <>
            <strong>Nøglen åbner sagen.</strong>
            <p>Det bedste spørgsmål er: “{correctKey?.text}”</p>
          </>
        ) : hint ? (
          <>
            <strong>Nøglen passer ikke helt.</strong>
            <p>{hint}</p>
          </>
        ) : (
          <>
            <strong>Vælg den nøgle, der får os til at undersøge.</strong>
            <p>Et filosofisk spørgsmål leder efter mere end likes, rygter og hurtige svar.</p>
          </>
        )}
      </div>
    </div>
  )
}
