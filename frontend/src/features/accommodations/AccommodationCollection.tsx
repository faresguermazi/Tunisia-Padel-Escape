import type {
  AccommodationOption,
  ImageMedia,
  TripContent,
} from '../../content/types'
import { useEffect, useId, useState } from 'react'
import { ChapterHeading } from '../../shared/components/ChapterHeading'
import { Gallery } from '../../shared/components/Gallery'
import { Icon } from '../../shared/components/Icon'
import { TabList } from '../../shared/components/TabList'

function AccommodationChapter({
  option,
  media,
  pendingLabel,
  comparison = true,
  preferred = false,
}: {
  option: AccommodationOption
  media: TripContent['media']
  pendingLabel: string
  comparison?: boolean
  preferred?: boolean
}) {
  const orderedIds = [
    ...new Set(
      [option.coverMediaId, ...option.mediaIds].filter((id): id is string =>
        Boolean(id),
      ),
    ),
  ]
  const images = orderedIds.flatMap((id) => {
    const image = media.find(
      (item): item is ImageMedia =>
        item.id === id && item.kind === 'image' && item.context === 'property',
    )
    return image ? [image] : []
  })
  const videos = option.mediaIds.flatMap((id) => {
    const video = media.find((item) => item.id === id && item.kind !== 'image')
    return video && video.kind !== 'image' ? [video] : []
  })

  return (
    <article
      id={option.id}
      className={`accommodation-chapter${preferred ? ' is-preferred' : ''}`}
      aria-labelledby={`${option.id}-title`}
    >
      <div className="accommodation-visual">
        <span className="property-index" aria-hidden="true">
          {option.number}
        </span>
        <div className="property-gallery-frame">
          <Gallery
            images={images}
            label={option.name}
            pendingLabel={pendingLabel}
            cover
          />
          {preferred && (
            <span
              className="stay-recommendation"
              role="img"
              aria-label="Our recommendation"
              title="Our recommendation"
            >
              <span aria-hidden="true">★</span>
            </span>
          )}
        </div>
        {videos.map((video) => (
          <div key={video.id} className="property-video">
            {video.kind === 'video' && video.localSrc ? (
              <video
                controls
                playsInline
                preload="none"
                poster={video.posterSrc}
                aria-label={video.title}
              >
                <source src={video.localSrc} />
                {video.captionsSrc && (
                  <track
                    kind="captions"
                    src={video.captionsSrc}
                    srcLang="en"
                    label="English"
                    default
                  />
                )}
                <a href={video.localSrc}>{video.title}</a>
              </video>
            ) : (
              <a
                className="text-link"
                href={video.url}
                target="_blank"
                rel="noreferrer"
              >
                {video.title}
                <Icon name="external" />
              </a>
            )}
          </div>
        ))}
      </div>
      <div className="accommodation-copy">
        <div className="property-intro">
          <div className="property-kicker">
            <p className="eyebrow">{option.kind}</p>
          </div>
          <h3 id={`${option.id}-title`}>{option.name}</h3>
          <p className="property-location">{option.location}</p>
          <ul className="property-highlights">
            {option.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
          <dl className="property-facts">
            {option.facts.map((fact) => (
              <div key={fact.label}>
                <dt>
                  {fact.icon && <Icon name={fact.icon} />}
                  <span>{fact.label}</span>
                </dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="stay-perspective">
          <p>
            <span className="stay-symbol" aria-label="Plus">
              +
            </span>
            <span>{option.advantages[0]}</span>
          </p>
          <p>
            <span className="stay-symbol" aria-label="Tradeoff">
              −
            </span>
            <span>{option.considerations[0]}</span>
          </p>
        </div>
        <details className="property-details">
          <summary>
            Rooms & practical details
            <Icon name="down" />
          </summary>
          <div className="property-detail-grid">
            <div>
              <p className="availability-detail">{option.availabilityNote}</p>
              <h4>Rooms</h4>
              <ul>
                {option.rooms.arrangements.map((room) => (
                  <li key={room}>{room}</li>
                ))}
              </ul>
              <p className="sharing-note">{option.rooms.sharingNote}</p>
            </div>
            <div>
              <h4>The setting</h4>
              <ul>
                {option.facilities.map((facility) => (
                  <li key={facility}>{facility}</li>
                ))}
              </ul>
            </div>
            <div>
              {comparison && option.considerations.length > 2 && (
                <>
                  <h4>Also worth knowing</h4>
                  <ul>
                    {option.considerations.slice(2).map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </>
              )}
              <h4>Padel & the neighbourhood</h4>
              <p>{option.access.padel}</p>
              <p>{option.access.neighbourhood}</p>
              <p className="fine-print">{option.access.note}</p>
            </div>
          </div>
        </details>
      </div>
    </article>
  )
}

export function AccommodationCollection({
  content,
  options,
  media,
  hotel,
}: {
  content: TripContent['stays']
  options: TripContent['accommodations']
  media: TripContent['media']
  hotel: TripContent['hotel']
}) {
  const prefix = useId()
  const [category, setCategory] = useState('villas')
  const [villa, setVilla] = useState(options[0]?.id ?? '')
  const selectedId = content.selectedAccommodationId
  const visibleVillas = selectedId
    ? options.filter((option) => option.id === selectedId)
    : options
  const showHotel = !selectedId || selectedId === hotel.id
  const comparison = !selectedId
  const tabbed = comparison
  useEffect(() => {
    const showStay = (id: string) => {
      if (options.some((option) => option.id === id)) {
        setCategory('villas')
        setVilla(id)
      } else if (id === hotel.id) setCategory('hotel')
      if (options.some((option) => option.id === id) || id === hotel.id)
        requestAnimationFrame(() =>
          document.getElementById(id)?.scrollIntoView({ block: 'start' }),
        )
    }
    const syncHash = () => showStay(window.location.hash.slice(1))
    // A repeated link to the same hash must reopen its stay after a manual tab change.
    const followStayLink = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return
      const href = event.target.closest('a')?.getAttribute('href')
      if (href?.startsWith('#')) showStay(href.slice(1))
    }
    window.addEventListener('hashchange', syncHash)
    document.addEventListener('click', followStayLink)
    syncHash()
    return () => {
      window.removeEventListener('hashchange', syncHash)
      document.removeEventListener('click', followStayLink)
    }
  }, [options, hotel.id])
  const renderProperty = (option: AccommodationOption) => (
    <AccommodationChapter
      key={option.id}
      option={option}
      media={media}
      pendingLabel={content.photographyNote}
      comparison={comparison}
      preferred={content.preferredAccommodationId === option.id}
    />
  )
  return (
    <section
      id={content.id}
      className="stays section-space section-container"
      aria-labelledby={`${content.id}-title`}
    >
      <div className="collection-heading">
        <ChapterHeading chapter={content} />
      </div>
      {tabbed ? (
        <div className="tabbed-accommodation">
          <TabList
            items={[
              { id: 'villas', label: 'Villas' },
              { id: 'hotel', label: hotel.name },
            ]}
            value={category}
            onChange={setCategory}
            label="Accommodation format"
            prefix={`${prefix}-format`}
          />
          <div
            role="tabpanel"
            id={`${prefix}-format-panel-villas`}
            aria-labelledby={`${prefix}-format-tab-villas`}
            hidden={category !== 'villas'}
            tabIndex={0}
          >
            <TabList
              items={options.map((option) => ({
                id: option.id,
                label: option.name,
                badge:
                  content.preferredAccommodationId === option.id
                    ? 'Our recommendation'
                    : undefined,
              }))}
              value={villa}
              onChange={setVilla}
              label="Villa choices"
              prefix={`${prefix}-villa`}
            />
            <div className="collection">
              {options.map((option) => (
                <div
                  role="tabpanel"
                  key={option.id}
                  id={`${prefix}-villa-panel-${option.id}`}
                  aria-labelledby={`${prefix}-villa-tab-${option.id}`}
                  hidden={villa !== option.id}
                  tabIndex={0}
                >
                  {renderProperty(option)}
                </div>
              ))}
            </div>
          </div>
          <div
            role="tabpanel"
            id={`${prefix}-format-panel-hotel`}
            aria-labelledby={`${prefix}-format-tab-hotel`}
            hidden={category !== 'hotel'}
            tabIndex={0}
          >
            <div className="collection hotel-collection">
              {renderProperty(hotel)}
            </div>
          </div>
        </div>
      ) : (
        <>
          {visibleVillas.length > 0 && (
            <>
              <div className="collection">
                {visibleVillas.map(renderProperty)}
              </div>
            </>
          )}
          {showHotel && (
            <div className="hotel-section">
              <p className="eyebrow">The hotel alternative</p>
              <div className="collection hotel-collection">
                {renderProperty(hotel)}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}
