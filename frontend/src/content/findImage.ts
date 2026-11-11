import type { ImageMedia, MediaReference } from './types'

export function findImage(
  media: MediaReference[],
  id?: string,
): ImageMedia | undefined {
  return media.find(
    (item): item is ImageMedia => item.kind === 'image' && item.id === id,
  )
}
