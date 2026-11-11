import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { BrandMark } from '../../shared/components/BrandMark'
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
import './BlueDoor.css'

const reducedMotion = () =>
  matchMedia('(prefers-reduced-motion: reduce)').matches

/** Two halves of the approved blue-door photograph. */
function Leaves({ src }: { src: string }) {
  return (
    <div className="bd-leaves" aria-hidden="true">
      <i
        className="bd-leaf bd-leaf--l"
        style={{ backgroundImage: `url(${src})` }}
      />
      <i
        className="bd-leaf bd-leaf--r"
        style={{ backgroundImage: `url(${src})` }}
      />
    </div>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-15% 0px -70% 0px' },
    )
    document
      .querySelectorAll('.bd main > section[id]')
      .forEach((s) => observer.observe(s))
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])
  return (
    <header
      className={`bd-header${solid ? ' is-solid' : ''}${open ? ' is-open' : ''}`}
      onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
    >
      <a className="bd-lockup" href="#top" aria-label="Back to the beginning">
        <BrandMark />
        <span>{trip.title}</span>
      </a>
      <button
        type="button"
        className="bd-menu"
        aria-expanded={open}
        aria-controls="bd-nav"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        onClick={() => setOpen(!open)}
      >
        <Icon name={open ? 'close' : 'menu'} />
      </button>
      <nav id="bd-nav" aria-label="Chapters">
        {trip.navigation.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={active === item.id ? 'location' : undefined}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}

function Hero() {
  const court = imageById(trip.introduction.mediaId)
  const door = imageById(trip.next.mediaId)
  return (
    <section className="bd-hero" id="top" aria-labelledby="bd-title">
      {court && (
        <img
          className="bd-hero-bg"
          src={court.src}
          srcSet={`${court.smallSrc} 800w, ${court.src} ${court.width}w`}
          sizes="100vw"
          alt={court.alt}
          width={court.width}
          height={court.height}
          fetchPriority="high"
        />
      )}
      <div className="bd-hero-copy">
        <p className="bd-eyebrow">
          <img
            src="/media/backgrounds/tunisia-flag.svg"
            alt="Tunisia"
            width="22"
            height="15"
          />
          3–7 February 2027
        </p>
        <h1 id="bd-title">
          Tunisia
          <em>Padel Escape</em>
        </h1>
        <p className="bd-flavour">{trip.introduction.flavour}</p>
      </div>
      <a className="bd-scroll" href="#on-the-court">
        {trip.introduction.scrollLabel}
        <Icon name="down" />
      </a>
      {door && <Leaves src={door.src} />}
    </section>
  )
}

function Journey() {
  const { program, activities } = trip
  const days = useRef<HTMLOListElement>(null)
  const [armed, setArmed] = useState(false)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = days.current
    if (!el || reducedMotion() || !('IntersectionObserver' in window)) return
    setArmed(true)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return (
    <section
      id={program.id}
      className="bd-section bd-journey"
      aria-labelledby="bd-journey-title"
    >
      <div className="bd-wrap bd-title-row">
        <h2 id="bd-journey-title">{program.title}</h2>
        <dl className="bd-facts-line">
          {program.padelHighlights.map((item) => (
            <div key={item.value}>
              <dt>{item.value}</dt>
              <dd>{item.label}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="bd-wrap">
        <ol
          ref={days}
          className={`bd-days${armed ? ' is-armed' : ''}${seen ? ' is-in' : ''}`}
          aria-label="The five days"
        >
          {program.schedule.map((day, i) => {
            const parts = dayParts(day.date)
            const activity =
              day.kind === 'padel'
                ? activities.find((a) => a.id === day.activityId)
                : undefined
            const image = imageById(day.mediaId)
            return (
              <li
                key={day.date}
                className={`bd-day${activity ? ' bd-day--padel' : ' bd-day--travel'}`}
                style={{ ['--i' as string]: i }}
              >
                {image && (
                  <img
                    src={image.smallSrc ?? image.src}
                    alt=""
                    width={image.width}
                    height={image.height}
                    loading="lazy"
                  />
                )}
                <time dateTime={day.date}>
                  <strong>{parts.day}</strong>
                  <span>{parts.weekday}</span>
                </time>
                <div className="bd-day-text">
                  {activity ? (
                    <>
                      <section className="bd-block">
                        <h3 className="bd-block-title">
                          <Icon name="racket" /> Morning
                        </h3>
                        <p className="bd-line">
                          <Icon name="coffee" /> {program.breakfastNote}
                        </p>
                        <p className="bd-session">{activity.title}</p>
                        <ul>
                          {activity.summary.map((p) => (
                            <li key={p}>{p}</li>
                          ))}
                        </ul>
                      </section>
                      <section className="bd-block bd-block--after">
                        <h3 className="bd-block-title">
                          <Icon name="sun" /> {program.afternoonLabel}
                          <small>Optional</small>
                        </h3>
                        <ul>
                          <li>{program.afternoonOption}</li>
                          <li>{program.afternoonExperiences}</li>
                        </ul>
                      </section>
                    </>
                  ) : day.kind !== 'padel' ? (
                    <>
                      <p className="bd-tag">
                        <Icon name="plane" /> Travel day
                      </p>
                      <h3>{day.title}</h3>
                      <p>{day.description}</p>
                    </>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ol>
        <p className="bd-plan-note">{program.planningNote}</p>
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
    document.getElementById(`bd-tab-${next.id}`)?.focus()
  }
  return (
    <section
      id={content.id}
      className="bd-section bd-stays"
      aria-labelledby="bd-stays-title"
    >
      <div className="bd-wrap">
        <h2 id="bd-stays-title">{content.title}</h2>
        <div className="bd-stay-grid">
          <div
            className="bd-stay-list"
            role="tablist"
            aria-label="Stays"
            onKeyDown={onKey}
          >
            {stays.map((s) => (
              <button
                key={s.id}
                id={`bd-tab-${s.id}`}
                role="tab"
                type="button"
                aria-selected={s.id === option.id}
                aria-controls="bd-stay-panel"
                tabIndex={s.id === option.id ? 0 : -1}
                onClick={() => setSelected(s.id)}
              >
                <small>{s.number}</small>
                <span className="bd-stay-name">
                  {shortName(s)}
                  {s.id === content.preferredAccommodationId && (
                    <span
                      role="img"
                      aria-label="Our recommendation"
                      title="Our recommendation"
                    >
                      ★
                    </span>
                  )}
                </span>
                <span className="bd-stay-where">{s.location}</span>
              </button>
            ))}
          </div>
          <div
            id="bd-stay-panel"
            role="tabpanel"
            aria-labelledby={`bd-tab-${option.id}`}
            className="bd-stay"
            key={option.id}
          >
            <StayCarousel
              images={stayImages(option)}
              label={option.name}
              pendingLabel={content.photographyNote}
            />
            <div className="bd-stay-info">
              <div>
                <p className="bd-tag">{option.kind}</p>
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
      className="bd-section bd-escape"
      aria-labelledby="bd-escape-title"
    >
      <div className="bd-wrap">
        <h2 id="bd-escape-title">{budget.title}</h2>
        <ul className="bd-prices">
          {stays.map((s) => {
            const preferred = s.id === trip.stays.preferredAccommodationId
            return (
              <li key={s.id} className={preferred ? 'is-preferred' : undefined}>
                <article>
                  {preferred && (
                    <span className="bd-reco">★ Our recommendation</span>
                  )}
                  <h3>{s.name}</h3>
                  <strong>{price(s)}</strong>
                  {s.kind === 'Hotel' && (
                    <small>{budget.transport.hotelNote}</small>
                  )}
                  <a href="#stays" onClick={() => onPick(s.id)}>
                    See the stay <Icon name="arrow" />
                  </a>
                </article>
              </li>
            )
          })}
        </ul>
        <ul className="bd-includes" aria-label="Included">
          {budget.inclusions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="bd-transport">
          <h3>{budget.transport.title}</h3>
          <p className="bd-driver">{budget.transport.driver}</p>
          <div className="bd-routes">
            {budget.transport.routes.map((route) => (
              <div className="bd-route" key={route.id}>
                <Icon name={route.icon} />
                <div className="bd-route-line" aria-hidden="true" />
                <p>
                  <b>{route.label}</b> · {route.count}
                  <br />
                  {route.vehicle} — {route.detail.toLowerCase()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Next() {
  const { next } = trip
  const door = imageById(next.mediaId)
  const backdrop = imageById('sidi-coast')
  const stage = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = stage.current
    if (!el) return
    const still = reducedMotion()
    let frame = 0
    const update = () => {
      frame = 0
      const r = el.getBoundingClientRect()
      const range = Math.max(1, r.height - window.innerHeight)
      const raw = still ? 1 : Math.min(1, Math.max(0, -r.top / range))
      // doors shut over the first 70% of the scroll, then rest
      const p = Math.min(1, raw / 0.7)
      el.style.setProperty('--p', String(1 - Math.pow(1 - p, 3)))
      el.style.setProperty(
        '--t',
        String(Math.min(1, Math.max(0, (raw - 0.6) / 0.3))),
      )
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])
  return (
    <section
      id={next.id}
      className="bd-section bd-next"
      aria-labelledby="bd-next-title"
    >
      <div className="bd-wrap">
        <h2 id="bd-next-title">{next.title}</h2>
        <ol className="bd-steps">
          {next.steps.map((step, i) => (
            <li key={step.title}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <h3>
                {step.title}
                {step.optional && <small>Optional</small>}
              </h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className="bd-close" ref={stage}>
        <div className="bd-close-stage">
          {door && (
            <>
              {backdrop && (
                <img
                  className="bd-close-bg"
                  src={backdrop.smallSrc ?? backdrop.src}
                  alt=""
                  width={backdrop.width}
                  height={backdrop.height}
                  loading="lazy"
                />
              )}
              <Leaves src={door.src} />
            </>
          )}
          <p className="bd-signoff">{next.signoff}</p>
        </div>
      </div>
    </section>
  )
}

export default function BlueDoor() {
  const [selected, setSelected] = useState(
    trip.stays.preferredAccommodationId ?? stays[0].id,
  )
  useEffect(() => {
    const previous = document.documentElement.style.background
    document.documentElement.style.background = '#08172b'
    document.title = `${trip.title} · The blue door`
    return () => {
      document.documentElement.style.background = previous
    }
  }, [])
  return (
    <div className="bd">
      <a className="bd-skip" href="#on-the-court">
        Skip to the journey
      </a>
      <Header />
      <main>
        <Hero />
        <Journey />
        <Stays selected={selected} setSelected={setSelected} />
        <Escape onPick={setSelected} />
        <Next />
      </main>
      <footer className="bd-footer">
        <BrandMark />
        <span>{trip.title}</span>
        <a href="#top">Back to the top ↑</a>
      </footer>
    </div>
  )
}
