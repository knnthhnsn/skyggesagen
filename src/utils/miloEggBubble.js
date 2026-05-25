/** Beregn fixed position for Milos hviske-boble ud fra et anchor-element. */
export function computeEggBubblePos(rect) {
  const centerX = rect.left + rect.width / 2
  const vw = window.innerWidth || document.documentElement.clientWidth
  const clampedX = Math.max(120, Math.min(vw - 120, centerX))
  const wantAbove = rect.top > 100
  return {
    x: clampedX,
    y: wantAbove ? rect.top - 10 : rect.bottom + 10,
    placement: wantAbove ? 'above' : 'below',
  }
}
