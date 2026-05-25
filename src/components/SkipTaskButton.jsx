import { useGame } from '../context/GameContext.jsx'
import { hasPassedScreen } from '../utils/skipTask.js'

export default function SkipTaskButton({ screen, onSkip, label = 'Spring opgaven over' }) {
  const { state, skipTask } = useGame()

  if (!screen || hasPassedScreen(state, screen)) return null

  function handleClick() {
    const ok = window.confirm(
      'Spring opgaven over?\n\nDu kan gå videre i sagen, men opgaven tæller ikke som løst. Du kan vende tilbage og løse den senere.'
    )
    if (!ok) return
    skipTask(screen)
    onSkip?.()
  }

  return (
    <button type="button" className="skip-task-btn" onClick={handleClick}>
      {label}
    </button>
  )
}
