import { trip, stays } from '../shared/data'
import { Navigation } from '../../app/Navigation'
import { ClubIntro } from '../club/ClubIntro'
import { useStaySelection } from '../shared/useStaySelection'
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
  const [selected, setSelected] = useStaySelection()
  return (
    <div className="petrol-door">
      <title>{trip.title}</title>
      <a className="skip-link" href="#on-the-court">
        Skip to the journey
      </a>
      <Navigation trip={trip} />
      <main>
        <BlueDoorHero hybrid />
        <ClubIntro />
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
