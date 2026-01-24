import { useCallback, useRef, useState } from 'react'
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
  const [isFlipButtonHovered, setIsFlipButtonHovered] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

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

  const handleFlipButtonHover = useCallback((hovered: boolean): void => {
    setIsFlipButtonHovered(hovered)
  }, [])

  return (
    <section
      ref={sectionRef}
      className={cn('w-full flex flex-col gap-6', className)}
    >
      {/* Section Heading */}
      <SectionHeading
        label="Postcard"
        onFlip={handleFlip}
        onExpand={handleExpand}
        onFlipButtonHover={handleFlipButtonHover}
      />

      {/* Interactive Postcard Component */}
      <PostcardInteractive
        receiverLocation={receiverLocation}
        activeFace={activeCover}
        onFaceChange={handleFaceChange}
        isExpanded={isExpanded}
        onExpandedChange={handleExpandedChange}
        isFlipButtonHovered={isFlipButtonHovered}
      />
    </section>
  )
}
