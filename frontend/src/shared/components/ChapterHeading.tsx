import type { Chapter } from '../../content/types'

export function ChapterHeading({
  chapter,
  centered = false,
}: {
  chapter: Chapter
  centered?: boolean
}) {
  return (
    <header
      className={`chapter-heading${centered ? ' chapter-heading--centered' : ''}`}
    >
      {chapter.eyebrow && <p className="eyebrow">{chapter.eyebrow}</p>}
      <h2 id={`${chapter.id}-title`} className="display-title preserve-lines">
        {chapter.title}
      </h2>
      {chapter.description && (
        <p className="chapter-description">{chapter.description}</p>
      )}
    </header>
  )
}
