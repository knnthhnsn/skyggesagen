import { useState } from 'react'
import Header from '../components/Header.jsx'
import Button from '../components/Button.jsx'
import SkipTaskButton from '../components/SkipTaskButton.jsx'
import EvidenceSort from '../components/EvidenceSort.jsx'
import { useGame } from '../context/GameContext.jsx'
import { SORT_CARDS } from '../data/caseData.js'

export default function SortScreen({ onNext, onBack }) {
  const { state } = useGame()
  const initialDone = SORT_CARDS.every((c) => state.sortedClues?.[c.id] === c.correct)
  const [done, setDone] = useState(initialDone)

  return (
    <div className="screen screen-pad">
      <Header eyebrow="Sorter sporene" name="Detektivboard" onBack={onBack} />
      <EvidenceSort onAllSorted={() => setDone(true)} />
      <div className="screen-bottom-bar">
        <SkipTaskButton screen="sort" onSkip={onNext} />
        <Button variant="primary" block onClick={onNext} disabled={!done}>
          {done ? 'Find det gode spørgsmål' : 'Sorter alle kort først'}
        </Button>
      </div>
    </div>
  )
}
