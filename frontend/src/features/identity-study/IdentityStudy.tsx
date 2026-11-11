import { useEffect, useState } from 'react'
import { identityStudy } from '../../content/identityStudy'
import { trip } from '../../content/trip'
import lettering from './assets/tunis-lettering.json'
import './IdentityStudy.css'

function Racket({
  turning = false,
  onEnd,
}: {
  turning?: boolean
  onEnd?: () => void
}) {
  return (
    <svg
      className={`identity-racket${turning ? ' is-turning' : ''}`}
      viewBox="0 0 120 180"
      aria-hidden="true"
      onAnimationEnd={onEnd}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M60 10C30 10 10 29 10 58C10 87 29 108 47 125L52 142V166Q60 170 68 166V142L73 125C91 108 110 87 110 58C110 29 90 10 60 10Z" />
        <path
          d="M20 53C22 30 38 19 60 19C82 19 98 30 100 53"
          strokeWidth=".65"
        />
        <path
          d="M29 98Q60 125 91 98M47 125L60 140L73 125M52 147H68M52 162H68"
          strokeWidth=".9"
        />
      </g>
      <circle className="identity-lime-point" cx="60" cy="31" r="1.7" />
      <svg
        className="identity-lettering"
        x="24"
        y="39"
        width="72"
        height="48"
        viewBox={lettering.viewBox}
      >
        <path d={lettering.path} fill="currentColor" fillRule="nonzero" />
      </svg>
    </svg>
  )
}

function Signature({
  turning = false,
  onEnd,
}: {
  turning?: boolean
  onEnd?: () => void
}) {
  return (
    <div
      className="identity-signature"
      role="img"
      aria-label="Tunis padel identity: تونس integrated inside a fine racket"
    >
      <div className="identity-racket-space">
        <Racket turning={turning} onEnd={onEnd} />
      </div>
      <span className="identity-latin" aria-hidden="true">
        PADEL ESCAPE
      </span>
    </div>
  )
}

export default function IdentityStudy() {
  const [reduced, setReduced] = useState(
    () => matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [turning, setTurning] = useState(false)
  const [take, setTake] = useState(0)
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => {
      setReduced(preference.matches)
      if (preference.matches) setTurning(false)
    }
    preference.addEventListener('change', change)
    return () => preference.removeEventListener('change', change)
  }, [])
  return (
    <main className="identity-study">
      <title>{`Identity study · ${trip.title}`}</title>
      <header className="identity-study-header">
        <a href="/">← Back to the presentation</a>
        <span>LOCAL STUDY / 02</span>
      </header>
      <div className="identity-intro">
        <h1>{identityStudy.title}</h1>
        <p>{identityStudy.description}</p>
      </div>
      <section className="identity-stage" aria-label="Large identity study">
        <span className="identity-specimen-label">TUNIS / THE SIGNATURE</span>
        <Signature
          key={take}
          turning={turning && !reduced}
          onEnd={() => setTurning(false)}
        />
        <div className="identity-stage-bottom">
          <span>IVORY · PETROL · A POINT OF LIME</span>
          <button
            type="button"
            disabled={reduced}
            onClick={() => {
              if (turning) setTurning(false)
              else {
                setTake((value) => value + 1)
                setTurning(true)
              }
            }}
          >
            {reduced
              ? 'Still · reduced motion'
              : turning
                ? 'Stop motion'
                : 'Play one turn'}
            <span aria-hidden="true">{turning ? 'Ⅱ' : '↻'}</span>
          </button>
        </div>
      </section>
      <p className="identity-motion-note">{identityStudy.motion}</p>
      <div className="identity-proofs">
        <section className="identity-paper" aria-labelledby="paper-proof-title">
          <h2 id="paper-proof-title">On warm paper</h2>
          <Signature />
        </section>
        <section
          className="identity-header-proof"
          aria-labelledby="header-proof-title"
        >
          <h2 id="header-proof-title">At header size</h2>
          <div className="identity-header-sample">
            <span
              className="identity-header-emblem"
              role="img"
              aria-label="Tunis inside a padel racket"
            >
              <Racket />
            </span>
            <span>{trip.title}</span>
          </div>
          <p>{identityStudy.smallNote}</p>
        </section>
      </div>
      <footer className="identity-study-footer">
        <p>{identityStudy.lettering.note}</p>
        <a
          href={identityStudy.lettering.source}
          target="_blank"
          rel="noreferrer"
        >
          {identityStudy.lettering.typeface} / {identityStudy.lettering.credit}
        </a>
        <span>{identityStudy.lettering.license}</span>
      </footer>
    </main>
  )
}
