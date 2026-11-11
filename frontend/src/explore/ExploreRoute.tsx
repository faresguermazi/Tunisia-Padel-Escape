import { lazy, Suspense } from 'react'
import VersionSwitcher from './VersionSwitcher'

const PetrolDoor = lazy(() => import('./petrol-door/PetrolDoor'))
const BlueDoor = lazy(() => import('./blue-door/BlueDoor'))

/** Local-only creative studies. Never imported by the production entry. */
export default function ExploreRoute({ direction }: { direction: string }) {
  return (
    <>
      <Suspense fallback={<p style={{ padding: 24 }}>Opening the study…</p>}>
        {direction === 'petrol-door' ? <PetrolDoor /> : <BlueDoor />}
      </Suspense>
      <VersionSwitcher current={direction} />
    </>
  )
}
