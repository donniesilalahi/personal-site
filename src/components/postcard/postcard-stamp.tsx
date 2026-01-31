import { NoiseOverlay, TextureOverlay } from './postcard-frame'
import { cn } from '@/lib/utils'

interface PostcardStampProps {
  src: string
  alt?: string
  className?: string
}

/**
 * PostcardStamp - Realistic postage stamp component
 *
 * Architecture (4 layers from outside to inside):
 * 1. Drop shadow wrapper - subtle depth effect
 * 2. Perforated white border - white with semi-circular cutouts along edges
 * 3. White inner padding - 4px white border around image
 * 4. Core stamp visual - the actual image with texture overlays
 */
export function PostcardStamp({
  src,
  alt = 'Stamp',
  className,
}: PostcardStampProps) {
  const holeRadius = 2
  const spacing = 8

  // Each edge mask: solid white with transparent holes punched at the edge
  // Using mask-composite: intersect to combine all 4 edge masks
  const topHoles = `radial-gradient(circle at 50% 0%, transparent ${holeRadius}px, white ${holeRadius}px)`
  const bottomHoles = `radial-gradient(circle at 50% 100%, transparent ${holeRadius}px, white ${holeRadius}px)`
  const leftHoles = `radial-gradient(circle at 0% 50%, transparent ${holeRadius}px, white ${holeRadius}px)`
  const rightHoles = `radial-gradient(circle at 100% 50%, transparent ${holeRadius}px, white ${holeRadius}px)`

  const maskImage = `${topHoles}, ${bottomHoles}, ${leftHoles}, ${rightHoles}`
  const maskSize = `${spacing}px 100%, ${spacing}px 100%, 100% ${spacing}px, 100% ${spacing}px`
  const maskPosition = 'top, bottom, left, right'
  const maskRepeat = 'repeat-x, repeat-x, repeat-y, repeat-y'
  const maskComposite = 'intersect, intersect, intersect'

  return (
    <div
      className={cn('relative aspect-[4/5]', className)}
      style={{
        filter: 'drop-shadow(0.5px 0.5px 0.5px rgba(0, 0, 0, 0.25))',
      }}
    >
      {/* Perforated white border - semi-circular cutouts along all edges */}
      <div
        className="absolute inset-0 bg-white"
        style={{
          maskImage,
          maskSize,
          maskPosition,
          maskRepeat,
          maskComposite,
          WebkitMaskImage: maskImage,
          WebkitMaskSize: maskSize,
          WebkitMaskPosition: maskPosition,
          WebkitMaskRepeat: maskRepeat,
          WebkitMaskComposite: 'source-in',
        }}
      />

      {/* White inner padding with image - inset to show perforation border */}
      <div className="absolute inset-[4px] bg-white p-[4px]">
        <div className="relative h-full w-full overflow-hidden">
          <img src={src} alt={alt} className="h-full w-full object-cover" />
          <TextureOverlay />
          <NoiseOverlay />
        </div>
      </div>
    </div>
  )
}
