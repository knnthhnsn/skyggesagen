export default function RewardStamp({ children = 'Sag opklaret', slam = false, className = '' }) {
  return (
    <span className={`reward-stamp${slam ? ' slam' : ''} ${className}`} aria-label={children}>
      {children}
    </span>
  )
}
