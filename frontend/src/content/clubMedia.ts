import type { ImageMedia } from './types.ts'

// Photographs of the intended club supplied by the organizer, 12 November 2026.
// Photographer and publication rights are not recorded, so they stay local to
// development until reviewed. Production and review builds show an editorial
// stand-in (clearly labelled) instead.
export const clubMedia: ImageMedia[] = [
  {
    id: 'club-courts-dusk',
    kind: 'image',
    context: 'property',
    usage: 'temporary-local',
    src: '/media/padel/club/courts-at-dusk.jpg',
    smallSrc: '/media/padel/club/courts-at-dusk-800.jpg',
    width: 1200,
    height: 800,
    position: '50% 60%',
    alt: 'Floodlit blue padel courts at dusk under an orange and violet sky, with white buildings and palms behind.',
    caption: 'The courts at dusk, Padel Gammarth.',
    credit: 'Organizer-supplied; photographer not recorded',
    license: 'Temporary local reference; rights to be confirmed',
  },
  {
    id: 'club-courts-sunset',
    kind: 'image',
    context: 'property',
    usage: 'temporary-local',
    src: '/media/padel/club/sunset-courts-portrait.jpg',
    smallSrc: '/media/padel/club/sunset-courts-portrait-800.jpg',
    width: 949,
    height: 1087,
    position: '50% 70%',
    alt: 'Players on blue padel courts below a blazing orange sunset sky.',
    caption: 'Sunset over the courts, Padel Gammarth.',
    credit: 'Organizer-supplied; photographer not recorded',
    license: 'Temporary local reference; rights to be confirmed',
  },
]
