import { useEffect, useState } from 'react'
import type { TripContent } from '../content/types'
import { Icon } from '../shared/components/Icon'
import { BrandMark } from '../shared/components/BrandMark'

export function Navigation({ trip }: { trip: TripContent }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('invitation')
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 70)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-15% 0px -65% 0px' },
    )
    document
      .querySelectorAll('main > section[id]')
      .forEach((section) => observer.observe(section))
    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [])

  return (
    <header
      className={`site-header${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          setOpen(false)
          document.getElementById('navigation-toggle')?.focus()
        }
      }}
    >
      <a
        className="wordmark"
        href="#invitation"
        onClick={() => setOpen(false)}
        aria-label={`${trip.title}, back to beginning`}
      >
        <BrandMark />
        <span>{trip.title}</span>
      </a>
      <button
        id="navigation-toggle"
        type="button"
        className="navigation-toggle icon-button"
        aria-label={
          open ? 'Close chapter navigation' : 'Open chapter navigation'
        }
        aria-expanded={open}
        aria-controls="chapter-navigation"
        onClick={() => setOpen(!open)}
      >
        <Icon name={open ? 'close' : 'menu'} />
      </button>
      <nav
        id="chapter-navigation"
        className={open ? 'chapter-nav is-open' : 'chapter-nav'}
        aria-label="Chapters"
      >
        {trip.navigation.map((item) => (
          <a
            href={`#${item.id}`}
            key={item.id}
            aria-current={active === item.id ? 'location' : undefined}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
