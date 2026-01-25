import type { Experience } from '@/lib/experiences'

export interface CareerCalendarProps {
  experiences: Array<Experience>
  className?: string
}

export interface PositionedExperience {
  experience: Experience
  /** Column index (0 = leftmost) */
  column: number
  /** Maximum columns in this overlap group (determines width) */
  maxColumnsInGroup: number
  /** Top position as percentage of total timeline height */
  topPercent: number
  /** Height as percentage of total timeline height */
  heightPercent: number
  /** Top position in pixels (original, based on date) */
  topPx: number
  /** Height in pixels */
  heightPx: number
  /** Final top position in pixels (after gap adjustment) */
  finalTopPx: number
  /** Final height in pixels (after gap adjustment) */
  finalHeightPx: number
}

export interface PositionedMilestone {
  experience: Experience
  topPercent: number
  topPx: number
}

export interface TimelineBounds {
  years: Array<number>
  ceilingYear: number
  timelineStart: Date
  timelineEnd: Date
}

export interface ExperiencePositioning {
  column: number
  maxConcurrent: number
}
