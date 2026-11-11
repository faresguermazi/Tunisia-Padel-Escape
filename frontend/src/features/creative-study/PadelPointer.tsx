import { useEffect, useRef, useState } from 'react'
import './PadelPointer.css'

/** Mouse-only motion, with native touch, keyboard and dialog behavior. */
export default function PadelPointer() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [paused, setPaused] = useState(false)
  const cursor = useRef<HTMLDivElement>(null)
  const active = !reduced && !paused
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(preference.matches)
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    const root = document.documentElement
    root.dataset.rallyMotion = active ? 'on' : 'off'
    window.dispatchEvent(new Event('presentationmotionchange'))
    return () => {
      delete root.dataset.rallyMotion
    }
  }, [active])
  useEffect(() => {
    const root = document.documentElement
    const dot = cursor.current
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!dot || !active) return
    let frame = 0,
      x = 0,
      y = 0
    const hide = () => {
      root.classList.remove('has-ball-cursor')
      dot.style.opacity = '0'
      cancelAnimationFrame(frame)
      frame = 0
    }
    const move = (event: PointerEvent) => {
      if (
        !pointer.matches ||
        event.pointerType !== 'mouse' ||
        (event.target instanceof Element && event.target.closest('dialog'))
      ) {
        hide()
        return
      }
      x = event.clientX
      y = event.clientY
      dot.dataset.interactive = String(
        event.target instanceof Element &&
          !!event.target.closest('a, button, summary, [role="tab"]'),
      )
      root.classList.add('has-ball-cursor')
      if (!frame)
        frame = requestAnimationFrame(() => {
          dot.style.transform = `translate3d(${x - 11}px, ${y - 11}px, 0)`
          dot.style.opacity = '1'
          frame = 0
        })
    }
    const leave = (event: PointerEvent) => {
      if (!event.relatedTarget) hide()
    }
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Tab' || event.key === 'Escape') hide()
    }
    const onPointerChange = () => {
      if (!pointer.matches) hide()
    }
    const focus = (event: FocusEvent) => {
      if (event.target instanceof Element && event.target.closest('dialog'))
        hide()
    }
    document.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerout', leave)
    document.addEventListener('keydown', key)
    document.addEventListener('focusin', focus)
    window.addEventListener('blur', hide)
    pointer.addEventListener('change', onPointerChange)
    return () => {
      hide()
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerout', leave)
      document.removeEventListener('keydown', key)
      document.removeEventListener('focusin', focus)
      window.removeEventListener('blur', hide)
      pointer.removeEventListener('change', onPointerChange)
    }
  }, [active])
  return (
    <>
      <div ref={cursor} className="rally-pointer" aria-hidden="true">
        <i />
      </div>
      <button
        type="button"
        className="rally-motion-toggle"
        aria-pressed={active}
        onClick={() => setPaused((value) => !value)}
        disabled={reduced}
      >
        {reduced ? 'Reduced motion' : active ? 'Pause motion' : 'Resume motion'}
        <span aria-hidden="true">{active ? 'II' : '+'}</span>
      </button>
    </>
  )
}
