import { useGame } from '../context/GameContext.jsx'
import { getCaseProgress, caseStatusFromState, caseStatusLabel, nextCaseStepLabel, TOTAL_CLUES } from '../utils/progress.js'

export default function CaseProgress() {
  const { state } = useGame()
  const progress = getCaseProgress(state)
  const status = caseStatusFromState(state)
  const clues = state.foundClues?.length || 0
  const nextStep = nextCaseStepLabel(state)
  const statusLabel = caseStatusLabel(status)

  return (
    <div className="progress" role="group" aria-label="Sagens fremskridt">
      <div className="progress-row">
        <span>Sagsstatus</span>
        <span style={{ color: status === 'opklaret' ? 'var(--success)' : status === 'under-efterforskning' ? 'var(--milo-blue)' : 'var(--muted)' }}>
          {statusLabel}
        </span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label={`Sagens fremskridt: ${statusLabel}. ${progress} procent. ${clues} af ${TOTAL_CLUES} spor fundet. ${nextStep}`}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={progress}
      >
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="progress-row">
        <span>Spor: {clues}/{TOTAL_CLUES}</span>
        <span>{progress}%</span>
      </div>
      <div className="progress-next" role="status" aria-live="polite">
        {nextStep}
      </div>
    </div>
  )
}
