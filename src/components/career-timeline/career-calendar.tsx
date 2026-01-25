import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import type { Experience } from '@/lib/experiences'
import { ExperienceEntryCard, MilestoneEntry } from './experience-entry-card'

interface CareerCalendarProps {
  experiences: Array<Experience>
  className?: string
}

/** Fixed height per year in pixels */
const YEAR_HEIGHT_PX = 48

/** Minimum height for very short experiences (in pixels) */
const MIN_EXPERIENCE_HEIGHT_PX = 32

/** Gap between side-by-side columns (in pixels) */
const COLUMN_GAP_PX = 4

// ============================================================================
// Types for Google Calendar-style positioning
// ============================================================================

interface PositionedExperience {
  experience: Experience
  /** Column index (0 = leftmost) */
  column: number
  /** Maximum columns in this overlap group (determines width) */
  maxColumnsInGroup: number
  /** Top position as percentage of total timeline height */
  topPercent: number
  /** Height as percentage of total timeline height */
  heightPercent: number
  /** Top position in pixels */
  topPx: number
  /** Height in pixels */
  heightPx: number
}

interface PositionedMilestone {
  experience: Experience
  topPercent: number
  topPx: number
}

// ============================================================================
// Core Algorithm: Google Calendar-style column assignment
// ============================================================================

/**
 * Check if two time intervals overlap.
 * Intervals are [startA, endA] and [startB, endB].
 * Overlap occurs when: startA < endB AND startB < endA
 */
function intervalsOverlap(
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date,
): boolean {
  return startA < endB && startB < endA
}

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
function calculatePositioning(
  experiences: Array<Experience>,
  now: Date,
): Map<string, { column: number; maxConcurrent: number }> {
  const columnAssignments = assignColumns(experiences, now)
  const maxConcurrencyMap = calculateMaxConcurrency(experiences, now)

  const result = new Map<string, { column: number; maxConcurrent: number }>()

  for (const exp of experiences) {
    const column = columnAssignments.get(exp.id) ?? 0
    const maxConcurrent = maxConcurrencyMap.get(exp.id) ?? 1

    result.set(exp.id, { column, maxConcurrent })
  }

  return result
}

// ============================================================================
// Career Calendar Component
// ============================================================================

