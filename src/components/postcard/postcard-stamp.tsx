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
 * Burelage pattern - decorative security swirl lines on stamp edges
 * Creates a subtle guilloche-like pattern overlay
 */
function BurelageOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.15]"
      aria-hidden="true"
    >
      {/* Left edge burelage */}
      <div
        className="absolute left-0 top-0 h-full w-4"
        style={{
          background: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 1px,
            currentColor 1px,
            currentColor 2px
          )`,
        }}
      />
      {/* Right edge burelage */}
      <div
        className="absolute right-0 top-0 h-full w-4"
        style={{
          background: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 1px,
            currentColor 1px,
            currentColor 2px
          )`,
        }}
      />
      {/* Top edge burelage */}
      <div
        className="absolute left-0 top-0 h-3 w-full"
        style={{
          background: `repeating-linear-gradient(
            -30deg,
            transparent,
            transparent 1px,
            currentColor 1px,
            currentColor 2px
          )`,
        }}
      />
      {/* Bottom edge burelage */}
      <div
        className="absolute bottom-0 left-0 h-3 w-full"
        style={{
          background: `repeating-linear-gradient(
            30deg,
            transparent,
            transparent 1px,
            currentColor 1px,
            currentColor 2px
          )`,
        }}
      />
    </div>
  )
}

/**
 * PostcardStamp - Realistic postage stamp component
 *
 * Features:
 * - 4:6 aspect ratio
 * - Perforated edges (classic stamp look)
 * - Burelage security pattern on edges
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
        'relative aspect-[4/6] w-[48px] bg-card text-muted-foreground',
        className,
      )}
    >
      {/* Perforated border effect */}
      <PerforationMask />

      {/* Inner content with 4px padding */}
      <div className="absolute inset-[3px] overflow-hidden">
        {/* Stamp image */}
        <img src={src} alt={alt} className="h-full w-full object-cover" />

        {/* Burelage security pattern */}
        <BurelageOverlay />

        {/* Postcard-like effects */}
        <TextureOverlay />
        <NoiseOverlay />
      </div>
    </div>
  )
}
