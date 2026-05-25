import { useMemo, useState } from 'react'
import EvidenceCard from './EvidenceCard.jsx'
import Milo from './Milo.jsx'
import { SORT_CARDS, SORT_CATEGORIES, MILO_LINES } from '../data/caseData.js'
import { useGame } from '../context/GameContext.jsx'
import { playCorrect, playWrong } from '../utils/audio.js'

export default function EvidenceSort({ onAllSorted }) {
  const { state, sortClue } = useGame()
  const [selectedCardId, setSelectedCardId] = useState(null)
  const [feedback, setFeedback] = useState({ cardId: null, status: null })
  const [milo, setMilo] = useState(MILO_LINES.sortIntro)

  const sorted = state.sortedClues || {}
  const allCount = SORT_CARDS.length
  const correctCount = useMemo(
    () => SORT_CARDS.filter((c) => sorted[c.id] === c.correct).length,
    [sorted]
  )
  const selectedCard = SORT_CARDS.find((c) => c.id === selectedCardId)

  function selectCard(id) {
    setSelectedCardId(prev => (prev === id ? null : id))
    setFeedback({ cardId: null, status: null })
  }

  function placeIn(category) {
    if (!selectedCardId) return
    const card = SORT_CARDS.find((c) => c.id === selectedCardId)
    if (!card) return
    if (card.correct === category) {
      sortClue(card.id, category)
      setFeedback({ cardId: card.id, status: 'correct' })
      setMilo(MILO_LINES.sortCorrect)
      playCorrect()
      setSelectedCardId(null)
      // Hvis alle korrekte er placeret, signalér completion
      const placedAfter = { ...sorted, [card.id]: category }
      const correctNow = SORT_CARDS.every((c) => placedAfter[c.id] === c.correct)
      if (correctNow && typeof onAllSorted === 'function') {
        setTimeout(() => onAllSorted(), 700)
      }
    } else {
      setFeedback({ cardId: card.id, status: 'wrong' })
      setMilo(`${MILO_LINES.sortWrong} ${sortHint(card.correct)}`)
      playWrong()
    }
    setTimeout(() => setFeedback({ cardId: null, status: null }), 700)
  }

  // Aktive kort = de kort som ikke er placeret korrekt endnu
  const remaining = SORT_CARDS.filter((c) => sorted[c.id] !== c.correct)
  const placedByCat = SORT_CATEGORIES.reduce((acc, cat) => {
    acc[cat.id] = SORT_CARDS.filter((c) => sorted[c.id] === cat.id && c.correct === cat.id)
    return acc
  }, {})

  return (
    <div className="sort-board">
      <div className="sort-intro-card paper-warm">
        <Milo pose={remaining.length === 0 ? 'thumbs' : 'watching'} size="sm" bob={remaining.length > 0} pulse={remaining.length === 0} />
        <div>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
            <div className="eyebrow">Detektivboard</div>
            <span className="tag tag-blue">{correctCount}/{allCount} placeret</span>
          </div>
          <p className="lede" style={{ marginTop: 0 }}>{milo}</p>
        </div>
      </div>

      <div className="sort-deck">
        <div className="sort-guide" role="status" aria-live="polite">
          <span className={`sort-guide-step${selectedCard ? ' is-done' : ' is-current'}`}>1. Vælg kort</span>
          <span className={`sort-guide-step${selectedCard ? ' is-current' : ''}`}>2. Tryk på kategori</span>
        </div>
        <span className="sort-deck-title">{selectedCard ? 'Kort valgt' : 'Vælg et kort'}</span>
        {selectedCard && (
          <div className="selected-evidence-tray">
            <span>Nu sorterer du</span>
            <strong>{selectedCard.text}</strong>
          </div>
        )}
        {remaining.length === 0 ? (
          <>
            <p className="sort-complete">Alle kort er placeret rigtigt. Boardet er rent!</p>
            <div className="sort-rule-card">
              <span>Detektivregel</span>
              <strong>Et gæt kan starte en tanke. Et bevis kan tjekkes.</strong>
            </div>
          </>
        ) : remaining.map((c) => (
          <EvidenceCard
            key={c.id}
            text={c.text}
            selected={selectedCardId === c.id}
            status={feedback.cardId === c.id ? feedback.status : null}
            onClick={() => selectCard(c.id)}
            dataAttrs={{
              'aria-pressed': selectedCardId === c.id,
              'aria-label': selectedCardId === c.id ? `Fravælg kort: ${c.text}` : `Vælg kort: ${c.text}`,
            }}
          />
        ))}
      </div>

      <div className="cat-grid" role="group" aria-label="Sorteringskategorier">
        {SORT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`cat-bin${selectedCardId ? ' is-active' : ' is-idle'}`}
            data-cat={cat.id}
            onClick={() => placeIn(cat.id)}
            aria-label={selectedCard ? `Placer "${selectedCard.text}" i ${cat.label}` : `Vælg et kort før du placerer i ${cat.label}`}
            disabled={!selectedCardId}
          >
            <span className="cat-bin-label">{cat.label}</span>
            <span className="cat-bin-hint">{cat.hint}</span>
            <span className={`cat-drop-hint${selectedCard ? ' is-visible' : ''}`}>
              {selectedCard ? categoryPrompt(cat.id) : 'Vælg et kort først'}
            </span>
            <div className="cat-bin-cards">
              {(placedByCat[cat.id] || []).length === 0 && (
                <span className="cat-bin-empty">Ingen kort her endnu</span>
              )}
              {(placedByCat[cat.id] || []).map((c) => (
                <EvidenceCard key={c.id} text={c.text} mini category={cat.id} />
              ))}
            </div>
            <span className="cat-bin-count">{(placedByCat[cat.id] || []).length} kort</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function sortHint(correctCategory) {
  if (correctCategory === 'gæt') return 'Spørg dig selv: ved vi det, eller tror vi det bare?'
  if (correctCategory === 'spor') return 'Kig efter en detalje, vi faktisk har set.'
  if (correctCategory === 'bevis') return 'Et bevis kan tjekkes af flere.'
  if (correctCategory === 'spørgsmål') return 'Et stort spørgsmål åbner sagen og får os til at undersøge.'
  return 'Prøv én gang til med lup-blikket.'
}

function categoryPrompt(category) {
  if (category === 'gæt') return 'Passer, hvis vi tror uden at vide.'
  if (category === 'spor') return 'Passer, hvis det er en set detalje.'
  if (category === 'bevis') return 'Passer, hvis flere kan tjekke det.'
  if (category === 'spørgsmål') return 'Passer, hvis det åbner sagen.'
  return 'Læg kortet her, hvis det passer.'
}
