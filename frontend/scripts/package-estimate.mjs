// Local calculation only. Never import this module or internal inputs in src/.
export function calculateScenario(scenario, commonComponents, guestCount) {
  if (!Number.isInteger(guestCount) || guestCount < 1)
    throw new Error('Guest count must be a positive integer')
  const components = [...scenario.components, ...commonComponents]
  const ids = components.map((component) => component.id)
  if (new Set(ids).size !== ids.length)
    throw new Error('Component IDs must be unique in each scenario')
  const missing = []
  const inclusions = []
  const exclusions = []
  let total = 0
  for (const component of components) {
    if (component.treatment === 'excluded') {
      exclusions.push(component.label)
      continue
    }
    if (
      component.treatment !== 'included' ||
      component.amount === null ||
      component.amount === undefined
    ) {
      missing.push(component.label)
      continue
    }
    if (component.currency !== scenario.currency)
      throw new Error(
        `Currency mismatch: ${component.id}; convert explicitly before calculating`,
      )
    if (!Number.isFinite(component.amount) || component.amount < 0)
      throw new Error(`Invalid amount: ${component.id}`)
    let multiplier = 1
    if (component.basis === 'per-person') multiplier = guestCount
    else if (component.basis === 'per-room-per-night') {
      if (
        ![component.roomCount, component.nightCount].every(
          (count) => Number.isInteger(count) && count > 0,
        )
      )
        throw new Error(`Room and night counts required: ${component.id}`)
      multiplier = component.roomCount * component.nightCount
    } else if (component.basis !== 'group-total')
      throw new Error(`Unknown cost basis: ${component.id}`)
    total += component.amount * multiplier
    inclusions.push(component.label)
  }
  if (!scenario.scopeReviewed)
    missing.push(
      'Organizer review of complete scope, inclusions and exclusions',
    )
  if (
    !components.some(
      (component) =>
        component.id === 'accommodation' && component.treatment === 'included',
    )
  )
    missing.push('Included accommodation cost')
  if (missing.length) return { state: 'pending', missing }
  return {
    state: 'estimated',
    amountPerGuest: total / guestCount,
    currency: scenario.currency,
    inclusions,
    exclusions,
  }
}
