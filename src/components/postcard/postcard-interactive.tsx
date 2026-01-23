import { useState } from 'react'
import { FlipHorizontal, Minimize2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer'
import { useMediaQuery } from '@/hooks/use-media-query'
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
}

interface PostcardControlsProps {
  onClose: () => void
  onFlip: () => void
}

function PostcardControls({ onClose, onFlip }: PostcardControlsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button variant="outline" size="sm" onClick={onClose}>
        <Minimize2 className="size-4" />
        Close
      </Button>
      <Button variant="outline" size="sm" onClick={onFlip}>
        <FlipHorizontal className="size-4" />
        Flip
      </Button>
    </div>
  )
}

interface FlippableCardProps {
  activeFace: CardFace
  receiverLocation?: string
  isFlipping: boolean
  className?: string
}

function FlippableCard({
  activeFace,
  receiverLocation,
  isFlipping,
  className,
}: FlippableCardProps) {
  return (
    <div
      className={cn('relative w-full [perspective:1000px]', className)}
      style={{ aspectRatio: '3/2' }}
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
 * and responsive dialog (desktop) / drawer (mobile) behavior
 */
export function PostcardInteractive({
  className,
  receiverLocation,
  activeFace: controlledFace,
  onFaceChange,
}: PostcardInteractiveProps) {
  const [open, setOpen] = useState(false)
  const [internalFace, setInternalFace] = useState<CardFace>('front')
  const [isFlipping, setIsFlipping] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  // Support controlled or uncontrolled mode
  const activeFace = controlledFace ?? internalFace
  const setActiveFace = onFaceChange ?? setInternalFace

  const handleFlip = () => {
    setIsFlipping(true)
    setActiveFace(activeFace === 'front' ? 'back' : 'front')
    // Reset flipping state after animation completes
    setTimeout(() => setIsFlipping(false), 500)
  }

  const handleCardClick = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  // Preview card (clickable to expand)
  const previewCard = (
    <div
      className={cn('cursor-pointer', className)}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick()
        }
      }}
      aria-label="Click to expand postcard"
    >
      <FlippableCard
        activeFace={activeFace}
        receiverLocation={receiverLocation}
        isFlipping={isFlipping}
      />
    </div>
  )

  // Expanded card content (inside dialog/drawer)
  const expandedCardContent = (
    <div className="flex flex-col gap-4">
      {/* Card at 120% scale */}
      <div className="flex items-center justify-center">
        <FlippableCard
          activeFace={activeFace}
          receiverLocation={receiverLocation}
          isFlipping={isFlipping}
          className="scale-100 md:scale-[1.2] origin-center"
        />
      </div>
      {/* Controls */}
      <PostcardControls onClose={handleClose} onFlip={handleFlip} />
    </div>
  )

  if (isDesktop) {
    return (
      <>
        {previewCard}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            className="max-w-4xl bg-transparent ring-0 shadow-none p-8"
            showCloseButton={false}
          >
            <DialogTitle className="sr-only">Postcard View</DialogTitle>
            <DialogDescription className="sr-only">
              Interactive postcard with flip animation. Use the Flip button to
              see the other side.
            </DialogDescription>
            {expandedCardContent}
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <>
      {previewCard}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="p-4 pb-8">
          <DrawerTitle className="sr-only">Postcard View</DrawerTitle>
          <DrawerDescription className="sr-only">
            Interactive postcard with flip animation. Use the Flip button to see
            the other side.
          </DrawerDescription>
          {expandedCardContent}
        </DrawerContent>
      </Drawer>
    </>
  )
}
