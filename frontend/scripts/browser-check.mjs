import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build, createServer, preview } from 'vite'
import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import { trip } from '../src/content/trip.ts'

// All browser QA in one invocation: no temporary source scripts or tool installs.
const root = fileURLToPath(new URL('../', import.meta.url))
const screenshots = path.join(os.tmpdir(), 'tunisia-padel-browser-check')
let dev
let production
let browser
function url(server) {
  const address = server.httpServer.address()
  assert.ok(address && typeof address !== 'string')
  return `http://127.0.0.1:${address.port}/`
}

async function closePreview(server) {
  await new Promise((resolve, reject) => {
    server.httpServer.close((error) => (error ? reject(error) : resolve()))
    server.httpServer.closeAllConnections()
  })
}

try {
  await mkdir(screenshots, { recursive: true })
  process.env.NODE_ENV = 'development'
  dev = await createServer({
    root,
    server: { host: '127.0.0.1', port: 0, strictPort: true },
    plugins: [
      {
        name: 'browser-qa-gallery-fixture',
        configureServer(server) {
          server.middlewares.use(
            '/__qa/gallery',
            async (_request, response, next) => {
              try {
                const html = await server.transformIndexHtml(
                  '/__qa/gallery',
                  `<!doctype html><html lang="en"><head><title>Gallery QA fixture</title></head><body><div id="gallery-fixture"></div><script type="module">
            import * as ReactModule from '/node_modules/.vite/deps/react.js';
            import * as ClientModule from '/node_modules/.vite/deps/react-dom_client.js';
            const { createElement } = ReactModule.default || ReactModule;
            const { createRoot } = ClientModule.default || ClientModule;
            import { Gallery } from '/src/shared/components/Gallery.tsx';
            import { AccommodationCollection } from '/src/features/accommodations/AccommodationCollection.tsx';
            import { trip } from '/src/content/trip.ts';
            import { media } from '/src/content/media.ts';
            import '/src/shared/styles/index.css';
            const selectedId = trip.accommodations[1].id;
            const fixture = location.search === '?selected'
              ? createElement(AccommodationCollection, { content: { ...trip.stays, selectedAccommodationId: selectedId, preferredAccommodationId: selectedId }, options: trip.accommodations, hotel: trip.hotel, media })
              : createElement(Gallery, { images: media.filter(item => item.kind === 'image' && item.context === 'editorial').slice(0, 2), label: 'Editorial gallery QA fixture' });
            createRoot(document.getElementById('gallery-fixture')).render(fixture);
          </script></body></html>`,
                )
                response.setHeader('Content-Type', 'text/html')
                response.end(html)
              } catch (error) {
                next(error)
              }
            },
          )
        },
      },
    ],
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
  await page.goto(url(dev), { waitUntil: 'networkidle' })
  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach((image) => {
      image.loading = 'eager'
    })
    await document.fonts.ready
    await Promise.all([...document.images].map((image) => image.decode()))
  })
  const propertyPhotos = trip.media.filter(
    (item) => item.kind === 'image' && item.context === 'property',
  )
  if (propertyPhotos.length) {
    const sheet = await page.evaluate(async (photos) => {
      const canvas = document.createElement('canvas')
      canvas.width = 1200
      canvas.height = Math.ceil(photos.length / 4) * 230
      const context = canvas.getContext('2d')
      context.fillStyle = '#f5f0e5'
      context.fillRect(0, 0, canvas.width, canvas.height)
      const dimensions = []
      for (const [index, photo] of photos.entries()) {
        const image = new Image()
        image.src = photo.src
        await image.decode()
        dimensions.push({
          id: photo.id,
          width: image.naturalWidth,
          height: image.naturalHeight,
        })
        const scale = Math.min(
          280 / image.naturalWidth,
          170 / image.naturalHeight,
        )
        const x = (index % 4) * 300
        const y = Math.floor(index / 4) * 230
        context.drawImage(
          image,
          x + 10,
          y,
          image.naturalWidth * scale,
          image.naturalHeight * scale,
        )
        context.fillStyle = '#123d49'
        context.font = '12px sans-serif'
        context.fillText(photo.id, x + 10, y + 190, 280)
        context.fillText(photo.caption, x + 10, y + 208, 280)
      }
      return { dataUrl: canvas.toDataURL('image/png'), dimensions }
    }, propertyPhotos)
    await writeFile(
      path.join(screenshots, 'property-contact-sheet.png'),
      Buffer.from(sheet.dataUrl.split(',')[1], 'base64'),
    )
    assert.deepEqual(
      sheet.dimensions,
      propertyPhotos.map((photo) => ({
        id: photo.id,
        width: photo.width,
        height: photo.height,
      })),
    )
  }
  assert.deepEqual(
    await page
      .locator('main > section')
      .evaluateAll((sections) => sections.map((section) => section.id)),
    ['invitation', ...trip.navigation.map((item) => item.id)],
  )
  assert.match(
    await page.locator('.hero-facts').innerText(),
    new RegExp(`${trip.guestCount} guests`),
  )
  assert.equal(
    await page.locator('#experience, [href="#experience"]').count(),
    0,
  )
  assert.equal(
    await page.locator('.gallery-empty').count(),
    [...trip.accommodations, trip.hotel].filter(
      (option) => !option.mediaIds.length,
    ).length,
  )

  assert.equal(await page.locator('.dev-review-panel').count(), 0)
  assert.equal(await page.locator('.breakfast-note').count(), 0)
  assert.equal(
    await page.locator('.breakfast-slot, .session-details').count(),
    0,
  )
  assert.equal(
    await page.getByRole('button', { name: 'Reference', exact: true }).count(),
    0,
  )
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: width < 700 ? 844 : 1000 })
    for (const approach of ['collection']) {
      {
        const formats = page.getByRole('tablist', {
          name: 'Accommodation format',
        })
        await formats
          .getByRole('tab', { name: trip.hotel.name, exact: true })
          .click()
        assert.equal(
          await page.locator('#four-seasons-tunis').isVisible(),
          true,
        )
        if ((width === 390 || width === 1440) && trip.hotel.mediaIds.length) {
          const hotelPanel = page.locator('#four-seasons-tunis')
          await hotelPanel.locator('img').evaluateAll(async (images) => {
            images.forEach((image) => {
              image.loading = 'eager'
            })
            await Promise.all(images.map((image) => image.decode()))
          })
          await hotelPanel.screenshot({
            path: path.join(screenshots, `${width}-${approach}-hotel.png`),
          })
          const hotelTrigger = hotelPanel.locator('.gallery-image').first()
          await hotelTrigger.click()
          await page.keyboard.press('ArrowRight')
          assert.match(
            await hotelPanel.locator('.lightbox-caption').innerText(),
            /illustrative category/,
          )
          await page.keyboard.press('Escape')
          assert.equal(
            await hotelTrigger.evaluate(
              (element) => element === document.activeElement,
            ),
            true,
          )
          const hotelAccessibility = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
            .analyze()
          assert.deepEqual(
            hotelAccessibility.violations.map((item) => ({
              id: item.id,
              targets: item.nodes.map((node) => node.target),
            })),
            [],
            `${width}/${approach}/hotel`,
          )
        }
        await formats.getByRole('tab', { name: 'Villas', exact: true }).click()
        const villas = page.getByRole('tablist', { name: 'Villa choices' })
        await villas.getByRole('tab').first().focus()
        await page.keyboard.press('ArrowRight')
        assert.equal(
          await villas.getByRole('tab').nth(1).getAttribute('aria-selected'),
          'true',
        )
        const recommendedTab = villas.getByRole('tab').first()
        assert.equal(
          await recommendedTab.getAttribute('aria-selected'),
          'false',
        )
        assert.equal(await recommendedTab.locator('.tab-star').count(), 1)
        assert.equal(
          await recommendedTab.evaluate(
            (element) => getComputedStyle(element).backgroundColor,
          ),
          'rgb(232, 237, 204)',
        )
        await page.keyboard.press('End')
        assert.equal(
          await villas.getByRole('tab').last().getAttribute('aria-selected'),
          'true',
        )
        await page.keyboard.press('Home')
        assert.equal(
          await villas.getByRole('tab').first().getAttribute('aria-selected'),
          'true',
        )
      }
      const details = await page
        .locator('.property-details > summary:visible')
        .all()
      for (const summary of details) await summary.click()
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        `Overflow: ${width}/${approach} ${JSON.stringify(
          await page.evaluate(() =>
            [...document.querySelectorAll('main *')]
              .filter(
                (element) =>
                  element.getBoundingClientRect().right > innerWidth + 1,
              )
              .slice(0, 6)
              .map((element) => ({
                tag: element.tagName,
                class: element.className,
                right: element.getBoundingClientRect().right,
              })),
          ),
        )}`,
      )
      assert.equal(
        await page
          .locator('.accommodation-copy:visible')
          .first()
          .evaluate((element) => getComputedStyle(element).display),
        'block',
      )
      // Regression: the hero has transparent CSS background and light text.
      // The header must never inherit that light text onto the fallback cream.
      for (const offset of [72, 120, 550, 720, 900]) {
        await page.evaluate(
          (y) => window.scrollTo({ top: y, behavior: 'instant' }),
          offset,
        )
        await page.waitForTimeout(60)
        const contrast = await page
          .locator('.site-header')
          .evaluate((header) => {
            const style = getComputedStyle(header)
            const luminance = (color) => {
              const rgb = color
                .match(/[\d.]+/g)
                .slice(0, 3)
                .map(Number)
                .map((v) => {
                  v /= 255
                  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
                })
              return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722
            }
            const a = luminance(style.backgroundColor),
              b = luminance(style.color)
            return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
          })
        assert.ok(
          contrast >= 4.5,
          `Header contrast ${contrast} in ${approach} at ${offset}`,
        )
      }
      assert.equal(await page.locator('.transparent-closing').count(), 1)
      assert.equal(await page.locator('.stay-package-price').count(), 0)
      assert.deepEqual(
        await page.locator('.property-index').allTextContents(),
        ['01', '02', '03'],
      )
      const galleryEdges = await page
        .locator('.accommodation-visual')
        .evaluateAll((elements) =>
          elements.map((element) => ({
            width: getComputedStyle(element).borderTopWidth,
            color: getComputedStyle(element).borderTopColor,
          })),
        )
      assert.ok(
        galleryEdges.every(
          (edge) => edge.width === '2px' && edge.color === 'rgb(120, 158, 42)',
        ),
      )

      assert.equal(await page.locator('.nav-date').count(), 0)
      assert.equal(await page.locator('.padel-value > div').count(), 4)
      assert.deepEqual(
        await page.locator('.padel-value dt').allTextContents(),
        ['3 padel mornings', '2 courts', '2 professional coaches', 'Americano'],
      )
      assert.equal(await page.locator('.hero-facts > span').count(), 3)
      assert.equal(await page.locator('.hero-bottom').count(), 0)

      assert.match(
        await page.locator('.padel-value').innerText(),
        /2 professional coaches/,
      )
      assert.match(
        await page.locator('.trip-day--padel').last().innerText(),
        /Coaching \/ 1 h/,
      )
      assert.equal(await page.locator('#next .tunisia-detail').count(), 0)
      assert.match(
        await page.locator('.escape-inclusions').innerText(),
        /3 breakfasts/,
      )
      assert.equal(await page.locator('.package-quote details').count(), 0)
      assert.equal(
        await page.locator('.package-quote .hotel-transfer-note').count(),
        1,
      )
      assert.equal(await page.locator('.transfer-hotel-note').count(), 0)
      assert.match(
        await page.locator('.escape-inclusions').innerText(),
        /2 professional coaches/,
      )

      assert.equal(
        await page
          .getByRole('tablist', { name: 'Villa choices' })
          .evaluate((el) => getComputedStyle(el).justifyContent),
        'flex-start',
      )

      assert.match(
        await page.locator('.trip-day--padel').last().innerText(),
        /Americano \/ 2 h with local players/,
      )
      assert.doesNotMatch(
        await page
          .locator('.session-points')
          .allTextContents()
          .then((items) => items.join(' ')),
        /~|Possible/,
      )
      assert.equal(
        await page.locator('.program-notes, .planner-media-note').count(),
        0,
      )
      assert.equal(await page.locator('.afternoon-options').count(), 3)
      assert.equal(await page.locator('.day-breakfast').count(), 3)
      for (const day of await page.locator('.trip-day--padel').all()) {
        assert.equal(
          await day.locator('.slot-label + .day-breakfast').count(),
          1,
          'Breakfast follows the morning heading',
        )
      }
      for (const chapter of [
        trip.club,
        trip.program,
        trip.stays,
        trip.budget,
        trip.next,
      ]) {
        assert.equal(
          await page.locator(`#${chapter.id}-title`).innerText(),
          trip.navigation.find((item) => item.id === chapter.id).label,
        )
      }
      assert.equal(await page.locator('.afternoon-options li').count(), 6)
      assert.equal(await page.locator('.club-note p').count(), 0)

      assert.match(
        await page.locator('.transfer-story').innerText(),
        /minibus/i,
      )
      assert.match(
        await page.locator('.transfer-story').innerText(),
        /8-passenger minivan/,
      )
      assert.doesNotMatch(await page.locator('main').innerText(), /packages?/i)
      assert.equal(await page.locator('.next-steps-list > li').count(), 4)
      assert.equal(await page.locator('.trip-day').count(), 5)
      assert.equal(await page.locator('.open-afternoon').count(), 3)
      assert.equal(
        await page
          .locator(
            '#between-sessions, .hero-court, .brand-symbol, .program-photo',
          )
          .count(),
        0,
      )
      assert.equal(
        await page
          .locator(
            '.accommodation-chapter a[href*="airbnb"], .accommodation-chapter a[href*="fourseasons"]',
          )
          .count(),
        0,
      )
      assert.equal(await page.locator('img[src*="padel-player"]').count(), 0)
      assert.deepEqual(
        await page
          .locator('.trip-day time')
          .evaluateAll((nodes) => nodes.map((node) => node.dateTime)),
        trip.program.schedule.map((day) => day.date),
      )
      if (width === 390 || width === 1440) {
        const result = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze()
        assert.deepEqual(
          result.violations.map((violation) => ({
            id: violation.id,
            nodes: violation.nodes.map((node) => ({
              target: node.target,
              summary: node.failureSummary,
            })),
          })),
          [],
          `${width}/${approach}`,
        )
      }
      for (const summary of details) await summary.click()
      if (width === 1440 || width === 390) {
        await page.locator('#padel').screenshot({
          path: path.join(screenshots, `${width}-padel-club.png`),
        })
        await page.evaluate(() => {
          document.activeElement?.blur()
          window.scrollTo(0, 0)
        })
        await page.screenshot({
          path: path.join(
            screenshots,
            `${width}-${approach}-refinement-hero.png`,
          ),
        })
        await page.locator('#stays').screenshot({
          path: path.join(
            screenshots,
            `${width}-${approach}-refinement-accommodation.png`,
          ),
        })
      }
    }
  }
  await page.setViewportSize({ width: 390, height: 844 })
  await page
    .getByRole('button', { name: 'Open chapter navigation', exact: true })
    .click()
  await page
    .getByRole('navigation', { name: 'Chapters' })
    .getByRole('link', { name: trip.navigation[0].label, exact: true })
    .click()
  assert.equal(new URL(page.url()).hash, `#${trip.club.id}`)
  await page.goto(new URL('/__qa/gallery', url(dev)).href, {
    waitUntil: 'networkidle',
  })
  const trigger = page.locator('.gallery-image').first()
  await trigger.click()
  const dialog = page.getByRole('dialog')
  const stage = dialog.locator('.lightbox-stage')
  const before = await stage.locator('img').getAttribute('src')
  await page.keyboard.press('ArrowRight')
  assert.notEqual(await stage.locator('img').getAttribute('src'), before)
  for (let index = 0; index < 10; index++) {
    await page.keyboard.press('Tab')
    assert.equal(
      await dialog.evaluate((element) =>
        element.contains(document.activeElement),
      ),
      true,
    )
  }
  const swipeBefore = await stage.locator('img').getAttribute('src')
  for (const [type, clientX] of [
    ['touchstart', 300],
    ['touchend', 100],
  ]) {
    await stage.evaluate(
      (element, { type, clientX }) =>
        element.dispatchEvent(
          new TouchEvent(type, {
            bubbles: true,
            changedTouches: [
              new Touch({
                identifier: 1,
                target: element,
                clientX,
                clientY: 250,
              }),
            ],
          }),
        ),
      { type, clientX },
    )
  }
  assert.notEqual(await stage.locator('img').getAttribute('src'), swipeBefore)
  await page.keyboard.press('Escape')
  assert.equal(await dialog.isVisible(), false)
  assert.equal(
    await trigger.evaluate((element) => element === document.activeElement),
    true,
  )
  assert.equal(
    await page.locator('body').evaluate((element) => element.style.overflow),
    '',
  )
  await page.goto(new URL('/__qa/gallery?selected', url(dev)).href, {
    waitUntil: 'networkidle',
  })
  await page.locator(`#${trip.accommodations[1].id}`).waitFor()
  assert.equal(await page.locator('.accommodation-chapter').count(), 1)
  assert.equal(
    await page
      .locator(
        '[role="tab"], .property-perspective, .villa-format-details, .collection-recommendation',
      )
      .count(),
    0,
  )
  assert.equal(await page.locator('.stay-recommendation').count(), 1)
  await page.goto(url(dev), { waitUntil: 'networkidle' })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.locator('.trip-day--padel').first().scrollIntoViewIfNeeded()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.waitForFunction(() =>
    document
      .getAnimations()
      .every((animation) => animation.playState !== 'running'),
  )
  assert.equal(
    await page
      .locator('.trip-day--padel')
      .first()
      .evaluate((element) => getComputedStyle(element).animationName),
    'none',
  )
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.waitForFunction(
    () => document.documentElement.dataset.rallyMotion === 'on',
  )
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.mouse.move(950, 400)
  await page.waitForFunction(() =>
    document.documentElement.classList.contains('has-ball-cursor'),
  )
  await page.screenshot({
    path: path.join(screenshots, 'rally-interactive-hero.png'),
    animations: 'disabled',
  })
  await page.locator('#stays .gallery-image:visible').first().click()
  await page.locator('dialog[open]').waitFor()
  await page.waitForFunction(
    () => !document.documentElement.classList.contains('has-ball-cursor'),
  )
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Pause motion', exact: true }).click()
  await page.waitForFunction(
    () => document.documentElement.dataset.rallyMotion === 'off',
  )
  await page.waitForFunction(() =>
    document
      .getAnimations()
      .every((animation) => animation.playState !== 'running'),
  )
  assert.equal(
    await page
      .locator('html')
      .evaluate((element) => element.classList.contains('has-ball-cursor')),
    false,
  )
  await page.getByRole('button', { name: 'Resume motion', exact: true }).click()
  await page.waitForFunction(
    () => document.documentElement.dataset.rallyMotion === 'on',
  )
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.waitForFunction(
    () => document.documentElement.dataset.rallyMotion === 'off',
  )
  assert.equal(
    await page
      .getByRole('button', { name: 'Reduced motion', exact: true })
      .isDisabled(),
    true,
  )
  const touchContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'no-preference',
  })
  try {
    const touchPage = await touchContext.newPage()
    await touchPage.goto(url(dev), { waitUntil: 'networkidle' })
    const brand = touchPage.locator('.site-header .brand-mark')
    await brand.waitFor()
    assert.equal(
      await brand.evaluate((element) => {
        const animation = element.getAnimations()[0]
        if (!animation) return false
        const timing = animation.effect.getTiming()
        animation.pause()
        animation.currentTime = 1200
        const first = getComputedStyle(element).transform
        animation.currentTime = 3100
        const second = getComputedStyle(element).transform
        animation.finish()
        return (
          timing.iterations === 1 && timing.duration <= 5000 && first !== second
        )
      }),
      true,
    )
    await touchPage.emulateMedia({ reducedMotion: 'reduce' })
    assert.equal(
      await brand.evaluate(
        (element) => getComputedStyle(element).animationName,
      ),
      'none',
    )
    await touchPage.emulateMedia({ reducedMotion: 'no-preference' })
    await touchPage.locator('.rally-pointer').waitFor({ state: 'attached' })
    await touchPage.touchscreen.tap(100, 300)
    assert.equal(
      await touchPage
        .locator('html')
        .evaluate((element) => element.classList.contains('has-ball-cursor')),
      false,
    )
    assert.equal(
      await touchPage.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    )
  } finally {
    await touchContext.close()
  }
  await page.goto(`${url(dev)}?study=identity`, { waitUntil: 'networkidle' })
  await page.locator('.identity-study').waitFor()
  assert.equal(await page.locator('.site-header').count(), 0)
  assert.equal(await page.locator('.identity-stage button').isDisabled(), true)
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `Identity study overflow at ${width}`,
    )
    const accessibility = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    assert.deepEqual(
      accessibility.violations.map((item) => ({
        id: item.id,
        targets: item.nodes.map((node) => node.target),
      })),
      [],
    )
    if (width !== 320) {
      await page.screenshot({
        path: path.join(screenshots, `${width}-identity-study.png`),
        fullPage: true,
      })
    }
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.getByRole('button', { name: 'Play one turn' }).click()
  const identityMotion = await page
    .locator('.identity-stage')
    .evaluate((stage) => {
      const racket = stage.querySelector('.identity-racket')
      const lettering = stage.querySelector('.identity-lettering')
      const animation = racket.getAnimations()[0]
      animation.pause()
      animation.currentTime = 1000
      const first = getComputedStyle(racket).transform
      const letteringBefore = lettering.getBoundingClientRect().toJSON()
      animation.currentTime = 3000
      return {
        first,
        second: getComputedStyle(racket).transform,
        letteringBefore,
        letteringAfter: lettering.getBoundingClientRect().toJSON(),
      }
    })
  assert.notEqual(identityMotion.first, identityMotion.second)
  assert.notDeepEqual(
    identityMotion.letteringBefore,
    identityMotion.letteringAfter,
  )
  assert.equal(
    await page
      .locator('.identity-stage .identity-racket .identity-lettering')
      .count(),
    1,
  )
  await page.getByRole('button', { name: 'Stop motion' }).click()
  await page.getByRole('button', { name: 'Play one turn' }).click()
  await page.waitForFunction(
    () => !document.querySelector('.identity-stage .is-turning'),
  )
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('about:blank')
  await dev.close()
  dev = undefined

  process.env.NODE_ENV = 'production'
  await build({ root })
  await import('./verify-production.mjs')
  production = await preview({
    root,
    preview: { host: '127.0.0.1', port: 0, strictPort: true },
  })
  await page.goto(url(production), { waitUntil: 'networkidle' })
  assert.equal(
    await page.locator('html').getAttribute('data-theme'),
    'cinematic',
  )
  assert.equal(
    await page
      .locator(
        '.dev-theme-switcher, .collection-study, .dev-review-panel, .rally-pointer, .rally-ribbon',
      )
      .count(),
    0,
  )
  assert.match(
    await page.locator('.hero-facts').innerText(),
    new RegExp(`${trip.guestCount} guests`),
  )
  assert.equal(
    await page.locator('html').getAttribute('data-stays-layout'),
    'tabbed',
  )
  assert.equal(
    await page.locator('.package-scenarios, .beyond-ribbon').count(),
    0,
  )
  assert.equal(await page.locator('.package-quote').count(), 3)
  assert.equal(
    await page.locator('html').getAttribute('data-presentation'),
    'collection',
  )
  assert.equal(await page.locator('.palette-review').count(), 0)
  await page.goto(`${url(production)}?study=identity`, {
    waitUntil: 'networkidle',
  })
  assert.equal(await page.locator('.identity-study').count(), 0)
  assert.equal(
    await page.locator('.design-comparison, .cinematic-study').count(),
    0,
  )
  await page.goto(`${url(production)}?direction=cinematic`, {
    waitUntil: 'networkidle',
  })
  assert.equal(
    await page.locator('.cinematic-study').count(),
    0,
    'Normal production keeps only the reference',
  )
  for (const direction of ['blue-door', 'petrol-door']) {
    await page.goto(`${url(production)}?direction=${direction}`, {
      waitUntil: 'networkidle',
    })
    assert.equal(
      await page.locator('.bd, .op, .vs').count(),
      0,
      'Production ignores creative directions and the version switcher',
    )
    assert.equal(await page.locator('#on-the-court').count(), 1)
  }
  for (const photo of trip.media.filter(
    (item) => item.usage === 'temporary-local',
  )) {
    const response = await page.request.get(
      `${url(production)}${photo.src.slice(1)}`,
    )
    assert.ok(
      !response.headers()['content-type']?.startsWith('image/'),
      'Local hotel photographs must not be served from the build',
    )
  }
  await closePreview(production)
  production = undefined
  await build({ root, mode: 'review' })
  production = await preview({
    root,
    mode: 'review',
    preview: { host: '127.0.0.1', port: 0, strictPort: true },
  })
  await page.goto(url(production), { waitUntil: 'networkidle' })
  assert.equal(await page.locator('.identity-study').count(), 0)
  assert.equal(
    await page.locator('meta[name="robots"]').getAttribute('content'),
    'noindex, nofollow',
  )
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    )
    assert.equal(
      await page.locator('html').getAttribute('data-presentation'),
      'collection',
    )
    assert.equal(await page.locator('.proposal-guide').count(), 0)
    assert.equal(
      await page.locator('.hero-eyebrow .tunisia-detail img').count(),
      1,
    )
    assert.equal(await page.locator('.day-art:visible').count(), 5)
  }
  assert.deepEqual(errors, [])
  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach((image) => {
      image.loading = 'eager'
    })
    await Promise.all([...document.images].map((image) => image.decode()))
  })
  await page.locator('#on-the-court').screenshot({
    path: path.join(screenshots, 'review-collection-escape.png'),
  })
  await page.locator('#the-details').screenshot({
    path: path.join(screenshots, 'review-collection-packages.png'),
  })
  await page
    .locator('#next')
    .screenshot({ path: path.join(screenshots, 'review-collection-next.png') })
  console.log(
    'Review build verified: Petrol & cream, opening flag and noindex metadata.',
  )
  assert.equal(await page.locator('.vs-toggle').count(), 1)
  for (const [direction, root] of [
    ['blue-door', '.bd'],
    ['petrol-door', '.petrol-door'],
  ]) {
    await page.setViewportSize({ width: 390, height: 900 })
    await page.goto(`${url(production)}?direction=${direction}`, {
      waitUntil: 'networkidle',
    })
    await page.locator(root).waitFor()
    assert.equal(await page.locator('.vs-toggle').count(), 1)
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `${direction} has no horizontal overflow on mobile`,
    )
    for (const id of ['padel', 'on-the-court', 'stays', 'the-details', 'next'])
      assert.equal(await page.locator(`${root} #${id}`).count(), 1)
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        `${direction} overflow at ${width}`,
      )
      if (width !== 320) {
        const audit = await new AxeBuilder({ page }).analyze()
        assert.deepEqual(
          audit.violations,
          [],
          `${direction} accessibility at ${width}`,
        )
        await page.locator(`${root} #padel`).screenshot({
          path: path.join(screenshots, `${width}-${direction}-padel.png`),
        })
      }
    }
    const carousel = page.locator('.xs-carousel').first()
    const count = carousel.locator('.xs-count')
    const firstCount = await count.innerText()
    await carousel
      .getByRole('button', { name: 'Next photograph', exact: true })
      .click()
    assert.notEqual(await count.innerText(), firstCount)
    await carousel.locator('.xs-track').focus()
    await page.keyboard.press('ArrowLeft')
    assert.equal(await count.innerText(), firstCount)
    await page.setViewportSize({ width: 390, height: 900 })
    await page
      .getByRole('button', {
        name:
          direction === 'petrol-door'
            ? 'Open chapter navigation'
            : 'Open navigation',
        exact: true,
      })
      .click()
    await page
      .getByRole('navigation', { name: 'Chapters' })
      .locator('a[href="#padel"]')
      .click()
    assert.equal(new URL(page.url()).hash, '#padel')
    if (direction === 'petrol-door') {
      await page.emulateMedia({ reducedMotion: 'no-preference' })
      const closing = page.locator('.hybrid-closing')
      await closing.evaluate((element) =>
        window.scrollTo(
          0,
          element.getBoundingClientRect().top + window.scrollY,
        ),
      )
      await page.waitForFunction(
        () =>
          Number(
            document
              .querySelector('.hybrid-closing')
              .style.getPropertyValue('--p'),
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
            document
              .querySelector('.hybrid-closing')
              .style.getPropertyValue('--p'),
          ) > 0.99,
      )
      await page.emulateMedia({ reducedMotion: 'reduce' })
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
      for (const width of [390, 1440]) {
        await page.setViewportSize({ width, height: 900 })
        for (const id of ['invitation', 'stays', 'next']) {
          await page.locator(`#${id}`).screenshot({
            path: path.join(screenshots, `${width}-hybrid-${id}.png`),
          })
        }
      }
    }
  }
  console.log('Review creative directions verified.')
  await page.goto(`${url(production)}#villa-la-marsa`, {
    waitUntil: 'networkidle',
  })
  await page.locator('#villa-la-marsa').waitFor()
  assert.equal(
    await page.locator('#villa-la-marsa').isVisible(),
    true,
    'Direct stay link opens the requested villa',
  )
  await page.getByRole('tab', { name: trip.hotel.name, exact: true }).click()
  assert.equal(
    await page.locator('#four-seasons-tunis .gallery-empty').count(),
    1,
  )
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    )
  }
  assert.deepEqual(errors, [])
  console.log(
    '\nBrowser QA passed: reference at four widths, included private transport, Rally cursor/motion/touch controls, tabs, five-day itinerary and reduced motion, accessibility, navigation, gallery keyboard/focus/swipe, production default and privacy guard.',
  )
  console.log(`Screenshots: ${screenshots}`)
} finally {
  await browser?.close()
  await dev?.close()
  if (production) await closePreview(production)
}
