import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ASSET_DIR = path.join(__dirname, '..', 'public', 'assets', 'milo')

const SCENE_FILES = new Set([
  'find-spor.png',
  'i-hulen.png',
  'vender-sig.png',
  'mod-udgangen.png',
  'ude-i-solen.png',
  'milo-poses.png',
])

const WITNESS_FILES = new Set([
  'milo-klassekammerat.png',
  'milo-lærer.png',
  'milo-ven.png',
])

function maxWidthFor(file) {
  if (SCENE_FILES.has(file)) return 1280
  if (WITNESS_FILES.has(file)) return 320
  return 512
}

async function optimizePng(file) {
  const input = path.join(ASSET_DIR, file)
  const before = (await stat(input)).size
  const pipeline = sharp(input).rotate().resize({
    width: maxWidthFor(file),
    withoutEnlargement: true,
  })

  const optimized = await pipeline
    .png({ quality: 82, compressionLevel: 9, palette: true, effort: 10 })
    .toBuffer()

  await sharp(optimized).toFile(input)

  const webpOut = input.replace(/\.png$/i, '.webp')
  await sharp(optimized)
    .webp({ quality: 82, effort: 6 })
    .toFile(webpOut)

  const after = (await stat(input)).size
  const webpSize = (await stat(webpOut)).size
  console.log(
    `${file}: ${Math.round(before / 1024)}KB -> PNG ${Math.round(after / 1024)}KB, WebP ${Math.round(webpSize / 1024)}KB`
  )
}

const files = (await readdir(ASSET_DIR)).filter((f) => f.toLowerCase().endsWith('.png'))
let totalBefore = 0
let totalAfter = 0

for (const file of files) {
  const before = (await stat(path.join(ASSET_DIR, file))).size
  totalBefore += before
  await optimizePng(file)
  totalAfter += (await stat(path.join(ASSET_DIR, file))).size
}

console.log(
  `\nTotal PNG: ${Math.round(totalBefore / 1024)}KB -> ${Math.round(totalAfter / 1024)}KB (${Math.round((1 - totalAfter / totalBefore) * 100)}% mindre)`
)
