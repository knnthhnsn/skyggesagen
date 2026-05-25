import SoundToggle from './SoundToggle.jsx'
import MotionToggle from './MotionToggle.jsx'
import CaseProgress from './CaseProgress.jsx'

export default function Header({
  eyebrow = 'Sandhedsdetektiv',
  name = 'Skyggesagen',
  onBack,
  showProgress = true,
  rightExtra = null,
}) {
  return (
    <>
      <header className="header">
        {onBack ? (
          <button className="header-back" onClick={onBack} aria-label="Tilbage">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
        ) : (
          <span className="header-back" aria-hidden="true" style={{ visibility: 'hidden' }} />
        )}
        <div className="header-title">
          <span className="header-eyebrow">{eyebrow}</span>
          <span className="header-name">{name}</span>
        </div>
        <div className="header-actions">
          {rightExtra}
          <MotionToggle />
          <SoundToggle />
        </div>
      </header>
      {showProgress && (
        <div className="header-progress-wrap">
          <CaseProgress />
        </div>
      )}
    </>
  )
}
