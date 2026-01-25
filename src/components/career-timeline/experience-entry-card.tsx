import * as LucideIcons from 'lucide-react'
import type { Experience, SubcategoryColorScheme } from '@/lib/experiences'
import { cn } from '@/lib/utils'
import { SUBCATEGORY_COLORS } from '@/lib/experiences'

interface ExperienceEntryCardProps {
  experience: Experience
  isShortDuration?: boolean // Less than 12 months
  hasOverlap?: boolean // Has overlapping experience (side-by-side)
  className?: string
}

type LucideIconComponent = React.ComponentType<{ className?: string }>

/**
 * Format date to "MMM YY" format (e.g., "Jan 24")
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}

/**
 * Format duration string (e.g., "Jan 24 - Dec 24" or "Jan 24 - Present")
 */
function formatDuration(startDate: Date, endDate: Date | null): string {
  const start = formatDate(startDate)
  const end = endDate ? formatDate(endDate) : 'Present'
  return `${start} - ${end}`
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
 * - Default (>= 12 months, no overlap): 4 lines - icon, role, @company, dates
 * - Short duration (< 12 months, no overlap): 1 line - icon role @ company dates
 * - Short duration with overlap (<= 12 months): 3 lines - icon, role, @company (no dates)
 * - Long duration with overlap (> 12 months): Keep 4-line layout
 */
export function ExperienceEntryCard({
  experience,
  isShortDuration = false,
  hasOverlap = false,
  className,
}: ExperienceEntryCardProps) {
  const colors: SubcategoryColorScheme =
    SUBCATEGORY_COLORS[experience.subcategory]
  const IconComponent = getIconComponent(experience.icon)
  const duration = formatDuration(
    experience.startDateParsed,
    experience.endDateParsed,
  )

  // Layout: Short duration with overlap (side-by-side, <= 12 months)
  if (isShortDuration && hasOverlap) {
    return (
      <div
        className={cn(
          'flex flex-col gap-0.5 px-2 py-1.5 rounded-md border',
          colors.bg,
          colors.border,
          colors.bgHover,
          'transition-colors cursor-default',
          className,
        )}
      >
        {/* Line 1: Icon */}
        {IconComponent && (
          <IconComponent className={cn('size-4 shrink-0', colors.text)} />
        )}

        {/* Line 2: Role */}
        <span
          className={cn(
            'text-xs font-normal leading-tight text-muted-foreground',
          )}
        >
          {experience.role}
        </span>

        {/* Line 3: @ Company */}
        <div className="flex items-center gap-1">
          <AtSeparator className="text-xs" />
          <span className="text-xs font-normal text-muted-foreground truncate">
            {experience.company}
          </span>
        </div>
      </div>
    )
  }

  // Layout: Short duration, no overlap (single row)
  if (isShortDuration) {
    return (
      <div
        className={cn(
          'flex items-center gap-1.5 px-2 py-1.5 rounded-md border',
          colors.bg,
          colors.border,
          colors.bgHover,
          'transition-colors cursor-default',
          className,
        )}
      >
        {IconComponent && (
          <IconComponent className={cn('size-4 shrink-0', colors.text)} />
        )}
        <span className={cn('text-xs font-normal text-muted-foreground')}>
          {experience.role}
        </span>
        <AtSeparator className="text-xs" />
        <span className="text-xs font-normal text-muted-foreground truncate flex-1">
          {experience.company}
        </span>
        <span className="text-[10px] text-muted-foreground shrink-0">
          {duration}
        </span>
      </div>
    )
  }

  // Layout: Default (>= 12 months) - 4 lines
  return (
    <div
      className={cn(
        'flex flex-col gap-0.5 px-3 py-2 rounded-lg border',
        colors.bg,
        colors.border,
        colors.bgHover,
        'transition-colors cursor-default',
        className,
      )}
    >
      {/* Line 1: Icon */}
      {IconComponent && <IconComponent className={cn('size-4', colors.text)} />}

      {/* Line 2: Role */}
      <span
        className={cn(
          'text-sm font-normal leading-tight text-muted-foreground',
        )}
      >
        {experience.role}
      </span>

      {/* Line 3: @ Company */}
      <div className="flex items-center gap-1">
        <AtSeparator className="text-sm" />
        <span className="text-sm font-normal text-muted-foreground">
          {experience.company}
        </span>
      </div>

      {/* Line 4: Duration */}
      <span className="text-[10px] text-muted-foreground">{duration}</span>
    </div>
  )
}

interface MilestoneEntryProps {
  experience: Experience
  className?: string
}

/**
 * Milestone entry (single-point event like graduation, award)
 * Ghost button style with hover container
 */
export function MilestoneEntry({ experience, className }: MilestoneEntryProps) {
  const colors: SubcategoryColorScheme =
    SUBCATEGORY_COLORS[experience.subcategory]

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded',
        'hover:bg-muted/50 transition-colors cursor-default',
        className,
      )}
    >
      {/* Dot indicator */}
      <div className={cn('size-1.5 rounded-full shrink-0', colors.dot)} />

      {/* Role */}
      <span className="text-[10px] font-medium text-foreground">
        {experience.role}
      </span>

      {/* @ */}
      <AtSeparator className="text-[10px]" />

      {/* Company */}
      <span className="text-[10px] text-muted-foreground">
        {experience.company}
      </span>
    </div>
  )
}
