import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FlipHorizontal, Shrink } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { PostcardFrontCover } from './postcard-front-cover'
import { PostcardBackCover } from './postcard-back-cover'

type CardFace = 'front' | 'back'

interface PostcardInteractiveProps {
  className?: string
  receiverLocation?: string
  /** Currently visible face */
  activeFace?: CardFace
  /** Callback when face changes */
  onFaceChange?: (face: CardFace) => void
  /** Whether the postcard is in expanded mode */
  isExpanded?: boolean
  /** Callback when expanded state changes */
  onExpandedChange?: (expanded: boolean) => void
}

interface PostcardControlsProps {
  onClose: () => void
  onFlip: () => void
}

function PostcardControls({ onClose, onFlip }: PostcardControlsProps) {
  return (
    <motion.div
      className="flex items-center justify-between w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ delay: 0.2, duration: 0.3 }}
    >
      <Button variant="outline" size="sm" onClick={onClose}>
        <Shrink className="size-4" />
        Close
      </Button>
      <Button variant="outline" size="sm" onClick={onFlip}>
        <FlipHorizontal className="size-4" />
        Flip
      </Button>
    </motion.div>
  )
}

interface FlippableCardProps {
  activeFace: CardFace
  receiverLocation?: string
  isFlipping: boolean
  className?: string
  onClick?: () => void
}

function FlippableCard({
  activeFace,
  receiverLocation,
  isFlipping,
  className,
  onClick,
}: FlippableCardProps) {
  return (
    <div
      className={cn('relative w-full [perspective:1000px]', className)}
      style={{ aspectRatio: '3/2' }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onClick()
              }
            }
          : undefined
      }
    >
      <div
        className={cn(
          'relative h-full w-full transition-transform duration-500',
          '[transform-style:preserve-3d]',
        )}
        style={{
          transform:
            activeFace === 'back' ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front face */}
        <div
          className={cn(
            'absolute inset-0 [backface-visibility:hidden]',
            isFlipping && 'pointer-events-none',
          )}
        >
          <PostcardFrontCover className="h-full w-full max-w-none" />
        </div>

        {/* Back face */}
        <div
          className={cn(
            'absolute inset-0 [backface-visibility:hidden]',
            '[transform:rotateY(180deg)]',
            isFlipping && 'pointer-events-none',
          )}
        >
          <PostcardBackCover
            className="h-full w-full max-w-none"
            receiverLocation={receiverLocation}
          />
        </div>
      </div>
    </div>
  )
}

/**
 * Interactive postcard component with horizontal flip animation
 * and smooth expand/collapse animation using motion
 */
export function PostcardInteractive({
  className,
  receiverLocation,
  activeFace: controlledFace,
  onFaceChange,
  isExpanded = false,
  onExpandedChange,
}: PostcardInteractiveProps) {
  const [internalFace, setInternalFace] = useState<CardFace>('front')
  const [isFlipping, setIsFlipping] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [cardRect, setCardRect] = useState<DOMRect | null>(null)

  // Support controlled or uncontrolled mode for face
  const activeFace = controlledFace ?? internalFace
  const setActiveFace = onFaceChange ?? setInternalFace

  // Capture card position when expanding
  useEffect(() => {
    if (isExpanded && cardRef.current) {
      setCardRect(cardRef.current.getBoundingClientRect())
    }
  }, [isExpanded])

  // Lock body scroll when expanded
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isExpanded])

  const handleFlip = () => {
    setIsFlipping(true)
    setActiveFace(activeFace === 'front' ? 'back' : 'front')
    setTimeout(() => setIsFlipping(false), 500)
  }

  // Click on postcard now flips instead of expanding
  const handleCardClick = () => {
    if (!isExpanded) {
      handleFlip()
    }
  }

  const handleClose = () => {
    onExpandedChange?.(false)
  }

  // Handle escape key to close expanded view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isExpanded])

  // Calculate scale factor for expansion (1.2x larger)
  const scaleFactor = 1.2

  // Calculate card height from width (3:2 aspect ratio)
  const cardHeight = cardRect ? (cardRect.width * 2) / 3 : 0

  return (
    <>
      {/* Default card - always visible to maintain layout */}
      <div
        ref={cardRef}
        className={cn('cursor-pointer', className)}
        aria-label="Click to flip postcard"
      >
        <FlippableCard
          activeFace={activeFace}
          receiverLocation={receiverLocation}
          isFlipping={isFlipping}
          onClick={handleCardClick}
        />
      </div>

      {/* Expanded overlay - rendered via portal to escape any parent transforms */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isExpanded && cardRect && (
              <>
                {/* Backdrop */}
                <motion.div
                  className="fixed inset-0 bg-black/50 z-40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={handleClose}
                />

                {/* Expanded card container - scales from center of the card */}
                <motion.div
                  className="fixed z-50 flex flex-col items-center gap-4"
                  style={{
                    // Position at original card's top-left
                    top: cardRect.top,
                    left: cardRect.left,
                    width: cardRect.width,
                    // Scale from the center of the CARD only (not including controls)
                    transformOrigin: `${cardRect.width / 2}px ${cardHeight / 2}px`,
                  }}
                  initial={{
                    scale: 1,
                  }}
                  animate={{
                    scale: scaleFactor,
                  }}
                  exit={{
                    scale: 1,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  {/* Card with 6:4 ratio */}
                  <FlippableCard
                    activeFace={activeFace}
                    receiverLocation={receiverLocation}
                    isFlipping={isFlipping}
                    className="w-full cursor-default"
                  />

                  {/* Controls with 16px gap from card */}
                  <PostcardControls onClose={handleClose} onFlip={handleFlip} />
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  )
}
