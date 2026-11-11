import { useState } from 'react'
import type { ImageMedia } from '../../content/types'

export function Photograph({
  image,
  className = '',
  eager = false,
  sizes = '100vw',
}: {
  image?: ImageMedia
  className?: string
  eager?: boolean
  sizes?: string
}) {
  const [failed, setFailed] = useState(false)
  if (!image || failed) {
    return (
      <div
        className={`photo-fallback ${className}`}
        role="img"
        aria-label="Editorial photograph pending"
      >
        <span>Light. Space. Mediterranean.</span>
        <small>Editorial photography pending</small>
      </div>
    )
  }
  return (
    <img
      className={`photograph ${className}`}
      src={image.src}
      srcSet={
        image.smallSrc
          ? `${image.smallSrc} 800w, ${image.src} ${image.width}w`
          : undefined
      }
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={image.alt}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : 'auto'}
      decoding="async"
      style={{ objectPosition: image.position }}
      onError={() => setFailed(true)}
    />
  )
}
