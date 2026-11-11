import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { BrandMark } from '../../shared/components/BrandMark'
import { PadelClub } from '../../features/padel-experience/PadelClub'
import { Icon } from '../../shared/components/Icon'
import {
  dayParts,
  imageById,
  price,
  shortName,
  stayImages,
  stays,
  trip,
} from '../shared/data'
import { StayCarousel } from '../shared/StayCarousel'
import { StayBalance, StayDetails, StayFacts } from '../shared/StayDetails'
import '../shared/shared.css'
import './OrderOfPlay.css'

/** A padel court in plan: 20 x 10 m, service lines 6.95 m from the net. */
function CourtLines() {
  return (
    <svg
      className="op-court"
      viewBox="0 0 200 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g pathLength={1}>
        <path pathLength={1} d="M1 1H199V99H1Z" />
        <path pathLength={1} d="M100 1V99" />
        <path pathLength={1} d="M30.5 1V99M169.5 1V99" />
        <path pathLength={1} d="M30.5 50H169.5" />
      </g>
    </svg>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const nav = useRef<HTMLElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        }),
      { rootMargin: '-15% 0px -70% 0px' },
    )
    document
      .querySelectorAll('.op main > section[id]')
      .forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    const el = nav.current
    const link = el?.querySelector<HTMLElement>(`[href="#${active}"]`)
    if (!el || !link) {
      el?.style.setProperty('--ball-o', '0')
      return
    }
    el.style.setProperty('--ball-x', `${link.offsetLeft}px`)
    el.style.setProperty('--ball-w', `${link.offsetWidth}px`)
    el.style.setProperty('--ball-o', '1')
  }, [active])
  return (
    <header
      className={`op-header${open ? ' is-open' : ''}`}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setOpen(false)
      }}
    >
      <a
        className="op-lockup"
        href="#top"
        aria-label={`${trip.title}, back to the beginning`}
      >
        <BrandMark />
        <span>
          Tunisia
          <br />
          Padel Escape
        </span>
      </a>
      <button
        type="button"
        className="op-menu"
        aria-expanded={open}
        aria-controls="op-nav"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        onClick={() => setOpen(!open)}
      >
        <Icon name={open ? 'close' : 'menu'} />
      </button>
      <nav id="op-nav" ref={nav} aria-label="Chapters">
        {trip.navigation.map((item, i) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={active === item.id ? 'location' : undefined}
            onClick={() => setOpen(false)}
          >
            <small>{String(i + 1).padStart(2, '0')}</small>
            {item.label}
          </a>
        ))}
        <i className="op-ball" aria-hidden="true" />
      </nav>
    </header>
  )
}

function Hero() {
  const image = imageById(trip.introduction.mediaId)
  return (
    <section className="op-hero" id="top" aria-labelledby="op-title">
      <CourtLines />
      <div className="op-hero-copy">
        <p className="op-kicker">
          <img
            src="/media/backgrounds/tunisia-flag.svg"
            alt="Tunisia"
            width="22"
            height="15"
          />
          {trip.introduction.eyebrow}
        </p>
        <h1 id="op-title">
          <span>Tunisia</span>
          <span>Padel</span>
          <span>Escape</span>
        </h1>
        <p className="op-flavour">{trip.introduction.flavour}</p>
      </div>
      <figure className="op-hero-photo">
        {image && (
          <img
            src={image.src}
            srcSet={`${image.smallSrc} 800w, ${image.src} ${image.width}w`}
            sizes="(min-width: 900px) 40vw, 90vw"
            width={image.width}
            height={image.height}
            alt={image.alt}
            fetchPriority="high"
          />
        )}
      </figure>
      <dl className="op-scoreline">
        <div>
          <dt>Dates</dt>
          <dd>3 — 7 Feb 2027</dd>
        </div>
        <div>
          <dt>Guests</dt>
          <dd>{trip.guestCount}</dd>
        </div>
        <div>
          <dt>Nights</dt>
          <dd>{trip.nights}</dd>
        </div>
        <div>
          <dt>Club</dt>
          <dd>{trip.program.club}</dd>
        </div>
      </dl>
    </section>
  )
}

