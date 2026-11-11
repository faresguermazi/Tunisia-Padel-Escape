export function StatusBadge({
  label,
  tone,
}: {
  label: string
  tone: 'included' | 'proposed' | 'optional'
}) {
  return (
    <span className={`proposal-status proposal-status--${tone}`}>
      <span aria-hidden="true" />
      {label}
    </span>
  )
}
