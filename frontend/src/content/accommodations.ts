import type { AccommodationOption } from './types'

// Organizer research supplied 8 November 2026. Not independently verified
// booking facts, live directions or availability. Existing IDs stay stable.
export const accommodations: AccommodationOption[] = [
  {
    id: 'villa-verdi',
    estimate: {
      state: 'estimated',
      amountPerGuest: 800,
      currency: 'EUR',
      asOf: '2026-11-08',
      inclusions: [
        'Four nights',
        '3 breakfasts',
        'Three padel mornings: coaching, match play & Americano',
        'Private airport & club transfers',
      ],
      exclusions: [],
      note: 'Indicative organizer estimate, including private transfers. Final scope and arrangements to agree.',
    },
    number: '01',
    name: 'Villa Verde',
    kind: 'Private villa',
    location: 'Sidi Bou Saïd · just outside the historic centre',
    status: 'proposed',
    description:
      'A courtyard house near Sidi Bou Said, with four suites and a rooftop terrace.',
    highlights: [
      'Traditional courtyard',
      'Four private suites',
      'Village rooftop',
    ],
    sourceUrl: 'https://www.airbnb.de/rooms/1395668710372631557',
    sourceLabel: 'Original property reference',
    sourceNote:
      'Details and recommendations are based on the organizer’s preliminary research, supplied 8 November 2026, and require reconfirmation. Previously called Villa Verdi in our working notes; this is Villa Verde, not Verdi Tunis Beach Resort.',
    facts: [
      {
        icon: 'bed',
        label: 'Sleeping',
        value: '4 suites / 4 double beds',
      },
      { icon: 'bath', label: 'Bathrooms', value: '4 private bathrooms' },
      { icon: 'racket', label: 'Club drive', value: '~20 min by car' },
      { icon: 'coffee', label: 'Breakfast', value: '3 included' },
    ],
    rooms: {
      summary: 'Four suites, each with a double bed and its own bathroom.',
      arrangements: [
        'Suite 1 · double bed, private bathroom',
        'Suite 2 · double bed, private bathroom',
        'Suite 3 · double bed, private bathroom',
        'Suite 4 · double bed, private bathroom',
      ],
      bathrooms: 'Four private suite bathrooms.',
      sharingNote: 'Four double beds for eight guests.',
    },
    facilities: [
      'Central courtyard / patio',
      'Rooftop terrace and small rooftop pool',
      'Three floors with an elevator',
      'Garage for one car',
    ],
    breakfast: {
      setting: 'A slow start in the traditional courtyard.',
      note: 'Three breakfasts are included. Preparation, delivery and timing will be arranged; the service is not yet booked.',
    },
    access: {
      padel:
        'Approximately 12 km / 20 minutes by car to the intended padel club.',
      neighbourhood:
        'Around 14 minutes on foot to the historic centre, according to earlier research.',
      note: 'Walking and driving times are estimates; we will check the routes.',
    },
    advantages: [
      'Our favourite for Tunisian charm and walks into Sidi Bou Said.',
      'Walk to the historic village.',
      'Rooftop, small pool and elevator.',
    ],
    considerations: [
      'A longer drive to the courts: around 20 minutes.',
      'Longer club drive.',
      'One-car parking; winter pool use to check.',
    ],
    recommendation:
      'Our favourite for Tunisian charm and walks into Sidi Bou Said.',
    availabilityNote: 'Availability for our dates still to be checked.',
    coverMediaId: 'villa-verdi-dining-area',
    mediaIds: [
      'villa-verdi-dining-area',
      'villa-verdi-bedroom-1',
      'villa-verdi-pool',
      'villa-verdi-view',
      'villa-verdi-bedroom-2',
      'villa-verdi-courtyard-wide',
      'villa-verdi-terrace',
      'villa-verdi-bedroom-3',
      'villa-verdi-bedroom-4',
      'villa-verdi-bathroom-1',
      'villa-verdi-bathroom-3',
      'villa-verdi-bathroom-4',
      'villa-verdi-view-second-angle',
    ],
  },
  {
    id: 'villa-la-marsa',
    estimate: {
      state: 'estimated',
      amountPerGuest: 700,
      currency: 'EUR',
      asOf: '2026-11-08',
      inclusions: [
        'Four nights',
        '3 breakfasts',
        'Three padel mornings: coaching, match play & Americano',
        'Private airport & club transfers',
      ],
      exclusions: [],
      note: 'Indicative organizer estimate, including private transfers. Final scope and arrangements to agree.',
    },
    number: '02',
    name: 'Escaliers vers Marsa Plage',
    kind: 'Private villa',
    location: 'La Marsa · lively seaside neighbourhood',
    status: 'proposed',
    description:
      'A house by the sea in La Marsa, with a garden, pool and steps to the water.',
    highlights: [
      'Seaside garden',
      'Four mixed-layout bedrooms',
      'La Marsa neighbourhood',
    ],
    sourceUrl: 'https://www.airbnb.de/rooms/1551596334126948977',
    sourceLabel: 'Original property reference',
    sourceNote:
      'Organizer research supplied 8 November 2026; room and bathroom configurations need reconfirmation. The earlier Airbnb location label said Carthage, while the organizer places the house in La Marsa. Exact address, access and all details must be checked.',
    facts: [
      { icon: 'bed', label: 'Sleeping', value: '4 bedrooms / mixed beds' },
      { icon: 'bath', label: 'Bathrooms', value: '2 full + 2 half bathrooms' },
      { icon: 'racket', label: 'Club drive', value: '~14 min by car' },
      { icon: 'coffee', label: 'Breakfast', value: '3 included' },
    ],
    rooms: {
      summary:
        'Four bedrooms with a mix of double, single and convertible beds.',
      arrangements: [
        'Suite · one double bed',
        'Bedroom 2 · three single beds',
        'Bedroom 3 · one double bed',
        'Bedroom 4 · one single bed and one convertible double bed',
      ],
      bathrooms:
        'Two full bathrooms and two half bathrooms, according to organizer research.',
      sharingNote:
        "The rooms are different sizes. We'll work out who sleeps where before choosing this house.",
    },
    facilities: [
      'Garden and outdoor spaces',
      'Swimming pool by the sea',
      'Direct sea access via stairs',
      'Garage for three cars',
    ],
    breakfast: {
      setting: 'Breakfast overlooking the Mediterranean.',
      note: 'Three breakfasts are included. Preparation, delivery and timing will be arranged; the service is not yet booked.',
    },
    access: {
      padel:
        'Approximately 7.5 km / 14 minutes by car to the intended padel club.',
      neighbourhood:
        'In La Marsa; around 30 minutes on foot to Sidi Bou Sa\u00efd, based on earlier research.',
      note: 'Journey times are estimates; we will check the address and access.',
    },
    advantages: [
      'Local life on foot, with a seaside garden to come home to.',
      'Shorter estimated club drive.',
      'Three-car parking; lively neighbourhood.',
    ],
    considerations: [
      'More contemporary, with less traditional Tunisian character.',
      'Different room sizes and bed types.',
      'Sea-access stairs; winter pool use to check.',
    ],
    recommendation:
      'Local life on foot, with a seaside garden to come home to.',
    availabilityNote: 'Availability for our dates still to be checked.',
    coverMediaId: 'villa-la-marsa-garden',
    mediaIds: [
      'villa-la-marsa-garden',
      'villa-la-marsa-pool',
      'villa-la-marsa-living-room',
      'villa-la-marsa-bedroom-1',
      'villa-la-marsa-dining-room',
      'villa-la-marsa-garden-second-view',
      'villa-la-marsa-bedroom-2',
      'villa-la-marsa-bedroom-3',
      'villa-la-marsa-bedroom-4',
      'villa-la-marsa-bathroom-1',
      'villa-la-marsa-bathroom-detail',
      'villa-la-marsa-bathroom-2',
      'villa-la-marsa-bathroom-3',
      'villa-la-marsa-bathroom-4',
    ],
  },
]
