import { useEffect, useState } from 'react'
import { trip, stays } from '../shared/data'
import { Navigation } from '../../app/Navigation'
import { PadelClub } from '../../features/padel-experience/PadelClub'
import { PadelProgram } from '../../features/padel-experience/PadelProgram'
import { PackageOptions } from '../../features/budget/PackageOptions'
import { NextSteps } from '../../features/trip-information/NextSteps'
import { usePresentationMotion } from '../../shared/usePresentationMotion'
import {
  BlueDoorHero,
  BlueDoorStays,
  BlueDoorClosing,
} from '../blue-door/BlueDoor'
import './PetrolDoor.css'

export default function PetrolDoor() {
  usePresentationMotion('collection')
  const [selected, setSelected] = useState(
    trip.stays.preferredAccommodationId ?? stays[0].id,
  )
  useEffect(() => {
    const selectStay = (id: string) => {
      if (!stays.some((stay) => stay.id === id)) return
      setSelected(id)
      requestAnimationFrame(() =>
        document.getElementById(id)?.scrollIntoView({ block: 'start' }),
      )
    }
    const sync = () => selectStay(window.location.hash.slice(1))
    const click = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return
      const href = event.target.closest('a')?.getAttribute('href')
      if (href?.startsWith('#')) selectStay(href.slice(1))
    }
    sync()
    window.addEventListener('hashchange', sync)
    document.addEventListener('click', click)
    return () => {
      window.removeEventListener('hashchange', sync)
      document.removeEventListener('click', click)
    }
  }, [])
  return (
    <div className="petrol-door">
      <title>{`${trip.title} · Petrol & doors`}</title>
      <a className="skip-link" href="#on-the-court">
        Skip to the journey
      </a>
      <Navigation trip={trip} />
      <main>
        <BlueDoorHero hybrid />
        <PadelClub content={trip.club} media={trip.media} />
        <PadelProgram
          content={trip.program}
          activities={trip.activities}
          media={trip.media}
        />
        <BlueDoorStays hybrid selected={selected} setSelected={setSelected} />
        <PackageOptions
          content={trip.budget}
          accommodations={stays}
          preferredId={trip.stays.preferredAccommodationId}
        />
        <NextSteps
          content={trip.next}
          title={trip.title}
          media={trip.media}
          closing={<BlueDoorClosing hybrid />}
        />
      </main>
    </div>
  )
}
