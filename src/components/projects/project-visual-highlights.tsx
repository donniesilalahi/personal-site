import { cn } from '@/lib/utils'

interface ProjectVisualHighlightsProps {
  visuals: Array<string>
  backgroundImage?: string
  className?: string
}

/**
 * Visual highlights component for project cards
 *
 * Layout rules:
 * - 1 image: 80% of available space, no rotation, centered
 * - 2 images: 55% width each, rotated ±4°, left on top (higher Y), right below (lower Y)
 * - 3 images: 55% width each, back at top-right, middle at center, front at bottom-left
 *
 * All images maintain 4:3 aspect ratio with postcard-like frame styling
 */
export function ProjectVisualHighlights({
  visuals,
  backgroundImage,
  className,
}: ProjectVisualHighlightsProps) {
  const count = Math.min(visuals.length, 3) // Max 3 visuals

  return (
    <div
      className={cn(
        'relative w-full aspect-[4/3] rounded-lg overflow-hidden',
        className,
      )}
    >
      {/* Background */}
      {backgroundImage ? (
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200" />
      )}

      {/* Visual highlights container */}
      <div className="absolute inset-0 flex items-center justify-center">
        {count === 1 && <SingleVisual visual={visuals[0]} />}
        {count === 2 && <TwoVisuals visuals={visuals.slice(0, 2)} />}
        {count === 3 && <ThreeVisuals visuals={visuals.slice(0, 3)} />}
      </div>
    </div>
  )
}

/**
 * Single visual - 80% width, no rotation
 */
function SingleVisual({ visual }: { visual: string }) {
  return (
    <div className="relative w-[80%]">
      <VisualImage src={visual} alt="" />
    </div>
  )
}

/**
 * Two visuals - 55% width each, ±4° rotation
 * Left visual: on top (z-index), positioned higher (upper Y)
 * Right visual: behind, positioned lower (lower Y)
 * Group is centered horizontally and vertically
 */
function TwoVisuals({ visuals }: { visuals: Array<string> }) {
  return (
    <div className="relative w-[75%] h-[75%]">
      {/* Back visual (right side, lower, -4°) */}
      <div
        className="absolute w-[70%] right-0 bottom-0"
        style={{ transform: 'rotate(-4deg)' }}
      >
        <VisualImage src={visuals[1]} alt="" />
      </div>

      {/* Front visual (left side, upper, +4°) */}
      <div
        className="absolute w-[70%] left-0 top-0 z-10"
        style={{ transform: 'rotate(4deg)' }}
      >
        <VisualImage src={visuals[0]} alt="" />
      </div>
    </div>
  )
}

/**
 * Three visuals - 55% width each
 * Z-order from back to front: top-right → center → bottom-left
 * Group is centered horizontally and vertically
 */
function ThreeVisuals({ visuals }: { visuals: Array<string> }) {
  return (
    <div className="relative w-[85%] h-[85%]">
      {/* Back visual (top right, -4°) - lowest z-index */}
      <div
        className="absolute w-[55%] right-0 top-0"
        style={{ transform: 'rotate(-4deg)' }}
      >
        <VisualImage src={visuals[2]} alt="" />
      </div>

      {/* Middle visual (center, 0°) - middle z-index */}
      <div
        className="absolute w-[55%] left-1/2 top-1/2 z-10"
        style={{ transform: 'translate(-50%, -50%) rotate(0deg)' }}
      >
        <VisualImage src={visuals[1]} alt="" />
      </div>

      {/* Front visual (bottom left, +4°) - highest z-index */}
      <div
        className="absolute w-[55%] left-0 bottom-0 z-20"
        style={{ transform: 'rotate(4deg)' }}
      >
        <VisualImage src={visuals[0]} alt="" />
      </div>
    </div>
  )
}

/**
 * Individual visual image with 4:3 aspect ratio
 * Postcard-like frame: border outline, small xy shadow, rounded corners, no inner padding
 */
function VisualImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="relative aspect-[4/3] rounded-md overflow-hidden border border-neutral-200 bg-white"
      style={{ boxShadow: '1px 2px 4px rgba(0, 0, 0, 0.1)' }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  )
}
