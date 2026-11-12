import { clubMedia } from './clubMedia.ts'
import { hotelMedia } from './hotelMedia.ts'
import { propertyMedia } from './propertyMedia.ts'
import type { MediaReference } from './types'

// Editorial photographs are not accommodation or intended-club photographs.
// Rights-cleared property photos can be added here and referenced by stable ID.
export const media: MediaReference[] = [
  ...propertyMedia,
  ...(import.meta.env?.PROD ? [] : [...hotelMedia, ...clubMedia]),
  {
    id: 'sidi-coast',
    kind: 'image',
    context: 'editorial',
    src: '/media/backgrounds/sidi-bou-said-hillside.jpg',
    smallSrc: '/media/backgrounds/sidi-bou-said-hillside-800.jpg',
    width: 1800,
    height: 1200,
    position: '50% 64%',
    alt: 'White houses above the Mediterranean coastline in Sidi Bou Saïd, Tunisia.',
    caption: 'Sidi Bou Saïd, where the hillside meets the Mediterranean.',
    credit: 'Brahim Guedich / Unsplash',
    sourceUrl:
      'https://unsplash.com/photos/a-view-of-a-hillside-with-houses-on-top-of-it-i34yA65OblA',
    license: 'Unsplash License',
    licenseUrl: 'https://unsplash.com/license',
  },
  {
    id: 'sidi-village',
    kind: 'image',
    context: 'editorial',
    src: '/media/backgrounds/sidi-bou-said-blue-door.jpg',
    smallSrc: '/media/backgrounds/sidi-bou-said-blue-door-800.jpg',
    width: 1200,
    height: 1600,
    alt: 'A blue studded door framed by warm stone and white walls in Sidi Bou Saïd.',
    caption: 'Blue doors and quiet corners in Sidi Bou Saïd.',
    credit: 'Rayyân / Unsplash',
    sourceUrl:
      'https://unsplash.com/photos/a-blue-door-with-two-pots-of-plants-in-front-of-it-NDq2T9sjDQw',
    license: 'Unsplash License',
    licenseUrl: 'https://unsplash.com/license',
  },
  {
    id: 'padel-court',
    kind: 'image',
    context: 'editorial',
    src: '/media/padel/padel-court-editorial.jpg',
    smallSrc: '/media/padel/padel-court-editorial-800.jpg',
    width: 1600,
    height: 1067,
    alt: 'Two padel rackets and yellow balls on a blue court.',
    caption:
      'The essentials of a good game. Editorial image; not Padel Gammarth.',
    credit: 'Vincenzo Morelli / Unsplash · photography Emanuela D’Ambrosi',
    sourceUrl:
      'https://unsplash.com/photos/two-tennis-rackets-and-balls-on-a-blue-tennis-court-Cj35lHL4atY',
    license: 'Unsplash License',
    licenseUrl: 'https://unsplash.com/license',
  },

  {
    id: 'sidi-dome',
    kind: 'image',
    context: 'editorial',
    src: '/media/backgrounds/sidi-bou-said-coast.jpg',
    smallSrc: '/media/backgrounds/sidi-bou-said-coast-800.jpg',
    width: 1800,
    height: 2700,
    position: '50% 54%',
    alt: 'A white dome and blue windows overlooking the Mediterranean in Sidi Bou Saïd.',
    caption: 'Whitewashed architecture and Mediterranean light, Sidi Bou Saïd.',
    credit: 'Mohamed Jamil Latrach / Unsplash',
    sourceUrl:
      'https://unsplash.com/photos/a-white-building-sitting-next-to-a-body-of-water-JuaCdbIiV74',
    license: 'Unsplash License',
    licenseUrl: 'https://unsplash.com/license',
  },
]
