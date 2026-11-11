import type { padelClub } from '../../content/padelClub'
import type { TripContent } from '../../content/types'
import { findImage } from '../../content/findImage'
import { ChapterHeading } from '../../shared/components/ChapterHeading'
import { Photograph } from '../../shared/components/Photograph'
import { Icon } from '../../shared/components/Icon'
import './PadelClub.css'

export function PadelClub({
  content,
  media,
}: {
  content: typeof padelClub
  media: TripContent['media']
}) {
  return (
    <section
      id={content.id}
      className="padel-club section-space"
      aria-labelledby={`${content.id}-title`}
    >
      <div className="section-container">
        <ChapterHeading chapter={content} />
        <div className="padel-club-layout">
          <figure className="padel-club-image">
            <Photograph image={findImage(media, content.mediaId)} />
            <figcaption>{content.imageNote}</figcaption>
          </figure>
          <div className="padel-club-copy">
            <div>
              <h3>{content.settingTitle}</h3>
              <p>{content.setting}</p>
            </div>
            <div className="padel-club-coaching">
              <Icon name="racket" />
              <div>
                <h3>{content.coachingTitle}</h3>
                <p>{content.coaching}</p>
                <p className="padel-club-note">{content.coachingNote}</p>
              </div>
            </div>
            <details className="padel-club-details">
              <summary>
                {content.detailsLabel}
                <Icon name="down" />
              </summary>
              <p>{content.facilities}</p>
            </details>
          </div>
        </div>
      </div>
    </section>
  )
}
