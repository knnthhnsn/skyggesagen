import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import MiloEggBubble from '../components/MiloEggBubble.jsx'
import { getGameState, saveGameState, resetGameState, initialState } from '../utils/storage.js'
import { setSoundEnabled, getSoundEnabled, playClick, playEgg } from '../utils/audio.js'
import { computeEggBubblePos } from '../utils/miloEggBubble.js'
import { caseStatusFromState } from '../utils/progress.js'
import { applySkipTask } from '../utils/skipTask.js'

const EGG_BUBBLE_MS = 3200
const EGG_BADGE_DELAY_MS = 3000

const GameContext = createContext(null)

function makeBadgeEvent(badgeId) {
  return { id: badgeId, eventId: `${badgeId}:${Date.now()}:${Math.random().toString(36).slice(2)}` }
}

function addBadgeToState(state, badgeId, eventId) {
  if ((state.badges || []).includes(badgeId)) return state
  const badgeEvent = { id: badgeId, eventId: eventId || `${badgeId}:${Date.now()}` }
  return {
    ...state,
    badges: [...(state.badges || []), badgeId],
    badgeEvents: [...(state.badgeEvents || []), badgeEvent].slice(-12),
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, detectiveName: action.name, symbol: action.symbol }
    case 'SET_SOUND':
      return { ...state, soundEnabled: !!action.value }
    case 'SET_MOTION_EFFECTS':
      return { ...state, motionEffectsEnabled: !!action.value }
    case 'COMPLETE_SCREEN': {
      if ((state.completedScreens || []).includes(action.screen)) return state
      return { ...state, completedScreens: [...(state.completedScreens || []), action.screen] }
    }
    case 'ADD_CLUE': {
      if (state.foundClues.includes(action.clueId)) return state
      return { ...state, foundClues: [...state.foundClues, action.clueId] }
    }
    case 'SORT_CLUE': {
      const sortedClues = { ...state.sortedClues, [action.cardId]: action.category }
      const sortAttempts = { ...state.sortAttempts, [action.cardId]: (state.sortAttempts[action.cardId] || 0) + 1 }
      return { ...state, sortedClues, sortAttempts }
    }
    case 'CLEAR_SORT': {
      const sortedClues = { ...state.sortedClues }
      delete sortedClues[action.cardId]
      return { ...state, sortedClues }
    }
    case 'SOLVE_QUESTION':
      return { ...state, questionSolved: true }
    case 'BUMP_QUESTION_ATTEMPT':
      return { ...state, questionAttempts: (state.questionAttempts || 0) + 1 }
    case 'SET_EXPLANATION_ORDER':
      return { ...state, explanationOrder: action.order }
    case 'SOLVE_EXPLANATION':
      return { ...state, explanationSolved: true }
    case 'REVEAL_SHADOW':
      return { ...state, shadowRevealed: true }
    case 'ADD_BADGE': {
      return addBadgeToState(state, action.badgeId, action.eventId)
    }
    case 'SAVE_REPORT':
      return { ...state, report: { ...state.report, ...action.report } }
    case 'ASK_WITNESS': {
      const prevList = (state.witnessAnswers || {})[action.witnessId] || []
      if (prevList.includes(action.questionId)) return state
      const witnessAnswers = { ...(state.witnessAnswers || {}), [action.witnessId]: [...prevList, action.questionId] }
      const goodQuestionCount = (state.goodQuestionCount || 0) + (action.good ? 1 : 0)
      return { ...state, witnessAnswers, goodQuestionCount }
    }
    case 'COMPLETE_WITNESSES':
      if (state.witnessesDone) return state
      return { ...state, witnessesDone: true }
    case 'SET_TIMELINE_ORDER':
      return { ...state, timelineOrder: action.order }
    case 'SOLVE_TIMELINE':
      if (state.timelineSolved) return state
      return { ...state, timelineSolved: true }
    case 'TAP_MILO': {
      if (state.miloEggUnlocked) return state
      const miloTaps = (state.miloTaps || 0) + 1
      const unlocksEgg = miloTaps >= 5
      const next = { ...state, miloTaps, miloEggUnlocked: unlocksEgg }
      if (action.deferBadge && unlocksEgg) return next
      const shouldAwardEggBadge = unlocksEgg && !(state.badges || []).includes('maagens-ven')
      return shouldAwardEggBadge ? addBadgeToState(next, 'maagens-ven', action.eventId) : next
    }
    case 'MATCH_PHILOSOPHY_PAIR': {
      if ((state.philosophyPairs || {})[action.pairId]) return state
      return { ...state, philosophyPairs: { ...(state.philosophyPairs || {}), [action.pairId]: true } }
    }
    case 'ADVANCE_CAVE_STAGE': {
      const target = Math.max(0, Math.min(4, action.stage))
      if (target <= (state.caveStage || 0)) return state
      return { ...state, caveStage: target }
    }
    case 'COMPLETE_PHILOSOPHY':
      if (state.philosophyDone) return state
      return { ...state, philosophyDone: true, caveStage: 4 }
    case 'SET_LAST_SCREEN':
      return { ...state, lastScreen: typeof action.screen === 'string' ? action.screen : '' }
    case 'SKIP_TASK':
      return applySkipTask(state, action.screen)
    case 'RESET':
      return { ...initialState }
    default:
      return state
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, getGameState)
  const [eggBubble, setEggBubble] = useState(null)
  const eggTimersRef = useRef([])

  function clearEggTimers() {
    eggTimersRef.current.forEach((id) => window.clearTimeout(id))
    eggTimersRef.current = []
  }

  function scheduleEggTimers(getAnchorRect, { playSound, deferBadge }) {
    clearEggTimers()
    const anchor = getAnchorRect?.()
    if (anchor) {
      const el = typeof anchor === 'function' ? anchor() : anchor
      if (el?.getBoundingClientRect) {
        setEggBubble({ anchor: el, ...computeEggBubblePos(el.getBoundingClientRect()) })
      }
    }
    if (playSound) playEgg()
    eggTimersRef.current.push(
      window.setTimeout(() => setEggBubble(null), EGG_BUBBLE_MS)
    )
    if (deferBadge) {
      eggTimersRef.current.push(
        window.setTimeout(() => {
          dispatch({
            type: 'ADD_BADGE',
            badgeId: 'maagens-ven',
            eventId: makeBadgeEvent('maagens-ven').eventId,
          })
        }, EGG_BADGE_DELAY_MS)
      )
    }
  }

  useEffect(() => {
    const status = caseStatusFromState(state)
    const stateWithStatus = { ...state, caseStatus: status }
    saveGameState(stateWithStatus)
    setSoundEnabled(state.soundEnabled !== false)
  }, [state])

  useEffect(() => () => clearEggTimers(), [])

  const tapMilo = useCallback((getAnchorRect) => {
    if (state.miloEggUnlocked) {
      if (getAnchorRect) scheduleEggTimers(getAnchorRect, { playSound: false, deferBadge: false })
      return
    }
    const nextTaps = (state.miloTaps || 0) + 1
    const willUnlock = nextTaps >= 5
    dispatch({
      type: 'TAP_MILO',
      deferBadge: willUnlock,
      eventId: makeBadgeEvent('maagens-ven').eventId,
    })
    if (willUnlock) {
      scheduleEggTimers(getAnchorRect, { playSound: true, deferBadge: true })
    } else {
      playClick()
    }
  }, [state.miloEggUnlocked, state.miloTaps])

  const api = useMemo(() => ({
    state,
    setProfile: (name, symbol) => dispatch({ type: 'SET_PROFILE', name, symbol }),
    setSound: (value) => dispatch({ type: 'SET_SOUND', value }),
    setMotionEffects: (value) => dispatch({ type: 'SET_MOTION_EFFECTS', value }),
    completeScreen: (screen) => dispatch({ type: 'COMPLETE_SCREEN', screen }),
    addClue: (clueId) => dispatch({ type: 'ADD_CLUE', clueId }),
    sortClue: (cardId, category) => dispatch({ type: 'SORT_CLUE', cardId, category }),
    clearSort: (cardId) => dispatch({ type: 'CLEAR_SORT', cardId }),
    solveQuestion: () => dispatch({ type: 'SOLVE_QUESTION' }),
    bumpQuestionAttempt: () => dispatch({ type: 'BUMP_QUESTION_ATTEMPT' }),
    setExplanationOrder: (order) => dispatch({ type: 'SET_EXPLANATION_ORDER', order }),
    solveExplanation: () => dispatch({ type: 'SOLVE_EXPLANATION' }),
    revealShadow: () => dispatch({ type: 'REVEAL_SHADOW' }),
    addBadge: (badgeId) => dispatch({ type: 'ADD_BADGE', badgeId, eventId: makeBadgeEvent(badgeId).eventId }),
    saveReport: (report) => dispatch({ type: 'SAVE_REPORT', report }),
    askWitness: (witnessId, questionId, good) => dispatch({ type: 'ASK_WITNESS', witnessId, questionId, good }),
    completeWitnesses: () => dispatch({ type: 'COMPLETE_WITNESSES' }),
    setTimelineOrder: (order) => dispatch({ type: 'SET_TIMELINE_ORDER', order }),
    solveTimeline: () => dispatch({ type: 'SOLVE_TIMELINE' }),
    tapMilo,
    matchPhilosophyPair: (pairId) => dispatch({ type: 'MATCH_PHILOSOPHY_PAIR', pairId }),
    advanceCaveStage: (stage) => dispatch({ type: 'ADVANCE_CAVE_STAGE', stage }),
    completePhilosophy: () => dispatch({ type: 'COMPLETE_PHILOSOPHY' }),
    setLastScreen: (screen) => dispatch({ type: 'SET_LAST_SCREEN', screen }),
    skipTask: (screen) => dispatch({ type: 'SKIP_TASK', screen }),
    reset: () => {
      resetGameState()
      dispatch({ type: 'RESET' })
    },
  }), [state, tapMilo])

  return (
    <GameContext.Provider value={api}>
      <MiloEggBubble pos={eggBubble} />
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within <GameProvider>')
  return ctx
}

export { getSoundEnabled }
