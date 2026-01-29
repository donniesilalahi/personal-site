import { forwardRef, useRef, useEffect, useState } from 'react'

import type { Experience, SubcategoryColorScheme } from '@/lib/experiences'
import { cn } from '@/lib/utils'
import { SUBCATEGORY_COLORS } from '@/lib/experiences'

interface ExperienceEntryCardProps {
  experience: Experience
  isVeryShortDuration?: boolean // Less than or equal to 6 months
  onClick?: () => void
  className?: string
}

/**
 * Vertical text with manual ellipsis truncation
 * (text-overflow: ellipsis doesn't work with writing-mode + transform)
 *
 * With writing-mode: vertical-rl + rotate(180deg), text reads bottom-to-top.
 * The visual "bottom" shows the START of the string, visual "top" shows the END.
 * We truncate from END and add ".." so it appears at visual top.
 */
function VerticalTruncatedText({
  text,
  className,
  alignEnd = true,
}: {
  text: string
  className?: string
  alignEnd?: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const [displayText, setDisplayText] = useState(text)

  useEffect(() => {
    const container = containerRef.current
    const textElement = textRef.current
    if (!container || !textElement) return

    const measure = () => {
      // For vertical-rl text, scrollHeight is the visual "length" of the text line
      const availableHeight = container.offsetHeight

      if (availableHeight === 0) {
        // Container not ready yet, retry
        requestAnimationFrame(measure)
        return
      }

      // Reset to full text and measure
      textElement.textContent = text
      const textHeight = textElement.scrollHeight

      if (textHeight <= availableHeight) {
        setDisplayText(text)
        return
      }

      // Text overflows - need to truncate
      // Simple linear search from full text down (more reliable than binary search)
      for (let i = text.length - 1; i >= 0; i--) {
        const testText = text.slice(0, i) + '..'
        textElement.textContent = testText
        if (textElement.scrollHeight <= availableHeight) {
          setDisplayText(testText)
          return
        }
      }

      // Nothing fits
      setDisplayText('..')
    }

    // Wait for layout to settle
    requestAnimationFrame(measure)
  }, [text])

  return (
    <div
      ref={containerRef}
      className={cn('h-full overflow-hidden flex', alignEnd ? 'items-end' : 'items-start')}
    >
      <span
        ref={textRef}
        className={cn('block', className)}
        style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          whiteSpace: 'nowrap',
        }}
      >
        {displayText}
      </span>
    </div>
  )
}

/**
 * Format date to "MMM YY" format in ALL CAPS (e.g., "JAN 24")
 */
function formatDate(date: Date): string {
  return date
    .toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    .toUpperCase()
}

/**
 * Format duration string (e.g., "JAN 24 - DEC 24" or "JAN 24 - PRESENT")
 */
function formatDuration(startDate: Date, endDate: Date | null): string {
  const start = formatDate(startDate)
  const end = endDate ? formatDate(endDate) : 'PRESENT'
  return `${start} - ${end}`
}

/**
 * Format start date only (for short duration with overlap)
 */
function formatStartOnly(startDate: Date): string {
  return formatDate(startDate)
}

/**
 * @ separator with Bricolage Grotesque font
 */
function AtSeparator({ className }: { className?: string }) {
  return (
    <span className={cn('font-bricolage text-muted-foreground', className)}>
      @
    </span>
  )
}

/**
 * Experience entry card for calendar timeline view
 *
 * Layout rules:
 * - ≤ 6 months: single line layout
 * - >6 months: two-line layout (icon top-left, role @ company + date bottom)
 * - Date always shows only start date
 * - Border radius: 2px (rounded-sm)
 *
 * Supports forwardRef for width measurement during layout calculation.
 */
export const ExperienceEntryCard = forwardRef<
  HTMLDivElement,
  ExperienceEntryCardProps
