import { useMemo } from 'react'

import { ExperienceEntryCard, MilestoneEntry } from './experience-entry-card'
import { calculatePositioning } from './career-calendar.algorithm'
import {
  MIN_EXPERIENCE_HEIGHT_PX,
  VERTICAL_GAP_PX,
  YEAR_HEIGHT_PX,
} from './career-calendar.constants'
import { areConsecutive, dateToPercent } from './career-calendar.utils'
import type {
  CareerCalendarProps,
  ExperiencePositioning,
  PositionedExperience,
  TimelineBounds,
} from './career-calendar.types'

import type { Experience } from '@/lib/experiences'
import { cn } from '@/lib/utils'

/**
 * Calculate timeline bounds from experiences
 */
function calculateTimelineBounds(
  regularExperiences: Array<Experience>,
  milestones: Array<Experience>,
  now: Date,
): TimelineBounds {
  const allExperiences = [...regularExperiences, ...milestones]
  if (allExperiences.length === 0) {
    const currentYear = now.getFullYear()
    return {
      years: [currentYear],
      ceilingYear: currentYear + 1,
      timelineStart: new Date(currentYear, 0, 1),
      timelineEnd: new Date(currentYear + 1, 0, 1),
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

  // Ceiling year = endYear + 1 (just label + line at top, no full lane)
  const ceiling = endYear + 1

  // Build years array (descending - newest at top)
  // These are the actual year lanes (endYear down to startYear)
  const yearsList: Array<number> = []
  for (let y = endYear; y >= startYear; y--) {
    yearsList.push(y)
  }

  // Timeline spans from start of startYear to start of ceiling year
  const timelineStartDate = new Date(startYear, 0, 1)
  const timelineEndDate = new Date(ceiling, 0, 1)

  return {
    years: yearsList,
    ceilingYear: ceiling,
    timelineStart: timelineStartDate,
    timelineEnd: timelineEndDate,
  }
}

/**
 * Position experiences with gap adjustments for consecutive items
 */
function positionExperiences(
  items: Array<Experience>,
  positioningMap: Map<string, ExperiencePositioning>,
  totalHeightPx: number,
  timelineStart: Date,
  timelineEnd: Date,
  now: Date,
): Array<PositionedExperience> {
  // First pass: calculate positions based on dates
  const basePositions = items.map((exp) => {
    const start = exp.startDateParsed
    const end = exp.endDateParsed ?? now

    // Top = where experience ends (newest point) - DATE BASED, NEVER CHANGES
    const topPercent = dateToPercent(end, timelineStart, timelineEnd)
    const topPx = (topPercent / 100) * totalHeightPx

    // Height calculated from EXACT dates (same scale as position)
    const startPercent = dateToPercent(start, timelineStart, timelineEnd)
    let heightPx = ((startPercent - topPercent) / 100) * totalHeightPx

    // Enforce minimum height
    if (heightPx < MIN_EXPERIENCE_HEIGHT_PX) {
      heightPx = MIN_EXPERIENCE_HEIGHT_PX
    }

    const heightPercent = (heightPx / totalHeightPx) * 100

    const positioningData = positioningMap.get(exp.id)
    const positioning: ExperiencePositioning = positioningData ?? {
      column: 0,
      leftPercent: 0,
      widthPercent: 100,
      overlapAtStart: 1,
      isOverlapped: false,
      cssLeft: '0%',
      cssWidth: '100%',
      zIndex: 1,
      cardType: 'regular',
    }

    return {
      experience: exp,
      column: positioning.column,
      leftPercent: positioning.leftPercent,
      widthPercent: positioning.widthPercent,
      maxColumnsInGroup: positioning.overlapAtStart,
      topPercent,
      heightPercent,
      topPx: Math.round(topPx),
      heightPx: Math.round(heightPx),
      finalTopPx: Math.round(topPx),
      finalHeightPx: Math.round(heightPx),
      isOverlapped: positioning.isOverlapped,
      isMilestone: exp.isMilestone || false,
      cssLeft: positioning.cssLeft,
      cssRight: positioning.cssRight,
      cssWidth: positioning.cssWidth,
      zIndex: positioning.zIndex,
      cardType: positioning.cardType,
    }
  })

  // Group cards by column for efficient processing
  const byColumn = new Map<number, Array<PositionedExperience>>()
  for (const entry of basePositions) {
    const list = byColumn.get(entry.column) ?? []
    list.push(entry)
    byColumn.set(entry.column, list)
  }

  // Second pass: resolve overlaps and ensure consistent gaps within each column
  // Key insight: For CONSECUTIVE experiences (no time gap), enforce uniform visual gap
  // For NON-consecutive experiences (real time gap), preserve the time-proportional gap
  for (const [, colCards] of byColumn) {
    // Sort by topPx (newest/higher cards first)
    colCards.sort((a, b) => a.finalTopPx - b.finalTopPx)

    for (let i = 0; i < colCards.length - 1; i++) {
      const current = colCards[i]
      const next = colCards[i + 1]

      const currentBottom = current.finalTopPx + current.finalHeightPx
      const gap = next.finalTopPx - currentBottom

      // Check if these experiences are consecutive (no real time gap)
      // Note: "current" is above (ends later), "next" is below (starts earlier)
      // So we check if current's START is consecutive to next's END
      const isConsecutive = areConsecutive(
        next.experience.endDateParsed,
        current.experience.startDateParsed,
        now,
      )

      // For consecutive experiences: enforce exactly VERTICAL_GAP_PX
      // For non-consecutive: only act if gap < VERTICAL_GAP_PX (overlap)
      if (isConsecutive) {
        // Always normalize consecutive cards to have exactly VERTICAL_GAP_PX
        // Directly set the height so bottom aligns with expected gap
        const newHeight = next.finalTopPx - current.finalTopPx - VERTICAL_GAP_PX

        if (newHeight >= MIN_EXPERIENCE_HEIGHT_PX) {
          current.finalHeightPx = newHeight
        } else {
          // Can't shrink enough - enforce min height and push next card down
          current.finalHeightPx = MIN_EXPERIENCE_HEIGHT_PX
          const newNextTop =
            current.finalTopPx + MIN_EXPERIENCE_HEIGHT_PX + VERTICAL_GAP_PX
          const shift = newNextTop - next.finalTopPx

          for (let j = i + 1; j < colCards.length; j++) {
            colCards[j].finalTopPx += shift
          }
        }
      } else if (gap < VERTICAL_GAP_PX) {
        // Non-consecutive but overlapping/too close - ensure minimum gap
        const desiredHeight =
          next.finalTopPx - current.finalTopPx - VERTICAL_GAP_PX

        if (desiredHeight >= MIN_EXPERIENCE_HEIGHT_PX) {
          current.finalHeightPx = desiredHeight
        } else {
          current.finalHeightPx = MIN_EXPERIENCE_HEIGHT_PX
          const newNextTop =
            current.finalTopPx + MIN_EXPERIENCE_HEIGHT_PX + VERTICAL_GAP_PX
          const shift = newNextTop - next.finalTopPx

          for (let j = i + 1; j < colCards.length; j++) {
            colCards[j].finalTopPx += shift
          }
        }
      }
    }
  }

  return basePositions
}

// ============================================================================
// Career Calendar Component
// ============================================================================

export function CareerCalendar({
  experiences,
  className,
  onExperienceClick,
}: CareerCalendarProps) {
  const now = useMemo(() => new Date(), [])

  // Calculate timeline bounds using all experiences
  const { years, ceilingYear, timelineStart, timelineEnd } = useMemo(
    () => calculateTimelineBounds(experiences, [], now),
    [experiences, now],
  )

  // Total timeline height in pixels
  const totalHeightPx = years.length * YEAR_HEIGHT_PX

  // Calculate positioning for all experiences using same algorithm
  const positioningMap = useMemo(
    () => calculatePositioning(experiences, now),
    [experiences, now],
  )

  // Position all items using the unified positioning logic
  const positionedExperiences = useMemo(
    () =>
      positionExperiences(
        experiences,
        positioningMap,
        totalHeightPx,
        timelineStart,
        timelineEnd,
        now,
      ),
    [
      experiences,
      positioningMap,
      totalHeightPx,
      timelineStart,
      timelineEnd,
      now,
    ],
  )

  return (
    <div
      className={cn(
        'border rounded-sm py-8 px-4 max-sm:py-4 max-sm:px-2 bg-neutral-50',
        className,
      )}
    >
      <div className="flex">
        {/* Year labels column - fixed width for year text */}
        <div
          className="shrink-0 w-10 relative"
          style={{ height: totalHeightPx }}
        >
          {/* Ceiling year label at top (e.g., 2027) */}
          <div
            className="absolute left-0 right-0 flex items-center"
            style={{
              top: 0,
              transform: 'translateY(-50%)',
            }}
          >
            <span className="text-[10px] font-medium text-muted-foreground leading-none">
              {ceilingYear}
            </span>
          </div>

          {/* Year labels at the BOTTOM of each year lane (start of that year) */}
          {years.map((year, index) => {
            const yearBottomPx = (index + 1) * YEAR_HEIGHT_PX

            return (
              <div
                key={year}
                className="absolute left-0 right-0 flex items-center"
                style={{
                  top: yearBottomPx,
                  transform: 'translateY(-50%)',
                }}
              >
                <span className="text-[10px] font-medium text-muted-foreground leading-none">
                  {year}
                </span>
              </div>
            )
          })}
        </div>

        {/* Timeline container with horizontal lines */}
        <div className="flex-1 relative pl-4" style={{ height: totalHeightPx }}>
          {/* Ceiling year indicator line at top */}
          <div
            className="absolute h-px bg-border"
            style={{
              top: 0,
              left: 0,
              right: 0,
            }}
          />

          {/* Horizontal indicator lines - at the BOTTOM of each year lane (start of year) */}
          {years.map((year, index) => {
            const lineTopPx = (index + 1) * YEAR_HEIGHT_PX

            return (
              <div
                key={`line-${year}`}
                className="absolute h-px bg-border"
                style={{
                  top: lineTopPx,
                  left: 0,
                  right: 0,
                }}
              />
            )
          })}

          {/* Experience cards container - offset by 16px for indicator line visibility */}
          <div className="absolute top-0 bottom-0 left-4 right-0">
            {positionedExperiences.map((entry) => {
              const exp = entry.experience
              const { cssLeft, cssRight, cssWidth, zIndex, cardType } = entry
              const isVeryShortDuration = exp.durationMonths <= 6

              // Milestone without overlap: link-like, positioned at left
              if (cardType === 'milestone-no-overlap') {
                return (
                  <div
                    key={exp.id}
                    className="absolute"
                    style={{
                      top: entry.finalTopPx,
                      left: cssLeft,
                      zIndex,
                    }}
                    onClick={() => onExperienceClick?.(exp)}
                  >
                    <MilestoneEntry experience={exp} />
                  </div>
                )
              }

              // Milestone with overlap: link-like, positioned from right with auto width
              if (cardType === 'milestone') {
                return (
                  <div
                    key={exp.id}
                    className="absolute"
                    style={{
                      top: entry.finalTopPx,
                      right: cssRight,
                      zIndex,
                    }}
                    onClick={() => onExperienceClick?.(exp)}
                  >
                    <MilestoneEntry experience={exp} />
                  </div>
                )
              }

              // Deprioritized and regular cards: full height
              return (
                <div
                  key={exp.id}
                  className="absolute"
                  style={{
                    top: entry.finalTopPx,
                    height: entry.finalHeightPx,
                    left: cssLeft,
                    width: cssWidth,
                    zIndex,
                  }}
                  onClick={() => onExperienceClick?.(exp)}
                >
                  <ExperienceEntryCard
                    experience={exp}
                    isVeryShortDuration={isVeryShortDuration}
                    className="h-full w-full"
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
