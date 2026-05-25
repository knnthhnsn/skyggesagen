import { useEffect, useMemo, useState } from 'react'
import { EXPLANATION_PIECES, MILO_LINES } from '../data/caseData.js'
import { playCorrect, playClick } from '../utils/audio.js'
import { useGame } from '../context/GameContext.jsx'

const CORRECT_EXPLANATION_ORDER = EXPLANATION_PIECES
  .slice()
  .sort((a, b) => a.order - b.order)
  .map((p) => p.id)
const EXPLANATION_PIECE_IDS = new Set(EXPLANATION_PIECES.map((p) => p.id))

/**
 * Brikker som barnet skal lægge i rigtig rækkefølge — op/ned-knapper holder det robust på mobil.
 */
export default function ExplanationPuzzle({ onSolved }) {
  const { state, setExplanationOrder, solveExplanation } = useGame()
  const [order, setOrder] = useState(() => {
    const saved = state.explanationOrder
    if (isValidExplanationOrder(saved)) return saved
    if (state.explanationSolved) return CORRECT_EXPLANATION_ORDER
    // Start med en bevidst forkert rækkefølge så barnet skal flytte
    return shuffle(EXPLANATION_PIECES.map((p) => p.id))
  })
  const [solved, setSolved] = useState(state.explanationSolved)
  const [nudge, setNudge] = useState('Flyt brikkerne, indtil sagen giver mening fra første billede til ny indsigt.')

  const items = useMemo(() => order.map((id) => EXPLANATION_PIECES.find((p) => p.id === id)).filter(Boolean), [order])
  const correctPositions = useMemo(() => order.filter((id, idx) => {
    const piece = EXPLANATION_PIECES.find((p) => p.id === id)
    return piece && piece.order === idx + 1
  }).length, [order])

  const isCorrect = useMemo(() => order.every((id, idx) => {
    const piece = EXPLANATION_PIECES.find((p) => p.id === id)
    return piece && piece.order === idx + 1
  }), [order])

  useEffect(() => {
    if (isCorrect && !solved) {
      setSolved(true)
      solveExplanation()
      playCorrect()
      if (typeof onSolved === 'function') setTimeout(onSolved, 800)
    }
  }, [isCorrect, solved, solveExplanation, onSolved])

  function move(idx, dir) {
    const j = idx + dir
    if (j < 0 || j >= order.length) return
    const next = order.slice()
    ;[next[idx], next[j]] = [next[j], next[idx]]
    setOrder(next)
    setExplanationOrder(next)
    setNudge(moveHint(next))
    playClick()
  }

  return (
    <div>
      <p className="lede" style={{ marginTop: 0 }}>
        {solved ? MILO_LINES.explanationCorrect : MILO_LINES.explanationIntro}
      </p>
      <div className={`puzzle-status${solved ? ' is-solved' : ''}`} role="status" aria-live="polite">
        <span className="puzzle-status-label">Rød tråd</span>
        <strong>{solved ? 'Forklaringen hænger sammen' : `${correctPositions}/${EXPLANATION_PIECES.length} brikker ligger rigtigt`}</strong>
        <p>{solved ? 'Først ser vi en skygge. Så undersøger vi os tættere på sandheden.' : nudge}</p>
      </div>
      <div className={`puzzle${solved ? ' is-solved' : ''}`} role="list">
        <div className="puzzle-thread" aria-hidden="true" />
        {items.map((p, idx) => (
          <div key={p.id} className="puzzle-piece" role="listitem">
            <span className="puzzle-piece-copy">
              <span className="puzzle-piece-role">{p.role}</span>
              <span>{p.text}</span>
            </span>
            <span className="puzzle-piece-actions">
              <button
                type="button"
                className="icon-btn"
                onClick={() => move(idx, -1)}
                disabled={idx === 0 || solved}
                aria-label="Flyt brikken op"
              >↑</button>
              <button
                type="button"
                className="icon-btn"
                onClick={() => move(idx, +1)}
                disabled={idx === items.length - 1 || solved}
                aria-label="Flyt brikken ned"
              >↓</button>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function isValidExplanationOrder(order) {
  if (!Array.isArray(order) || order.length !== EXPLANATION_PIECES.length) return false
  return order.every((id) => EXPLANATION_PIECE_IDS.has(id)) && new Set(order).size === EXPLANATION_PIECES.length
}

function moveHint(nextOrder) {
  const correct = nextOrder.filter((id, idx) => {
    const piece = EXPLANATION_PIECES.find((p) => p.id === id)
    return piece && piece.order === idx + 1
  }).length
  if (correct === EXPLANATION_PIECES.length) return MILO_LINES.explanationCorrect
  if (nextOrder[0] !== 'p-1') return 'Start med det, vi faktisk så. Hvad kom først?'
  if (nextOrder[nextOrder.length - 1] !== 'p-4') return 'Slutningen skal vise, hvad en god detektiv gør bagefter.'
  if (correct >= 2) return 'Du er tæt på. Kig på forskellen mellem gæt og undersøgelse.'
  return 'Prøv at følge sagen som en lille historie: billede, vinkel, gæt, undersøgelse.'
}

function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  // Sikrer at startrækkefølgen ikke er korrekt fra start
  if (a.every((id, idx) => EXPLANATION_PIECES.find((p) => p.id === id)?.order === idx + 1)) {
    return [a[1], a[0], ...a.slice(2)]
  }
  return a
}
