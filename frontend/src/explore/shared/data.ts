import type {
  AccommodationOption,
  ImageMedia,
  TripContent,
} from '../../content/types'
import { trip } from '../../content/trip'

export { trip }

export const stays: AccommodationOption[] = [...trip.accommodations, trip.hotel]

export function stayImages(option: AccommodationOption): ImageMedia[] {
  const ids = [
    ...new Set(
      [option.coverMediaId, ...option.mediaIds].filter((id): id is string =>
        Boolean(id),
      ),
    ),
  ]
  return ids.flatMap((id) => {
    const image = trip.media.find(
      (item): item is ImageMedia =>
        item.id === id && item.kind === 'image' && item.context === 'property',
    )
    return image ? [image] : []
  })
}

export function shortName(option: AccommodationOption) {
  return option.id === 'villa-la-marsa'
    ? 'La Marsa'
    : option.id === 'four-seasons-tunis'
      ? 'Four Seasons'
      : option.name
}

export function price(option: AccommodationOption) {
  const { estimate } = option
  return estimate.state === 'estimated'
    ? new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: estimate.currency,
        maximumFractionDigits: 0,
      }).format(estimate.amountPerGuest)
    : trip.budget.pendingLabel
}

export function imageById(id?: string) {
  return trip.media.find(
    (item): item is ImageMedia => item.kind === 'image' && item.id === id,
  )
}

const weekday = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  timeZone: 'UTC',
})
const month = new Intl.DateTimeFormat('en-GB', {
  month: 'long',
  timeZone: 'UTC',
})

export function dayParts(iso: string) {
  const date = new Date(`${iso}T12:00:00Z`)
  return {
    weekday: weekday.format(date),
    day: iso.slice(8),
    month: month.format(date),
  }
}

export type Day = TripContent['program']['schedule'][number]
