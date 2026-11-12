import { useEffect, useRef, type KeyboardEvent } from 'react'
import { Icon } from '../../shared/components/Icon'
import { imageById, shortName, stayImages, stays, trip } from '../shared/data'
import { StayCarousel } from '../shared/StayCarousel'
import { StayBalance, StayDetails, StayFacts } from '../shared/StayDetails'
import '../shared/shared.css'
import './BlueDoor.css'

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

export function BlueDoorHero({ hybrid = false }: { hybrid?: boolean }) {
  const court = imageById(trip.introduction.mediaId)
  const door = imageById(trip.next.mediaId)
  return (
    <section
      className={hybrid ? 'bd bd-hero hybrid-hero' : 'bd-hero'}
      id={hybrid ? 'invitation' : 'top'}
      aria-labelledby="bd-title"
    >
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
          {trip.dateLabel}
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

export function BlueDoorStays({
  selected,
  setSelected,
  hybrid = false,
}: {
  selected: string
  setSelected: (id: string) => void
  hybrid?: boolean
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
      className={`bd-section bd-stays${hybrid ? ' bd hybrid-stays' : ''}`}
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

export function BlueDoorClosing({ hybrid = false }: { hybrid?: boolean }) {
  const { next } = trip
  const door = imageById(next.mediaId)
  const backdrop = imageById('sidi-coast')
  const stage = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = stage.current
    if (!el) return
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    const update = () => {
      frame = 0
      const r = el.getBoundingClientRect()
      const range = Math.max(1, r.height - window.innerHeight)
      const raw = preference.matches
        ? 1
        : Math.min(1, Math.max(0, -r.top / range))
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
    preference.addEventListener('change', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      preference.removeEventListener('change', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])
  return (
    <div
      className={hybrid ? 'bd bd-close hybrid-closing' : 'bd-close'}
      ref={stage}
    >
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
  )
}
