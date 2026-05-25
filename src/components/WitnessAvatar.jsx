import { useState } from 'react'
import OptimizedImage from './OptimizedImage.jsx'

/**
 * Lille SVG-portræt af et vidne. Genereres ud fra portrait-konfig i caseData.
 */
export default function WitnessAvatar({ portrait, image, size = 88, speaking = false }) {
  const [imageErrored, setImageErrored] = useState(false)
  const { skin = '#f6cfae', hair = '#3a2615', accessory, accessoryColor = '#357fc4' } = portrait || {}

  return (
    <div className={`witness-avatar${speaking ? ' is-speaking' : ''}`} style={{ width: size, height: size }} aria-hidden="true">
      {image && !imageErrored ? (
        <OptimizedImage
          file={image}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          width={size}
          height={size}
          onError={() => setImageErrored(true)}
        />
      ) : (
        <svg viewBox="0 0 100 100" width={size} height={size}>
          <defs>
            <radialGradient id={`bg-${accessory || 'none'}`} cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="rgba(255,250,240,0.92)" />
              <stop offset="100%" stopColor="rgba(255,250,240,0.55)" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill={`url(#bg-${accessory || 'none'})`} stroke="rgba(31,41,51,0.10)" strokeWidth="1" />
          {/* shoulders */}
          <path d="M14 96c4-16 16-26 36-26s32 10 36 26" fill={accessoryColor} opacity="0.85" />
          {/* neck */}
          <rect x="44" y="60" width="12" height="14" rx="3" fill={skin} />
          {/* head */}
          <ellipse cx="50" cy="46" rx="20" ry="22" fill={skin} />
          {/* hair base */}
          {accessory === 'braids' ? (
            <>
              <path d="M30 36c2-12 12-20 20-20s18 8 20 20c-3-2-7-3-12-3-5 3-12 4-18 1-3-1-7-1-10 2Z" fill={hair} />
              <ellipse cx="32" cy="58" rx="3" ry="10" fill={hair} />
              <ellipse cx="68" cy="58" rx="3" ry="10" fill={hair} />
              <circle cx="32" cy="68" r="2.4" fill={accessoryColor} />
              <circle cx="68" cy="68" r="2.4" fill={accessoryColor} />
            </>
          ) : (
            <path d="M30 38c2-13 12-22 20-22s18 9 20 22c-4-2-9-3-14-3-6 1-12 2-18 1-3 0-6 1-8 2Z" fill={hair} />
          )}
          {/* eyes */}
          <ellipse cx="42" cy="48" rx="1.6" ry="2.2" fill="#1f2933" />
          <ellipse cx="58" cy="48" rx="1.6" ry="2.2" fill="#1f2933" />
          {/* mouth */}
          <path d="M45 56c2 2 8 2 10 0" stroke="#3a2615" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* glasses */}
          {accessory === 'glasses' && (
            <g stroke={accessoryColor} strokeWidth="1.6" fill="none">
              <circle cx="42" cy="48" r="6" />
              <circle cx="58" cy="48" r="6" />
              <line x1="48" y1="48" x2="52" y2="48" />
              <line x1="36" y1="46" x2="32" y2="44" />
              <line x1="64" y1="46" x2="68" y2="44" />
            </g>
          )}
          {/* cap */}
          {accessory === 'cap' && (
            <g>
              <path d="M28 32c4-12 14-18 22-18s18 6 22 18l-44 0Z" fill={accessoryColor} />
              <rect x="28" y="32" width="44" height="3" rx="1" fill={accessoryColor} />
              <ellipse cx="50" cy="36" rx="10" ry="2" fill={accessoryColor} opacity="0.7" />
            </g>
          )}
        </svg>
      )}
    </div>
  )
}
