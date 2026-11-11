import type { padelClub } from './padelClub'

export type InformationStatus = 'proposed' | 'estimated' | 'confirmed'

export interface ImageMedia {
  id: string
  kind: 'image'
  src: string
  smallSrc?: string
  alt: string
  width: number
  height: number
  caption: string
  credit: string
  sourceUrl?: string
  license: string
  licenseUrl?: string
  context: 'editorial' | 'property'
  usage?: 'temporary-local'
  position?: string
}

export interface VideoMedia {
  id: string
  kind: 'video' | 'reel'
  title: string
  url: string
  // Only local, rights-cleared video files may be played in the presentation.
  localSrc?: string
  posterSrc?: string
  captionsSrc?: string
}

export type MediaReference = ImageMedia | VideoMedia

export interface Chapter {
  id: string
  number: string
  eyebrow: string
  title: string
  description: string
}

export interface Activity {
  id: string
  number: string
  title: string
  status: InformationStatus
  rhythm: string
  summary: string[]
  description: string
  detail: string
}

export type TripDay = { date: string; mediaId?: string } & (
  | { kind: 'arrival' | 'departure'; title: string; description: string }
  | { kind: 'padel'; activityId: string }
)

export interface AccommodationOption {
  id: string
  number: string
  name: string
  kind: 'Private villa' | 'Village residence' | 'Hotel'
  location: string
  status: InformationStatus
  description: string
  highlights: string[]
  sourceUrl?: string
  sourceLabel?: string
  sourceNote: string
  facts: {
    label: string
    value: string
    icon?: 'bed' | 'bath' | 'racket' | 'coffee'
  }[]
  rooms: {
    summary: string
    arrangements: string[]
    bathrooms: string
    sharingNote: string
  }
  facilities: string[]
  breakfast: { setting: string; note: string }
  access: { padel: string; neighbourhood: string; note: string }
  advantages: string[]
  considerations: string[]
  recommendation?: string
  availabilityNote: string
  estimate: PackageEstimate
  mediaIds: string[]
  coverMediaId?: string
}

export type PackageEstimate =
  | { state: 'pending'; note: string }
  | {
      state: 'estimated'
      amountPerGuest: number
      currency: string
      asOf: string
      inclusions: string[]
      exclusions: string[]
      note: string
    }

export interface TripContent {
  club: typeof padelClub
  id: string
  title: string
  destination: string
  tagline: string
  startDate: string
  endDate: string
  dateLabel: string
  guestCount: number
  days: number
  nights: number
  status: InformationStatus
  statusGuide: {
    id: 'included' | 'proposed' | 'optional'
    label: string
    description: string
  }[]
  navigation: { id: string; label: string }[]
  introduction: {
    eyebrow: string
    title: string
    accent: string
    description: string
    area: string
    scrollLabel: string
    mediaId: string
    note: string
    flavour: string
  }
  program: Chapter & {
    courtMediaId: string
    courtCaption: string
    dayImageNote: string
    club: string
    breakfastNote: string
    clubDescription: string
    clubSourceUrl: string
    destinationMediaId: string
    destinationTitle: string
    destinationNote: string
    padelHighlights: { value: string; label: string }[]
    schedule: TripDay[]
    afternoonLabel: string
    afternoonOption: string
    afternoonExperiences: string
    afternoonNote: string
    planningNote: string
  }
  activities: Activity[]
  stays: Chapter & {
    photographyNote: string
    recommendationNote: string
    preferredAccommodationId: string | null
    selectedAccommodationId: string | null
  }
  accommodations: AccommodationOption[]
  hotel: AccommodationOption
  budget: Chapter & {
    inclusions: string[]
    transport: {
      title: string
      description: string
      driver: string
      routes: {
        id: string
        icon: 'plane' | 'racket'
        label: string
        count: string
        vehicle: string
        detail: string
      }[]
      hotelNote: string
    }
    pendingLabel: string
    scope: {
      title: string
      status: 'included' | 'proposed' | 'optional'
      items: string[]
    }[]
    note: string
  }
  next: Chapter & {
    steps: { title: string; text: string; optional?: boolean }[]
    beyond: { title: string; note: string; items: string[]; mediaId: string }
    closing: string
    signoff: string
    mediaId: string
  }
  media: MediaReference[]
}
