import { useState } from 'react'
import Button from './Button.jsx'
import Milo from './Milo.jsx'
import MiloSpeech from './MiloSpeech.jsx'
import { REPORT_CHIPS_SITUATION, REPORT_CHIPS_ACTION, REPORT_CHIPS_RULE, MILO_LINES } from '../data/caseData.js'
import { useGame } from '../context/GameContext.jsx'

/**
 * Refleksionsformularen — chips som primær interaktion, fritekst som valgfri.
 */
export default function ThoughtReport({ onSubmit }) {
  const { state, saveReport } = useGame()
  const [situation, setSituation] = useState(state.report?.situation || '')
  const [action, setAction] = useState(state.report?.action || '')
  const [rule, setRule] = useState(state.report?.rule || '')
  const [note, setNote] = useState(state.report?.note || '')
  const canSubmit = !!(situation || action || rule || note.trim())
  const noteLength = note.length

  function submit() {
    if (!canSubmit) return
    saveReport({ situation, action, rule, note })
    if (typeof onSubmit === 'function') onSubmit({ situation, action, rule, note })
  }

  return (
    <div className="col">
      <div className="milo-row">
        <Milo pose="adore" size="sm" bob />
        <MiloSpeech>{MILO_LINES.reportIntro}</MiloSpeech>
      </div>

      <div className="paper">
        <span className="input-label">Hvornår har du oplevet, at noget måske ikke var hele sandheden?</span>
        <div className="chips" aria-label="Vælg en skygge fra hverdagen">
          {REPORT_CHIPS_SITUATION.map((s) => (
            <button
              key={s}
              type="button"
              className={`chip${situation === s ? ' is-on' : ''}`}
              aria-pressed={situation === s}
              onClick={() => setSituation(situation === s ? '' : s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="paper">
        <span className="input-label">Hvad kan du gøre næste gang?</span>
        <div className="chips" aria-label="Vælg hvad du kan gøre næste gang">
          {REPORT_CHIPS_ACTION.map((s) => (
            <button
              key={s}
              type="button"
              className={`chip${action === s ? ' is-on' : ''}`}
              aria-pressed={action === s}
              onClick={() => setAction(action === s ? '' : s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="paper">
        <span className="input-label">Min detektivregel</span>
        <div className="chips" aria-label="Vælg din detektivregel">
          {REPORT_CHIPS_RULE.map((s) => (
            <button
              key={s}
              type="button"
              className={`chip${rule === s ? ' is-on' : ''}`}
              aria-pressed={rule === s}
              onClick={() => setRule(rule === s ? '' : s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="paper">
        <label className="input-label" htmlFor="report-note">Min egen tanke (valgfri)</label>
        <textarea
          id="report-note"
          className="textarea"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Skriv din egen detektivtanke her…"
          maxLength={160}
          aria-describedby="report-note-count"
        />
        <p id="report-note-count" className="report-note-count">{160 - noteLength} tegn tilbage</p>
      </div>

      <div className="report-draft" aria-label="Din rapportkladde">
        <span className="report-draft-label">Rapportkladde</span>
        <p>{situation ? `Skyggen: ${situation}.` : 'Vælg en skygge fra hverdagen.'}</p>
        <p>{action ? `Næste skridt: ${action}.` : 'Vælg, hvad du kan gøre næste gang.'}</p>
        <p>{rule ? `Min regel: ${rule}.` : 'Vælg din egen detektivregel.'}</p>
        {note.trim() && <p>Min tanke: {note.trim()}</p>}
      </div>

      <div className="report-submit">
        <p className="report-submit-hint" role="status" aria-live="polite">
          {canSubmit ? 'Klar. Din rapport har en tanke at tage med videre.' : 'Vælg mindst en brik, eller skriv din egen tanke.'}
        </p>
        <Button variant="primary" block onClick={submit} disabled={!canSubmit}>
          Indsend rapporten
        </Button>
      </div>
    </div>
  )
}
