import * as LucideIcons from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Experience, SubcategoryColorScheme } from '@/lib/experiences'
import { SUBCATEGORY_COLORS } from '@/lib/experiences'

interface ExperienceEntryCardProps {
  experience: Experience
  isCompact?: boolean // When duration is too short for multi-row layout
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const icons = LucideIcons as Record<string, any>
  const IconComponent = icons[pascalCase] as LucideIconComponent | undefined
  return IconComponent || null
}

/**
 * Experience entry card for calendar timeline view
 * Displays icon, role, company, and duration
 */
export function ExperienceEntryCard({
  experience,
  isCompact = false,
  className,
}: ExperienceEntryCardProps) {
  const colors: SubcategoryColorScheme =
    SUBCATEGORY_COLORS[experience.subcategory]
  const IconComponent = getIconComponent(experience.icon)
  const duration = formatDuration(
    experience.startDateParsed,
    experience.endDateParsed,
  )

  if (isCompact) {
    // Single-row compact layout for short durations
    return (
      <div
        className={cn(
          'flex items-center gap-2 px-2 py-1 rounded-md border text-xs',
          colors.bg,
          colors.border,
          colors.bgHover,
          'transition-colors cursor-default',
          className,
        )}
      >
        {IconComponent && (
          <IconComponent className={cn('size-3 shrink-0', colors.text)} />
        )}
        <span className={cn('font-medium truncate', colors.text)}>
          {experience.role}
        </span>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground truncate">
          {experience.company}
        </span>
      </div>
    )
  }

  // Multi-row standard layout
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
      {/* Row 1: Icon */}
      {IconComponent && <IconComponent className={cn('size-4', colors.text)} />}

      {/* Row 2: Role · Company */}
      <div className="flex items-center gap-1.5 text-sm">
        <span className={cn('font-medium', colors.text)}>
          {experience.role}
        </span>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">{experience.company}</span>
      </div>

      {/* Row 3: Duration */}
      <span className="text-xs text-muted-foreground">{duration}</span>
    </div>
  )
}

interface MilestoneEntryProps {
  experience: Experience
  className?: string
}

/**
 * Milestone entry (single-point event like graduation, award)
 * Displayed as a dot with smaller text
 */
export function MilestoneEntry({ experience, className }: MilestoneEntryProps) {
  const colors: SubcategoryColorScheme =
    SUBCATEGORY_COLORS[experience.subcategory]

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Dot indicator */}
      <div className={cn('size-2 rounded-full shrink-0', colors.dot)} />

      {/* Text content */}
      <div className="flex items-center gap-1 text-xs">
        <span className={cn('font-medium', colors.text)}>
          {experience.role}
        </span>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">{experience.company}</span>
      </div>
    </div>
  )
}
