import type { Experience } from '@/lib/experiences'

export interface CareerCalendarProps {
  experiences: Array<Experience>
  className?: string
  onExperienceClick?: (experience: Experience) => void
}

export interface PositionedExperience {
  experience: Experience
  /** Column index (0 = leftmost) */
  column: number
  /** Left position as percentage (0-100) - from forward packing algorithm */
  leftPercent: number
  /** Width as percentage (0-100) - from forward packing algorithm */
  widthPercent: number
  /** Maximum columns in this overlap group (for backward compatibility) */
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
  /** Whether this card is overlapped by another card from right */
  isOverlapped: boolean
  /** Whether this positioned item is a milestone */
  isMilestone: boolean
}

export interface PositionedMilestone {
  experience: Experience
  topPercent: number
  topPx: number
  /** Whether this milestone overlaps with regular experiences */
  hasOverlapWithRegular: boolean
  /** Number of overlapping regular experiences at this point */
  overlappingRegularCount: number
}

export interface TimelineBounds {
  years: Array<number>
  ceilingYear: number
  timelineStart: Date
  timelineEnd: Date
}

export interface ExperiencePositioning {
  /** Which column (0 = leftmost) */
  column: number
  /** Left position as percentage (0-100) */
  leftPercent: number
  /** Width as percentage (0-100) */
  widthPercent: number
  /** Number of events overlapping at this event's start time (for debugging) */
  overlapAtStart: number
  /** Whether this card has another card overlapping it from the right */
  isOverlapped: boolean
}
