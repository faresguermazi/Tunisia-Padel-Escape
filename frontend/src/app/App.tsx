import { lazy, Suspense } from 'react'
import PetrolDoor from '../presentation/petrol-door/PetrolDoor'

const IdentityStudy = import.meta.env.DEV
  ? lazy(() => import('../features/identity-study/IdentityStudy'))
  : null
const PadelPointer =
  import.meta.env.DEV || import.meta.env.MODE === 'review'
    ? lazy(() => import('../features/creative-study/PadelPointer'))
    : null

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
      <PetrolDoor />
      {PadelPointer && (
        <Suspense fallback={null}>
          <PadelPointer />
        </Suspense>
      )}
    </>
  )
}
