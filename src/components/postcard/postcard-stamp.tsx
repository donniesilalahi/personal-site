import { cn } from '@/lib/utils'
import { NoiseOverlay, TextureOverlay } from './postcard-frame'

interface PostcardStampProps {
  src: string
  alt?: string
  className?: string
}

/**
 * Generates CSS mask with radial gradients for perforation effect
 * Creates semicircular cutouts along all four edges
 */
function getPerforationStyle(): React.CSSProperties {
  const holeRadius = 2.5 // px - size of each perforation hole
  const spacing = 7 // px - distance between hole centers

  // Each edge needs its own radial gradient that creates semicircular holes
  const topEdge = `radial-gradient(circle, transparent ${holeRadius}px, white ${holeRadius}px) 0 0 / ${spacing}px ${holeRadius * 2}px repeat-x`
  const bottomEdge = `radial-gradient(circle, transparent ${holeRadius}px, white ${holeRadius}px) 0 100% / ${spacing}px ${holeRadius * 2}px repeat-x`
  const leftEdge = `radial-gradient(circle, transparent ${holeRadius}px, white ${holeRadius}px) 0 0 / ${holeRadius * 2}px ${spacing}px repeat-y`
  const rightEdge = `radial-gradient(circle, transparent ${holeRadius}px, white ${holeRadius}px) 100% 0 / ${holeRadius * 2}px ${spacing}px repeat-y`

  const maskImage = `${topEdge}, ${bottomEdge}, ${leftEdge}, ${rightEdge}`

  return {
    maskImage,
    maskComposite: 'intersect',
    WebkitMaskImage: maskImage,
    WebkitMaskComposite: 'source-in',
  }
}

/**
 * PostcardStamp - Realistic postage stamp component
 *
 * Architecture (4 layers from outside to inside):
 * 1. Drop shadow wrapper - subtle depth effect
 * 2. Perforation layer - white background with perforated edges
 * 3. White inner padding - 4px white border around image
 * 4. Core stamp visual - the actual image with texture overlays
 */
export function PostcardStamp({
  src,
  alt = 'Stamp',
  className,
}: PostcardStampProps) {
  return (
    // Layer 1: Drop shadow wrapper
    <div
      className={cn('relative aspect-[4/5]', className)}
      style={{
        filter: 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.12))',
      }}
    >
      {/* Layer 2: Perforation ornament (white with perforated edges) */}
      <div
        className="absolute inset-0 bg-white"
        style={getPerforationStyle()}
      />

      {/* Layer 3: White inner padding (4px) */}
      <div className="absolute inset-[3px] bg-white p-[4px]">
        {/* Layer 4: Core stamp visual */}
        <div className="relative h-full w-full overflow-hidden">
          <img src={src} alt={alt} className="h-full w-full object-cover" />

          {/* Texture overlays for realism */}
          <TextureOverlay />
          <NoiseOverlay />
        </div>
      </div>
    </div>
  )
}