export function CareerCalendar({
  experiences,
  className,
}: CareerCalendarProps) {
  const now = useMemo(() => new Date(), [])

  // Separate regular experiences from milestones
  const regularExperiences = useMemo(
    () => experiences.filter((e) => !e.isMilestone),
    [experiences],
  )

  const milestones = useMemo(
    () => experiences.filter((e) => e.isMilestone),
    [experiences],
  )

  // Calculate timeline bounds
  const { years, timelineStart, timelineEnd } = useMemo(() => {
    const allExperiences = [...regularExperiences, ...milestones]
    if (allExperiences.length === 0) {
      const currentYear = now.getFullYear()
      return {
        years: [currentYear],
        timelineStart: new Date(currentYear, 0, 1),
        timelineEnd: new Date(currentYear, 11, 31),
        totalMonths: 12,
      }
    }

    let minDate = new Date(allExperiences[0].startDateParsed)
    let maxDate = allExperiences[0].endDateParsed ?? now

    for (const exp of allExperiences) {
      if (exp.startDateParsed < minDate) {
        minDate = new Date(exp.startDateParsed)
      }
      const endDate = exp.endDateParsed ?? now
      if (endDate > maxDate) {
        maxDate = endDate
      }
    }

    // Round to year boundaries
    const startYear = minDate.getFullYear()
    const endYear = maxDate.getFullYear()

    // Build years array (descending - newest at top)
    const yearsList: Array<number> = []
    for (let y = endYear; y >= startYear; y--) {
      yearsList.push(y)
    }

    // Timeline spans from start of startYear to end of endYear
    const timelineStartDate = new Date(startYear, 0, 1)
    const timelineEndDate = new Date(endYear + 1, 0, 1) // Start of next year

    return {
      years: yearsList,
      timelineStart: timelineStartDate,
      timelineEnd: timelineEndDate,
    }
  }, [regularExperiences, milestones, now])

  // Total timeline height in pixels
  const totalHeightPx = years.length * YEAR_HEIGHT_PX

  // Convert date to position (0% = top/newest, 100% = bottom/oldest)
  // Since years are displayed newest at top, we invert the calculation
  const dateToPercent = (date: Date): number => {
    const totalMs = timelineEnd.getTime() - timelineStart.getTime()
    if (totalMs === 0) return 0
    // Invert: newest (timelineEnd) = 0%, oldest (timelineStart) = 100%
    return ((timelineEnd.getTime() - date.getTime()) / totalMs) * 100
  }

  // Calculate positioning using Google Calendar algorithm (column + max concurrency)
  const positioningMap = useMemo(
    () => calculatePositioning(regularExperiences, now),
    [regularExperiences, now],
  )

  // Position all experiences
  const positionedExperiences: Array<PositionedExperience> = useMemo(() => {
    return regularExperiences.map((exp) => {
      const start = exp.startDateParsed
      const end = exp.endDateParsed ?? now

      // Top = where experience ends (newest point)
      const topPercent = dateToPercent(end)
      // Bottom = where experience starts (oldest point)
      const bottomPercent = dateToPercent(start)
      // Height = difference
      let heightPercent = bottomPercent - topPercent

      // Convert to pixels
      let topPx = (topPercent / 100) * totalHeightPx
      let heightPx = (heightPercent / 100) * totalHeightPx

      // Enforce minimum height
      if (heightPx < MIN_EXPERIENCE_HEIGHT_PX) {
        heightPx = MIN_EXPERIENCE_HEIGHT_PX
        heightPercent = (heightPx / totalHeightPx) * 100
      }

      const positioning = positioningMap.get(exp.id) ?? {
        column: 0,
        maxConcurrent: 1,
      }

      return {
        experience: exp,
        column: positioning.column,
        maxColumnsInGroup: positioning.maxConcurrent,
        topPercent,
        heightPercent,
        topPx,
        heightPx,
      }
    })
  }, [regularExperiences, positioningMap, totalHeightPx, now])

  // Position milestones (simple - no columns)
  const positionedMilestones: Array<PositionedMilestone> = useMemo(() => {
    return milestones.map((m) => {
      const topPercent = dateToPercent(m.startDateParsed)
      const topPx = (topPercent / 100) * totalHeightPx

      return {
        experience: m,
        topPercent,
        topPx,
      }
    })
  }, [milestones, totalHeightPx])

  // Calculate year line positions
  const getYearTopPx = (year: number): number => {
    // Year label marks the START of that year
    // Newest year (first in array) is at top
    const yearDate = new Date(year + 1, 0, 1) // End of year = start of next
    return (dateToPercent(yearDate) / 100) * totalHeightPx
  }

  return (
    <div
      className={cn(
        'border rounded-lg p-4 max-sm:p-2 bg-background',
        className,
      )}
    >
      <div className="flex">
        {/* Year labels column */}
        <div className="flex flex-col shrink-0 w-12 relative">
          {years.map((year) => (
            <div
              key={year}
              className="flex items-start justify-end pr-3"
              style={{ height: YEAR_HEIGHT_PX }}
            >
              <span className="text-[10px] font-medium text-muted-foreground leading-none pt-1">
                {year}
              </span>
            </div>
          ))}
        </div>

        {/* Timeline container */}
        <div className="flex-1 relative" style={{ height: totalHeightPx }}>
          {/* Horizontal year divider lines */}
          {years.map((year) => {
            const topPx = getYearTopPx(year)
            return (
              <div
                key={`line-${year}`}
                className="absolute left-0 right-0 h-px bg-border"
                style={{ top: topPx }}
              />
            )
          })}
          {/* Bottom line (end of timeline) */}
          <div
            className="absolute left-0 right-0 h-px bg-border"
            style={{ top: totalHeightPx }}
          />

          {/* Experience cards container */}
          <div className="absolute inset-0">
            {positionedExperiences.map((entry) => {
              const { column, maxColumnsInGroup } = entry

              // Calculate width and left position
              // Each column gets equal share, minus gaps
              const totalGapPx = (maxColumnsInGroup - 1) * COLUMN_GAP_PX
              const availableWidthPercent = 100
              const columnWidthPercent =
                availableWidthPercent / maxColumnsInGroup
              const leftPercent = column * columnWidthPercent

              // Adjust for gaps in pixels
              const gapOffset = column * COLUMN_GAP_PX
              const widthReduction = totalGapPx / maxColumnsInGroup

              const isShortDuration = entry.experience.durationMonths < 12
              const hasOverlap = maxColumnsInGroup > 1

              return (
                <div
                  key={entry.experience.id}
                  className="absolute"
                  style={{
                    top: entry.topPx,
                    height: entry.heightPx,
                    left: `calc(${leftPercent}% + ${gapOffset}px)`,
                    width: `calc(${columnWidthPercent}% - ${widthReduction}px)`,
                    paddingRight:
                      column < maxColumnsInGroup - 1 ? 0 : undefined,
                  }}
                >
                  <ExperienceEntryCard
                    experience={entry.experience}
                    isShortDuration={isShortDuration}
                    hasOverlap={hasOverlap}
                    className="h-full w-full"
                  />
                </div>
              )
            })}
          </div>

          {/* Milestones */}
          {positionedMilestones.map((m) => (
            <div
              key={m.experience.id}
              className="absolute left-0 z-10"
              style={{ top: m.topPx }}
            >
              <MilestoneEntry experience={m.experience} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
