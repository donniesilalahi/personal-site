/**
 * Google Calendar-style "Forward Packing" algorithm
 *
 * Key principles:
 * 1. Events that start earlier claim more horizontal space
 * 2. Width is NOT uniform - it's based on overlap depth at each event's start time
 * 3. Later events are "squeezed" into remaining space on the right
 * 4. Column assignment is greedy-leftmost
 *
 * Important insight from Google Calendar:
 * - When a new event starts, it doesn't "steal" space from running events
 * - Instead, ALL overlapping events at that moment share the space
 * - Width is determined by max concurrency during the event's span
 * - But LEFT POSITION is cumulative based on earlier events
 */

import { intervalsOverlap } from './career-calendar.utils'
import type { Experience } from '@/lib/experiences'
import type { ExperiencePositioning } from './career-calendar.types'

/**
 * PHASE 1: Assign columns to experiences using greedy leftmost algorithm.
 * - Sort by startDate ASC, then endDate ASC
 * - Assign each to leftmost column where it doesn't overlap with existing events
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
 * PHASE 2: Calculate max concurrency for each event.
 *
 * Key insight from Google Calendar:
 * - Width is determined by the MAXIMUM number of concurrent events
 *   at ANY POINT during this event's duration
 * - This ensures consistent column widths for overlapping events
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
    const checkPoints: Array<Date> = [start, end]

    // Add start/end points of all events that overlap with this one
    for (const other of experiences) {
      const otherStart = other.startDateParsed
      const otherEnd = other.endDateParsed ?? now

      if (intervalsOverlap(start, end, otherStart, otherEnd)) {
        if (otherStart >= start && otherStart <= end) {
          checkPoints.push(otherStart)
        }
        if (otherEnd >= start && otherEnd <= end) {
          checkPoints.push(otherEnd)
        }
      }
    }

    // Find maximum concurrency at any check point
    let maxConcurrent = 1

    for (const checkTime of checkPoints) {
      const concurrent = experiences.filter((e) => {
        const eStart = e.startDateParsed
        const eEnd = e.endDateParsed ?? now
        return eStart <= checkTime && checkTime <= eEnd
      }).length

      maxConcurrent = Math.max(maxConcurrent, concurrent)
    }

    maxConcurrencyMap.set(exp.id, maxConcurrent)
  }

  return maxConcurrencyMap
}

/**
 * PHASE 3: Calculate widths and positions using Forward Packing.
 *
 * Google Calendar style:
 * - All events in the same overlap group share width equally
 * - Width = 100% / maxConcurrency
 * - Left position = column * width
 *
 * The "forward packing" aspect comes from:
 * - Events starting earlier get lower column numbers (assigned first)
 * - Lower column = further left position
 * - So early starters naturally appear on the left
 */
function calculateWidthsAndPositions(
  experiences: Array<Experience>,
  columnAssignments: Map<string, number>,
  maxConcurrencyMap: Map<string, number>,
): Map<
  string,
  { leftPercent: number; widthPercent: number; overlapAtStart: number }
> {
  const result = new Map<
    string,
    { leftPercent: number; widthPercent: number; overlapAtStart: number }
  >()

  for (const exp of experiences) {
    const column = columnAssignments.get(exp.id) ?? 0
    const maxConcurrent = maxConcurrencyMap.get(exp.id) ?? 1

    // Width is uniform for all events in the same overlap group
    const widthPercent = 100 / maxConcurrent

    // Left position is based on column number
    const leftPercent = column * widthPercent

    result.set(exp.id, {
      leftPercent,
      widthPercent,
      overlapAtStart: maxConcurrent,
    })
  }

  return result
}

/**
 * PHASE 4: Calculate which cards are overlapped by others on the right.
 *
 * A card is "overlapped" if there exists another card in a higher column
 * that temporally overlaps with it. This is used to add padding-right
 * for better readability.
 */
function calculateOverlappedStatus(
  experiences: Array<Experience>,
  columnAssignments: Map<string, number>,
  now: Date,
): Map<string, boolean> {
  const overlappedMap = new Map<string, boolean>()

  for (const exp of experiences) {
    const column = columnAssignments.get(exp.id) ?? 0
    const start = exp.startDateParsed
    const end = exp.endDateParsed ?? now

    // Check if any other experience in a HIGHER column overlaps this one
    let isOverlapped = false
    for (const other of experiences) {
      if (other.id === exp.id) continue

      const otherColumn = columnAssignments.get(other.id) ?? 0
      if (otherColumn <= column) continue // Only care about cards to the right

      const otherStart = other.startDateParsed
      const otherEnd = other.endDateParsed ?? now

      if (intervalsOverlap(start, end, otherStart, otherEnd)) {
        isOverlapped = true
        break
      }
    }

    overlappedMap.set(exp.id, isOverlapped)
  }

  return overlappedMap
}

/**
 * PHASE 5: Combine all calculations for final positioning.
 *
 * Returns complete positioning info for each experience:
 * - column: logical column (0 = leftmost)
 * - leftPercent: horizontal position (0-100%)
 * - widthPercent: width (0-100%)
 * - overlapAtStart: number of max concurrent events (for debugging)
 * - isOverlapped: whether another card overlaps this one from the right
 */
export function calculatePositioning(
  experiences: Array<Experience>,
  now: Date,
): Map<string, ExperiencePositioning> {
  const columnAssignments = assignColumns(experiences, now)
  const maxConcurrencyMap = calculateMaxConcurrency(experiences, now)
  const widthsAndPositions = calculateWidthsAndPositions(
    experiences,
    columnAssignments,
    maxConcurrencyMap,
  )
  const overlappedStatus = calculateOverlappedStatus(
    experiences,
    columnAssignments,
    now,
  )

  const result = new Map<string, ExperiencePositioning>()

  for (const exp of experiences) {
    const column = columnAssignments.get(exp.id) ?? 0
    const { leftPercent, widthPercent, overlapAtStart } =
      widthsAndPositions.get(exp.id) ?? {
        leftPercent: 0,
        widthPercent: 100,
        overlapAtStart: 1,
      }
    const isOverlapped = overlappedStatus.get(exp.id) ?? false

    result.set(exp.id, {
      column,
      leftPercent,
      widthPercent,
      overlapAtStart,
      isOverlapped,
    })
  }

  return result
}
