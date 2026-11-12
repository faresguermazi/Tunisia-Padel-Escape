import type { ImageMedia } from '../../content/types'
import { Icon } from '../../shared/components/Icon'
import { trip } from '../shared/data'

/** A poster that opens the original Instagram post. No video is hosted or embedded. */
export function ClubVideo({
  poster,
  className = '',
}: {
  poster?: ImageMedia
  className?: string
}) {
  const { video } = trip.club
  return (
    <a
      className={`club-video ${className}`}
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {poster && (
        <img
          src={poster.smallSrc ?? poster.src}
          alt=""
          width={poster.width}
          height={poster.height}
          loading="lazy"
          style={{ objectPosition: poster.position }}
        />
      )}
      <span className="club-video-play" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22">
          <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
        </svg>
      </span>
      <span className="club-video-text">
        <small>{video.label}</small>
        <span>
          {video.action} <Icon name="external" />
          <span className="visually-hidden">
            {' '}
            (opens in a new tab). {video.note}
          </span>
        </span>
      </span>
    </a>
  )
}
