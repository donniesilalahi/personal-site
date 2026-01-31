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
 * - 2 images: 55% width each, rotated ±4°, placed closer to edges
 * - 3 images: 55% width each, first +4°, second 0°, third -4°
 *
 * All images maintain 4:3 aspect ratio
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
      <div className="absolute inset-0 flex items-center justify-center p-6">
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
 * Two visuals - 55% width each, ±4° rotation, offset positions
 */
function TwoVisuals({ visuals }: { visuals: Array<string> }) {
  return (
    <div className="relative w-full h-full">
      {/* Back visual (left side, -4°) */}
      <div
        className="absolute w-[55%] left-[10%] top-1/2 -translate-y-1/2"
        style={{ transform: 'translateY(-50%) rotate(-4deg)' }}
      >
        <VisualImage src={visuals[0]} alt="" />
      </div>

      {/* Front visual (right side, +4°) */}
      <div
        className="absolute w-[55%] right-[10%] top-1/2 z-10"
        style={{ transform: 'translateY(-50%) rotate(4deg)' }}
      >
        <VisualImage src={visuals[1]} alt="" />
      </div>
    </div>
  )
}

/**
 * Three visuals - 55% width each
 * First: +4°, Second: 0°, Third: -4°
 * Stacked with overlapping effect
 */
function ThreeVisuals({ visuals }: { visuals: Array<string> }) {
  return (
    <div className="relative w-full h-full">
      {/* Back visual (bottom left, -4°) */}
      <div
        className="absolute w-[55%] left-[5%] top-[55%] -translate-y-1/2"
        style={{ transform: 'translateY(-50%) rotate(-4deg)' }}
      >
        <VisualImage src={visuals[2]} alt="" />
      </div>

      {/* Middle visual (center top, 0°) */}
      <div
        className="absolute w-[55%] left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 z-10"
        style={{ transform: 'translate(-50%, -50%) rotate(0deg)' }}
      >
        <VisualImage src={visuals[1]} alt="" />
      </div>

      {/* Front visual (bottom right, +4°) */}
      <div
        className="absolute w-[55%] right-[5%] top-[60%] z-20"
        style={{ transform: 'translateY(-50%) rotate(4deg)' }}
      >
        <VisualImage src={visuals[0]} alt="" />
      </div>
    </div>
  )
}

/**
 * Individual visual image with 4:3 aspect ratio and shadow
 */
function VisualImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-lg bg-white">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  )
}
