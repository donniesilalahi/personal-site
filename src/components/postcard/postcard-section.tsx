import { useCallback, useEffect, useRef, useState } from 'react'
import { PostcardFrontCover } from './postcard-front-cover'
import { PostcardBackCover } from './postcard-back-cover'
import { SectionHeading } from './section-heading'
import { cn } from '@/lib/utils'

interface PostcardSectionProps {
  className?: string
  receiverLocation?: string
}

type ActiveCover = 'front' | 'back'

function Postcard({
  receiverLocation,
  activeCover,
  isMaximized,
  isHovered,
  isScrolling,
  onCardClick,
  onOutsideClick,
}: {
  receiverLocation?: string
  activeCover: ActiveCover
  isMaximized: boolean
  isHovered: boolean
  isScrolling: boolean
  onCardClick: () => void
  onOutsideClick: () => void
}) {
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
          onClick={onCardClick}
        />
      )}

      <div
        className={cn(
          'relative mx-auto w-full transition-all duration-500',
          isMaximized &&
            'fixed inset-0 z-50 flex items-center justify-center max-w-2xl p-8',
        )}
      >
        {/* Clickable area outside active card to trigger flip */}
        {!isMaximized && (
          <div
            className="absolute inset-0 -m-4 cursor-pointer"
            onClick={onOutsideClick}
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
            onClick={onCardClick}
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
          <PostcardFrontCover onClick={onCardClick} />
        </div>
      </div>
    </>
  )
}

export function PostcardSection({
  className,
  receiverLocation,
}: PostcardSectionProps) {
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

  return (
    <section
      ref={sectionRef}
      className={cn('w-full flex flex-col gap-6', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Section Heading */}
      <SectionHeading
        label="Postcard"
        onExpand={handleMaximize}
        onFlip={handleFlip}
      />

      {/* Postcard Component */}
      <Postcard
        receiverLocation={receiverLocation}
        activeCover={activeCover}
        isMaximized={isMaximized}
        isHovered={isHovered}
        isScrolling={isScrolling}
        onCardClick={handleCardClick}
        onOutsideClick={handleOutsideClick}
      />
    </section>
  )
}
