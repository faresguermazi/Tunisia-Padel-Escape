import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { clubMedia } from '../src/content/clubMedia.ts'
import { hotelMedia } from '../src/content/hotelMedia.ts'

const review = process.argv.includes('--review')
const dist = fileURLToPath(
  new URL(review ? '../dist-review/' : '../dist/', import.meta.url),
)
const files = await readdir(dist, { recursive: true, withFileTypes: true })
const reviewOnly = [
  'Design study',
  'Development visual direction',
  'dev-theme-switcher',
  'data-study',
  'premium-study',
  'dev-review-panel',
  'journey-arrive',
  'journey-destination',
  'rally-pointer',
  'rally-ribbon',
  'rally-marquee',
  'transparent-glass-enter',
  'sunlight-arrive',
  'palette-review',
  'Tabbed color palette',
  'Development layout review',
  'collection-study',
  'cinematic-study',
  'design-comparison',
]
const forbidden = [
  'identity-study',
  ...(review ? [] : reviewOnly),
  'initialGuidancePerGuest',
  'scopeReviewed',
  'Organizer estimate; date not supplied',
]
const localOnlyFiles = [...hotelMedia, ...clubMedia].flatMap((image) =>
  image.usage === 'temporary-local'
    ? [image.src, image.smallSrc]
        .filter(Boolean)
        .map((source) => source.slice(1))
    : [],
)
for (const file of files) {
  if (!file.isFile()) continue
  const filename = path.join(file.parentPath, file.name)
  const relative = path.relative(dist, filename)
  if (localOnlyFiles.includes(relative.split(path.sep).join('/')))
    throw new Error(`Local-only photograph in build: ${relative}`)
  if (
    /^(internal|scripts|src|node_modules|\.git)[/\\]/.test(relative) ||
    /ThemeSwitcher|package-costs/.test(relative)
  )
    throw new Error(`Non-public file in build: ${relative}`)
  if (!/\.(js|css|html|json|map)$/.test(filename)) continue
  const content = await readFile(filename, 'utf8')
  for (const marker of forbidden) {
    if (content.includes(marker))
      throw new Error(`Non-public marker in ${relative}: ${marker}`)
  }
}
console.log(
  review
    ? 'Review guard passed: no private costing inputs or source files.'
    : 'Production guard passed: no theme selector, selector stylesheet or private costing inputs.',
)
