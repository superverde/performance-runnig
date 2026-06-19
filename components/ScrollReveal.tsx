'use client'

import { useEffect } from 'react'

/**
 * Mounts an IntersectionObserver that adds .revealed to any element
 * with a [data-reveal] attribute when it enters the viewport.
 * Add data-delay="100|200|300|400" for staggered animations.
 */
export function ScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )

    const targets = document.querySelectorAll('[data-reveal]')
    targets.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return null
}
