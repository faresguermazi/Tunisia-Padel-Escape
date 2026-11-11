import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calculateScenario } from './package-estimate.mjs'

const cost = (overrides = {}) => ({
  id: 'accommodation',
  label: 'Accommodation',
  amount: 1600,
  currency: 'EUR',
  basis: 'group-total',
  treatment: 'included',
  ...overrides,
})
const scenario = (components = [cost()], extra = {}) => ({
  currency: 'EUR',
  scopeReviewed: true,
  components,
  ...extra,
})

test('partial costs and an unreviewed scope never produce a per-guest estimate', () => {
  const result = calculateScenario(
    scenario(undefined, { scopeReviewed: false }),
    [cost({ id: 'coaching', amount: null, treatment: 'pending' })],
    8,
  )
  assert.equal(result.state, 'pending')
  assert.equal('amountPerGuest' in result, false)
  assert.equal(result.missing.length, 2)
})
test('group costs, per-person costs and explicit exclusions are accounted for', () => {
  const result = calculateScenario(
    scenario(),
    [
      cost({ id: 'coaching', amount: 100, basis: 'per-person' }),
      cost({ id: 'breakfast', amount: null, treatment: 'excluded' }),
    ],
    8,
  )
  assert.equal(result.amountPerGuest, 300)
  assert.equal(result.exclusions.length, 1)
})
test('nightly room prices require quantities and are not mistaken for group totals', () => {
  const result = calculateScenario(
    scenario([
      cost({
        amount: 100,
        basis: 'per-room-per-night',
        roomCount: 4,
        nightCount: 4,
      }),
    ]),
    [],
    8,
  )
  assert.equal(result.amountPerGuest, 1600 / 8)
  assert.throws(
    () =>
      calculateScenario(
        scenario([cost({ basis: 'per-room-per-night' })]),
        [],
        8,
      ),
    /counts required/,
  )
})
test('invalid counts, amounts, currencies and duplicate IDs are rejected', () => {
  assert.throws(() => calculateScenario(scenario(), [], 0), /positive integer/)
  assert.throws(
    () => calculateScenario(scenario([cost({ amount: -1 })]), [], 8),
    /Invalid amount/,
  )
  assert.throws(
    () => calculateScenario(scenario([cost({ currency: 'TND' })]), [], 8),
    /Currency mismatch/,
  )
  assert.throws(() => calculateScenario(scenario(), [cost()], 8), /unique/)
})
