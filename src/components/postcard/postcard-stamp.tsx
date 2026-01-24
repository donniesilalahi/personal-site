import { cn } from '@/lib/utils'
import { NoiseOverlay, TextureOverlay } from './postcard-frame'

interface PostcardStampProps {
  src: string
  alt?: string
  className?: string
}

/**
 * SVG perforation mask - creates punched-out holes along edges
 * White areas show through (visible), black areas are cut out (transparent)
 */
function PerforationMask() {
  const holeRadius = 3
  const spacing = 7

  return (
    <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
      <defs>
        <mask id="stamp-perforations">
          {/* White = visible (stamp body), Black = cut out (perforation holes) */}
          <rect width="100%" height="100%" fill="white" />

          {/* Semi-circles cut out along top edge */}
          {Array.from({ length: 20 }).map((_, i) => (
            <circle
              key={`top-${i}`}
              cx={spacing / 2 + i * spacing}
              cy={spacing / 2}
              r={holeRadius}
              fill="black"
            />
          ))}

          {/* Semi-circles cut out along bottom edge */}
          {Array.from({ length: 20 }).map((_, i) => (
            <circle
              key={`bottom-${i}`}
              cx={spacing / 2 + i * spacing}
              cy={`calc(100% - ${spacing / 2}px)`}
              r={holeRadius}
              fill="black"
            />
          ))}

          {/* Semi-circles cut out along left edge */}
          {Array.from({ length: 25 }).map((_, i) => (
            <circle
              key={`left-${i}`}
              cx={spacing / 2}
              cy={spacing / 2 + i * spacing}
              r={holeRadius}
              fill="black"
            />
          ))}

          {/* Semi-circles cut out along right edge */}
          {Array.from({ length: 25 }).map((_, i) => (
            <circle
              key={`right-${i}`}
              cx={`calc(100% - ${spacing / 2}px)`}
              cy={spacing / 2 + i * spacing}
              r={holeRadius}
              fill="black"
            />
          ))}
        </mask>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill="white"
        mask="url(#stamp-perforations)"
      />
    </svg>
  )
}

/**
 * PostcardStamp - Realistic postage stamp component
 *
 * Architecture (4 layers from outside to inside):
 * 1. Drop shadow wrapper - subtle depth effect
 * 2. Perforation layer - white stamp body with punched holes showing background
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
      className={cn('relative aspect-[4/5] bg-background', className)}
      style={{
        filter: 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.12))',
      }}
    >
      {/* Layer 2: Perforation ornament (white with punched-out holes) */}
      <PerforationMask />

      {/* Layer 3: White inner padding (4px) - inset by spacing to avoid perforations */}
      <div className="absolute inset-[5px] bg-white p-[4px]">
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
