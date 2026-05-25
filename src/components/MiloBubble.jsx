import Milo from './Milo.jsx'
import MiloSpeech from './MiloSpeech.jsx'

/**
 * Talebobbel + Milo i en række. Brug align="left" eller "right".
 */
export default function MiloBubble({
  text,
  pose = 'neutral',
  size = 'sm',
  align = 'left',
  bubbleVariant = '',
  className = '',
  bob = true,
}) {
  return (
    <div className={`milo-row${align === 'right' ? ' reverse' : ''} ${className}`}>
      <Milo pose={pose} size={size} bob={bob} />
      <MiloSpeech className={bubbleVariant}>{text}</MiloSpeech>
    </div>
  )
}
