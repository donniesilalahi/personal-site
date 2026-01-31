import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Postcard visual effects configuration
 * Based on Figma design specifications
 */
export interface PostcardEffectsConfig {
  /** Drop shadow: x=0, y=3.17, blur=0, spread=0, color #000000 25% */
  shadow?: boolean
  /** Paper-like texture with size 0.4 and radius 0.4 */
  texture?: boolean
  /** Mono noise: size 0.2, density 100%, color #F6F3F1 10% */
  noise?: boolean
}

interface PostcardFrameProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  /** Effects to apply - defaults to all enabled */
  effects?: PostcardEffectsConfig
}

/**
 * Texture overlay component - paper-like texture effect
 * Specs: size 0.4, radius 0.4
 */
export function TextureOverlay({ className }: { className?: string }) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='texture'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.4' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23texture)'/%3E%3C/svg%3E")`,
        opacity: 0.04,
        mixBlendMode: 'overlay',
      }}
      aria-hidden="true"
    />
  )
}

/**
 * Noise overlay component - grainy film effect
 * Specs: mono, size 0.2, density 100%, color #F6F3F1 10%
 */
export function NoiseOverlay({ className }: { className?: string }) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='1' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        opacity: 0.1,
        mixBlendMode: 'soft-light',
        backgroundColor: 'rgba(246, 243, 241, 0.1)',
      }}
      aria-hidden="true"
    />
  )
}

/**
 * Dotted lines overlay component - journaling paper effect
 * Creates horizontal dotted lines with 24px spacing for journaling paper look
 * Light mode: black dots at 15% opacity
 * Dark mode: white dots at 15% opacity
 */
export function DottedLinesOverlay({ className }: { className?: string }) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0 dotted-lines-overlay', className)}
      aria-hidden="true"
    />
  )
}

/** Drop shadow style from Figma specs */
const POSTCARD_SHADOW = '0px 3.17px 0px 0px rgba(0, 0, 0, 0.25)'

/**
 * PostcardFrame - Reusable frame component with postcard visual effects
 *
 * Applies the following effects based on Figma design:
 * - Drop shadow: x=0, y=3.17, blur=0, spread=0, color #000000 25%
 * - Texture: paper-like with size 0.4, radius 0.4
 * - Noise: mono, size 0.2, density 100%, color #F6F3F1 10%
 *
 * @example
 * ```tsx
 * <PostcardFrame>
 *   <img src="/photo.jpg" />
 * </PostcardFrame>
 *
 * // Disable specific effects
 * <PostcardFrame effects={{ shadow: true, texture: false, noise: true }}>
 *   <div>Content</div>
 * </PostcardFrame>
 * ```
 */
export function PostcardFrame({
  children,
  className,
  onClick,
  effects = { shadow: true, texture: true, noise: true },
}: PostcardFrameProps) {
  const { shadow = true, texture = true, noise = true } = effects

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-sm border border-border bg-card p-2 md:aspect-[3/2] md:p-4',
        className,
      )}
      onClick={onClick}
      style={{
        boxShadow: shadow ? POSTCARD_SHADOW : undefined,
      }}
    >
      {/* Content container with inner rounded corners */}
      <div className="relative h-full w-full overflow-hidden rounded-[2px]">
        {children}

        {/* Effect overlays */}
        {texture && <TextureOverlay />}
        {noise && <NoiseOverlay />}
      </div>
    </div>
  )
}
