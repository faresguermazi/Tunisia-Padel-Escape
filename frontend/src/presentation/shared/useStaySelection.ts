import { useEffect, useState } from 'react'
import { stays, trip } from './data'

/** Selected stay, kept in step with #stay-id links from the package cards. */
export function useStaySelection() {
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
  return [selected, setSelected] as const
}
