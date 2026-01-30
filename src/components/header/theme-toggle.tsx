'use client'

import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  theme: 'light' | 'dark'
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const [isRotating, setIsRotating] = useState(false)

  const handleClick = () => {
    setIsRotating(true)
    onToggle()
    setTimeout(() => setIsRotating(false), 300)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'relative flex size-9 items-center justify-center rounded-md border border-transparent transition-colors',
        'hover:bg-muted focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'outline-none',
      )}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div
        className={cn(
          'relative size-4 transition-transform duration-300',
          isRotating && 'animate-spin',
        )}
        style={{
          animationDuration: '300ms',
          animationTimingFunction: 'ease-in-out',
        }}
      >
        <Sun
          className={cn(
            'absolute inset-0 size-4 transition-opacity duration-150',
            theme === 'light' ? 'opacity-100' : 'opacity-0',
          )}
        />
        <Moon
          className={cn(
            'absolute inset-0 size-4 transition-opacity duration-150',
            theme === 'dark' ? 'opacity-100' : 'opacity-0',
          )}
        />
      </div>
    </button>
  )
}
