export default function Badge({ title, desc, isNew = false, locked = false }) {
  const status = locked ? 'Låst' : isNew ? 'Nyt' : null
  const ariaLabel = `${title}${desc ? `. ${desc}` : ''}${status ? `. ${status}` : ''}`

  return (
    <div className={`badge${isNew ? ' is-new' : ''}${locked ? ' is-locked' : ''}`} role="group" aria-label={ariaLabel}>
      <span className="badge-title">
        {title}
        {status && <span className="badge-status" aria-hidden="true">{status}</span>}
      </span>
      {desc && <span className="badge-desc">{desc}</span>}
    </div>
  )
}
