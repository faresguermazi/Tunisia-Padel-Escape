import { presentationMedia } from '../../content/presentationMedia'
export function TunisiaFlag() {
  return (
    <span className="tunisia-detail">
      <img
        src={presentationMedia.flag.src}
        width="24"
        height="16"
        alt="Tunisia"
      />
    </span>
  )
}
