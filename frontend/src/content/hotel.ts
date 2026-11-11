import type { AccommodationOption } from './types'

// Official hotel pages checked 8 Nov 2026. This is property information, not
// confirmation of facilities, rooms, prices or included services for our dates.
export const hotel: AccommodationOption = {
  id: 'four-seasons-tunis',
  estimate: {
    state: 'estimated',
    amountPerGuest: 1250,
    currency: 'EUR',
    asOf: '2026-11-11',
    inclusions: [
      'Four nights',
      '3 breakfasts',
      'Three padel mornings: coaching, match play & Americano',
      'Private airport transfers',
    ],
    exclusions: [],
    note: 'EUR1250 per guest, including 3 breakfasts and private airport transfers. Organizer update 11 November 2026. No club transfers needed; airport arrangements and room allocation to agree.',
  },
  number: '03',
  name: 'Four Seasons Hotel Tunis',
  kind: 'Hotel',
  location: 'Cap Gammarth',
  status: 'proposed',
  description: 'Rooms or suites at Cap Gammarth, opposite the padel club.',
  highlights: [
    'Hotel rooms or suites',
    'Opposite the padel club',
    'Indoor pool, spa & hammam; access to check',
  ],
  sourceUrl: 'https://www.fourseasons.com/tunis/',
  sourceNote:
    'Prepared from the official hotel, accommodation and amenities pages, checked 8 November 2026. This is not a group offer. Rooms, services, seasonal access and availability for February 2027 still need confirmation.',
  facts: [
    { icon: 'bed', label: 'Stay format', value: 'Hotel rooms or suites' },
    { icon: 'racket', label: 'Padel access', value: 'Opposite the club' },
    { icon: 'coffee', label: 'Breakfast', value: '3 included' },
  ],
  rooms: {
    summary: 'A hotel room arrangement rather than a single shared house.',
    arrangements: [
      'The hotel lists rooms with a king bed or two double beds.',
      'We will choose the room type and sharing arrangements with you.',
    ],
    bathrooms:
      'Bathroom specifications will be checked against the room category selected.',
    sharingNote: 'No rooms reserved yet.',
  },
  facilities: [
    'The hotel lists a heated indoor pool, gym, spa and hammam.',
    'Concierge and room service; extra charges may apply.',
  ],
  breakfast: {
    setting: 'Three breakfasts included.',
    note: 'The breakfast format and timing will be agreed with the hotel; no group offer is confirmed.',
  },
  access: {
    padel:
      'Around five minutes on foot to the club, according to the organizer, so no club transfers are planned. We will check pedestrian access and the walking route.',
    neighbourhood:
      'Quieter than La Marsa or Sidi Bou Sa\u00efd, with less local life on the doorstep.',
    note: 'Beach and outdoor pool access is seasonal. We will check February access to the indoor facilities.',
  },
  advantages: [
    'Five-star comfort by the sea, a short walk from padel.',
    'No club transfers needed; opposite the courts.',
    'Indoor pool, gym, spa and hammam: February access to check.',
  ],
  considerations: [
    'Further from local life, restaurants and bars.',
    'Further from village life.',
    'Seasonal facilities and extra charges to check.',
  ],
  recommendation: 'Five-star comfort by the sea, a short walk from padel.',
  availabilityNote: 'Availability for our dates still to be checked.',
  coverMediaId: 'four-seasons-tunis-pool-at-dusk',
  mediaIds: [
    'four-seasons-tunis-pool-at-dusk',
    'four-seasons-tunis-suite-bedroom',
    'four-seasons-tunis-alyssa-lounge',
    'four-seasons-tunis-spa-passage',
    'four-seasons-tunis-lobby-sculpture',
  ],
}
