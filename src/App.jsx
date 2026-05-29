import { lazy, Suspense, useEffect, useState } from 'react'
import AppShell from './components/AppShell.jsx'
import { useGame } from './context/GameContext.jsx'
import { resolveInitialScreen, applyMotionEffectsPref } from './utils/storage.js'

const StartScreen = lazy(() => import('./screens/StartScreen.jsx'))
const ProfileScreen = lazy(() => import('./screens/ProfileScreen.jsx'))
const HubScreen = lazy(() => import('./screens/HubScreen.jsx'))
const BriefingScreen = lazy(() => import('./screens/BriefingScreen.jsx'))
const InvestigateScreen = lazy(() => import('./screens/InvestigateScreen.jsx'))
const WitnessScreen = lazy(() => import('./screens/WitnessScreen.jsx'))
const TimelineScreen = lazy(() => import('./screens/TimelineScreen.jsx'))
const SortScreen = lazy(() => import('./screens/SortScreen.jsx'))
const QuestionScreen = lazy(() => import('./screens/QuestionScreen.jsx'))
const ExplanationScreen = lazy(() => import('./screens/ExplanationScreen.jsx'))
const RevealScreen = lazy(() => import('./screens/RevealScreen.jsx'))
const PhilosophyScreen = lazy(() => import('./screens/PhilosophyScreen.jsx'))
const ReportScreen = lazy(() => import('./screens/ReportScreen.jsx'))
const TeacherScreen = lazy(() => import('./screens/TeacherScreen.jsx'))

const Notebook = lazy(() => import('./components/Notebook.jsx'))
const NotebookPanel = lazy(() =>
  import('./components/Notebook.jsx').then((m) => ({ default: m.NotebookPanel }))
)
const AchievementPopup = lazy(() => import('./components/AchievementPopup.jsx'))

const NIGHT_SCREENS = new Set(['start', 'reveal'])
const NOTEBOOK_HIDDEN = new Set(['start', 'profile', 'teacher', 'reveal'])

const SCREEN_TITLES = {
  start: 'Start',
  profile: 'Detektivprofil',
  hub: 'Sagsmappen',
  briefing: 'Briefing',
  investigate: 'Find spor',
  witness: 'Afhør vidner',
  timeline: 'Tidslinje',
  sort: 'Sorter sporene',
  question: 'Det gode spørgsmål',
  explanation: 'Byg forklaringen',
  reveal: 'Afslør skyggen',
  philosophy: 'Platons to verdener',
  report: 'Detektivrapport',
  teacher: 'Lærerside',
}

function ScreenFallback() {
  return <div className="screen screen-fallback" aria-busy="true" aria-label="Indlæser..." />
}

export default function App() {
  const { state, setLastScreen } = useGame()
  const [screen, setScreen] = useState(() => resolveInitialScreen(state))

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const screenTitle = SCREEN_TITLES[screen] || 'Skyggesagen'
      document.title = `${screenTitle} | Milo: Skyggesagen`
    }
  }, [screen])

  useEffect(() => {
    applyMotionEffectsPref(state.motionEffectsEnabled)
  }, [state.motionEffectsEnabled])

  useEffect(() => {
    if (screen !== 'start') return undefined
    const prefetch = state.detectiveName
      ? import('./screens/HubScreen.jsx')
      : import('./screens/ProfileScreen.jsx')
    prefetch.catch(() => {})
    return undefined
  }, [screen, state.detectiveName])

  function go(next) {
    setLastScreen(next)
    setScreen(next)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
    }
  }

  const themeNight = NIGHT_SCREENS.has(screen)

  let content = null
  switch (screen) {
    case 'start':
      content = <StartScreen onOpenCase={() => go(state.detectiveName ? 'hub' : 'profile')} onTeacher={() => go('teacher')} />
      break
    case 'profile':
      content = <ProfileScreen onDone={() => go('hub')} onBack={() => go('start')} />
      break
    case 'hub':
      content = <HubScreen go={go} />
      break
    case 'briefing':
      content = <BriefingScreen onNext={() => go('investigate')} onBack={() => go('hub')} />
      break
    case 'investigate':
      content = <InvestigateScreen onNext={() => go('witness')} onBack={() => go('hub')} />
      break
    case 'witness':
      content = <WitnessScreen onNext={() => go('timeline')} onBack={() => go('hub')} />
      break
    case 'timeline':
      content = <TimelineScreen onNext={() => go('sort')} onBack={() => go('hub')} />
      break
    case 'sort':
      content = <SortScreen onNext={() => go('question')} onBack={() => go('hub')} />
      break
    case 'question':
      content = <QuestionScreen onNext={() => go('explanation')} onBack={() => go('hub')} />
      break
    case 'explanation':
      content = <ExplanationScreen onNext={() => go('reveal')} onBack={() => go('hub')} />
      break
    case 'reveal':
      content = <RevealScreen onNext={() => go('philosophy')} onBack={() => go('hub')} />
      break
    case 'philosophy':
      content = <PhilosophyScreen onNext={() => go('report')} onBack={() => go('hub')} />
      break
    case 'report':
      content = <ReportScreen onDone={() => go('hub')} onBack={() => go('hub')} />
      break
    case 'teacher':
      content = <TeacherScreen onBack={() => go('start')} />
      break
    default:
      content = <StartScreen onOpenCase={() => go('profile')} onTeacher={() => go('teacher')} />
  }

  const showNotebook = !NOTEBOOK_HIDDEN.has(screen)

  return (
    <AppShell
      themeNight={themeNight}
      screen={screen}
      sidebar={
        showNotebook ? (
          <Suspense fallback={null}>
            <NotebookPanel go={go} />
          </Suspense>
        ) : null
      }
    >
      <Suspense fallback={<ScreenFallback />}>{content}</Suspense>
      {showNotebook && (
        <Suspense fallback={null}>
          <Notebook go={go} currentScreen={screen} />
        </Suspense>
      )}
      <Suspense fallback={null}>
        <AchievementPopup />
      </Suspense>
    </AppShell>
  )
}
