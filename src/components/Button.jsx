import { forwardRef } from 'react'
import { playClick } from '../utils/audio.js'

const Button = forwardRef(function Button({
  children,
  variant = 'primary',
  block = false,
  onClick,
  type = 'button',
  disabled = false,
  silent = false,
  ariaLabel,
  className = '',
  ...rest
}, ref) {
  function handle(e) {
    if (disabled) return
    if (!silent) playClick()
    if (onClick) onClick(e)
  }
  const variantClass =
    variant === 'primary' ? 'btn-primary'
    : variant === 'secondary' ? 'btn-secondary'
    : variant === 'yellow' ? 'btn-yellow'
    : 'btn-ghost'
  return (
    <button
      ref={ref}
      type={type}
      className={`btn ${variantClass}${block ? ' btn-block' : ''} ${className}`}
      onClick={handle}
      disabled={disabled}
      aria-label={ariaLabel}
      {...rest}
    >
      {children}
    </button>
  )
})

export default Button
