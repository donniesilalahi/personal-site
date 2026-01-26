import { useMemo } from 'react'

import { ExperienceEntryCard, MilestoneEntry } from './experience-entry-card'
import { calculatePositioning } from './career-calendar.algorithm'
import {
  COLUMN_GAP_PX,
  DEPRIORITIZED_CARD_WIDTH_PX,
  MILESTONE_CARD_WIDTH_PX,
  MIN_EXPERIENCE_HEIGHT_PX,
  VERTICAL_GAP_PX,
  YEAR_HEIGHT_PX,
} from './career-calendar.constants'
import { areConsecutive, dateToPercent } from './career-calendar.utils'
import type {
  CareerCalendarProps,
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
  positioningMap: Map<
    string,
    {
      column: number
      leftPercent: number
      widthPercent: number
      overlapAtStart: number
      isOverlapped: boolean
    }
  >,
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
    // This ensures cards span exactly from end date to start date on timeline
    const startPercent = dateToPercent(start, timelineStart, timelineEnd)
    let heightPx = ((startPercent - topPercent) / 100) * totalHeightPx

    // Enforce minimum height
    if (heightPx < MIN_EXPERIENCE_HEIGHT_PX) {
      heightPx = MIN_EXPERIENCE_HEIGHT_PX
    }

    const heightPercent = (heightPx / totalHeightPx) * 100

    const positioningData = positioningMap.get(exp.id)
    const positioning = {
      column: positioningData?.column ?? 0,
      leftPercent: positioningData?.leftPercent ?? 0,
      widthPercent: positioningData?.widthPercent ?? 100,
      overlapAtStart: positioningData?.overlapAtStart ?? 1,
      isOverlapped: positioningData?.isOverlapped ?? false,
    }

    return {
      experience: exp,
      column: positioning.column,
      // Store the new positioning values for rendering
      leftPercent: positioning.leftPercent,
      widthPercent: positioning.widthPercent,
      maxColumnsInGroup: positioning.overlapAtStart, // Keep for backward compatibility
      topPercent,
      heightPercent,
      topPx: Math.round(topPx),
      heightPx: Math.round(heightPx),
      finalTopPx: Math.round(topPx),
      finalHeightPx: Math.round(heightPx),
      isOverlapped: positioning.isOverlapped,
      isMilestone: exp.isMilestone || false,
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
        'border rounded-lg p-4 max-sm:p-2 bg-background',
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
              const { column, leftPercent, widthPercent } = entry
              const exp = entry.experience
              const isDeprioritized = exp.isDeprioritized
              const isMilestone = exp.isMilestone

              const hasOverlap = widthPercent < 100
              const isShortDuration = exp.durationMonths <= 12
              const isVeryShortDuration = exp.durationMonths <= 6

              // Helper to check if two experiences temporally overlap
              const checkTemporalOverlap = (
                a: PositionedExperience,
                b: PositionedExperience,
              ): boolean => {
                const aStart = a.experience.startDateParsed.getTime()
                const aEnd =
                  a.experience.endDateParsed?.getTime() ?? now.getTime()
                const bStart = b.experience.startDateParsed.getTime()
                const bEnd =
                  b.experience.endDateParsed?.getTime() ?? now.getTime()
                return aStart <= bEnd && bStart <= aEnd
              }

              // Find all deprioritized cards that temporally overlap with this entry
              // (regardless of algorithm's widthPercent - we always want to respect deprioritized cards)
              const overlappingDeprioritized = positionedExperiences.filter(
                (other) => {
                  if (other.experience.id === exp.id) return false
                  if (!other.experience.isDeprioritized) return false
                  return checkTemporalOverlap(entry, other)
                },
              )

              // Find all milestones with algorithm-detected overlap that temporally overlap with this entry
              const overlappingMilestones = positionedExperiences.filter(
                (other) => {
                  if (other.experience.id === exp.id) return false
                  if (!other.experience.isMilestone) return false
                  if (other.widthPercent >= 100) return false // Only milestones with algorithm overlap
                  return checkTemporalOverlap(entry, other)
                },
              )

              // Combined "special cards" = deprioritized + overlapping milestones
              const overlappingSpecialEntries = [
                ...overlappingDeprioritized,
                ...overlappingMilestones,
              ]

              // Determine if this entry should be treated as a special card
              // - Deprioritized: always special
              // - Milestone: only if it has overlap (with any card, not just special)
              const hasAnyTemporalOverlap =
                overlappingSpecialEntries.length > 0 ||
                positionedExperiences.some(
                  (other) =>
                    other.experience.id !== exp.id &&
                    checkTemporalOverlap(entry, other),
                )
              const isSpecialCard =
                isDeprioritized || (isMilestone && hasAnyTemporalOverlap)

              // Get width for a special card
              const getSpecialCardWidth = (e: PositionedExperience): number => {
                if (e.experience.isDeprioritized)
                  return DEPRIORITIZED_CARD_WIDTH_PX
                if (e.experience.isMilestone) return MILESTONE_CARD_WIDTH_PX
                return 0
              }

              // Calculate total deprioritized width only (for regular cards)
              const deprioritizedOnlyWidthPx = overlappingDeprioritized.reduce(
                (acc) => acc + DEPRIORITIZED_CARD_WIDTH_PX + COLUMN_GAP_PX,
                0,
              )

              // Calculate card positioning based on type
              let cardWidth: string
              let cardLeft: string

              if (isSpecialCard) {
                // Special cards (deprioritized or milestone with overlap):
                // Fixed pixel width, positioned at the right edge
                const myWidth = getSpecialCardWidth(entry)

                // Deprioritized cards: positioned at far right, only account for other deprioritized cards
                // Milestones: positioned to the left of deprioritized cards
                if (isDeprioritized) {
                  // Get all deprioritized cards overlapping at this time, sorted by start date DESC
                  // (earlier start date = further right = processed later in offset calculation)
                  const allOverlappingDeprioritized = [
                    entry,
                    ...overlappingDeprioritized,
                  ].sort(
                    (a, b) =>
                      b.experience.startDateParsed.getTime() -
                      a.experience.startDateParsed.getTime(),
                  )

                  // Calculate offset from right edge (only deprioritized cards)
                  let offsetFromRight = myWidth
                  for (const other of allOverlappingDeprioritized) {
                    if (other.experience.id === exp.id) break
                    offsetFromRight +=
                      getSpecialCardWidth(other) + COLUMN_GAP_PX
                  }

                  cardWidth = `${myWidth}px`
                  cardLeft = `calc(100% - ${offsetFromRight}px)`
                } else {
                  // Milestone: positioned to the left of ALL deprioritized cards it overlaps with
                  const totalDeprioritizedWidthPx =
                    overlappingDeprioritized.reduce(
                      (acc, e) => acc + getSpecialCardWidth(e) + COLUMN_GAP_PX,
                      0,
                    )

                  // Get all milestones overlapping at this time, sorted by start date DESC
                  const allOverlappingMilestones = [
                    entry,
                    ...overlappingMilestones,
                  ].sort(
                    (a, b) =>
                      b.experience.startDateParsed.getTime() -
                      a.experience.startDateParsed.getTime(),
                  )

                  // Calculate offset from right edge (after deprioritized cards)
                  let offsetFromRight = totalDeprioritizedWidthPx + myWidth
                  for (const other of allOverlappingMilestones) {
                    if (other.experience.id === exp.id) break
                    offsetFromRight +=
                      getSpecialCardWidth(other) + COLUMN_GAP_PX
                  }

                  cardWidth = `${myWidth}px`
                  cardLeft = `calc(100% - ${offsetFromRight}px)`
                }

                // Milestone without overlap: ghost button style, positioned at left
                if (isMilestone && !hasOverlap) {
                  return (
                    <div
                      key={exp.id}
                      className="absolute z-10"
                      style={{
                        top: entry.topPx,
                        left: 0,
                      }}
                      onClick={() => onExperienceClick?.(exp)}
                    >
                      <MilestoneEntry experience={exp} />
                    </div>
                  )
                }
              } else if (deprioritizedOnlyWidthPx > 0) {
                // Regular card overlapping with deprioritized cards:
                // Expand to fill space minus the deprioritized cards' fixed width
                // (Milestones are handled separately and don't affect regular card width)
                //
                // Find all non-deprioritized, non-milestone-with-overlap cards that temporally overlap
                const nonSpecialOverlapping = positionedExperiences.filter(
                  (other) => {
                    if (other.experience.isDeprioritized) return false
                    // Check if other is a milestone with overlap (making it special)
                    const otherIsMilestoneSpecial =
                      other.experience.isMilestone &&
                      positionedExperiences.some(
                        (o) =>
                          o.experience.id !== other.experience.id &&
                          checkTemporalOverlap(other, o),
                      )
                    if (otherIsMilestoneSpecial) return false
                    return checkTemporalOverlap(entry, other)
                  },
                )

                const nonSpecialCount = nonSpecialOverlapping.length

                // My column among non-special cards (sorted by algorithm column)
                const myNonSpecialColumn = nonSpecialOverlapping
                  .sort((a, b) => a.column - b.column)
                  .findIndex((e) => e.experience.id === exp.id)

                // Width = (100% - deprioritized cards space) / non-special count
                cardWidth = `calc((100% - ${deprioritizedOnlyWidthPx}px) / ${nonSpecialCount})`
                cardLeft = `calc((100% - ${deprioritizedOnlyWidthPx}px) / ${nonSpecialCount} * ${myNonSpecialColumn} + ${myNonSpecialColumn * COLUMN_GAP_PX}px)`
              } else {
                // Normal case: no special card overlap, use percentage width
                cardWidth = `${widthPercent}%`
                cardLeft = `calc(${leftPercent}% + ${column * COLUMN_GAP_PX}px)`
              }

              // Determine z-index: special cards on bottom, regular on top by column
              const zIndex = isSpecialCard ? 0 : column + 1

              // Special rendering for special cards
              if (isSpecialCard) {
                if (isMilestone) {
                  // Milestone: ghost button, width hugs content
                  return (
                    <div
                      key={exp.id}
                      className="absolute flex items-start"
                      style={{
                        top: entry.finalTopPx,
                        left: cardLeft,
                        zIndex,
                      }}
                      onClick={() => onExperienceClick?.(exp)}
                    >
                      <MilestoneEntry experience={exp} />
                    </div>
                  )
                }
                // Deprioritized: full height card
                return (
                  <div
                    key={exp.id}
                    className="absolute"
                    style={{
                      top: entry.finalTopPx,
                      height: entry.finalHeightPx,
                      left: cardLeft,
                      width: cardWidth,
                      zIndex,
                    }}
                    onClick={() => onExperienceClick?.(exp)}
                  >
                    <ExperienceEntryCard
                      experience={exp}
                      isShortDuration={isShortDuration}
                      isVeryShortDuration={isVeryShortDuration}
                      hasOverlap={hasOverlap}
                      className="h-full w-full"
                    />
                  </div>
                )
              }

              // Regular card rendering
              return (
                <div
                  key={exp.id}
                  className="absolute"
                  style={{
                    top: entry.finalTopPx,
                    height: entry.finalHeightPx,
                    left: cardLeft,
                    width: cardWidth,
                    zIndex,
                  }}
                  onClick={() => onExperienceClick?.(exp)}
                >
                  <ExperienceEntryCard
                    experience={exp}
                    isShortDuration={isShortDuration}
                    isVeryShortDuration={isVeryShortDuration}
                    hasOverlap={hasOverlap}
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
