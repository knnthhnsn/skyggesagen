/**
 * Et lille papirskort med tekst — bruges i sorter-skærmen og som mini-kort i bins.
 */
export default function EvidenceCard({ text, category, selected, status, onClick, mini = false, dataAttrs = {} }) {
  const className = `evidence-card${selected ? ' is-selected' : ''}${status === 'correct' ? ' is-correct' : ''}${status === 'wrong' ? ' is-wrong' : ''}`
  if (mini) {
    return (
      <div className="cat-mini-card" {...dataAttrs}>
        <span className={`stamp stamp-${miniStampColor(category)}`}>{labelFor(category)}</span>
        <div>{text}</div>
      </div>
    )
  }
  return (
    <button
      type="button"
      className={className}
      data-cat={category || ''}
      onClick={onClick}
      {...dataAttrs}
    >
      {text}
    </button>
  )
}

function labelFor(cat) {
  if (cat === 'gæt') return 'Gæt'
  if (cat === 'spor') return 'Spor'
  if (cat === 'bevis') return 'Bevis'
  if (cat === 'spørgsmål') return 'Spørgsmål'
  return ''
}

function miniStampColor(cat) {
  if (cat === 'gæt') return 'yellow'
  if (cat === 'spor') return 'blue'
  if (cat === 'bevis') return 'green'
  if (cat === 'spørgsmål') return 'purple'
  return 'blue'
}
