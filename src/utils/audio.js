// Web Audio API — korte, behagelige syntetiske lyde. Aldrig autoplay før brug.
let ctx = null
let masterGain = null
let enabled = true
let initialised = false

function ensureCtx() {
  if (typeof window === 'undefined') return null
  if (ctx) return ctx
  try {
    const Ctor = window.AudioContext || window.webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
    masterGain = ctx.createGain()
    masterGain.gain.value = 0.55
    masterGain.connect(ctx.destination)
    return ctx
  } catch {
    return null
  }
}

export function initAudio() {
  if (initialised) return
  initialised = true
  const c = ensureCtx()
  if (c && c.state === 'suspended') {
    c.resume().catch(() => {})
  }
}

export function setSoundEnabled(value) {
  enabled = !!value
}

export function getSoundEnabled() {
  return enabled
}

function tone({ freq = 440, type = 'sine', duration = 0.18, gain = 0.18, attack = 0.01, release = 0.12, glide = null, delay = 0 } = {}) {
  if (!enabled) return
  const c = ensureCtx()
  if (!c) return
  try {
    if (c.state === 'suspended') c.resume().catch(() => {})
    const start = c.currentTime + delay
    const osc = c.createOscillator()
    const g = c.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, start)
    if (glide) {
      osc.frequency.linearRampToValueAtTime(glide, start + duration)
    }
    g.gain.setValueAtTime(0, start)
    g.gain.linearRampToValueAtTime(gain, start + attack)
    g.gain.linearRampToValueAtTime(0, start + duration + release)
    osc.connect(g)
    g.connect(masterGain)
    osc.start(start)
    osc.stop(start + duration + release + 0.05)
  } catch {
    // ignorer fejl — appen skal ikke crashe
  }
}

function noiseBurst({ duration = 0.25, gain = 0.06, delay = 0, filterFreq = 1200 } = {}) {
  if (!enabled) return
  const c = ensureCtx()
  if (!c) return
  try {
    const start = c.currentTime + delay
    const buffer = c.createBuffer(1, Math.floor(c.sampleRate * duration), c.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
    }
    const src = c.createBufferSource()
    src.buffer = buffer
    const filter = c.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = filterFreq
    const g = c.createGain()
    g.gain.setValueAtTime(gain, start)
    g.gain.linearRampToValueAtTime(0, start + duration)
    src.connect(filter)
    filter.connect(g)
    g.connect(masterGain)
    src.start(start)
    src.stop(start + duration + 0.02)
  } catch {}
}

export function playClick() {
  tone({ freq: 520, type: 'triangle', duration: 0.05, gain: 0.12, release: 0.08 })
}

export function playClue() {
  // Lille glødelyd: to toner glider opad
  tone({ freq: 660, type: 'sine', duration: 0.12, gain: 0.14, glide: 880, release: 0.18 })
  tone({ freq: 990, type: 'sine', duration: 0.18, gain: 0.10, delay: 0.08, release: 0.22 })
}

export function playCorrect() {
  // Varm positiv arpeggio (C major-feel)
  tone({ freq: 523.25, type: 'triangle', duration: 0.12, gain: 0.13 })
  tone({ freq: 659.25, type: 'triangle', duration: 0.12, gain: 0.13, delay: 0.08 })
  tone({ freq: 783.99, type: 'triangle', duration: 0.18, gain: 0.13, delay: 0.16, release: 0.2 })
}

export function playWrong() {
  // Blødt lavt fald — ikke aggressivt
  tone({ freq: 320, type: 'sine', duration: 0.18, gain: 0.12, glide: 220, release: 0.18 })
}

export function playUnlock() {
  // Mekanisk klik + opadgående tone
  noiseBurst({ duration: 0.08, gain: 0.07, filterFreq: 2200 })
  tone({ freq: 440, type: 'triangle', duration: 0.18, gain: 0.12, glide: 880, delay: 0.06, release: 0.2 })
  tone({ freq: 880, type: 'sine', duration: 0.22, gain: 0.10, delay: 0.22, release: 0.3 })
}

