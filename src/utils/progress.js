import { CLUES, EXPLANATION_PIECES, WITNESSES, TIMELINE_EVENTS, PHILOSOPHY_PAIRS, CAVE_STAGES } from '../data/caseData.js'
import {
  hasPassedScreen,
  isScreenSkipped,
  isTaskGenuinelyComplete,
  PREVIOUS_SCREEN_FOR_NODE,
  SCREEN_FOR_NODE,
} from './skipTask.js'

export const TOTAL_CLUES = CLUES.length
export const TOTAL_EXPLANATION_PIECES = EXPLANATION_PIECES.length
export const TOTAL_WITNESSES = WITNESSES.length
export const TOTAL_TIMELINE_EVENTS = TIMELINE_EVENTS.length
export const TOTAL_PHILOSOPHY_PAIRS = PHILOSOPHY_PAIRS.length
export const TOTAL_CAVE_STAGES = CAVE_STAGES.length

export function getCaseProgress(state) {
  const done = HUB_NODES.filter((node) => isNodeDone(node.id, state)).length
  return Math.round((done / HUB_NODES.length) * 100)
}

export function caseStatusFromState(state) {
  if (HUB_NODES.every((node) => isNodeDone(node.id, state))) return 'opklaret'
  const started = HUB_NODES.some((node) => {
    const screen = SCREEN_FOR_NODE[node.id]
    return hasPassedScreen(state, screen)
  })
  if (started) return 'under-efterforskning'
  return 'ikke-opklaret'
}

export function caseStatusLabel(status) {
  if (status === 'opklaret') return 'Opklaret'
  if (status === 'under-efterforskning') return 'Under efterforskning'
  return 'Ikke opklaret'
}

export function nextCaseStepLabel(state) {
  const next = HUB_NODES.find((node) => isNodeUnlocked(node.id, state) && !isNodeDone(node.id, state))
  if (next) {
    const screen = SCREEN_FOR_NODE[next.id]
    if (isScreenSkipped(state, screen)) {
      return `Næste mission: Løs ${next.label.toLowerCase()} (du sprang over den)`
    }
    return `Næste mission: ${next.label}`
  }
  if (HUB_NODES.every((node) => isNodeDone(node.id, state))) return 'Sagen er opklaret'
  return 'Fortsæt efterforskningen'
}

export const HUB_NODES = [
  { id: 'briefing', label: 'Briefing', screen: 'briefing' },
  { id: 'spor1', label: 'Spor: Billedet', screen: 'investigate' },
  { id: 'spor2', label: 'Spor: Vidner', screen: 'witness' },
  { id: 'spor3', label: 'Spor: Tidslinje', screen: 'timeline' },
  { id: 'sort', label: 'Sorter sporene', screen: 'sort' },
  { id: 'question', label: 'Det gode spørgsmål', screen: 'question' },
  { id: 'explanation', label: 'Forklaringen', screen: 'explanation' },
  { id: 'reveal', label: 'Afslør skyggen', screen: 'reveal' },
  { id: 'philosophy', label: 'Platons to verdener', screen: 'philosophy' },
  { id: 'report', label: 'Detektivrapport', screen: 'report' },
]

export function isNodeUnlocked(nodeId, state) {
  if (nodeId === 'briefing') return true
  const previousScreen = PREVIOUS_SCREEN_FOR_NODE[nodeId]
  return previousScreen ? hasPassedScreen(state, previousScreen) : false
}

export function isNodeDone(nodeId, state) {
  const screen = SCREEN_FOR_NODE[nodeId]
  if (!screen || isScreenSkipped(state, screen)) return false
  return isTaskGenuinelyComplete(state, screen)
}

export { isScreenSkipped, isTaskGenuinelyComplete, hasPassedScreen, SCREEN_FOR_NODE }
