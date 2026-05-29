import { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header.jsx'
import Button from '../components/Button.jsx'
import SkipTaskButton from '../components/SkipTaskButton.jsx'
import Milo from '../components/Milo.jsx'
import MiloSpeech from '../components/MiloSpeech.jsx'
import WitnessAvatar from '../components/WitnessAvatar.jsx'
import { WITNESSES, MILO_LINES } from '../data/caseData.js'
import { useGame } from '../context/GameContext.jsx'
import { playWitnessSpeak, playCorrect, playWrong, playInsight } from '../utils/audio.js'

const QUESTIONS_PER_WITNESS = 2

export default function WitnessScreen({ onNext, onBack }) {
  const { state, askWitness, completeWitnesses, addBadge } = useGame()
  const [activeId, setActiveId] = useState(null)
  const [milo, setMilo] = useState(MILO_LINES.witnessIntro)
  const [feedback, setFeedback] = useState(null) // { questionId, kind: 'good'|'leading' }

  const answers = state.witnessAnswers || {}
  const witnessProgress = useMemo(() => WITNESSES.map((w) => ({
    id: w.id,
    asked: (answers[w.id] || []).length,
  })), [answers])

  const allInterviewedNow = WITNESSES.every((w) => (answers[w.id] || []).length >= QUESTIONS_PER_WITNESS)
  // Hvis state allerede markerer vidnerne som færdige (fx via migration), så respekter det.
  const allInterviewed = allInterviewedNow || !!state.witnessesDone
  const totalAsked = Object.values(answers).reduce((sum, list) => sum + list.length, 0)

  useEffect(() => {
    if (allInterviewed && !state.witnessesDone) {
      completeWitnesses()
      addBadge('tre-vinkler')
      playInsight()
      setMilo(MILO_LINES.witnessAllDone)
    }
  }, [allInterviewed, state.witnessesDone, completeWitnesses, addBadge])

  const activeWitness = WITNESSES.find((w) => w.id === activeId)

  function pickWitness(id) {
    setActiveId(id)
    setFeedback(null)
    const w = WITNESSES.find((x) => x.id === id)
    setMilo(w ? `Vidne: ${w.name}. ${w.distance}` : MILO_LINES.witnessIntro)
    playWitnessSpeak()
  }

  function ask(question) {
    if (!activeWitness) return
    const asked = answers[activeWitness.id] || []
    if (asked.includes(question.id)) return
    askWitness(activeWitness.id, question.id, question.good)
    setFeedback({ questionId: question.id, kind: question.good ? 'good' : 'leading' })
    if (question.good) {
      setMilo(MILO_LINES.witnessGood)
      playCorrect()
    } else {
      setMilo(MILO_LINES.witnessLeading)
      playWrong()
    }
  }

  function backToWitnesses() {
    setActiveId(null)
    setFeedback(null)
    if (!allInterviewed) setMilo(MILO_LINES.witnessIntro)
  }

  if (activeWitness) {
    return (
      <WitnessRoom
        witness={activeWitness}
        asked={answers[activeWitness.id] || []}
        feedback={feedback}
        milo={milo}
        onAsk={ask}
        onBack={backToWitnesses}
      />
    )
  }

  return (
    <div className="screen screen-pad">
      <Header eyebrow="Afhør vidner" name="Tre vinkler" onBack={onBack} />

      <div className="milo-row" style={{ alignItems: 'flex-end' }}>
        <Milo pose={allInterviewed ? 'thumbs' : 'watching'} size="sm" bob={!allInterviewed} pulse={allInterviewed} />
        <MiloSpeech>{milo}</MiloSpeech>
      </div>

      <div className="paper-warm fade-up witness-instructions">
        <span className="eyebrow">Sådan gør du</span>
        <p>Vælg et vidne. Stil <strong>{QUESTIONS_PER_WITNESS} spørgsmål</strong> til hver. Åbne spørgsmål åbner sagen — ledende spørgsmål lukker den.</p>
        <div className="witness-meter" aria-label={`${totalAsked} af ${WITNESSES.length * QUESTIONS_PER_WITNESS} spørgsmål stillet`}>
          <span style={{ width: `${(totalAsked / (WITNESSES.length * QUESTIONS_PER_WITNESS)) * 100}%` }} />
        </div>
      </div>

      <div className="witness-grid" role="list">
        {WITNESSES.map((w, idx) => {
          const askedCount = (answers[w.id] || []).length
          const done = askedCount >= QUESTIONS_PER_WITNESS
          return (
            <button
              key={w.id}
              type="button"
              role="listitem"
              className={`witness-card${done ? ' is-done' : ''}`}
              onClick={() => pickWitness(w.id)}
              aria-label={`Vidne ${w.name}, ${w.role}. ${askedCount} af ${QUESTIONS_PER_WITNESS} spørgsmål stillet${done ? '. Færdig.' : '.'}`}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <WitnessAvatar portrait={w.portrait} image={w.image} size={72} />
              <div className="witness-card-body">
                <span className="witness-card-meta">{w.role}</span>
                <strong>{w.name}</strong>
                <p>{w.distance}</p>
                <span className={`witness-card-status${done ? ' is-done' : ''}`}>
                  {done ? 'Afhørt' : `${askedCount}/${QUESTIONS_PER_WITNESS} spørgsmål`}
                </span>
              </div>
              {done && <span className="witness-card-stamp">✓</span>}
            </button>
          )
        })}
      </div>

      {allInterviewed && (
        <div className="paper fade-up witness-insight">
          <span className="eyebrow">Tre vinkler — en sag</span>
          <ul className="witness-insight-list">
            {WITNESSES.map((w) => (
              <li key={w.id}>
                <strong>{w.name}:</strong> {w.truth}
              </li>
            ))}
          </ul>
          <p className="witness-insight-rule">
            Ingen af dem ser hele sandheden. Sammen viser de mere end et billede kan.
          </p>
        </div>
      )}

      <div className="screen-bottom-bar">
        <SkipTaskButton screen="witness" onSkip={onNext} />
        <Button variant="primary" block onClick={onNext} disabled={!allInterviewed}>
          {allInterviewed ? 'Sæt tidslinjen sammen' : `Afhør alle vidner (${witnessProgress.filter((w) => w.asked >= QUESTIONS_PER_WITNESS).length}/${WITNESSES.length})`}
        </Button>
      </div>
    </div>
  )
}

function WitnessRoom({ witness, asked, feedback, milo, onAsk, onBack }) {
  const askedSet = new Set(asked)
  const askedCount = asked.length
  const remaining = Math.max(0, QUESTIONS_PER_WITNESS - askedCount)
  const isDone = askedCount >= QUESTIONS_PER_WITNESS

  return (
    <div className="screen screen-pad">
      <Header eyebrow={`Afhør: ${witness.name}`} name="Vælg dine spørgsmål" onBack={onBack} />

      <div className="witness-room paper-warm">
        <div className="witness-room-head">
          <WitnessAvatar portrait={witness.portrait} image={witness.image} size={92} speaking />
          <div>
            <span className="witness-card-meta">{witness.role}</span>
            <h2 className="title-screen" style={{ marginTop: 4 }}>{witness.name}</h2>
            <p className="lede" style={{ marginTop: 4 }}>{witness.distance}</p>
          </div>
        </div>
        <div className="witness-bubble">
          <span aria-hidden="true">“</span>
          {witness.intro}
          <span aria-hidden="true">”</span>
        </div>
      </div>

      <div className="milo-row" style={{ alignItems: 'flex-end' }}>
        <Milo pose={feedback?.kind === 'good' ? 'thumbs' : feedback?.kind === 'leading' ? 'adore' : 'side'} size="sm" bob={!feedback} />
        <MiloSpeech>{milo}</MiloSpeech>
      </div>

      <div className="paper">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className="eyebrow">Dine spørgsmål</span>
          <span className="tag tag-blue">{askedCount}/{QUESTIONS_PER_WITNESS}</span>
        </div>
        <div className="witness-questions">
          {witness.questions.map((q) => {
            const wasAsked = askedSet.has(q.id)
            return (
              <div key={q.id} className={`witness-question${wasAsked ? ' is-asked' : ''}${wasAsked && q.good ? ' is-good' : ''}${wasAsked && !q.good ? ' is-leading' : ''}`}>
                <button
                  type="button"
                  className="witness-question-button"
                  onClick={() => onAsk(q)}
                  disabled={wasAsked || isDone}
                  aria-label={wasAsked ? `Allerede spurgt: ${q.text}` : `Spørg: ${q.text}`}
                >
                  <span className="witness-question-text">{q.text}</span>
                  {!wasAsked && (
                    <span className="witness-question-cta" aria-hidden="true">Spørg</span>
                  )}
                  {wasAsked && (
                    <span className={`witness-question-tag${q.good ? ' is-good' : ' is-leading'}`}>
                      {q.good ? 'Åbent' : 'Ledende'}
                    </span>
                  )}
                </button>
                {wasAsked && (
                  <div className="witness-answer">
                    <span className="witness-answer-label">{witness.name} svarer</span>
                    <p>“{q.answer}”</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        {!isDone && remaining < QUESTIONS_PER_WITNESS && (
          <p className="witness-hint">{remaining === 0 ? 'Du har stillet dine spørgsmål til dette vidne.' : `Du kan stille ${remaining} spørgsmål mere.`}</p>
        )}
      </div>

      <div className="screen-bottom-bar">
        <Button variant="primary" block onClick={onBack}>
          {isDone ? 'Tilbage til vidnerne' : `Tilbage (${askedCount}/${QUESTIONS_PER_WITNESS} stillet)`}
        </Button>
      </div>
    </div>
  )
}
