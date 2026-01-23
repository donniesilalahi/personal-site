import { type ReactNode, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

/**
 * Image effect presets for photograph styling
 */
export type ImageEffectPreset = 'none' | 'misty' | 'vintage'

interface ImageEffectsProps {
  children: ReactNode
  className?: string
  /** Effect preset to apply */
  preset?: ImageEffectPreset
  /** Custom filter overrides */
  customFilter?: string
}

/**
 * Effect configurations for each preset
 */
const EFFECT_PRESETS: Record<ImageEffectPreset, CSSProperties> = {
  none: {},
  /**
   * Misty effect - Creates a dreamy, soft atmosphere
   * - Slight desaturation
   * - Reduced contrast
   * - Soft brightness boost
   * - Light blur for dream-like quality
   */
  misty: {
    filter: 'saturate(0.85) contrast(0.9) brightness(1.05)',
  },
  /**
   * Vintage effect - Classic film photography look
   * - Sepia toning
   * - Warm color cast
   * - Slightly faded blacks
   * - Reduced saturation with warm tint
   */
  vintage: {
    filter: 'sepia(0.15) saturate(0.9) contrast(0.95) brightness(1.02)',
  },
}

/**
 * Overlay styles for each preset (additional color grading)
 */
const OVERLAY_STYLES: Record<ImageEffectPreset, CSSProperties | null> = {
  none: null,
  /**
   * Misty overlay - Adds a subtle white/blue haze
   */
  misty: {
    background:
      'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(200, 210, 220, 0.05) 100%)',
    mixBlendMode: 'overlay' as const,
  },
  /**
   * Vintage overlay - Adds warm color cast and vignette hint
   */
  vintage: {
    background:
      'radial-gradient(ellipse at center, rgba(255, 240, 220, 0.08) 0%, rgba(180, 140, 100, 0.12) 100%)',
    mixBlendMode: 'overlay' as const,
  },
}

/**
 * ImageEffects - Wrapper component for applying visual effects to images
 *
 * Provides preset effects for photographs:
 * - `none`: No effects applied
 * - `misty`: Dreamy, soft atmosphere with slight desaturation
 * - `vintage`: Classic film look with warm sepia toning
 *
 * @example
 * ```tsx
 * <ImageEffects preset="misty">
 *   <img src="/photo.jpg" className="h-full w-full object-cover" />
 * </ImageEffects>
 *
 * // With custom filter
 * <ImageEffects preset="vintage" customFilter="blur(0.5px)">
 *   <img src="/photo.jpg" />
 * </ImageEffects>
 * ```
 */
export function ImageEffects({
  children,
  className,
  preset = 'none',
  customFilter,
}: ImageEffectsProps) {
  const presetStyles = EFFECT_PRESETS[preset]
  const overlayStyles = OVERLAY_STYLES[preset]

  // Combine preset filter with custom filter if provided
  const combinedFilter = customFilter
    ? `${presetStyles.filter || ''} ${customFilter}`.trim()
    : presetStyles.filter

  return (
    <div className={cn('relative h-full w-full', className)}>
      {/* Content with filter applied */}
      <div
        className="h-full w-full"
        style={{
          ...presetStyles,
          filter: combinedFilter || undefined,
        }}
      >
        {children}
      </div>

      {/* Color grading overlay */}
      {overlayStyles && (
        <div
          className="pointer-events-none absolute inset-0"
          style={overlayStyles}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

/**
 * MistyOverlay - Standalone misty effect overlay
 * Use when you need just the overlay without the filter wrapper
 */
export function MistyOverlay({ className }: { className?: string }) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        background:
          'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(200, 210, 220, 0.05) 100%)',
        mixBlendMode: 'overlay',
      }}
      aria-hidden="true"
    />
  )
}

/**
 * VintageOverlay - Standalone vintage effect overlay
 * Use when you need just the overlay without the filter wrapper
 */
export function VintageOverlay({ className }: { className?: string }) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        background:
          'radial-gradient(ellipse at center, rgba(255, 240, 220, 0.08) 0%, rgba(180, 140, 100, 0.12) 100%)',
        mixBlendMode: 'overlay',
      }}
      aria-hidden="true"
    />
  )
}
