'use client'

import { createContext, useContext } from 'react'
import type { RefObject } from 'react'

interface ProfileVisibilityContextValue {
  isProfileVisible: boolean
  setProfileRef: (ref: RefObject<HTMLElement | null>) => void
  scrollProgress: number
  isHomePage: boolean
  setIsHomePage: (value: boolean) => void
}

export const ProfileVisibilityContext =
  createContext<ProfileVisibilityContextValue>({
    isProfileVisible: true,
    setProfileRef: () => {},
    scrollProgress: 0,
    isHomePage: false,
    setIsHomePage: () => {},
  })

export function useProfileVisibility(): ProfileVisibilityContextValue {
  return useContext(ProfileVisibilityContext)
}


