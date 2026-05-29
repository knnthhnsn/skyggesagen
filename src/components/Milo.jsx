import { useEffect, useRef, useState } from 'react'
import { useGame } from '../context/GameContext.jsx'
import OptimizedImage from './OptimizedImage.jsx'
import { miloAssetUrl } from '../utils/assetUrl.js'

const POSE_TO_FILE = {
  wave: 'milo-waving.png',
  neutral: 'milo.png',
  adore: 'milo-adore.png',
  thumbs: 'milo-thumbs-hover.png',
  glitter: 'milo-glitter.png',
  side: 'milo-side.png',
  poses: 'milo-poses.png',
  watching: 'milo-watching.png',
  run: 'milo-run.png',
  flying: 'milo-flying.png',
}

const POSE_TO_VIDEO = {
  thumbs: 'milo-thumbs-up.mp4',
  watching: 'milo-store-ojne.mp4',
}

const POSE_ALT = {
  wave: 'Milo mågen vinker',
  neutral: 'Milo mågen som detektiv',
  adore: 'Milo mågen ser undrende ud',
  thumbs: 'Milo mågen giver tommel op',
  glitter: 'Milo mågen fejrer',
  side: 'Milo mågen i profil',
  poses: 'Milo mågen i forskellige positurer',
  watching: 'Milo mågen holder øje med sagen',
  run: 'Milo mågen løber videre i sagen',
  flying: 'Milo mågen flyver af sted med en indsigt',
}

const SIZE_PX = {
  sm: 64,
  md: 110,
  lg: 180,
  xl: 220,
}

/**
 * Milo komponent — robust med fallback hvis billede mangler.
 * Tryk x5 låser easter-egg op (kun sjov, ingen progression-konsekvens).
 * Brug:  <Milo pose="wave" size="lg" bob priority />
 * Brug imageOnly i modaler, hvor PNG foretrækkes frem for video.
 */
export default function Milo({
  pose = 'neutral',
  size = 'md',
  bob = false,
  pulse = false,
  decorative = false,
  priority = false,
  imageOnly = false,
  className = '',
  style,
}) {
  const [errored, setErrored] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [nudge, setNudge] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const miloRef = useRef(null)
  const videoRef = useRef(null)
  const nudgeTimerRef = useRef(null)
  const ctx = useGame()
  const tapMilo = ctx?.tapMilo
  const eggUnlocked = ctx?.state?.miloEggUnlocked || false

  const file = POSE_TO_FILE[pose] || POSE_TO_FILE.neutral
  const videoFile = POSE_TO_VIDEO[pose]
  const videoSrc = videoFile ? miloAssetUrl(videoFile) : null
  const useVideo = !!videoSrc && !videoFailed && !errored && !imageOnly
  const alt = decorative ? '' : (POSE_ALT[pose] || 'Milo mågen')
  const tapLabel = eggUnlocked
    ? `${alt}. Tryk for at høre Milos hvisken igen.`
    : `${alt}. Tryk på Milo og se hvad der sker.`
  const dimension = SIZE_PX[size] || SIZE_PX.md

  function handleTap(e) {
    if (decorative || !tapMilo) return
    e.stopPropagation()
    tapMilo(() => miloRef.current)
    if (nudgeTimerRef.current) window.clearTimeout(nudgeTimerRef.current)
    setNudge(true)
    nudgeTimerRef.current = window.setTimeout(() => setNudge(false), 380)
  }

  function handleKeyDown(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return
    e.preventDefault()
    handleTap(e)
  }

  useEffect(() => {
    setErrored(false)
    setVideoFailed(false)
    setVideoReady(false)
  }, [pose, imageOnly])

  useEffect(() => {
    const root = miloRef.current
    if (!root || !useVideo) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVideoReady(true)
      },
      { rootMargin: '120px', threshold: 0.01 }
    )
    observer.observe(root)
    return () => observer.disconnect()
  }, [useVideo, pose])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !useVideo || !videoReady) return undefined
    video.muted = true
    video.defaultMuted = true
    video.play().catch(() => setVideoFailed(true))
    return undefined
  }, [useVideo, videoReady, videoSrc])

  return (
    <div
      ref={miloRef}
      className={`milo size-${size} pose-${pose}${useVideo ? ' is-video' : ''}${bob ? ' bob' : ''}${pulse ? ' pulse' : ''}${nudge ? ' milo-nudge' : ''} ${className}`}
      style={style}
      aria-hidden={decorative ? 'true' : undefined}
      aria-label={decorative ? undefined : tapLabel}
      role={decorative ? undefined : 'button'}
      tabIndex={decorative ? undefined : 0}
      onClick={decorative ? undefined : handleTap}
      onKeyDown={decorative ? undefined : handleKeyDown}
    >
      {errored ? (
        <div className="milo-fallback" role="img" aria-label={decorative ? undefined : alt}>
          MILO
        </div>
      ) : useVideo ? (
        <>
          {!videoReady && (
            <OptimizedImage
              file={file}
              className="milo-media"
              alt=""
              aria-hidden="true"
              loading={priority ? 'eager' : 'lazy'}
              fetchPriority={priority ? 'high' : undefined}
              width={dimension}
              height={dimension}
              draggable={false}
            />
          )}
          <video
            ref={videoRef}
            className="milo-media milo-video"
            src={videoReady ? videoSrc : undefined}
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
            controls={false}
            controlsList="nodownload noplaybackrate noremoteplayback"
            preload="none"
            width={dimension}
            height={dimension}
            aria-hidden="true"
            tabIndex={-1}
            style={videoReady ? undefined : { position: 'absolute', opacity: 0, pointerEvents: 'none' }}
            onError={() => setVideoFailed(true)}
          />
        </>
      ) : (
        <OptimizedImage
          file={file}
          className="milo-media"
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          width={dimension}
          height={dimension}
          draggable={false}
          onError={() => setErrored(true)}
        />
      )}
    </div>
  )
}