>(function ExperienceEntryCard(
  { experience, isVeryShortDuration = false, onClick, className },
  ref,
) {
  const colors: SubcategoryColorScheme =
    SUBCATEGORY_COLORS[experience.subcategory]

  // Always show only start date
  const dateDisplay = formatStartOnly(experience.startDateParsed)

  // Deprioritized variant: vertical text, compact width, bottom-to-top reading
  // Layout: [icon (bottom-left) + start date (top-right)] [role @ company (vertical)]
  if (experience.isDeprioritized) {
    const startDateDisplay = formatStartOnly(experience.startDateParsed)
    const roleCompanyText = `${experience.role} @ ${experience.company}`

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-end gap-1.5 h-full px-2 py-1.5 rounded-sm border',
          colors.bg,
          colors.border,
          colors.bgHover,
          'transition-colors',
          onClick ? 'cursor-pointer' : 'cursor-default',
          className,
        )}
        onClick={onClick}
      >
        {/* Icon + Start Date container - single column, vertically stacked */}
        <div className="flex flex-col items-center h-full flex-shrink-0 gap-1.5">
          {/* Start Date - top, vertical text, bottom-to-top, constrained by icon + gap */}
          <div className="flex-1 min-h-0 w-full">
            <VerticalTruncatedText
              text={startDateDisplay}
              className="text-[8px] leading-tight text-muted-foreground"
              alignEnd={false}
            />
          </div>

          {/* Icon - bottom, NOT rotated, stays upright */}
          <img
            src={experience.icon}
            alt={experience.company}
            className={cn(
              'size-3 flex-shrink-0 object-contain rounded-[1.5px]',
              colors.text,
            )}
          />
        </div>

        {/* Role @ Company - vertical text, bottom-to-top, constrained to card height */}
        <VerticalTruncatedText
          text={roleCompanyText}
          className="text-[10px] leading-tight font-normal text-muted-foreground"
          alignEnd={true}
        />
      </div>
    )
  }

  // B6: Very short duration (<= 6 months) - compact single line, no wrap, truncate
  if (isVeryShortDuration) {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-1.5 px-2 py-1.5 rounded-sm border overflow-hidden',
          colors.bg,
          colors.border,
          colors.bgHover,
          'transition-colors',
          onClick ? 'cursor-pointer' : 'cursor-default',
          className,
        )}
        onClick={onClick}
      >
        <img
          src={experience.icon}
          alt={experience.company}
          className={cn(
            'size-3 shrink-0 object-contain rounded-[1.5px]',
            colors.text,
          )}
        />
        <span className="inline-flex items-center gap-x-1 truncate min-w-0">
          <span className="text-[10px] font-normal text-muted-foreground">
            {experience.role}
          </span>
          <AtSeparator className="text-[8px]" />
          <span className="text-[10px] font-normal text-muted-foreground">
            {experience.company}
          </span>
        </span>
        <span className="text-[8px] text-muted-foreground shrink-0 ml-auto">
          {dateDisplay}
        </span>
      </div>
    )
  }

  // > 6 months: two-line layout
  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col justify-between h-full px-2 py-1.5 rounded-sm border',
        colors.bg,
        colors.border,
        colors.bgHover,
        'transition-colors',
        onClick ? 'cursor-pointer' : 'cursor-default',
        className,
      )}
      onClick={onClick}
    >
      {/* Line 1: Icon (left) + Date (right on mobile) */}
      <div className="flex items-center justify-between">
        <img
          src={experience.icon}
          alt={experience.company}
          className={cn(
            'size-3 shrink-0 object-contain rounded-[1.5px]',
            colors.text,
          )}
        />
        <span className="max-sm:block hidden text-[8px] text-muted-foreground">
          {dateDisplay}
        </span>
      </div>

      {/* Line 2: Role @ Company (left) + Date (right on desktop) */}
      <div className="flex items-center justify-between">
        <span className="inline-flex flex-wrap items-center gap-x-1 gap-y-0.5">
          <span className="text-xs font-normal leading-tight text-muted-foreground">
            {experience.role}
          </span>
          <AtSeparator className="text-[8px]" />
          <span className="text-xs font-normal text-muted-foreground">
            {experience.company}
          </span>
        </span>
        <span className="max-sm:hidden text-[8px] text-muted-foreground shrink-0">
          {dateDisplay}
        </span>
      </div>
    </div>
  )
})

interface MilestoneEntryProps {
  experience: Experience
  onClick?: () => void
  className?: string
}

/**
 * Milestone entry (single-point event like graduation, award)
 * Link-like style - no padding, underline on hover
 * Shows only role with a small success-colored dot
 *
 * Supports forwardRef for width measurement during layout calculation.
 */
export const MilestoneEntry = forwardRef<HTMLDivElement, MilestoneEntryProps>(
  function MilestoneEntry({ experience, onClick, className }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1',
          'group',
          onClick ? 'cursor-pointer' : 'cursor-default',
          className,
        )}
        onClick={onClick}
      >
        {/* Dot indicator - small success color */}
        <div className="size-1 rounded-full shrink-0 bg-emerald-500" />

        {/* Role only - 8px, underline on hover */}
        <span className="text-[8px] font-medium text-foreground leading-tight whitespace-nowrap group-hover:underline">
          {experience.role}
        </span>
      </div>
    )
  },
)
