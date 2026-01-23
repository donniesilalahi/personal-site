import { useCallback, useEffect, useRef, useState } from 'react'
import { PostcardInteractive } from './postcard-interactive'
import { SectionHeading } from './section-heading'
import { cn } from '@/lib/utils'

interface PostcardSectionProps {
  className?: string
  receiverLocation?: string
}

type ActiveCover = 'front' | 'back'

export function PostcardSection({
  className,
  receiverLocation,
}: PostcardSectionProps) {
  const [activeCover, setActiveCover] = useState<ActiveCover>('front')
  const [isExpanded, setIsExpanded] = useState(false)
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

  const handleFaceChange = useCallback((face: ActiveCover): void => {
    setActiveCover(face)
  }, [])

  const handleExpand = useCallback((): void => {
    setIsExpanded(true)
  }, [])

  const handleExpandedChange = useCallback((expanded: boolean): void => {
    setIsExpanded(expanded)
  }, [])

  // Calculate rotation based on hover/scroll state for visual flair
  const rotation = isHovered || isScrolling ? 2 : 0

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
        onFlip={handleFlip}
        onExpand={handleExpand}
      />

      {/* Interactive Postcard Component */}
      <div
        className="transition-transform duration-300 ease-out"
        style={{
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <PostcardInteractive
          receiverLocation={receiverLocation}
          activeFace={activeCover}
          onFaceChange={handleFaceChange}
          isExpanded={isExpanded}
          onExpandedChange={handleExpandedChange}
        />
      </div>
    </section>
  )
}
