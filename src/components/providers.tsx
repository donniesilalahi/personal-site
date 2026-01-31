'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'
import { ProfileVisibilityContext } from '@/hooks/use-profile-visibility'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [isProfileVisible, setIsProfileVisible] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isHomePage, setIsHomePage] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const profileRefCurrent = useRef<HTMLElement | null>(null)

  const setProfileRef = useCallback((ref: RefObject<HTMLElement | null>) => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    if (!ref.current) return
    profileRefCurrent.current = ref.current

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsProfileVisible(entry.isIntersecting)
      },
      { threshold: 0 },
    )

    observerRef.current.observe(ref.current)
  }, [])

  useEffect(() => {
    const handleScroll = (): void => {
      if (!isHomePage || !profileRefCurrent.current) {
        setScrollProgress(window.scrollY > 0 ? 1 : 0)
        return
      }

      const profileRect = profileRefCurrent.current.getBoundingClientRect()
      const profileBottom = profileRect.bottom
      const headerHeight = 56

      if (profileBottom <= headerHeight) {
        setScrollProgress(1)
      } else if (profileBottom >= profileRect.height) {
        setScrollProgress(0)
      } else {
        const progress =
          1 - (profileBottom - headerHeight) / (profileRect.height - headerHeight)
        setScrollProgress(Math.max(0, Math.min(1, progress)))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHomePage])

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return (
    <ProfileVisibilityContext.Provider
      value={{
        isProfileVisible,
        setProfileRef,
        scrollProgress,
        isHomePage,
        setIsHomePage,
      }}
    >
      {children}
    </ProfileVisibilityContext.Provider>
  )
}
