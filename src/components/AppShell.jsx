import { useEffect, useRef } from 'react'

/**
 * AppShell — den ydre ramme om appen.
 *  - Mobile/tablet: enkelt-kolonne phone-frame.
 *  - Desktop (>= 1024px) når `sidebar` er angivet: 2-kolonne layout med
 *    main + persistent sidebar (Skyggebogen).
 */
export default function AppShell({
  children,
  themeNight = false,
  screen,
  sidebar = null,
}) {
  const mainRef = useRef(null)

  useEffect(() => {
    mainRef.current?.focus({ preventScroll: true })
  }, [screen])

  const hasSidebar = !!sidebar

  return (
    <div className="app-frame" data-screen={screen}>
      <div
        className={`app-shell${themeNight ? ' theme-night' : ''}${hasSidebar ? ' has-sidebar' : ''}`}
      >
        <a className="skip-link" href="#app-indhold">Spring til indhold</a>
        <main
          id="app-indhold"
          className="app-main"
          tabIndex="-1"
          ref={mainRef}
          aria-label="Aktuelt indhold"
        >
          {children}
        </main>
        {hasSidebar && (
          <div className="app-sidebar">
            {sidebar}
          </div>
        )}
      </div>
    </div>
  )
}
