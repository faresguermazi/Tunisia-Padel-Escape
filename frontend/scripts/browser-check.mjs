import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build, createServer, preview } from 'vite'
import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import { trip } from '../src/content/trip.ts'
import { clubMedia } from '../src/content/clubMedia.ts'
import { hotelMedia } from '../src/content/hotelMedia.ts'

// All browser QA in one invocation: no temporary source scripts or tool installs.
const root = fileURLToPath(new URL('../', import.meta.url))
const screenshots = path.join(os.tmpdir(), 'tunisia-padel-browser-check')
const sections = [
  'invitation',
  'padel',
  'on-the-court',
  'stays',
  'the-details',
  'next',
]
const localOnly = [...hotelMedia, ...clubMedia].filter(
  (image) => image.usage === 'temporary-local',
)
let dev
let production
let browser

function url(server) {
  const address = server.httpServer.address()
  assert.ok(address && typeof address !== 'string')
  return `http://127.0.0.1:${address.port}/`
}

async function closeServer(server) {
  await new Promise((resolve, reject) => {
    server.httpServer.close((error) => (error ? reject(error) : resolve()))
    server.httpServer.closeAllConnections()
  })
}

const noOverflow = (page) =>
  page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)

async function loadEverything(page) {
  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach((image) => {
      image.loading = 'eager'
    })
    await document.fonts.ready
  })
}

/** The checks that apply to every build of the single presentation. */
async function checkPresentation(page, base, label) {
  await page.goto(base, { waitUntil: 'networkidle' })
  for (const id of sections)
    assert.equal(
      await page.locator(`main #${id}`).count(),
      1,
      `${label} #${id}`,
    )
  assert.equal(await page.locator('.vs').count(), 0, 'No version switcher')
  assert.equal(
    await page.locator('a[href*="ftt.tn"]').count(),
    0,
    'No federation link',
  )
  const text = await page.locator('main').innerText()
  assert.ok(!text.includes('Serious padel, by the sea'), 'Old headline is gone')
  assert.ok(text.includes('September 2026'), 'FIP hosting is shown')
  const reel = page.locator('.club-video')
  assert.equal(await reel.count(), 1)
  assert.equal(await reel.getAttribute('href'), trip.club.video.url)
  assert.equal(await reel.getAttribute('target'), '_blank')
  assert.match(await reel.getAttribute('rel'), /noopener/)
  assert.equal(await page.locator('.club-video video, iframe').count(), 0)
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    assert.equal(await noOverflow(page), true, `${label} overflow at ${width}`)
    if (width === 390 || width === 1440) {
      const audit = await new AxeBuilder({ page }).analyze()
      assert.deepEqual(
        audit.violations,
        [],
        `${label} accessibility at ${width}`,
      )
      await page.locator('#padel').screenshot({
        path: path.join(screenshots, `${label}-${width}-padel.png`),
      })
    }
  }
}

async function checkInteractions(page, base) {
  await page.setViewportSize({ width: 1440, height: 900 })
  // Stay gallery: buttons and keyboard
  await page.goto(base, { waitUntil: 'networkidle' })
  const carousel = page.locator('.xs-carousel').first()
  const count = carousel.locator('.xs-count')
  const first = await count.innerText()
  await carousel
    .getByRole('button', { name: 'Next photograph', exact: true })
    .click()
  assert.notEqual(await count.innerText(), first)
  await carousel.locator('.xs-track').focus()
  await page.keyboard.press('ArrowLeft')
  assert.equal(await count.innerText(), first)
  // Package cards select the matching stay
  await page.locator('.package-quote').last().getByRole('link').click()
  assert.equal(
    await page
      .locator('#bd-tab-four-seasons-tunis')
      .getAttribute('aria-selected'),
    'true',
  )
  await page.locator('#bd-tab-villa-la-marsa').click()
  await page.locator('.package-quote').last().getByRole('link').click()
  assert.equal(
    await page
      .locator('#bd-tab-four-seasons-tunis')
      .getAttribute('aria-selected'),
    'true',
  )
  // Direct link
  await page.goto(`${base}#villa-la-marsa`, { waitUntil: 'networkidle' })
  assert.equal(
    await page.locator('#bd-tab-villa-la-marsa').getAttribute('aria-selected'),
    'true',
  )
  // Mobile navigation
  await page.setViewportSize({ width: 390, height: 900 })
  await page.goto(base, { waitUntil: 'networkidle' })
  await page
    .getByRole('button', { name: 'Open chapter navigation', exact: true })
    .click()
  await page
    .getByRole('navigation', { name: 'Chapters' })
    .locator('a[href="#padel"]')
    .click()
  assert.equal(new URL(page.url()).hash, '#padel')
  // Closing doors: closed while pinned, resting at the end
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  const closing = page.locator('.hybrid-closing')
  await closing.evaluate((element) =>
    window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY),
  )
  await page.waitForFunction(
    () =>
      Number(
        document.querySelector('.hybrid-closing').style.getPropertyValue('--p'),
      ) < 0.1,
  )
  await closing.evaluate((element) =>
    window.scrollTo(
      0,
      element.getBoundingClientRect().bottom + window.scrollY - innerHeight,
    ),
  )
  await page.waitForFunction(
    () =>
      Number(
        document.querySelector('.hybrid-closing').style.getPropertyValue('--p'),
      ) > 0.99,
  )
  // Club cards rise in with motion, and are never hidden for reduced motion
  await page.goto(base, { waitUntil: 'networkidle' })
  await page.locator('.cm-grid').scrollIntoViewIfNeeded()
  await page.waitForFunction(() =>
    document.querySelector('.cm-grid').classList.contains('is-in'),
  )
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(base, { waitUntil: 'networkidle' })
  for (const card of await page.locator('.cm-card').all())
    assert.equal(await card.evaluate((el) => getComputedStyle(el).opacity), '1')
}

