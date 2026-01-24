import { cn } from '@/lib/utils'
import { NoiseOverlay, TextureOverlay } from './postcard-frame'

interface PostcardStampProps {
  src: string
  alt?: string
  className?: string
}

/**
 * Perforated border effect using CSS mask with radial gradients
 * Creates the classic stamp edge appearance
 */
function PerforationMask() {
  return (
    <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
      <defs>
        {/* Perforation pattern - small circles along edges */}
        <mask id="stamp-perforations">
          {/* White background (visible area) */}
          <rect width="100%" height="100%" fill="white" />
          {/* Circles cut out along edges - top */}
          <g>
            {Array.from({ length: 12 }).map((_, i) => (
              <circle
                key={`top-${i}`}
                cx={`${((i + 0.5) / 12) * 100}%`}
                cy="0"
                r="3"
                fill="black"
              />
            ))}
            {/* Bottom */}
            {Array.from({ length: 12 }).map((_, i) => (
              <circle
                key={`bottom-${i}`}
                cx={`${((i + 0.5) / 12) * 100}%`}
                cy="100%"
                r="3"
                fill="black"
              />
            ))}
            {/* Left */}
            {Array.from({ length: 16 }).map((_, i) => (
              <circle
                key={`left-${i}`}
                cx="0"
                cy={`${((i + 0.5) / 16) * 100}%`}
                r="3"
                fill="black"
              />
            ))}
            {/* Right */}
            {Array.from({ length: 16 }).map((_, i) => (
              <circle
                key={`right-${i}`}
                cx="100%"
                cy={`${((i + 0.5) / 16) * 100}%`}
                r="3"
                fill="black"
              />
            ))}
          </g>
        </mask>
      </defs>
      {/* Apply mask to a rect that covers the stamp */}
      <rect
        width="100%"
        height="100%"
        fill="currentColor"
        mask="url(#stamp-perforations)"
      />
    </svg>
  )
}

/**
 * PostcardStamp - Realistic postage stamp component
 *
 * Features:
 * - Perforated edges (classic stamp look)
 * - Texture and noise overlays (like postcard frame)
 * - 4px inner padding
 */
export function PostcardStamp({
  src,
  alt = 'Stamp',
  className,
}: PostcardStampProps) {
  return (
    <div
      className={cn(
        'relative h-full w-[48px] bg-card text-muted-foreground',
        className,
      )}
    >
      {/* Perforated border effect */}
      <PerforationMask />

      {/* Inner content with 4px padding */}
      <div className="absolute inset-[3px] overflow-hidden">
        {/* Stamp image */}
        <img src={src} alt={alt} className="h-full w-full object-cover" />

        {/* Postcard-like effects */}
        <TextureOverlay />
        <NoiseOverlay />
      </div>
    </div>
  )
}
