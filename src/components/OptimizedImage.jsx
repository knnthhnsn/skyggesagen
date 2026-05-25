import { useEffect, useState } from 'react'
import { miloAssetSrc } from '../utils/assetUrl.js'

/**
 * Billede med WebP-first og PNG-fallback. Bruges til store Milo-assets.
 */
export default function OptimizedImage({
  file,
  alt = '',
  className = '',
  loading = 'lazy',
  fetchPriority,
  decoding = 'async',
  draggable = false,
  width,
  height,
  onError,
  ...rest
}) {
  const { png, webp } = miloAssetSrc(file)
  const [src, setSrc] = useState(webp || png)

  useEffect(() => {
    setSrc(webp || png)
  }, [png, webp])

  function handleError(e) {
    if (webp && src === webp) {
      setSrc(png)
      return
    }
    onError?.(e)
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding={decoding}
      draggable={draggable}
      width={width}
      height={height}
      onError={handleError}
      {...rest}
    />
  )
}
