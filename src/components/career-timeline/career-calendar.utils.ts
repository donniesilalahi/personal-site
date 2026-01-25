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
 * Check if two experiences are consecutive (no gap between them).
 * Consecutive means: expA ends in month M, expB starts in month M+1 (or same month)
 * We treat month-level precision: "2022-02" ends → "2022-03" starts = consecutive
 */
export function areConsecutive(
  expAEnd: Date | null,
  expBStart: Date,
  now: Date,
): boolean {
  const endDate = expAEnd ?? now

  // Get year/month for comparison
  const endYear = endDate.getFullYear()
  const endMonth = endDate.getMonth()
  const startYear = expBStart.getFullYear()
  const startMonth = expBStart.getMonth()

  // Calculate months difference
  const monthsDiff = (startYear - endYear) * 12 + (startMonth - endMonth)

  // Consecutive if start is 0 or 1 month after end
  // 0 = same month (overlap or same month boundary)
  // 1 = next month (truly consecutive)
  return monthsDiff >= 0 && monthsDiff <= 1
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
