'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'
import { ProfileVisibilityContext } from '@/hooks/use-profile-visibility'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [isProfileVisible, setIsProfileVisible] = useState(true)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const setProfileRef = useCallback((ref: RefObject<HTMLElement | null>) => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    if (!ref.current) return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsProfileVisible(entry.isIntersecting)
      },
      { threshold: 0 },
    )

    observerRef.current.observe(ref.current)
  }, [])

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return (
    <ProfileVisibilityContext.Provider
      value={{ isProfileVisible, setProfileRef }}
    >
      {children}
    </ProfileVisibilityContext.Provider>
  )
}
