export default function MiloSpeech({
  children,
  className = '',
  role = 'status',
  live = 'polite',
}) {
  const text = typeof children === 'string'
    ? children.replace(/^Milo:\s*/i, '').replace(/^Milo-tip:\s*/i, 'Tip: ')
    : children

  return (
    <div className={`milo-bubble ${className}`} role={role} aria-live={live}>
      <span className="milo-bubble-speaker">Milo:</span>{' '}
      {text}
    </div>
  )
}
