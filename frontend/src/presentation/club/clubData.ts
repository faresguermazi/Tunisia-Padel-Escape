import type { ImageMedia } from '../../content/types'
import { imageById, trip } from '../shared/data'

const { club } = trip

/** Real club photographs when present (local development); else one labelled stand-in. */
export function clubPhotos(): { photos: ImageMedia[]; real: boolean } {
  const real = club.photoIds.flatMap((id) => imageById(id) ?? [])
  if (real.length) return { photos: real, real: true }
  const stand = imageById(club.mediaId)
  return { photos: stand ? [stand] : [], real: false }
}

/** Honest caption: stand-in imagery is never presented as the venue. */
export function photoCaption(image: ImageMedia, real: boolean) {
  return real ? image.caption : `${club.imageNote}`
}

export const editorialCourt = () => imageById(club.mediaId)
