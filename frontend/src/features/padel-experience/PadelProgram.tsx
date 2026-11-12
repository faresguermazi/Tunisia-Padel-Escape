import { Icon } from '../../shared/components/Icon'
import type { TripContent } from '../../content/types'
import { Photograph } from '../../shared/components/Photograph'
import { findImage } from '../../content/findImage'
import { ChapterHeading } from '../../shared/components/ChapterHeading'

const weekday = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  timeZone: 'UTC',
})
const month = new Intl.DateTimeFormat('en-GB', {
  month: 'short',
  timeZone: 'UTC',
})

export function PadelProgram({
  content,
  activities,
  media,
}: {
  content: TripContent['program']
  activities: TripContent['activities']
  media: TripContent['media']
}) {
  return (
    <section
      id={content.id}
      className="program itinerary section-space"
      aria-labelledby={`${content.id}-title`}
    >
      <div className="section-container">
        <div className="program-heading">
          <ChapterHeading chapter={content} />
          <div className="club-note">
            <span className="status-dot" />
            <div>
              <strong>{content.club}</strong>
            </div>
          </div>
        </div>
        <dl className="padel-value">
          {content.padelHighlights.map((item) => (
            <div key={item.value}>
              <dt>{item.value}</dt>
              <dd>{item.label}</dd>
            </div>
          ))}
        </dl>
        <ol className="day-planner" aria-label="Proposed daily plan">
          {content.schedule.map((day) => {
            const date = new Date(`${day.date}T12:00:00Z`)
            const activity =
              day.kind === 'padel'
                ? activities.find((item) => item.id === day.activityId)
                : undefined
            return (
              <li className={`trip-day trip-day--${day.kind}`} key={day.date}>
                <time dateTime={day.date}>
                  <span>{weekday.format(date)}</span>
                  <strong>{day.date.slice(8)}</strong>
                  <span>{month.format(date)}</span>
                </time>
                <div className="trip-day-content">
                  {day.kind === 'padel' && activity ? (
                    <>
                      <p className="day-mood">{activity.rhythm}</p>
                      <h4 className="slot-label">
                        <Icon name="racket" />
                        Morning
                      </h4>
                      <p className="day-breakfast">
                        <Icon name="coffee" />
                        {content.breakfastNote}
                      </p>
                      <h3>{activity.title}</h3>
                      <ul className="session-points">
                        {activity.summary.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                      <div className="open-afternoon">
                        <div>
                          <h4 className="slot-label">
                            <Icon name="sun" />
                            {content.afternoonLabel}
                          </h4>
                          <div className="afternoon-options">
                            <small>Optional</small>
                            <ul>
                              <li>{content.afternoonOption}</li>
                              <li>{content.afternoonExperiences}</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : day.kind !== 'padel' ? (
                    <>
                      <p className="day-mood">
                        {day.kind === 'arrival'
                          ? 'The beginning'
                          : 'The goodbyes'}
                      </p>
                      <span className="slot-label">
                        <Icon name="plane" />
                        Travel day
                      </span>
                      <h3>{day.title}</h3>
                      <p className="session-copy">{day.description}</p>
                      <span className="travel-day-mark" aria-hidden="true">
                        {day.kind === 'arrival' ? '↘' : '↗'}
                      </span>
                    </>
                  ) : null}
                  {day.mediaId && (
                    <figure className="day-art">
                      <Photograph
                        image={findImage(media, day.mediaId)}
                        sizes="(min-width: 1100px) 18vw, 80vw"
                      />
                    </figure>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
        <p className="planner-note">{content.planningNote}</p>
      </div>
    </section>
  )
}
