import { useEffect } from 'react'

/** Progressive enhancement: content stays visible without animation support. */
export function usePresentationMotion(presentationKey: string) {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!('IntersectionObserver' in window)) return
    const root = document.documentElement
    const motionDisabled = () =>
      preference.matches || root.dataset.rallyMotion === 'off'
    const animations = new Set<Animation>()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (!entry.isIntersecting) return
          observer.unobserve(entry.target)
          if (motionDisabled()) return
          const photographic = entry.target.matches(
            '.court-editorial, .destination-interlude, .accommodation-visual',
          )
          const animation = entry.target.animate(
            photographic
              ? [
                  {
                    opacity: 0.5,
                    transform: 'translateY(20px)',
                    clipPath: 'inset(0 0 10% 0)',
                  },
                  {
                    opacity: 1,
                    transform: 'translateY(0)',
                    clipPath: 'inset(0)',
                  },
                ]
              : [
                  { opacity: 0.35, transform: 'translateY(28px)' },
                  { opacity: 1, transform: 'translateY(0)' },
                ],
            {
              duration: 850,
              delay: Math.min(index * 75, 225),
              easing: 'cubic-bezier(.2,.7,.2,1)',
              fill: 'backwards',
            },
          )
          animations.add(animation)
          void animation.finished.then(
            () => animations.delete(animation),
            () => {},
          )
        })
      },
      { threshold: 0.12 },
    )
    document
      .querySelectorAll(
        '.chapter-heading, .trip-day, .accommodation-visual, .property-intro, .court-editorial, .destination-interlude, .next-steps-list li',
      )
      .forEach((element) => observer.observe(element))
    const syncScene = () => {
      const section = [
        ...document.querySelectorAll<HTMLElement>('main > section'),
      ].find((element) => {
        const bounds = element.getBoundingClientRect()
        return bounds.top <= 110 && bounds.bottom > 110
      })
      if (!section) return
      const style = getComputedStyle(section)
      const transparent = style.backgroundColor === 'rgba(0, 0, 0, 0)'
      const rootStyle = getComputedStyle(root)
      root.style.setProperty(
        '--scene-paper',
        transparent
          ? rootStyle.getPropertyValue('--paper')
          : style.backgroundColor,
      )
      root.style.setProperty(
        '--scene-ink',
        transparent ? rootStyle.getPropertyValue('--ink') : style.color,
      )
    }
    let frame = 0
    const updateScene = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        syncScene()
      })
    }
    window.addEventListener('scroll', updateScene, { passive: true })
    window.addEventListener('presentationpalettechange', updateScene)
    syncScene()
    const stop = () => {
      if (motionDisabled()) {
        animations.forEach((animation) => animation.cancel())
        animations.clear()
      }
    }
    preference.addEventListener('change', stop)
    window.addEventListener('presentationmotionchange', stop)
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', updateScene)
      window.removeEventListener('presentationpalettechange', updateScene)
      cancelAnimationFrame(frame)
      root.style.removeProperty('--scene-paper')
      root.style.removeProperty('--scene-ink')
      animations.forEach((animation) => animation.cancel())
      preference.removeEventListener('change', stop)
      window.removeEventListener('presentationmotionchange', stop)
    }
  }, [presentationKey])
}
