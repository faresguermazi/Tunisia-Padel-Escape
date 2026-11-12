import type { AccommodationOption } from '../../content/types'
import { Icon } from '../../shared/components/Icon'

export function StayFacts({ option }: { option: AccommodationOption }) {
  return (
    <dl className="xs-facts">
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
  )
}

export function StayBalance({ option }: { option: AccommodationOption }) {
  return (
    <ul className="xs-balance">
      <li>
        <span aria-label="Plus">+</span>
        {option.advantages[0]}
      </li>
      <li>
        <span aria-label="Tradeoff">−</span>
        {option.considerations[0]}
      </li>
    </ul>
  )
}

export function StayDetails({ option }: { option: AccommodationOption }) {
  return (
    <details className="xs-details">
      <summary>
        Rooms &amp; practical details
        <Icon name="down" />
      </summary>
      <div className="xs-details-grid">
        <div>
          <p className="xs-note">{option.availabilityNote}</p>
          <h4>Rooms</h4>
          <ul>
            {option.rooms.arrangements.map((room) => (
              <li key={room}>{room}</li>
            ))}
          </ul>
          <p className="xs-note">{option.rooms.sharingNote}</p>
        </div>
        <div>
          <h4>The setting</h4>
          <ul>
            {option.facilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          {option.considerations.length > 2 && (
            <>
              <h4>Also worth knowing</h4>
              <ul>
                {option.considerations.slice(2).map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </>
          )}
          <h4>Padel &amp; the neighbourhood</h4>
          <p>{option.access.padel}</p>
          <p>{option.access.neighbourhood}</p>
          <p className="xs-note">{option.access.note}</p>
        </div>
      </div>
    </details>
  )
}
