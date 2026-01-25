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
 * Assign columns to experiences using Google Calendar's algorithm:
 * 1. Sort by startDate ASC, then endDate ASC
 * 2. For each experience, assign to leftmost column where it doesn't overlap
 * 3. Track max columns per overlap group for width calculation
 */
function assignColumns(
  experiences: Array<Experience>,
  now: Date,
): Map<string, { column: number; maxColumnsInGroup: number }> {
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

  // Track which column each experience is assigned to
  const columnAssignments = new Map<string, number>()

  // Track active experiences per column (experiences that haven't ended yet at current point)
  // Each column contains list of experiences with their end dates
  const columns: Array<Array<{ id: string; end: Date }>> = []

  for (const exp of sorted) {
    const start = exp.startDateParsed
    const end = exp.endDateParsed ?? now

    // Find leftmost column where this experience fits
    let assignedColumn = -1

    for (let colIdx = 0; colIdx < columns.length; colIdx++) {
      // Check if any experience in this column overlaps with current
      const hasOverlap = columns[colIdx].some((existing) => {
        const existingExp = experiences.find((e) => e.id === existing.id)
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

    // Add experience to its column
    columns[assignedColumn].push({ id: exp.id, end })
    columnAssignments.set(exp.id, assignedColumn)
  }

  // Now calculate maxColumnsInGroup for each experience
  // An overlap group is all experiences that share any overlap chain
  const maxColumnsMap = new Map<
    string,
    { column: number; maxColumnsInGroup: number }
  >()

  for (const exp of sorted) {
    const column = columnAssignments.get(exp.id) ?? 0
    const start = exp.startDateParsed
    const end = exp.endDateParsed ?? now

    // Find all experiences that overlap with this one
    const overlappingExps = sorted.filter((other) => {
      if (other.id === exp.id) return false
      const otherStart = other.startDateParsed
      const otherEnd = other.endDateParsed ?? now
      return intervalsOverlap(start, end, otherStart, otherEnd)
    })

    // Max columns = max column index among overlapping + 1 (including self)
    let maxCol = column
    for (const other of overlappingExps) {
      const otherCol = columnAssignments.get(other.id) ?? 0
      if (otherCol > maxCol) maxCol = otherCol
    }

    // Also need to check transitive overlaps - experiences that overlap with our overlaps
    // This ensures all members of an overlap group get the same maxColumnsInGroup
    const visited = new Set<string>([exp.id])
    const queue = [...overlappingExps]

    while (queue.length > 0) {
      const current = queue.shift()!
      if (visited.has(current.id)) continue
      visited.add(current.id)

      const currentCol = columnAssignments.get(current.id) ?? 0
      if (currentCol > maxCol) maxCol = currentCol

      const currentStart = current.startDateParsed
      const currentEnd = current.endDateParsed ?? now

      // Find experiences that overlap with current
      for (const other of sorted) {
        if (visited.has(other.id)) continue
        const otherStart = other.startDateParsed
        const otherEnd = other.endDateParsed ?? now
        if (intervalsOverlap(currentStart, currentEnd, otherStart, otherEnd)) {
          queue.push(other)
        }
      }
    }

    maxColumnsMap.set(exp.id, {
      column,
      maxColumnsInGroup: maxCol + 1,
    })
  }

  return maxColumnsMap
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

  // Assign columns using Google Calendar algorithm
  const columnAssignments = useMemo(
    () => assignColumns(regularExperiences, now),
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

      const assignment = columnAssignments.get(exp.id) ?? {
        column: 0,
        maxColumnsInGroup: 1,
      }

      return {
        experience: exp,
        column: assignment.column,
        maxColumnsInGroup: assignment.maxColumnsInGroup,
        topPercent,
        heightPercent,
        topPx,
        heightPx,
      }
    })
  }, [regularExperiences, columnAssignments, totalHeightPx, now])

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
