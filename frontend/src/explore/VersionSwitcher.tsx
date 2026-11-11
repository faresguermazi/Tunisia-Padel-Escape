import { useState } from 'react'
import './VersionSwitcher.css'

const versions = [
  { id: 'reference', label: 'Reference', note: 'Petrol & cream' },
  {
    id: 'petrol-door',
    label: 'Petrol & doors',
    note: 'The combined direction',
  },
  { id: 'blue-door', label: 'The blue door', note: 'Cinematic' },
] as const

/** Local-only, collapsible. Links reload the page on the same address. */
export default function VersionSwitcher({ current }: { current: string }) {
  const [open, setOpen] = useState(false)
  return (
    <aside className="vs" aria-label="Design versions (local review)">
      <button
        type="button"
        className="vs-toggle"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? 'Hide versions' : 'Versions'}
      </button>
      {open && (
        <ul>
          {versions.map((v) => (
            <li key={v.id}>
              <a
                href={`/?direction=${v.id}`}
                aria-current={v.id === current ? 'page' : undefined}
              >
                <strong>{v.label}</strong>
                <span>{v.note}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}
