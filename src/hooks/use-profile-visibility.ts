'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import type { RefObject } from 'react'

interface ProfileVisibilityContextValue {
  isProfileVisible: boolean
  setProfileRef: (ref: RefObject<HTMLElement | null>) => void
}

export const ProfileVisibilityContext =
  createContext<ProfileVisibilityContextValue>({
    isProfileVisible: true,
    setProfileRef: () => {},
  })

export function useProfileVisibility(): ProfileVisibilityContextValue {
  return useContext(ProfileVisibilityContext)
}

export function useProfileVisibilityProvider(): ProfileVisibilityContextValue & {
  profileRef: RefObject<HTMLElement | null> | null
} {
  const [isProfileVisible, setIsProfileVisible] = useState(true)
  const [profileRef, setProfileRefState] =
    useState<RefObject<HTMLElement | null> | null>(null)

  const setProfileRef = useCallback((ref: RefObject<HTMLElement | null>) => {
    setProfileRefState(ref)

    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsProfileVisible(entry.isIntersecting)
      },
      { threshold: 0 },
    )

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [])

  return { isProfileVisible, setProfileRef, profileRef }
}
