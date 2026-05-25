import { useEffect, useState } from 'react'
import AppShell from './components/AppShell.jsx'
import StartScreen from './screens/StartScreen.jsx'
import ProfileScreen from './screens/ProfileScreen.jsx'
import HubScreen from './screens/HubScreen.jsx'
import BriefingScreen from './screens/BriefingScreen.jsx'
import InvestigateScreen from './screens/InvestigateScreen.jsx'
import WitnessScreen from './screens/WitnessScreen.jsx'
import TimelineScreen from './screens/TimelineScreen.jsx'
import SortScreen from './screens/SortScreen.jsx'
import QuestionScreen from './screens/QuestionScreen.jsx'
import ExplanationScreen from './screens/ExplanationScreen.jsx'
import RevealScreen from './screens/RevealScreen.jsx'
import PhilosophyScreen from './screens/PhilosophyScreen.jsx'
import ReportScreen from './screens/ReportScreen.jsx'
import TeacherScreen from './screens/TeacherScreen.jsx'
import Notebook, { NotebookPanel } from './components/Notebook.jsx'
import AchievementPopup from './components/AchievementPopup.jsx'
import { useGame } from './context/GameContext.jsx'
import { resolveInitialScreen, applyMotionEffectsPref } from './utils/storage.js'

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
  sort: 'Sortér sporene',
  question: 'Det gode spørgsmål',
  explanation: 'Byg forklaringen',
  reveal: 'Afslør skyggen',
  philosophy: 'Platons to verdener',
  report: 'Detektivrapport',
  teacher: 'Lærerside',
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
      sidebar={showNotebook ? <NotebookPanel go={go} /> : null}
    >
      {content}
      {showNotebook && <Notebook go={go} currentScreen={screen} />}
      <AchievementPopup />
    </AppShell>
  )
}
