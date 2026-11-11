import { useEffect, useRef, useState } from 'react'
import type { ImageMedia } from '../../content/types'
import { Photograph } from './Photograph'
import { Icon } from './Icon'

export function Gallery({
  images,
  label,
  pendingLabel = 'Property photography pending',
  cover = false,
}: {
  images: ImageMedia[]
  label: string
  pendingLabel?: string
  cover?: boolean
}) {
  const [index, setIndex] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const active = index === null ? undefined : images[index]

  useEffect(() => {
    const dialog = dialogRef.current
    if (index === null || !dialog) return
    if (!dialog.open) dialog.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [index])

  function close() {
    dialogRef.current?.close()
    setIndex(null)
  }

  function navigate(direction: number) {
    setIndex((current) =>
      current === null
        ? null
        : (current + direction + images.length) % images.length,
    )
  }

  if (!images.length) {
    return (
      <div className="gallery-empty">
        <div className="architectural-mark" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <p>{pendingLabel}</p>
      </div>
    )
  }

  return (
    <div className={`gallery${cover ? ' gallery--cover' : ''}`}>
      <div className="gallery-grid">
        {images.slice(0, cover ? 5 : 4).map((image, imageIndex) => (
          <button
            type="button"
            className="gallery-image"
            key={image.id}
            aria-label={`Open ${label}: ${image.caption}, photo ${imageIndex + 1} of ${images.length}`}
            onClick={() => setIndex(imageIndex)}
          >
            <Photograph image={image} sizes="(min-width: 900px) 55vw, 100vw" />
            <span>
              {imageIndex === 0
                ? `View photos · ${images.length.toString().padStart(2, '0')}`
                : `${imageIndex + 1}`}
              <Icon name="external" />
            </span>
          </button>
        ))}
      </div>
      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label={`${label} photo gallery`}
        onCancel={(event) => {
          event.preventDefault()
          close()
        }}
        onClose={() => setIndex(null)}
        onKeyDown={(event) => {
          if (event.key === 'Tab') {
            const controls = event.currentTarget.querySelectorAll<HTMLElement>(
              'button:not(:disabled), a[href]',
            )
            const first = controls[0]
            const last = controls[controls.length - 1]
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault()
              last?.focus()
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault()
              first?.focus()
            }
          }
          if (event.key === 'ArrowRight') {
            event.preventDefault()
            navigate(1)
          }
          if (event.key === 'ArrowLeft') {
            event.preventDefault()
            navigate(-1)
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close()
        }}
      >
        {active && (
          <>
            <header className="lightbox-header">
              <span>{label}</span>
              <span>
                {(index ?? 0) + 1} / {images.length}
              </span>
              <button
                type="button"
                className="icon-button"
                aria-label="Close gallery"
                onClick={close}
                autoFocus
              >
                <Icon name="close" />
              </button>
            </header>
            <div
              className="lightbox-stage"
              onTouchStart={(event) => {
                const touch = event.changedTouches[0]
                touchStart.current = { x: touch.clientX, y: touch.clientY }
              }}
              onTouchEnd={(event) => {
                const start = touchStart.current
                touchStart.current = null
                if (!start || images.length < 2) return
                const touch = event.changedTouches[0]
                const dx = touch.clientX - start.x
                const dy = touch.clientY - start.y
                if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4)
                  navigate(dx < 0 ? 1 : -1)
              }}
            >
              <Photograph key={active.id} image={active} eager />
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    className="lightbox-previous icon-button"
                    aria-label="Previous photograph"
                    onClick={() => navigate(-1)}
                  >
                    <Icon name="previous" />
                  </button>
                  <button
                    type="button"
                    className="lightbox-next icon-button"
                    aria-label="Next photograph"
                    onClick={() => navigate(1)}
                  >
                    <Icon name="next" />
                  </button>
                </>
              )}
            </div>
            <footer className="lightbox-caption">
              <p>{active.caption}</p>
              {active.context === 'editorial' ? (
                <a href={active.sourceUrl} target="_blank" rel="noreferrer">
                  {active.credit} · {active.license}
                  <Icon name="external" />
                </a>
              ) : (
                <span className="property-photo-credit">
                  {active.credit} · {active.license}
                </span>
              )}
              <span className="lightbox-hint">
                Swipe or use arrow keys · Esc to close
              </span>
            </footer>
          </>
        )}
      </dialog>
    </div>
  )
}
