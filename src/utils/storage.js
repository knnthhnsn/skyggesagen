// Robust localStorage-håndtering med fallback ved tom/korrupt state.
import { normalizeSymbolId } from '../data/caseData.js'

const STORAGE_KEY = 'milo-skyggesagen:v1'

export const initialState = {
  detectiveName: '',
  symbol: 'spormagnet',
  soundEnabled: true,
  motionEffectsEnabled: true,
  foundClues: [],
  sortedClues: {},
  sortAttempts: {},
  questionSolved: false,
  questionAttempts: 0,
  explanationOrder: [],
  explanationSolved: false,
  shadowRevealed: false,
  badges: [],
  caseStatus: 'ikke-opklaret',
  report: { situation: '', action: '', rule: '', note: '' },
  completedScreens: [],
  // Vidneafhøring
  witnessAnswers: {},      // { [witnessId]: [questionId, ...] }
  witnessesDone: false,
  goodQuestionCount: 0,    // antal gode (åbne) spørgsmål stillet
  // Tidslinje
  timelineOrder: [],
  timelineSolved: false,
  // Platons filosofi
  philosophyPairs: {},       // { [pairId]: true } — hvilke ide/kopi-par der er matchet
  caveStage: 0,              // 0..4 — hvor langt ud af hulen vi er gået
  philosophyDone: false,
  skippedScreens: [],
  // Easter egg
  miloTaps: 0,
  miloEggUnlocked: false,
  lastScreen: '',
}

/** Synkroniser html[data-motion-effects] — skal køre før første paint. */
export function applyMotionEffectsPref(enabled) {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.motionEffects = enabled === false ? 'off' : 'on'
}

function safeParse(raw) {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

function safeArray(value) {
  return Array.isArray(value) ? value : []
}

function safeObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {}
}

function normalizeState(parsed) {
  const report = safeObject(parsed.report)
  return {
    ...initialState,
    ...parsed,
    detectiveName: typeof parsed.detectiveName === 'string' ? parsed.detectiveName : initialState.detectiveName,
    symbol: normalizeSymbolId(parsed.symbol),
    soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : initialState.soundEnabled,
    motionEffectsEnabled: typeof parsed.motionEffectsEnabled === 'boolean' ? parsed.motionEffectsEnabled : initialState.motionEffectsEnabled,
    foundClues: safeArray(parsed.foundClues),
    sortedClues: safeObject(parsed.sortedClues),
    sortAttempts: safeObject(parsed.sortAttempts),
    questionSolved: !!parsed.questionSolved,
    questionAttempts: Number.isFinite(parsed.questionAttempts) ? parsed.questionAttempts : initialState.questionAttempts,
    explanationOrder: safeArray(parsed.explanationOrder),
    explanationSolved: !!parsed.explanationSolved,
    shadowRevealed: !!parsed.shadowRevealed,
    badges: safeArray(parsed.badges),
    report: {
      situation: typeof report.situation === 'string' ? report.situation : '',
      action: typeof report.action === 'string' ? report.action : '',
      rule: typeof report.rule === 'string' ? report.rule : '',
      note: typeof report.note === 'string' ? report.note : '',
    },
    completedScreens: safeArray(parsed.completedScreens),
    witnessAnswers: safeObject(parsed.witnessAnswers),
    witnessesDone: !!parsed.witnessesDone,
    goodQuestionCount: Number.isFinite(parsed.goodQuestionCount) ? parsed.goodQuestionCount : 0,
    timelineOrder: safeArray(parsed.timelineOrder),
    timelineSolved: !!parsed.timelineSolved,
    philosophyPairs: safeObject(parsed.philosophyPairs),
    caveStage: Number.isFinite(parsed.caveStage) ? Math.max(0, Math.min(4, parsed.caveStage)) : 0,
    philosophyDone: !!parsed.philosophyDone,
    skippedScreens: safeArray(parsed.skippedScreens),
    miloTaps: Number.isFinite(parsed.miloTaps) ? parsed.miloTaps : 0,
    miloEggUnlocked: !!parsed.miloEggUnlocked,
    lastScreen: typeof parsed.lastScreen === 'string' ? parsed.lastScreen : '',
    badgeEvents: [],
  }
}

/**
 * Migration: hvis en gammel save allerede er kommet forbi sortering/spørgsmål,
 * så lås de nye skærme op så brugeren ikke står låst ude.
 */
function migrateLegacyState(state) {
  const sortedCount = Object.keys(safeObject(state.sortedClues)).length
  const isPastNewSteps = sortedCount >= 6 || !!state.questionSolved || !!state.explanationSolved || !!state.shadowRevealed
  const reportWritten = (state.completedScreens || []).includes('report')
  let next = state
  if (isPastNewSteps) {
    next = { ...next, witnessesDone: true, timelineSolved: true }
  }
  // Hvis rapporten allerede er skrevet, betragt filosofitrinet som passeret så brugeren ikke bliver låst.
  if (reportWritten && !next.philosophyDone) {
    next = { ...next, philosophyDone: true, caveStage: 4 }
  }
  return next
}

const RESTORE_SCREENS = new Set([
  'hub', 'briefing', 'investigate', 'witness', 'timeline', 'sort',
  'question', 'explanation', 'reveal', 'philosophy', 'report',
])

/** Skærm ved reload — kun spilskærme, ikke start/profil/lærer. */
export function resolveInitialScreen(state) {
  if (!state.detectiveName) return 'start'
  if (RESTORE_SCREENS.has(state.lastScreen)) return state.lastScreen
  return 'hub'
}

export function getGameState() {
  if (typeof window === 'undefined') return { ...initialState }
  try {
    const parsed = safeParse(window.localStorage.getItem(STORAGE_KEY))
    if (!parsed) return { ...initialState }
    return migrateLegacyState(normalizeState(parsed))
  } catch {
    return { ...initialState }
  }
}

export function saveGameState(state) {
  if (typeof window === 'undefined') return
  try {
    const { badgeEvents, ...persistentState } = state
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persistentState))
  } catch {
    // localStorage kan være låst — appen må ikke crashe.
  }
}

export function resetGameState() {
  if (typeof window === 'undefined') return { ...initialState }
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {}
  return { ...initialState }
}

export function updateGameState(patch) {
  const current = getGameState()
  const next = { ...current, ...patch }
  saveGameState(next)
  return next
}

export function addBadge(badgeId) {
  const state = getGameState()
  if (!state.badges.includes(badgeId)) {
    state.badges = [...state.badges, badgeId]
    saveGameState(state)
  }
  return state
}

export function addClue(clueId) {
  const state = getGameState()
  if (!state.foundClues.includes(clueId)) {
    state.foundClues = [...state.foundClues, clueId]
    saveGameState(state)
  }
  return state
}

export function saveReport(report) {
  const state = getGameState()
  state.report = { ...state.report, ...report }
  saveGameState(state)
  return state
}

export function setSoundPreference(enabled) {
  const state = getGameState()
  state.soundEnabled = !!enabled
  saveGameState(state)
  return state
}
