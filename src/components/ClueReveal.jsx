import { useEffect, useRef } from 'react'
import Milo from './Milo.jsx'
import Button from './Button.jsx'

/**
 * Modal-overlay som viser et nyligt fundet spor som et flippet polaroidkort.
 */
export default function ClueReveal({ clue, onClose }) {
  const dialogRef = useRef(null)
  const closeRef = useRef(null)

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const dialog = dialogRef.current
      if (!dialog) return
      const focusable = dialog.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])')
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    if (!clue || typeof document === 'undefined') return undefined
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => closeRef.current?.focus(), 0)
    return () => {
      window.clearTimeout(t)
      document.body.style.overflow = previousOverflow
      if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus()
    }
  }, [clue])

  if (!clue) return null

  return (
    <div
      className="clue-reveal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="clue-title"
      aria-describedby="clue-desc clue-quote"
      onClick={onClose}
    >
      <div className="clue-reveal-card" ref={dialogRef} onClick={(e) => e.stopPropagation()}>
        <div className="clue-reveal-inner">
          <div className="clue-reveal-front">
            <div className="clue-reveal-top">
              <button
                ref={closeRef}
                type="button"
                className="clue-close"
                onClick={onClose}
                aria-label="Luk spor"
              >
                ×
              </button>
              <span className="stamp clue-reveal-stamp">Spor</span>
            </div>
            <h2 className="clue-clue-title" id="clue-title">{clue.title}</h2>
            <p className="clue-clue-text" id="clue-desc">{clue.text}</p>
            <div className="clue-reveal-hero" aria-hidden="true">
              <Milo pose="watching" size="lg" bob decorative />
            </div>
            <p className="clue-clue-quote" id="clue-quote">“{clue.miloLine}”</p>
            <Button onClick={onClose} block>Tilbage til scenen</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
