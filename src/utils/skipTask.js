import {
  CLUES,
  SORT_CARDS,
  EXPLANATION_PIECES,
  WITNESSES,
  TIMELINE_EVENTS,
  PHILOSOPHY_PAIRS,
} from '../data/caseData.js'

export const SKIPPABLE_SCREENS = new Set([
  'briefing',
  'investigate',
  'witness',
  'timeline',
  'sort',
  'question',
  'explanation',
  'reveal',
  'philosophy',
  'report',
])

export const SCREEN_FOR_NODE = {
  briefing: 'briefing',
  spor1: 'investigate',
  spor2: 'witness',
  spor3: 'timeline',
  sort: 'sort',
  question: 'question',
  explanation: 'explanation',
  reveal: 'reveal',
  philosophy: 'philosophy',
  report: 'report',
}

export const PREVIOUS_SCREEN_FOR_NODE = {
  spor1: 'briefing',
  spor2: 'investigate',
  spor3: 'witness',
  sort: 'timeline',
  question: 'sort',
  explanation: 'question',
  reveal: 'explanation',
  philosophy: 'reveal',
  report: 'philosophy',
}

export const NEXT_SCREEN_AFTER = {
  briefing: 'investigate',
  investigate: 'witness',
  witness: 'timeline',
  timeline: 'sort',
  sort: 'question',
  question: 'explanation',
  explanation: 'reveal',
  reveal: 'philosophy',
  philosophy: 'report',
  report: 'hub',
}

export function isScreenSkipped(state, screen) {
  return (state.skippedScreens || []).includes(screen)
}

/** Opgaven er rigtigt løst — ikke sprunget over. */
export function isTaskGenuinelyComplete(state, screen) {
  switch (screen) {
    case 'briefing':
      return state.completedScreens?.includes('briefing')
    case 'investigate':
      return (state.foundClues?.length || 0) >= CLUES.length
    case 'witness':
      return !!state.witnessesDone
    case 'timeline':
      return !!state.timelineSolved
    case 'sort':
      return SORT_CARDS.every((c) => state.sortedClues?.[c.id] === c.correct)
    case 'question':
      return !!state.questionSolved
    case 'explanation':
      return !!state.explanationSolved
    case 'reveal':
      return !!state.shadowRevealed
    case 'philosophy':
      return !!state.philosophyDone
    case 'report':
      return state.completedScreens?.includes('report')
    default:
      return true
  }
}

/** Brugeren må gå videre (løst eller sprunget over). */
export function hasPassedScreen(state, screen) {
  return isScreenSkipped(state, screen) || isTaskGenuinelyComplete(state, screen)
}

/** Kun marker som sprunget over — udfyld ikke løsningsdata. */
export function applySkipTask(state, screen) {
  if (!SKIPPABLE_SCREENS.has(screen)) return state
  const skippedScreens = state.skippedScreens || []
  if (skippedScreens.includes(screen)) return state
  return { ...state, skippedScreens: [...skippedScreens, screen] }
}
