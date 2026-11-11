import { lazy, Suspense } from 'react'
import VersionSwitcher from './VersionSwitcher'

const OrderOfPlay = lazy(() => import('./order-of-play/OrderOfPlay'))
const BlueDoor = lazy(() => import('./blue-door/BlueDoor'))

/** Local-only creative studies. Never imported by the production entry. */
export default function ExploreRoute({ direction }: { direction: string }) {
  return (
    <>
      <Suspense fallback={<p style={{ padding: 24 }}>Opening the study…</p>}>
        {direction === 'order-of-play' ? <OrderOfPlay /> : <BlueDoor />}
      </Suspense>
      <VersionSwitcher current={direction} />
    </>
  )
}
