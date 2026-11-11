import { Icon } from '../../shared/components/Icon'
import type { PackageEstimate, TripContent } from '../../content/types'
import { ChapterHeading } from '../../shared/components/ChapterHeading'

function PackageQuote({
  option,
  estimate,
  pendingLabel,
  preferred = false,
  transferNote,
}: {
  option: TripContent['hotel']
  estimate: PackageEstimate
  pendingLabel: string
  preferred?: boolean
  transferNote?: string
}) {
  return (
    <article className={`package-quote${preferred ? ' is-preferred' : ''}`}>
      {preferred && <span className="preferred-label">Our recommendation</span>}
      <h3>{option.name}</h3>
      <p className="package-amount">
        {estimate.state === 'estimated'
          ? new Intl.NumberFormat('en-GB', {
              style: 'currency',
              currency: estimate.currency,
              maximumFractionDigits: 0,
            }).format(estimate.amountPerGuest)
          : pendingLabel}
      </p>
      {transferNote && <p className="hotel-transfer-note">{transferNote}</p>}
      <a href={`#${option.id}`} className="package-explore">
        See the stay <span aria-hidden="true">&rarr;</span>
      </a>
    </article>
  )
}

export function PackageOptions({
  content,
  accommodations,
  preferredId,
}: {
  content: TripContent['budget']
  accommodations: TripContent['accommodations']
  preferredId: string | null
}) {
  return (
    <section
      id={content.id}
      className="trip-details section-space section-container"
      aria-labelledby={`${content.id}-title`}
    >
      <ChapterHeading chapter={content} />
      <ul className="escape-inclusions">
        {content.inclusions.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="package-comparison">
        {accommodations.map((option) => (
          <PackageQuote
            key={option.id}
            option={option}
            estimate={option.estimate}
            pendingLabel={content.pendingLabel}
            preferred={option.id === preferredId}
            transferNote={
              option.kind === 'Hotel' ? content.transport.hotelNote : undefined
            }
          />
        ))}
      </div>
      <aside className="transfer-story" aria-label="Included private transport">
        <header>
          <h3>{content.transport.title}</h3>
          <p>{content.transport.driver}</p>
        </header>
        <div className="transfer-routes">
          {content.transport.routes.map((route) => (
            <div className="transfer-route" key={route.id}>
              <Icon name={route.icon} />
              <div>
                <span className="transfer-route-label">
                  {route.label}
                  <strong>{route.count}</strong>
                </span>
                <h4>{route.vehicle}</h4>
                <p>{route.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </section>
  )
}
