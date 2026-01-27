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
 */
export function ExperienceEntryCard({
  experience,
  isVeryShortDuration = false,
  onClick,
  className,
}: ExperienceEntryCardProps) {
  const colors: SubcategoryColorScheme =
    SUBCATEGORY_COLORS[experience.subcategory]

  // Always show only start date
  const dateDisplay = formatStartOnly(experience.startDateParsed)

  // Deprioritized variant: vertical text, compact width, bottom-to-top reading
  // Layout: [icon] [role @ company (vertical)] [dates (vertical)]
  if (experience.isDeprioritized) {
    const deprioritizedDateDisplay = formatDuration(
      experience.startDateParsed,
      experience.endDateParsed,
    )

    return (
      <div
        className={cn(
          'flex items-end gap-0.5 h-full px-2 py-1.5 rounded-sm border',
          colors.bg,
          colors.border,
          colors.bgHover,
          'transition-colors',
          onClick ? 'cursor-pointer' : 'cursor-default',
          className,
        )}
        onClick={onClick}
      >
        {/* Icon - NOT rotated, stays upright, aligned to bottom-left */}
        <img
          src={experience.icon}
          alt={experience.company}
          className={cn(
            'size-3 shrink-0 object-contain rounded-[1.5px]',
            colors.text,
          )}
        />

        {/* Role @ Company - single vertical text line, bottom-to-top */}
        <span
          className="text-[10px] leading-tight font-normal text-muted-foreground whitespace-nowrap"
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
          }}
        >
          {experience.role} @ {experience.company}
        </span>

        {/* Dates - single vertical text line, bottom-to-top */}
        <span
          className="text-[8px] leading-tight text-muted-foreground whitespace-nowrap"
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
          }}
        >
          {deprioritizedDateDisplay}
        </span>
      </div>
    )
  }

  // B6: Very short duration (<= 6 months) - compact single line, no wrap, truncate
  if (isVeryShortDuration) {
    return (
      <div
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
        <span className="text-[10px] font-normal text-muted-foreground truncate">
          {experience.role}
        </span>
        {/* B4: text-3xs (8px) for <= 12 months */}
        <AtSeparator className="text-[8px] shrink-0" />
        <span className="text-[10px] font-normal text-muted-foreground truncate">
          {experience.company}
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
      {/* Line 1: Icon */}
      <img
        src={experience.icon}
        alt={experience.company}
        className={cn(
          'size-3 shrink-0 object-contain rounded-[1.5px]',
          colors.text,
        )}
      />

      {/* Line 2: Role @ Company (left) + Date (right) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-1">
          <span className="text-xs font-normal leading-tight text-muted-foreground">
            {experience.role}
          </span>
          <AtSeparator className="text-[8px]" />
          <span className="text-xs font-normal text-muted-foreground">
            {experience.company}
          </span>
        </div>
        <span className="text-[8px] text-muted-foreground shrink-0">
          {dateDisplay}
        </span>
      </div>
    </div>
  )
}

interface MilestoneEntryProps {
  experience: Experience
  onClick?: () => void
  className?: string
}

/**
 * Milestone entry (single-point event like graduation, award)
 * Link-like style - no padding, underline on hover
 * Shows only role with a small success-colored dot
 */
export function MilestoneEntry({
  experience,
  onClick,
  className,
}: MilestoneEntryProps) {
  return (
    <div
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
}
