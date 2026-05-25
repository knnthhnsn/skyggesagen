import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import DetectiveSymbol from './DetectiveSymbol.jsx'
import { SYMBOLS } from '../data/caseData.js'

/**
 * Horisontal stil-vælger — centreret snap, uden scroll-kamp mellem swipe og pile.
 */
export default function StyleCarousel({ value, onChange }) {
  const scrollRef = useRef(null)
  const cardRefs = useRef({})
  const isDraggingRef = useRef(false)
  const [edgeFade, setEdgeFade] = useState({ start: true, end: false })
  const selectedIndex = Math.max(0, SYMBOLS.findIndex((s) => s.id === value))
  const selected = SYMBOLS[selectedIndex] || SYMBOLS[0]

  const scrollToId = useCallback((id, behavior = 'smooth') => {
    const root = scrollRef.current
    const el = cardRefs.current[id]
    if (!root || !el) return
    const left = el.offsetLeft - (root.clientWidth - el.offsetWidth) / 2
    root.scrollTo({ left: Math.max(0, left), behavior })
  }, [])

  const syncFromScroll = useCallback(() => {
    if (isDraggingRef.current) return
    const root = scrollRef.current
    if (!root) return
    const centerX = root.scrollLeft + root.clientWidth / 2
    let closestId = value
    let closestDist = Infinity
    SYMBOLS.forEach((s) => {
      const el = cardRefs.current[s.id]
      if (!el) return
      const cardCenter = el.offsetLeft + el.offsetWidth / 2
      const dist = Math.abs(cardCenter - centerX)
      if (dist < closestDist) {
        closestDist = dist
        closestId = s.id
      }
    })
    if (closestId !== value) onChange(closestId)
  }, [onChange, value])

  const updateEdgeFades = useCallback(() => {
    const root = scrollRef.current
    if (!root) return
    const maxScroll = Math.max(0, root.scrollWidth - root.clientWidth)
    setEdgeFade({
      start: root.scrollLeft <= 8,
      end: root.scrollLeft >= maxScroll - 8,
    })
  }, [])

  const pickStyle = useCallback((id) => {
    onChange(id)
    requestAnimationFrame(() => {
      scrollToId(id, 'smooth')
      updateEdgeFades()
    })
  }, [onChange, scrollToId, updateEdgeFades])

  const didInitRef = useRef(false)

  useLayoutEffect(() => {
    if (didInitRef.current) return
    didInitRef.current = true
    scrollToId(value, 'instant')
    updateEdgeFades()
  }, [scrollToId, updateEdgeFades, value])

  useEffect(() => {
    const root = scrollRef.current
    if (!root) return undefined
    let syncTimer

    function onScroll() {
      updateEdgeFades()
      window.clearTimeout(syncTimer)
      syncTimer = window.setTimeout(syncFromScroll, 120)
    }

    function onTouchStart() {
      isDraggingRef.current = true
    }

    function onTouchEnd() {
      isDraggingRef.current = false
      window.clearTimeout(syncTimer)
      syncTimer = window.setTimeout(() => {
        updateEdgeFades()
        syncFromScroll()
      }, 80)
    }

    updateEdgeFades()
    const ro = new ResizeObserver(updateEdgeFades)
    ro.observe(root)

    root.addEventListener('scroll', onScroll, { passive: true })
    root.addEventListener('touchstart', onTouchStart, { passive: true })
    root.addEventListener('touchend', onTouchEnd, { passive: true })
    root.addEventListener('touchcancel', onTouchEnd, { passive: true })
    return () => {
      ro.disconnect()
      root.removeEventListener('scroll', onScroll)
      root.removeEventListener('touchstart', onTouchStart)
      root.removeEventListener('touchend', onTouchEnd)
      root.removeEventListener('touchcancel', onTouchEnd)
      window.clearTimeout(syncTimer)
    }
  }, [syncFromScroll, updateEdgeFades])

  function step(delta) {
    const next = SYMBOLS[selectedIndex + delta]
    if (next) pickStyle(next.id)
  }

  return (
    <div className="symbol-carousel">
      <div
        className={`symbol-carousel-viewport${edgeFade.start ? ' is-at-start' : ''}${edgeFade.end ? ' is-at-end' : ''}`}
      >
        <div className="symbol-scroll-wrap" ref={scrollRef} role="radiogroup" aria-label="Detektivstil">
          <div className="symbol-track">
            {SYMBOLS.map((s) => {
              const isSelected = value === s.id
              return (
                <button
                  key={s.id}
                  ref={(el) => { cardRefs.current[s.id] = el }}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`${s.label}. ${s.tagline}`}
                  className={`symbol-card${isSelected ? ' is-selected' : ''}`}
                  onClick={() => pickStyle(s.id)}
                >
                  <span className="symbol-art" aria-hidden="true">
                    <DetectiveSymbol symbolId={s.id} size="card" />
                  </span>
                  <span className="symbol-card-copy">
                    <span className="symbol-label">{s.label}</span>
                    <span className="symbol-tagline">{s.tagline}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
        <div className="symbol-edge-fade symbol-edge-fade--start" aria-hidden="true" />
        <div className="symbol-edge-fade symbol-edge-fade--end" aria-hidden="true" />
      </div>

      <div className="symbol-carousel-controls">
        <button
          type="button"
          className="symbol-nav-btn"
          onClick={() => step(-1)}
          disabled={selectedIndex <= 0}
          aria-label="Forrige detektivstil"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
        </button>

        <div className="symbol-dots" role="tablist" aria-label="Vælg stil">
          {SYMBOLS.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={value === s.id}
              aria-label={s.label}
              className={`symbol-dot${value === s.id ? ' is-active' : ''}`}
              onClick={() => pickStyle(s.id)}
            />
          ))}
        </div>

        <button
          type="button"
          className="symbol-nav-btn"
          onClick={() => step(1)}
          disabled={selectedIndex >= SYMBOLS.length - 1}
          aria-label="Næste detektivstil"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>

      <p className="symbol-carousel-status" role="status" aria-live="polite">
        <span>{selectedIndex + 1} af {SYMBOLS.length}</span>
        <strong>{selected.label}</strong>
        <span className="symbol-carousel-tagline">{selected.tagline}</span>
      </p>
    </div>
  )
}
