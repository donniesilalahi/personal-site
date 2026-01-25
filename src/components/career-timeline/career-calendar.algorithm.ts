/**
 * Google Calendar-style column assignment algorithm
 *
 * This module handles the core positioning logic for overlapping experiences
 * in the career calendar, similar to how Google Calendar positions events.
 */

import type { Experience } from '@/lib/experiences'
import type { ExperiencePositioning } from './career-calendar.types'
import { intervalsOverlap } from './career-calendar.utils'

/**
 * PHASE 1: Assign columns to experiences using Google Calendar's algorithm.
 * - Sort by startDate ASC, then endDate ASC
 * - Assign each to leftmost column where it doesn't overlap with existing events
 * - Column reuse: non-overlapping events can share the same column
 */
function assignColumns(
  experiences: Array<Experience>,
  now: Date,
): Map<string, number> {
  if (experiences.length === 0) {
    return new Map()
  }

  // Sort by startDate ASC, then endDate ASC (null endDate = now)
  const sorted = [...experiences].sort((a, b) => {
    const startDiff = a.startDateParsed.getTime() - b.startDateParsed.getTime()
    if (startDiff !== 0) return startDiff

    const aEnd = a.endDateParsed?.getTime() ?? now.getTime()
    const bEnd = b.endDateParsed?.getTime() ?? now.getTime()
    return aEnd - bEnd
  })

  const columnAssignments = new Map<string, number>()

  // Each column tracks which experiences are in it
  const columns: Array<Array<string>> = []

  for (const exp of sorted) {
    const start = exp.startDateParsed
    const end = exp.endDateParsed ?? now

    // Find leftmost column where this experience fits (no overlap)
    let assignedColumn = -1

    for (let colIdx = 0; colIdx < columns.length; colIdx++) {
      const hasOverlap = columns[colIdx].some((existingId) => {
        const existingExp = experiences.find((e) => e.id === existingId)
        if (!existingExp) return false

        const existingStart = existingExp.startDateParsed
        const existingEnd = existingExp.endDateParsed ?? now

        return intervalsOverlap(start, end, existingStart, existingEnd)
      })

      if (!hasOverlap) {
        assignedColumn = colIdx
        break
      }
    }

    // If no existing column works, create a new one
    if (assignedColumn === -1) {
      assignedColumn = columns.length
      columns.push([])
    }

    columns[assignedColumn].push(exp.id)
    columnAssignments.set(exp.id, assignedColumn)
  }

  return columnAssignments
}

/**
 * PHASE 2: Calculate max concurrent events during each experience's duration.
 * This determines the width of each event - NOT based on transitive overlap groups,
 * but on actual maximum concurrency at any point during the event's span.
 *
 * Key insight: Width is determined by maximum concurrent events during the
 * event's ENTIRE duration, not moment-by-moment or by global overlap chains.
 */
function calculateMaxConcurrency(
  experiences: Array<Experience>,
  now: Date,
): Map<string, number> {
  const maxConcurrencyMap = new Map<string, number>()

  for (const exp of experiences) {
    const start = exp.startDateParsed
    const end = exp.endDateParsed ?? now

    // Collect all time points to check within this experience's duration
    // We need to check at boundaries of all potentially overlapping events
    const checkPoints: Array<Date> = [start, end]

    // Add start/end points of all events that overlap with this one
    for (const other of experiences) {
      const otherStart = other.startDateParsed
      const otherEnd = other.endDateParsed ?? now

      if (intervalsOverlap(start, end, otherStart, otherEnd)) {
        // Only add points that fall within our event's span
        if (otherStart >= start && otherStart <= end) {
          checkPoints.push(otherStart)
        }
        if (otherEnd >= start && otherEnd <= end) {
          checkPoints.push(otherEnd)
        }
      }
    }

    // Find maximum concurrency at any check point
    let maxConcurrent = 1 // At minimum, the event itself

    for (const checkTime of checkPoints) {
      // Count how many events are active at this exact time
      // An event is active if: start <= checkTime < end (or start <= checkTime <= end for end boundary)
      const concurrent = experiences.filter((e) => {
        const eStart = e.startDateParsed
        const eEnd = e.endDateParsed ?? now
        // Event is active at checkTime if it contains this point
        return eStart <= checkTime && checkTime <= eEnd
      }).length

      maxConcurrent = Math.max(maxConcurrent, concurrent)
    }

    maxConcurrencyMap.set(exp.id, maxConcurrent)
  }

  return maxConcurrencyMap
}

/**
 * PHASE 3: Combine column assignment and max concurrency for final positioning.
 * - column: which column (0 = leftmost)
 * - maxConcurrent: determines width (100% / maxConcurrent)
 * - left position: column * width
 */
export function calculatePositioning(
  experiences: Array<Experience>,
  now: Date,
): Map<string, ExperiencePositioning> {
  const columnAssignments = assignColumns(experiences, now)
  const maxConcurrencyMap = calculateMaxConcurrency(experiences, now)

  const result = new Map<string, ExperiencePositioning>()

  for (const exp of experiences) {
    const column = columnAssignments.get(exp.id) ?? 0
    const maxConcurrent = maxConcurrencyMap.get(exp.id) ?? 1

    result.set(exp.id, { column, maxConcurrent })
  }

  return result
}
