import { SYMBOLS } from '../data/caseData.js'
import OptimizedImage from './OptimizedImage.jsx'

const BY_ID = Object.fromEntries(SYMBOLS.map((s) => [s.id, s]))

/**
 * Detektivstil — illustration fra assets/milo (ikke SVG-ikoner).
 */
export default function DetectiveSymbol({ glyph, symbolId, size = 'md', className = '' }) {
  const symbol = BY_ID[symbolId] || BY_ID[glyph] || SYMBOLS[0]

  return (
    <OptimizedImage
      file={symbol.image}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`detective-style-art size-${size}${className ? ` ${className}` : ''}`}
      loading="lazy"
      decoding="async"
    />
  )
}
