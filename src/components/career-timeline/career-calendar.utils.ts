import { MIN_EXPERIENCE_HEIGHT_PX } from './career-calendar.constants'
import type { Experience } from '@/lib/experiences'
import type { CardType, TimelineBounds } from './career-calendar.types'

/**
 * Check if two time intervals overlap.
 * Intervals are [startA, endA] and [startB, endB].
 * Overlap occurs when: startA < endB AND startB < endA
 */
export function intervalsOverlap(
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date,
): boolean {
  return startA < endB && startB < endA
}

/**
 * Check if two experiences are consecutive (no meaningful gap between them).
 *
 * With smart date parsing:
 * - End dates default to last day of month (e.g., "2022-06" → June 30)
 * - Start dates default to first day of month (e.g., "2022-07" → July 1)
 *
 * This means consecutive employment like:
 * - Job A ends "2022-06" (June 30)
 * - Job B starts "2022-07" (July 1)
 * Results in only 1 day difference → truly consecutive.
 *
 * We consider experiences consecutive if the gap is <= 7 days.
 * This handles edge cases like:
 * - Weekend gaps between jobs
 * - Minor date recording inconsistencies
 */
export function areConsecutive(
  expAEnd: Date | null,
  expBStart: Date,
  now: Date,
): boolean {
  const endDate = expAEnd ?? now

  // Calculate the gap in days
  const msPerDay = 24 * 60 * 60 * 1000
  const gapMs = expBStart.getTime() - endDate.getTime()
  const gapDays = gapMs / msPerDay

  // Consecutive if gap is <= 7 days (allows for weekends, minor inconsistencies)
  // Also handle negative gaps (overlap) as consecutive
  return gapDays <= 7
}

/**
 * Convert date to position (0% = top/newest, 100% = bottom/oldest)
 * Since years are displayed newest at top, we invert the calculation
 */
export function dateToPercent(
  date: Date,
  timelineStart: Date,
  timelineEnd: Date,
): number {
  const totalMs = timelineEnd.getTime() - timelineStart.getTime()
  if (totalMs === 0) return 0
  // Invert: newest (timelineEnd) = 0%, oldest (timelineStart) = 100%
  return ((timelineEnd.getTime() - date.getTime()) / totalMs) * 100
}

/**
 * Calculate timeline bounds from experiences
 */
export function calculateTimelineBounds(
  experiences: Array<Experience>,
  now: Date,
): TimelineBounds {
  if (experiences.length === 0) {
    const currentYear = now.getFullYear()
    return {
      years: [currentYear],
      ceilingYear: currentYear + 1,
      timelineStart: new Date(currentYear, 0, 1),
      timelineEnd: new Date(currentYear + 1, 0, 1),
    }
  }

  let minDate = new Date(experiences[0].startDateParsed)
  let maxDate = experiences[0].endDateParsed ?? now

  for (const exp of experiences) {
    if (exp.startDateParsed < minDate) minDate = new Date(exp.startDateParsed)
    const endDate = exp.endDateParsed ?? now
    if (endDate > maxDate) maxDate = endDate
  }

  const startYear = minDate.getFullYear()
  const endYear = maxDate.getFullYear()
  const ceiling = endYear + 1

  const yearsList: Array<number> = []
  for (let y = endYear; y >= startYear; y--) {
    yearsList.push(y)
  }

  return {
    years: yearsList,
    ceilingYear: ceiling,
    timelineStart: new Date(startYear, 0, 1),
    timelineEnd: new Date(ceiling, 0, 1),
  }
}

/**
 * Calculate vertical position for an experience card
 */
export function calculateVerticalPosition(
  exp: Experience,
  totalHeightPx: number,
  timelineStart: Date,
  timelineEnd: Date,
  now: Date,
): { topPx: number; heightPx: number } {
  const start = exp.startDateParsed
  const end = exp.endDateParsed ?? now

  const topPercent = dateToPercent(end, timelineStart, timelineEnd)
  const topPx = (topPercent / 100) * totalHeightPx

  const startPercent = dateToPercent(start, timelineStart, timelineEnd)
  let heightPx = ((startPercent - topPercent) / 100) * totalHeightPx

  if (heightPx < MIN_EXPERIENCE_HEIGHT_PX) {
    heightPx = MIN_EXPERIENCE_HEIGHT_PX
  }

  return { topPx: Math.round(topPx), heightPx: Math.round(heightPx) }
}

/**
 * Get card type from experience
 */
export function getCardType(exp: Experience): CardType {
  if (exp.isDeprioritized) return 'deprioritized'
  if (exp.isMilestone) return 'milestone'
  return 'regular'
}
