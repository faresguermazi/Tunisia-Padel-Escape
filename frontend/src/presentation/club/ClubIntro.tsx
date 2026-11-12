import { useEffect, useRef, useState } from 'react'
import { trip } from '../shared/data'
import { ClubVideo } from './ClubVideo'
import { clubPhotos } from './clubData'
import './club.css'

/** Padel Gammarth: a photographic opening, then four short, visual cards. */
export function ClubIntro() {
  const { club } = trip
  const { photos, real } = clubPhotos()
  const lead = photos[0]
  const second = photos[1] ?? lead
  const grid = useRef<HTMLDivElement>(null)
  const [armed, setArmed] = useState(false)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = grid.current
    if (
      !el ||
      matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    )
      return
    setArmed(true)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return (
    <section id={club.id} className="cm" aria-labelledby={`${club.id}-title`}>
      <div className="cm-hero">
        {lead && (
          <img
            src={lead.src}
            srcSet={
              lead.smallSrc
                ? `${lead.smallSrc} 800w, ${lead.src} ${lead.width}w`
                : undefined
            }
            sizes="100vw"
            alt={lead.alt}
            width={lead.width}
            height={lead.height}
            loading="lazy"
            style={{ objectPosition: lead.position }}
          />
        )}
        <div className="cm-hero-copy">
          <p className="cm-kicker">{club.kicker}</p>
          <h2 id={`${club.id}-title`}>{club.title}</h2>
          <p className="cm-line">{club.line}</p>
        </div>
        {lead && !real && <p className="cm-credit">{club.imageNote}</p>}
      </div>
      <div
        ref={grid}
        className={`cm-grid${armed ? ' is-armed' : ''}${seen ? ' is-in' : ''}`}
      >
        <article className="cm-card cm-fip" style={{ ['--i' as string]: 0 }}>
          <div className="cm-fip-text">
            {second && (
              <img
                src={second.smallSrc ?? second.src}
                alt=""
                loading="lazy"
                style={{ objectPosition: second.position }}
              />
            )}
            <div>
              <p className="cm-label">{club.fip.label}</p>
              <h3>{club.fip.title}</h3>
              <p className="cm-when">{club.fip.when}</p>
              <p>{club.fip.text}</p>
            </div>
          </div>
          <ClubVideo poster={lead} className="cm-video" />
        </article>
        <article
          className="cm-card cm-coaches"
          style={{ ['--i' as string]: 1 }}
        >
          <div className="cm-coaches-head">
            <p className="cm-label">{club.coaches.label}</p>
            <h3>{club.coaches.title}</h3>
            <p>{club.coaches.line}</p>
          </div>
          <ol className="cm-values">
            {club.coaches.values.map((value) => (
              <li key={value.title}>
                <strong>{value.title}</strong>
                <span>{value.text}</span>
              </li>
            ))}
          </ol>
          <p className="cm-note">{club.coaches.note}</p>
        </article>
        <section
          className="cm-life"
          aria-label={club.life.label}
          style={{ ['--i' as string]: 2 }}
        >
          <header>
            <p className="cm-label">{club.life.label}</p>
            <h3>{club.life.title}</h3>
          </header>
          <ul>
            {club.life.tiles.map((tile) => (
              <li key={tile.word}>
                <strong>{tile.word}</strong>
                <span>{tile.text}</span>
              </li>
            ))}
          </ul>
          <p className="cm-note">{club.life.note}</p>
        </section>
      </div>
    </section>
  )
}
