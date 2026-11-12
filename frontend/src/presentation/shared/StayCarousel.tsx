import { useRef, useState } from 'react'
import type { ImageMedia } from '../../content/types'
import { Icon } from '../../shared/components/Icon'

/**
 * Native scroll-snap carousel: swipe and trackpad work without custom
 * gesture code; buttons, arrow keys and thumbnails cover keyboards.
 */
export function StayCarousel({
  images,
  label,
  pendingLabel,
}: {
  images: ImageMedia[]
  label: string
  pendingLabel: string
}) {
  const track = useRef<HTMLUListElement>(null)
  const [index, setIndex] = useState(0)
  if (!images.length)
    return (
      <div className="xs-empty">
        <p>{pendingLabel}</p>
      </div>
    )
  const go = (next: number) => {
    const el = track.current
    if (!el) return
    const target = (next + images.length) % images.length
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({
      left: target * el.clientWidth,
      behavior: reduced ? 'auto' : 'smooth',
    })
    setIndex(target)
  }
  return (
    <div
      className="xs-carousel"
      role="group"
      aria-roledescription="carousel"
      aria-label={`${label} photographs`}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') {
          event.preventDefault()
          go(index + 1)
        }
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          go(index - 1)
        }
      }}
    >
      <ul
        ref={track}
        className="xs-track"
        tabIndex={0}
        aria-label={`${label}: use arrow keys or swipe`}
        onScroll={(event) => {
          const el = event.currentTarget
          const next = Math.round(el.scrollLeft / el.clientWidth)
          if (next !== index) setIndex(next)
        }}
      >
        {images.map((image, i) => (
          <li
            key={image.id}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${images.length}`}
          >
            <img
              src={image.src}
              width={image.width}
              height={image.height}
              alt={image.alt}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              draggable={false}
            />
          </li>
        ))}
      </ul>
      <div className="xs-bar">
        <p className="xs-caption" aria-live="polite">
          <span className="xs-count">
            {String(index + 1).padStart(2, '0')} /{' '}
            {String(images.length).padStart(2, '0')}
          </span>
          {images[index]?.caption}
        </p>
        <div className="xs-buttons">
          <button
            type="button"
            aria-label="Previous photograph"
            onClick={() => go(index - 1)}
          >
            <Icon name="previous" />
          </button>
          <button
            type="button"
            aria-label="Next photograph"
            onClick={() => go(index + 1)}
          >
            <Icon name="next" />
          </button>
        </div>
      </div>
      <ul className="xs-thumbs" aria-label="Choose a photograph">
        {images.map((image, i) => (
          <li key={image.id}>
            <button
              type="button"
              aria-label={`Show photograph ${i + 1}: ${image.caption}`}
              aria-current={i === index}
              onClick={() => go(i)}
            >
              <img
                src={image.src}
                alt=""
                width={96}
                height={72}
                loading="lazy"
                decoding="async"
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