function Journey() {
  const { program, activities } = trip
  return (
    <section
      id={program.id}
      className="op-section op-play"
      aria-labelledby="op-play-title"
    >
      <div className="op-wrap">
        <header className="op-head">
          <p className="op-num">01</p>
          <h2 id="op-play-title">{program.title}</h2>
          <p className="op-head-aside">Order of play</p>
        </header>
        <dl className="op-stats">
          {program.padelHighlights.map((item) => (
            <div key={item.value}>
              <dt>{item.value}</dt>
              <dd>{item.label}</dd>
            </div>
          ))}
        </dl>
        <ol className="op-days">
          {program.schedule.map((day) => {
            const parts = dayParts(day.date)
            const activity =
              day.kind === 'padel'
                ? activities.find((a) => a.id === day.activityId)
                : undefined
            const image = imageById(day.mediaId)
            return (
              <li
                key={day.date}
                className={`op-day op-day--${day.kind === 'padel' ? 'padel' : 'travel'}`}
              >
                <time dateTime={day.date}>
                  <strong>{parts.day}</strong>
                  <span>
                    {parts.weekday}
                    <br />
                    {parts.month}
                  </span>
                </time>
                <div className="op-day-main">
                  {activity ? (
                    <>
                      <p className="op-label">
                        <Icon name="racket" /> Morning
                      </p>
                      <h3>{activity.title}</h3>
                      <ul className="op-agenda">
                        <li>
                          <Icon name="coffee" /> {program.breakfastNote}
                        </li>
                        {activity.summary.map((point) => (
                          <li key={point}>
                            <Icon name="racket" /> {point}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : day.kind !== 'padel' ? (
                    <>
                      <p className="op-label">
                        <Icon name="plane" /> Travel day
                      </p>
                      <h3>{day.title}</h3>
                      <p>{day.description}</p>
                    </>
                  ) : null}
                </div>
                <div className="op-day-after">
                  {activity && (
                    <>
                      <p className="op-label">
                        <Icon name="sun" /> {program.afternoonLabel}
                        <span>Optional</span>
                      </p>
                      <p>{program.afternoonOption}</p>
                      <p>{program.afternoonExperiences}</p>
                    </>
                  )}
                </div>
                {image && (
                  <figure className="op-day-photo">
                    <img
                      src={image.smallSrc ?? image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      loading="lazy"
                    />
                  </figure>
                )}
              </li>
            )
          })}
        </ol>
        <p className="op-foot">{program.planningNote}</p>
      </div>
    </section>
  )
}

function Stays({
  selected,
  setSelected,
}: {
  selected: string
  setSelected: (id: string) => void
}) {
  const content = trip.stays
  const option = stays.find((s) => s.id === selected) ?? stays[0]
  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const i = stays.findIndex((s) => s.id === selected)
    const step =
      event.key === 'ArrowDown' || event.key === 'ArrowRight'
        ? 1
        : event.key === 'ArrowUp' || event.key === 'ArrowLeft'
          ? -1
          : 0
    if (!step) return
    event.preventDefault()
    const next = stays[(i + step + stays.length) % stays.length]
    setSelected(next.id)
    document.getElementById(`op-tab-${next.id}`)?.focus()
  }
  return (
    <section
      id={content.id}
      className="op-section op-stays"
      aria-labelledby="op-stays-title"
    >
      <div className="op-wrap">
        <header className="op-head">
          <p className="op-num">02</p>
          <h2 id="op-stays-title">{content.title}</h2>
          <p className="op-head-aside">Three ways to stay</p>
        </header>
        <div className="op-stay-grid">
          <div
            className="op-stay-list"
            role="tablist"
            aria-label="Stays"
            onKeyDown={onKey}
          >
            {stays.map((s) => (
              <button
                key={s.id}
                id={`op-tab-${s.id}`}
                role="tab"
                type="button"
                aria-selected={s.id === option.id}
                aria-controls="op-stay-panel"
                tabIndex={s.id === option.id ? 0 : -1}
                onClick={() => setSelected(s.id)}
              >
                <small>{s.number}</small>
                <span className="op-stay-name">
                  {shortName(s)}
                  {s.id === content.preferredAccommodationId && (
                    <span
                      className="op-star"
                      role="img"
                      aria-label="Our recommendation"
                      title="Our recommendation"
                    >
                      ★
                    </span>
                  )}
                </span>
                <span className="op-stay-where">{s.location}</span>
              </button>
            ))}
          </div>
          <div
            id="op-stay-panel"
            role="tabpanel"
            aria-labelledby={`op-tab-${option.id}`}
            className="op-stay-panel"
          >
            <StayCarousel
              key={option.id}
              images={stayImages(option)}
              label={option.name}
              pendingLabel={content.photographyNote}
            />
            <div className="op-stay-info">
              <div>
                <p className="op-label">{option.kind}</p>
                <h3 id={option.id}>{option.name}</h3>
                <StayFacts option={option} />
              </div>
              <StayBalance option={option} />
            </div>
            <StayDetails option={option} />
          </div>
        </div>
      </div>
    </section>
  )
}

function Escape({ onPick }: { onPick: (id: string) => void }) {
  const { budget } = trip
  return (
    <section
      id={budget.id}
      className="op-section op-escape"
      aria-labelledby="op-escape-title"
    >
      <div className="op-wrap">
        <header className="op-head">
          <p className="op-num">03</p>
          <h2 id="op-escape-title">{budget.title}</h2>
          <p className="op-head-aside">Per guest, EUR</p>
        </header>
        <div className="op-escape-grid">
          <ul className="op-includes">
            {budget.inclusions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <ul className="op-prices">
            {stays.map((s) => (
              <li
                key={s.id}
                className={
                  s.id === trip.stays.preferredAccommodationId
                    ? 'is-preferred'
                    : undefined
                }
              >
                <a href="#stays" onClick={() => onPick(s.id)}>
                  <span className="op-price-name">
                    {shortName(s)}
                    {s.id === trip.stays.preferredAccommodationId && (
                      <span className="op-star" aria-hidden="true">
                        ★
                      </span>
                    )}
                    {s.kind === 'Hotel' && (
                      <small>{budget.transport.hotelNote}</small>
                    )}
                  </span>
                  <span className="op-leader" aria-hidden="true" />
                  <strong>{price(s)}</strong>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="op-transport">
          <header>
            <h3>{budget.transport.title}</h3>
            <p>{budget.transport.driver}</p>
          </header>
          {budget.transport.routes.map((route) => (
            <div className="op-route" key={route.id}>
              <Icon name={route.icon} />
              <div>
                <p className="op-label">
                  {route.label} <span>{route.count}</span>
                </p>
                <p className="op-vehicle">{route.vehicle}</p>
                <p className="op-route-detail">{route.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Next() {
  const { next } = trip
  const door = imageById(next.mediaId)
  return (
    <section
      id={next.id}
      className="op-section op-next"
      aria-labelledby="op-next-title"
    >
      <div className="op-wrap op-next-grid">
        <div>
          <header className="op-head">
            <p className="op-num">04</p>
            <h2 id="op-next-title">{next.title}</h2>
          </header>
          <ol className="op-steps">
            {next.steps.map((step, i) => (
              <li key={step.title}>
                <span className="op-step-n">{i + 1}</span>
                <div>
                  <h3>
                    {step.title}
                    {step.optional && <small>Optional</small>}
                  </h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="op-closing">Your move.</p>
        </div>
        {door && (
          <figure className="op-door">
            <img
              src={door.src}
              srcSet={`${door.smallSrc} 800w, ${door.src} ${door.width}w`}
              sizes="(min-width: 900px) 34vw, 90vw"
              alt={door.alt}
              width={door.width}
              height={door.height}
              loading="lazy"
            />
          </figure>
        )}
      </div>
    </section>
  )
}

export default function OrderOfPlay() {
  const [selected, setSelected] = useState(
    trip.stays.preferredAccommodationId ?? stays[0].id,
  )
  useEffect(() => {
    const previous = document.documentElement.style.background
    document.documentElement.style.background = '#ece5d6'
    document.title = `${trip.title} · Order of play`
    return () => {
      document.documentElement.style.background = previous
    }
  }, [])
  return (
    <div className="op">
      <a className="op-skip" href="#on-the-court">
        Skip to the journey
      </a>
      <Header />
      <main>
        <Hero />
        <PadelClub content={trip.club} media={trip.media} />
        <Journey />
        <Stays selected={selected} setSelected={setSelected} />
        <Escape onPick={setSelected} />
        <Next />
      </main>
      <footer className="op-footer">
        <div className="op-wrap">
          <span className="op-footer-mark">
            <BrandMark />
          </span>
          <p>{trip.next.signoff}</p>
          <a href="#top">Back to the top ↑</a>
        </div>
      </footer>
    </div>
  )
}
