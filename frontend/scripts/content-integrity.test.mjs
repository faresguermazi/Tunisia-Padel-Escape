import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { trip } from '../src/content/trip.ts'
import { calculateScenario } from './package-estimate.mjs'

test('five-day draft plan uses the real February weekdays and resolves its padel sessions', () => {
  assert.deepEqual(
    trip.program.schedule.map((day) => day.date),
    ['2027-02-03', '2027-02-04', '2027-02-05', '2027-02-06', '2027-02-07'],
  )
  assert.deepEqual(
    trip.program.schedule.map((day) => day.kind),
    ['arrival', 'padel', 'padel', 'padel', 'departure'],
  )
  const weekdays = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    timeZone: 'UTC',
  })
  assert.deepEqual(
    trip.program.schedule.map((day) =>
      weekdays.format(new Date(`${day.date}T12:00:00Z`)),
    ),
    ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  )
  for (const day of trip.program.schedule) {
    if (day.kind === 'padel')
      assert.ok(
        trip.activities.some((activity) => activity.id === day.activityId),
      )
  }
  assert.equal(
    trip.media.some((item) => item.id === 'padel-play'),
    false,
  )
})

test('content IDs, navigation and scenario relationships stay valid when options are edited', () => {
  for (const collection of [trip.media, trip.accommodations, trip.activities]) {
    assert.equal(
      new Set(collection.map((item) => item.id)).size,
      collection.length,
    )
  }
  const sections = [
    trip.club,
    trip.program,
    trip.stays,
    trip.budget,
    trip.next,
  ].map((section) => section.id)
  for (const item of trip.navigation) assert.ok(sections.includes(item.id))
  for (const option of [...trip.accommodations, trip.hotel]) {
    const scenario = { accommodationId: option.id, estimate: option.estimate }
    assert.ok(
      scenario.accommodationId === trip.hotel.id ||
        trip.accommodations.some(
          (option) => option.id === scenario.accommodationId,
        ),
    )
    if (scenario.estimate.state === 'estimated') {
      assert.ok(scenario.estimate.amountPerGuest > 0)
      assert.ok(scenario.estimate.inclusions.length > 0)
      assert.match(scenario.estimate.asOf, /^\d{4}-\d{2}-\d{2}$/)
    }
  }
})

test('refined trip keeps eight guests, club navigation and complete-package calculations in sync', () => {
  assert.equal(trip.guestCount, 8)
  assert.equal('experience' in trip, false)
  assert.equal(trip.navigation[0].id, trip.club.id)
  const chapters = [trip.program, trip.stays, trip.budget, trip.next]
  assert.deepEqual(
    chapters.map((chapter) => chapter.number),
    ['01', '02', '03', '04'],
  )
  assert.equal(
    trip.accommodations.some((option) => option.id === 'el-dar'),
    false,
  )
  assert.equal(
    trip.accommodations.some((option) => option.id === 'four-seasons-tunis'),
    false,
  )
  const result = calculateScenario(
    {
      currency: 'EUR',
      scopeReviewed: true,
      components: [
        {
          id: 'accommodation',
          label: 'Synthetic complete scope',
          amount: 1600,
          currency: 'EUR',
          basis: 'group-total',
          treatment: 'included',
        },
      ],
    },
    [],
    trip.guestCount,
  )
  assert.equal(result.amountPerGuest, 200)
})

test('local media paths exist and editorial photos cannot enter a property gallery', () => {
  for (const item of trip.media) {
    if (item.kind !== 'image') continue
    for (const asset of [item.src, item.smallSrc].filter(Boolean)) {
      assert.match(asset, /^\/media\//)
      assert.ok(
        existsSync(new URL(`../public${asset}`, import.meta.url)),
        asset,
      )
    }
    assert.ok(
      item.alt &&
        item.width > 0 &&
        item.height > 0 &&
        item.credit &&
        item.license,
    )
  }
  for (const option of [...trip.accommodations, trip.hotel]) {
    for (const id of [option.coverMediaId, ...option.mediaIds].filter(
      Boolean,
    )) {
      const item = trip.media.find((medium) => medium.id === id)
      assert.ok(item, id)
      if (item.kind === 'image') assert.equal(item.context, 'property')
    }
  }
})

test('per-stay provisional prices and the current recommendation stay consistent', () => {
  const options = [...trip.accommodations, trip.hotel]
  assert.ok(
    options.some((option) => option.id === trip.stays.preferredAccommodationId),
  )
  for (const option of options) {
    assert.equal(option.estimate.state, 'estimated')
    assert.ok(option.estimate.amountPerGuest > 0)
    assert.equal(option.estimate.currency, 'EUR')
    assert.ok(option.estimate.inclusions.includes('3 breakfasts'))
  }
  assert.equal(trip.accommodations.length, 2)
})
