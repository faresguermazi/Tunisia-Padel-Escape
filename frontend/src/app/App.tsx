import { usePresentationMotion } from '../shared/usePresentationMotion'
import { lazy, Suspense } from 'react'
import { trip } from '../content/trip'
import { TripIntroduction } from '../features/introduction/TripIntroduction'
import { PadelProgram } from '../features/padel-experience/PadelProgram'
import { PadelClub } from '../features/padel-experience/PadelClub'
import { AccommodationCollection } from '../features/accommodations/AccommodationCollection'
import { PackageOptions } from '../features/budget/PackageOptions'
import { NextSteps } from '../features/trip-information/NextSteps'
import { Navigation } from './Navigation'

const reviewEnabled = import.meta.env.DEV || import.meta.env.MODE === 'review'
const IdentityStudy = import.meta.env.DEV
  ? lazy(() => import('../features/identity-study/IdentityStudy'))
  : null
const PadelPointer = reviewEnabled
  ? lazy(() => import('../features/creative-study/PadelPointer'))
  : null

function ReferencePresentation() {
  usePresentationMotion('collection')
  return (
    <>
      <Navigation trip={trip} />
      <main>
        <TripIntroduction trip={trip} />
        <PadelClub content={trip.club} media={trip.media} />
        <PadelProgram
          content={trip.program}
          activities={trip.activities}
          media={trip.media}
        />
        <AccommodationCollection
          content={trip.stays}
          options={trip.accommodations}
          media={trip.media}
          hotel={trip.hotel}
        />
        <PackageOptions
          content={trip.budget}
          accommodations={[...trip.accommodations, trip.hotel]}
          preferredId={trip.stays.preferredAccommodationId}
        />
        <NextSteps
          content={trip.next}
          title={trip.title}
          media={trip.media}
          closingStudy
        />
      </main>
    </>
  )
}

export default function App() {
  if (
    IdentityStudy &&
    new URLSearchParams(window.location.search).get('study') === 'identity'
  ) {
    return (
      <Suspense fallback={<p>Opening the identity study…</p>}>
        <IdentityStudy />
      </Suspense>
    )
  }
  return (
    <>
      <title>{trip.title}</title>
      <meta name="description" content={trip.introduction.flavour} />
      <a className="skip-link" href="#on-the-court">
        Skip to the padel experience
      </a>
      <ReferencePresentation />
      {PadelPointer && (
        <Suspense fallback={null}>
          <PadelPointer />
        </Suspense>
      )}
    </>
  )
}
