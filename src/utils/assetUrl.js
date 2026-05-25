const MILO_BASE = `${import.meta.env.BASE_URL || '/'}assets/milo/`

/** Returnerer WebP + PNG URL til et Milo-asset (WebP genereres ved build/optimering). */
export function miloAssetSrc(filename) {
  const png = `${MILO_BASE}${filename}`
  if (!filename.endsWith('.png')) return { png, webp: null }
  return { png, webp: `${MILO_BASE}${filename.replace(/\.png$/i, '.webp')}` }
}

export function miloAssetUrl(filename) {
  return miloAssetSrc(filename).png
}
