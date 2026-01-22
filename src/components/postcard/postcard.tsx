import { useCallback, useEffect, useRef, useState } from 'react'
import { Maximize2, RotateCcw } from 'lucide-react'
import { PostcardFrontCover } from './postcard-front-cover'
import { PostcardBackCover } from './postcard-back-cover'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface PostcardProps {
  className?: string
  receiverLocation?: string
}

type ActiveCover = 'front' | 'back'

export function Postcard({ className, receiverLocation }: PostcardProps) {
  const [activeCover, setActiveCover] = useState<ActiveCover>('front')
  const [isMaximized, setIsMaximized] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Intersection Observer for mobile scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.5 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Scroll detection for mobile shake animation
  useEffect(() => {
    const handleScroll = (): void => {
      if (isInView) {
        setIsScrolling(true)
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current)
        }
        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false)
        }, 150)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [isInView])

  const handleFlip = useCallback((): void => {
    setActiveCover((prev) => (prev === 'front' ? 'back' : 'front'))
  }, [])

  const handleMaximize = useCallback((): void => {
    setIsMaximized((prev) => !prev)
  }, [])

  const handleCardClick = useCallback((): void => {
    if (isMaximized) {
      setIsMaximized(false)
    } else {
      handleMaximize()
    }
  }, [isMaximized, handleMaximize])

  const handleOutsideClick = useCallback((): void => {
    handleFlip()
  }, [handleFlip])

  // Calculate rotation based on hover/scroll state
  const baseRotationFront = -2
  const baseRotationBack = 2
  const activeRotationFront = isHovered || isScrolling ? -4 : baseRotationFront
  const activeRotationBack = isHovered || isScrolling ? 4 : baseRotationBack

  return (
    <>
      {/* Maximized overlay */}
      {isMaximized && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMaximized(false)}
        />
      )}

      <section
        ref={sectionRef}
        className={cn('relative py-12 px-4', className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Container for stacked postcards */}
        <div
          className={cn(
            'relative mx-auto w-full max-w-md transition-all duration-500',
            isMaximized &&
              'fixed inset-0 z-50 flex items-center justify-center max-w-2xl p-8',
          )}
        >
          {/* Clickable area outside active card to trigger flip */}
          {!isMaximized && (
            <div
              className="absolute inset-0 -m-4 cursor-pointer"
              onClick={handleOutsideClick}
            />
          )}

          {/* Back cover (below) */}
          <div
            className={cn(
              'absolute inset-0 transition-all duration-300 ease-out',
              activeCover === 'back' ? 'z-10' : 'z-0',
              !isMaximized && activeCover === 'front' && 'opacity-80',
            )}
            style={{
              transform: isMaximized
                ? 'none'
                : `rotate(${activeCover === 'back' ? 0 : activeRotationBack}deg) translateY(${activeCover === 'back' ? 0 : 8}px)`,
            }}
          >
            <PostcardBackCover
              onClick={handleCardClick}
              receiverLocation={receiverLocation}
            />
          </div>

          {/* Front cover (above) */}
          <div
            className={cn(
              'relative transition-all duration-300 ease-out',
              activeCover === 'front' ? 'z-10' : 'z-0',
              !isMaximized && activeCover === 'back' && 'opacity-80',
            )}
            style={{
              transform: isMaximized
                ? 'none'
                : `rotate(${activeCover === 'front' ? 0 : activeRotationFront}deg) translateY(${activeCover === 'front' ? 0 : -8}px)`,
            }}
          >
            <PostcardFrontCover onClick={handleCardClick} />
          </div>

          {/* Floating action buttons (desktop hover) */}
          <div
            className={cn(
              'absolute -bottom-12 left-1/2 z-20 flex -translate-x-1/2 gap-2 transition-all duration-200',
              isHovered && !isMaximized
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2 pointer-events-none',
              'md:flex hidden',
            )}
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={handleMaximize}
              className="shadow-lg"
            >
              <Maximize2 className="size-4" />
              Expand
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleFlip}
              className="shadow-lg bg-background"
            >
              <RotateCcw className="size-4" />
              Flip
            </Button>
          </div>
        </div>

        {/* Mobile: always visible action buttons */}
        <div className="mt-8 flex justify-center gap-2 md:hidden">
          <Button variant="secondary" size="sm" onClick={handleMaximize}>
            <Maximize2 className="size-4" />
            Expand
          </Button>
          <Button variant="outline" size="sm" onClick={handleFlip}>
            <RotateCcw className="size-4" />
            Flip
          </Button>
        </div>
      </section>
    </>
  )
}
