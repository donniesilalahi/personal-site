import * as LucideIcons from 'lucide-react'
import type { Experience, SubcategoryColorScheme } from '@/lib/experiences'
import { cn } from '@/lib/utils'
import { SUBCATEGORY_COLORS } from '@/lib/experiences'

interface ExperienceEntryCardProps {
  experience: Experience
  isShortDuration?: boolean // Less than or equal to 12 months
  isVeryShortDuration?: boolean // Less than or equal to 6 months
  hasOverlap?: boolean // Card has overlapping experiences (side by side)
  onClick?: () => void
  className?: string
}

type LucideIconComponent = React.ComponentType<{ className?: string }>

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
 * Get Lucide icon component by name
 */
function getIconComponent(iconName: string): LucideIconComponent | null {
  // Convert kebab-case to PascalCase (e.g., "graduation-cap" -> "GraduationCap")
  const pascalCase = iconName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')

  const icons = LucideIcons as Record<string, any>
  const IconComponent = icons[pascalCase] as LucideIconComponent | undefined
  return IconComponent || null
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
 * - B5: Long duration (> 12 months): icon top-left, info bottom-left, allow wrap
 * - B6: Very short duration (<= 6 months): no wrap, truncate role+company
 * - B7: Short duration (<= 12 months) with overlap: show only start date
 */
export function ExperienceEntryCard({
  experience,
  isShortDuration = false,
  isVeryShortDuration = false,
  hasOverlap = false,
  onClick,
  className,
}: ExperienceEntryCardProps) {
  const colors: SubcategoryColorScheme =
    SUBCATEGORY_COLORS[experience.subcategory]
  const IconComponent = getIconComponent(experience.icon)

  // B7: Show only start date for short duration with overlap
  const dateDisplay =
    isShortDuration && hasOverlap
      ? formatStartOnly(experience.startDateParsed)
      : formatDuration(experience.startDateParsed, experience.endDateParsed)

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
          'flex items-end gap-0.5 h-full px-1 py-1 rounded-md border',
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
        {IconComponent && (
          <IconComponent className={cn('size-3 shrink-0', colors.text)} />
        )}

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
          'flex items-center gap-1 px-1.5 py-1 rounded-md border overflow-hidden',
          colors.bg,
          colors.border,
          colors.bgHover,
          'transition-colors',
          onClick ? 'cursor-pointer' : 'cursor-default',
          className,
        )}
        onClick={onClick}
      >
        {IconComponent && (
          <IconComponent className={cn('size-3 shrink-0', colors.text)} />
        )}
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

  // Short duration (> 6 months && <= 12 months) - single line layout
  if (isShortDuration) {
    return (
      <div
        className={cn(
          'flex items-center gap-1.5 px-2 py-1.5 rounded-md border',
          colors.bg,
          colors.border,
          colors.bgHover,
          'transition-colors',
          onClick ? 'cursor-pointer' : 'cursor-default',
          className,
        )}
        onClick={onClick}
      >
        {IconComponent && (
          <IconComponent className={cn('size-3.5 shrink-0', colors.text)} />
        )}
        <span className="text-xs font-normal text-muted-foreground">
          {experience.role}
        </span>
        {/* B4: text-3xs (8px) for <= 12 months */}
        <AtSeparator className="text-[8px]" />
        <span className="text-xs font-normal text-muted-foreground truncate flex-1">
          {experience.company}
        </span>
        <span className="text-[8px] text-muted-foreground shrink-0">
          {dateDisplay}
        </span>
      </div>
    )
  }

  // B5: Long duration (> 12 months) - icon top-left, info bottom-left, allow wrap
  return (
    <div
      className={cn(
        'flex flex-col justify-between h-full px-2.5 py-2 rounded-lg border',
        colors.bg,
        colors.border,
        colors.bgHover,
        'transition-colors',
        onClick ? 'cursor-pointer' : 'cursor-default',
        className,
      )}
      onClick={onClick}
    >
      {/* Top-left: Icon */}
      {IconComponent && (
        <IconComponent className={cn('size-4 shrink-0', colors.text)} />
      )}

      {/* Bottom-left: Role @ Company + Dates - allow wrap */}
      <div className="flex flex-col gap-0.5 mt-auto">
        <div className="flex flex-wrap items-center gap-x-1">
          <span className="text-xs font-normal leading-tight text-muted-foreground">
            {experience.role}
          </span>
          {/* B4: text-2xs (10px) for > 12 months */}
          <AtSeparator className="text-[10px]" />
          <span className="text-xs font-normal text-muted-foreground">
            {experience.company}
          </span>
        </div>
        {/* B4: text-2xs (10px) for > 12 months */}
        <span className="text-[10px] text-muted-foreground">{dateDisplay}</span>
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
 * Ghost button style - no background/border by default, shows on hover
 * Content wraps: first line "<dot> <role>", second line "@ <company>"
 * Width hugs content (inline-block)
 */
export function MilestoneEntry({
  experience,
  onClick,
  className,
}: MilestoneEntryProps) {
  const colors: SubcategoryColorScheme =
    SUBCATEGORY_COLORS[experience.subcategory]

  return (
    <div
      className={cn(
        'inline-flex items-start gap-1 px-1.5 py-0.5 rounded',
        'hover:bg-muted/50 transition-colors',
        onClick ? 'cursor-pointer' : 'cursor-default',
        className,
      )}
      onClick={onClick}
    >
      {/* Dot indicator - aligned to first line */}
      <div
        className={cn('size-1.5 rounded-full shrink-0 mt-[3px]', colors.dot)}
      />

      {/* Role and Company - stacked vertically */}
      <div className="flex flex-col">
        <span className="text-[10px] font-medium text-foreground leading-tight">
          {experience.role}
        </span>
        <div className="flex items-center gap-0.5">
          <AtSeparator className="text-[10px]" />
          <span className="text-[10px] text-muted-foreground leading-tight">
            {experience.company}
          </span>
        </div>
      </div>
    </div>
  )
}
