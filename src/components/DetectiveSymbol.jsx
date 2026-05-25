import { SYMBOLS } from '../data/caseData.js'

const BASE = `${import.meta.env.BASE_URL || '/'}assets/milo/`

const BY_ID = Object.fromEntries(SYMBOLS.map((s) => [s.id, s]))

/**
 * Detektivstil — illustration fra assets/milo (ikke SVG-ikoner).
 */
export default function DetectiveSymbol({ glyph, symbolId, size = 'md', className = '' }) {
  const symbol = BY_ID[symbolId] || BY_ID[glyph] || SYMBOLS[0]
  const src = `${BASE}${symbol.image}`

  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      draggable="false"
      className={`detective-style-art size-${size}${className ? ` ${className}` : ''}`}
      loading="eager"
    />
  )
}
