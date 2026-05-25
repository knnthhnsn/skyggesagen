import { useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { MILO_LINES } from '../data/caseData.js'

/**
 * Én global hviske-boble — undgår flere portaler og lyd-dobbelttrig.
 */
export default function MiloEggBubble({ pos }) {
  const [layout, setLayout] = useState(pos)

  useLayoutEffect(() => {
    if (!pos) {
      setLayout(null)
      return undefined
    }
    setLayout(pos)

    function update() {
      if (!pos?.anchor) return
      const rect = pos.anchor.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const vw = window.innerWidth || document.documentElement.clientWidth
      const clampedX = Math.max(120, Math.min(vw - 120, centerX))
      const wantAbove = rect.top > 100
      setLayout({
        x: clampedX,
        y: wantAbove ? rect.top - 10 : rect.bottom + 10,
        placement: wantAbove ? 'above' : 'below',
      })
    }

    update()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [pos])

  if (!layout || typeof document === 'undefined') return null

  return createPortal(
    <span
      className={`milo-egg-bubble milo-egg-bubble--${layout.placement}`}
      role="status"
      aria-live="polite"
      style={{ left: `${layout.x}px`, top: `${layout.y}px` }}
    >
      {MILO_LINES.eggHello}
    </span>,
    document.body
  )
}