export function playSolved() {
  // Lille fanfare: stigende treklang + glød
  tone({ freq: 523.25, type: 'triangle', duration: 0.14, gain: 0.14 })
  tone({ freq: 659.25, type: 'triangle', duration: 0.14, gain: 0.14, delay: 0.1 })
  tone({ freq: 783.99, type: 'triangle', duration: 0.14, gain: 0.14, delay: 0.2 })
  tone({ freq: 1046.5, type: 'sine', duration: 0.4, gain: 0.16, delay: 0.32, release: 0.4 })
}

export function playAchievementStamp() {
  // Tungt sagsstempel + kort, varm sejrsglød.
  noiseBurst({ duration: 0.1, gain: 0.18, filterFreq: 460, delay: 0.02 })
  tone({ freq: 86, type: 'sine', duration: 0.12, gain: 0.22, glide: 58, release: 0.14, delay: 0.02 })
  noiseBurst({ duration: 0.16, gain: 0.07, filterFreq: 1700, delay: 0.13 })
  tone({ freq: 392, type: 'triangle', duration: 0.11, gain: 0.12, delay: 0.2, release: 0.13 })
  tone({ freq: 523.25, type: 'triangle', duration: 0.11, gain: 0.13, delay: 0.28, release: 0.13 })
  tone({ freq: 659.25, type: 'triangle', duration: 0.13, gain: 0.13, delay: 0.36, release: 0.14 })
  tone({ freq: 783.99, type: 'triangle', duration: 0.16, gain: 0.12, delay: 0.45, release: 0.18 })
  tone({ freq: 1046.5, type: 'sine', duration: 0.34, gain: 0.14, delay: 0.55, release: 0.36 })
  tone({ freq: 1567.98, type: 'sine', duration: 0.18, gain: 0.07, delay: 0.67, release: 0.28 })
  noiseBurst({ duration: 0.58, gain: 0.055, filterFreq: 5200, delay: 0.34 })
}

export function playFolderOpen() {
  // Papir-agtig syntetisk åbning
  noiseBurst({ duration: 0.4, gain: 0.05, filterFreq: 900 })
  tone({ freq: 280, type: 'sine', duration: 0.3, gain: 0.08, glide: 380, release: 0.25, delay: 0.05 })
}

export function playWitnessSpeak() {
  // Lille talende glimt — to korte konsonant-toner
  tone({ freq: 360, type: 'triangle', duration: 0.07, gain: 0.10, release: 0.08 })
  tone({ freq: 480, type: 'triangle', duration: 0.07, gain: 0.10, release: 0.08, delay: 0.09 })
}

export function playTimelineTick() {
  // Mekanisk tikkelyd, som et urværk
  tone({ freq: 1100, type: 'square', duration: 0.03, gain: 0.06, release: 0.04 })
  tone({ freq: 760, type: 'square', duration: 0.04, gain: 0.05, release: 0.05, delay: 0.05 })
}

export function playInsight() {
  // Lyse indsigtsklokker — frisk åbning
  tone({ freq: 880, type: 'sine', duration: 0.2, gain: 0.10, release: 0.25 })
  tone({ freq: 1320, type: 'sine', duration: 0.22, gain: 0.10, delay: 0.08, release: 0.3 })
  tone({ freq: 1760, type: 'sine', duration: 0.32, gain: 0.08, delay: 0.18, release: 0.4 })
}

export function playEgg() {
  // Skæv lille trille — easter egg
  tone({ freq: 540, type: 'triangle', duration: 0.08, gain: 0.10 })
  tone({ freq: 720, type: 'triangle', duration: 0.08, gain: 0.10, delay: 0.06 })
  tone({ freq: 980, type: 'triangle', duration: 0.12, gain: 0.10, delay: 0.12, release: 0.18 })
  tone({ freq: 660, type: 'sine', duration: 0.2, gain: 0.08, delay: 0.22, release: 0.25 })
}
