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
