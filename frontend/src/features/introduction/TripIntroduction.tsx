import { TunisiaFlag } from '../../shared/components/TunisiaFlag'
import type { TripContent } from '../../content/types'
import { Photograph } from '../../shared/components/Photograph'
import { findImage } from '../../content/findImage'
import { Icon } from '../../shared/components/Icon'

export function TripIntroduction({ trip }: { trip: TripContent }) {
  const intro = trip.introduction
  return (
    <section
      id="invitation"
      className="invitation"
      aria-labelledby="invitation-title"
    >
      <div className="hero-image">
        <Photograph image={findImage(trip.media, intro.mediaId)} eager />
        <div className="hero-shade" />
      </div>
      <div className="hero-content">
        <p className="eyebrow hero-eyebrow">
          <TunisiaFlag />
          {intro.eyebrow}
        </p>
        <h1 id="invitation-title">
          {intro.title}
          <br />
          <em>{intro.accent}</em>
          <span className="title-full-stop">.</span>
        </h1>
        <p className="hero-flavour">{intro.flavour}</p>
        {intro.description && (
          <p className="hero-description">{intro.description}</p>
        )}
        <div className="hero-facts">
          <span>{trip.dateLabel}</span>
          <span>{trip.guestCount} guests</span>
          <span>{trip.nights} nights</span>
        </div>
        <a href={`#${trip.program.id}`} className="hero-scroll">
          <span>{intro.scrollLabel}</span>
          <Icon name="down" />
        </a>
      </div>
      <span className="hero-count" aria-hidden="true">
        {trip.guestCount.toString().padStart(2, '0')}
      </span>
    </section>
  )
}