try {
  await mkdir(screenshots, { recursive: true })

  // Development: real club photographs are available locally.
  process.env.NODE_ENV = 'development'
  dev = await createServer({
    root,
    server: { host: '127.0.0.1', port: 0, strictPort: true },
  })
  await dev.listen()
  browser = await chromium.launch({ channel: 'msedge', headless: true })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: 'reduce',
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await checkPresentation(page, url(dev), 'dev')
  await loadEverything(page)
  const heroImage = page.locator('.cm-hero > img')
  assert.equal(await heroImage.count(), 1)
  assert.ok(
    (await heroImage.getAttribute('src')).includes('/media/padel/club/'),
  )
  assert.equal(
    await page.locator('.cm-credit').count(),
    0,
    'No caption over real club photography',
  )
  assert.ok(
    await heroImage.evaluate((img) => img.complete && img.naturalWidth > 0),
  )
  await checkInteractions(page, url(dev))
  await page.goto(`${url(dev)}?direction=club`, { waitUntil: 'networkidle' })
  assert.equal(await page.locator('.vs, .evo, .ch').count(), 0)
  await dev.close()
  dev = undefined

  // Production: no local-only photographs, no review or study code.
  process.env.NODE_ENV = 'production'
  await build({ root })
  production = await preview({
    root,
    preview: { host: '127.0.0.1', port: 0, strictPort: true },
  })
  const base = url(production)
  await checkPresentation(page, base, 'production')
  assert.ok(
    (await page.locator('.cm-credit').innerText()).includes('club photography'),
    'Stand-in image is labelled in production',
  )
  for (const photo of localOnly) {
    for (const source of [photo.src, photo.smallSrc].filter(Boolean)) {
      const response = await page.request.get(`${base}${source.slice(1)}`)
      const type = response.headers()['content-type'] ?? ''
      assert.ok(
        response.status() === 404 || type.includes('text/html'),
        `${source} must not be served`,
      )
    }
  }
  await page.goto(`${base}?study=identity`, { waitUntil: 'networkidle' })
  assert.equal(await page.locator('.identity-study').count(), 0)
  await checkInteractions(page, base)
  await closeServer(production)

  // Review build: same presentation, noindex.
  await build({ root, mode: 'review' })
  production = await preview({
    root,
    mode: 'review',
    preview: { host: '127.0.0.1', port: 0, strictPort: true },
  })
  await page.goto(url(production), { waitUntil: 'networkidle' })
  assert.equal(
    await page.locator('meta[name="robots"]').getAttribute('content'),
    'noindex, nofollow',
  )
  assert.equal(await page.locator('.vs').count(), 0)
  assert.equal(await noOverflow(page), true)
  assert.deepEqual(errors, [])
  console.log(
    '\nBrowser QA passed: single Petrol & doors presentation in development, production and review; club chapter, reel link, galleries, deep links, navigation, closing doors, reduced motion, accessibility, overflow and local-photo privacy.',
  )
  console.log(`Screenshots: ${screenshots}`)
} finally {
  await browser?.close()
  await dev?.close()
  if (production) await closeServer(production)
}
