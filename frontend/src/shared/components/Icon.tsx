export function Icon({
  name,
  className = '',
}: {
  name:
    | 'arrow'
    | 'external'
    | 'down'
    | 'up'
    | 'close'
    | 'previous'
    | 'next'
    | 'menu'
    | 'bed'
    | 'bath'
    | 'racket'
    | 'coffee'
    | 'sun'
    | 'plane'
  className?: string
}) {
  const paths = {
    arrow: 'M4 12h16M14 6l6 6-6 6',
    external: 'M6 18 18 6M6 6h12v12',
    down: 'M12 4v16M6 14l6 6 6-6',
    up: 'M12 20V4M6 10l6-6 6 6',
    close: 'm6 6 12 12M6 18 18 6',
    previous: 'm15 5-7 7 7 7',
    next: 'm9 5 7 7-7 7',
    menu: 'M4 8h16M4 16h16',
    bed: 'M3 18V7M21 18v-7H3M3 15h18M6 11V7h5v4M3 18v3M21 18v3',
    bath: 'M3 12h18M4 12v3a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-3M6 19v2M18 19v2M5 12V5a2 2 0 0 1 4 0',
    racket: 'M8 15 3 21M7 16l2 2M10 5c3-3 7-3 9-1s2 6-1 9-7 3-9 1-2-6 1-9Z',
    coffee:
      'M4 8h12v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5ZM16 9h2a3 3 0 0 1 0 6h-2M7 3v2M11 3v2',
    sun: 'M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
    plane: 'm3 12 7 1 6 8 2-1-3-8 5-5c2-2 1-4-1-3l-6 5-8-3-1 2 6 5-5 3Z',
  }
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  )
}
