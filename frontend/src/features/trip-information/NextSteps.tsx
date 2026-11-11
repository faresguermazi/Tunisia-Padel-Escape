import './ClosingImage.css'
import type { ReactNode } from 'react'
import { Photograph } from '../../shared/components/Photograph'
import { findImage } from '../../content/findImage'
import type { TripContent } from '../../content/types'
import { ChapterHeading } from '../../shared/components/ChapterHeading'
import { Icon } from '../../shared/components/Icon'
import { BrandMark } from '../../shared/components/BrandMark'

export function NextSteps({
  content,
  title,
  media,
  closingStudy = false,
  closing,
}: {
  content: TripContent['next']
  title: string
  media: TripContent['media']
  closingStudy?: boolean
  closing?: ReactNode
}) {
  return (
    <section
      id={content.id}
      className="next-steps next-steps--compact"
      aria-labelledby={`${content.id}-title`}
    >
      <div className="section-container section-space">
        <ChapterHeading chapter={content} />
        <div className="next-conversation">
          <ol className="next-steps-list">
            {content.steps.map((step, index) => (
              <li
                key={step.title}
                className={step.optional ? 'is-optional' : undefined}
              >
                <span>0{index + 1}</span>
                {step.optional && (
                  <small className="optional-step-label">Optional</small>
                )}
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
      {closing ??
        (closingStudy ? (
          <div className="transparent-closing">
            <Photograph image={findImage(media, content.mediaId)} />
            <div className="section-container">
              <p className="preserve-lines">{content.closing}</p>
            </div>
          </div>
        ) : (
          <p className="closing-line section-container preserve-lines">
            {content.closing}
          </p>
        ))}
      <footer className="site-footer section-container">
        <a href="#invitation" className="footer-brand">
          <BrandMark />
          <span>{title}</span>
        </a>
        <span>{content.signoff}</span>
        <a href="#invitation" className="back-top">
          Back to the top
          <Icon name="up" />
        </a>
      </footer>
    </section>
  )
}
