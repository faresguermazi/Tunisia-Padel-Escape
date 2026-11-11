export interface TabItem {
  id: string
  label: string
  badge?: string
}

export function TabList({
  items,
  value,
  onChange,
  label,
  prefix,
}: {
  items: TabItem[]
  value: string
  onChange: (id: string) => void
  label: string
  prefix: string
}) {
  return (
    <div
      className="presentation-tabs"
      role="tablist"
      aria-label={label}
      onKeyDown={(event) => {
        const current = items.findIndex((item) => item.id === value)
        let next: number
        if (event.key === 'ArrowRight') next = (current + 1) % items.length
        else if (event.key === 'ArrowLeft')
          next = (current - 1 + items.length) % items.length
        else if (event.key === 'Home') next = 0
        else if (event.key === 'End') next = items.length - 1
        else return
        event.preventDefault()
        onChange(items[next].id)
        event.currentTarget
          .querySelectorAll<HTMLButtonElement>('[role="tab"]')
          [next]?.focus()
      }}
    >
      {items.map((item) => (
        <button
          type="button"
          role="tab"
          key={item.id}
          className={item.badge ? 'is-highlighted' : undefined}
          id={`${prefix}-tab-${item.id}`}
          aria-controls={`${prefix}-panel-${item.id}`}
          aria-selected={value === item.id}
          tabIndex={value === item.id ? 0 : -1}
          onClick={() => onChange(item.id)}
        >
          {item.badge && (
            <svg
              className="tab-star"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01Z"
              />
            </svg>
          )}
          {item.label}
          {item.badge && <span>{item.badge}</span>}
        </button>
      ))}
    </div>
  )
}
