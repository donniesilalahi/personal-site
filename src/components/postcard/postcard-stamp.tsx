import { cn } from '@/lib/utils'
import { NoiseOverlay, TextureOverlay } from './postcard-frame'

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
 * 2. Perforated white border - white with holes along edges
 * 3. White inner padding - 4px white border around image
 * 4. Core stamp visual - the actual image with texture overlays
 */
export function PostcardStamp({
  src,
  alt = 'Stamp',
  className,
}: PostcardStampProps) {
  const holeRadius = 2.5
  const spacing = 7

  // Create radial gradients for perforation holes along each edge
  // Top edge: circles at top, repeating horizontally
  const topHoles = `radial-gradient(circle at 50% 0%, transparent ${holeRadius}px, white ${holeRadius + 0.1}px)`
  const topPattern = `topHoles top / ${spacing}px ${holeRadius * 2 + 1}px repeat-x`

  // Bottom edge: circles at bottom, repeating horizontally
  const bottomHoles = `radial-gradient(circle at 50% 100%, transparent ${holeRadius}px, white ${holeRadius + 0.1}px)`
  const bottomPattern = `bottomHoles bottom / ${spacing}px ${holeRadius * 2 + 1}px repeat-x`

  // Left edge: circles at left, repeating vertically
  const leftHoles = `radial-gradient(circle at 0% 50%, transparent ${holeRadius}px, white ${holeRadius + 0.1}px)`
  const leftPattern = `leftHoles left / ${holeRadius * 2 + 1}px ${spacing}px repeat-y`

  // Right edge: circles at right, repeating vertically
  const rightHoles = `radial-gradient(circle at 100% 50%, transparent ${holeRadius}px, white ${holeRadius + 0.1}px)`
  const rightPattern = `rightHoles right / ${holeRadius * 2 + 1}px ${spacing}px repeat-y`

  return (
    <div
      className={cn('relative aspect-[4/5] bg-background', className)}
      style={{
        filter: 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.12))',
      }}
    >
      {/* Perforated white border - shows background through holes */}
      <div
        className="absolute inset-0 bg-white"
        style={{
          maskImage: `${topHoles}, ${bottomHoles}, ${leftHoles}, ${rightHoles}`,
          maskPosition: 'top, bottom, left, right',
          maskSize: `${spacing}px ${holeRadius * 2}px, ${spacing}px ${holeRadius * 2}px, ${holeRadius * 2}px ${spacing}px, ${holeRadius * 2}px ${spacing}px`,
          maskRepeat: 'repeat-x, repeat-x, repeat-y, repeat-y',
          WebkitMaskImage: `${topHoles}, ${bottomHoles}, ${leftHoles}, ${rightHoles}`,
          WebkitMaskPosition: 'top, bottom, left, right',
          WebkitMaskSize: `${spacing}px ${holeRadius * 2}px, ${spacing}px ${holeRadius * 2}px, ${holeRadius * 2}px ${spacing}px, ${holeRadius * 2}px ${spacing}px`,
          WebkitMaskRepeat: 'repeat-x, repeat-x, repeat-y, repeat-y',
        }}
      />

      {/* White inner padding with image - positioned to avoid perforations */}
      <div className="absolute inset-[3px] bg-white p-[4px]">
        <div className="relative h-full w-full overflow-hidden">
          <img src={src} alt={alt} className="h-full w-full object-cover" />
          <TextureOverlay />
          <NoiseOverlay />
        </div>
      </div>
    </div>
  )
}
