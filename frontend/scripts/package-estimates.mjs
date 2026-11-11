import { readFile } from 'node:fs/promises'
import { trip } from '../src/content/trip.ts'
import { calculateScenario } from './package-estimate.mjs'

const inputs = JSON.parse(
  await readFile(
    new URL('../internal/package-costs.json', import.meta.url),
    'utf8',
  ),
)
for (const scenario of inputs.scenarios) {
  if (scenario.accommodationId === 'el-dar') continue // Retained internal history; removed from current shortlist.
  if (
    scenario.accommodationId !== trip.hotel.id &&
    !trip.accommodations.some(
      (option) => option.id === scenario.accommodationId,
    )
  )
    throw new Error(`Unknown accommodation: ${scenario.accommodationId}`)
  const result = calculateScenario(
    scenario,
    inputs.commonComponents,
    trip.guestCount,
  )
  console.log(`\n${scenario.accommodationId}`)
  if (scenario.accommodationId === trip.hotel.id)
    console.log(
      'Hotel candidate; room allocation, availability and package rate remain pending.',
    )
  if (result.state === 'pending')
    console.log(`Pending — ${result.missing.join('; ')}`)
  else console.log(JSON.stringify(result, null, 2))
}
console.log(
  '\nLocal working estimate only. Review before manually publishing any per-guest package estimate in src/content/trip.ts.',
)
