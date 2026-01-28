import { useMemo } from 'react'

import { ExperienceEntryCard, MilestoneEntry } from './experience-entry-card'
import { CareerCalendarSkeleton } from './career-calendar-skeleton'
import { calculatePositioning } from './career-calendar.algorithm'
import {
  COLUMN_GAP_PX,
  MIN_EXPERIENCE_HEIGHT_PX,
  VERTICAL_GAP_PX,
  YEAR_HEIGHT_PX,
} from './career-calendar.constants'
import { areConsecutive, dateToPercent, intervalsOverlap } from './career-calendar.utils'
import type {
  CareerCalendarProps,
  TimelineBounds,
} from './career-calendar.types'

import type { Experience } from '@/lib/experiences'
import { cn } from '@/lib/utils'

// ============================================================================
// Constants
// ============================================================================

/** Estimated width for deprioritized cards (vertical text) */
const DEPRIORITIZED_WIDTH_PX = 48

/** Estimated width for milestone cards */
const MILESTONE_WIDTH_PX = 80

// ============================================================================
// Types
// ============================================================================

interface PositionedCard {
  experience: Experience
  topPx: number
  heightPx: number
  cardType: 'regular' | 'deprioritized' | 'milestone'
  /** For regular cards: column within regular region (0 = leftmost) */
  regularColumn: number
  /** For regular cards: total columns in regular region */
  totalRegularColumns: number
  /** For fixed cards: column within fixed region (0 = rightmost) */
  fixedColumn: number
  /** Total fixed columns in the group */
  totalFixedColumns: number
  /** Total width of fixed region in pixels (for regular cards to subtract) */
  fixedRegionWidthPx: number
}

// ============================================================================
// Helper Functions
// ============================================================================

function calculateTimelineBounds(
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
    if (exp.startDateParsed < minDate) {
      minDate = new Date(exp.startDateParsed)
    }
    const endDate = exp.endDateParsed ?? now
    if (endDate > maxDate) {
      maxDate = endDate
    }
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

function calculateVerticalPosition(
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
 * Assign columns within a set of experiences using greedy leftmost algorithm.
 * Returns a map from experience ID to column index.
 */
function assignColumnsGreedy(
  experiences: Array<Experience>,
  now: Date,
): Map<string, number> {
  if (experiences.length === 0) return new Map()

  // Sort by start date ASC
  const sorted = [...experiences].sort(
    (a, b) => a.startDateParsed.getTime() - b.startDateParsed.getTime(),
  )

  const assignments = new Map<string, number>()
  const columns: Array<Array<Experience>> = []

  for (const exp of sorted) {
    const start = exp.startDateParsed
    const end = exp.endDateParsed ?? now

    // Find leftmost column without overlap
    let assignedColumn = -1

    for (let colIdx = 0; colIdx < columns.length; colIdx++) {
      const hasOverlap = columns[colIdx].some((existing) => {
        const existingStart = existing.startDateParsed
        const existingEnd = existing.endDateParsed ?? now
        return intervalsOverlap(start, end, existingStart, existingEnd)
      })

      if (!hasOverlap) {
        assignedColumn = colIdx
        break
      }
    }

    if (assignedColumn === -1) {
      assignedColumn = columns.length
      columns.push([])
    }

    columns[assignedColumn].push(exp)
    assignments.set(exp.id, assignedColumn)
  }

  return assignments
}

/**
 * Build positioned cards with proper column assignments.
 *
 * Key principle:
 * - Regular cards are in the LEFT region (flex-grow)
 * - Fixed cards (deprioritized/milestone) are in the RIGHT region (content-width)
 */
function buildPositionedCards(
  experiences: Array<Experience>,
  totalHeightPx: number,
  timelineStart: Date,
  timelineEnd: Date,
  now: Date,
): Array<PositionedCard> {
  const positioningResult = calculatePositioning(experiences, now)
  const cards: Array<PositionedCard> = []

  for (const group of positioningResult.groups) {
    // Separate regular and fixed cards
    const regularExps = group.cards
      .filter((c) => c.cardType === 'regular')
      .map((c) => c.experience)
    const fixedExps = group.cards
      .filter((c) => c.cardType !== 'regular')
      .map((c) => c.experience)

    // Assign columns within each region
    const regularColumns = assignColumnsGreedy(regularExps, now)
    const fixedColumns = assignColumnsGreedy(fixedExps, now)

    const totalRegularCols = Math.max(
      1,
      ...Array.from(regularColumns.values()).map((c) => c + 1),
    )
    const totalFixedCols =
      fixedExps.length > 0
        ? Math.max(...Array.from(fixedColumns.values()).map((c) => c + 1))
        : 0

    // Calculate fixed region width
    let fixedRegionWidthPx = 0
    if (totalFixedCols > 0) {
      // Estimate based on card types
      for (const exp of fixedExps) {
        if (exp.isDeprioritized) {
          fixedRegionWidthPx = Math.max(fixedRegionWidthPx, DEPRIORITIZED_WIDTH_PX)
        } else if (exp.isMilestone) {
          fixedRegionWidthPx = Math.max(fixedRegionWidthPx, MILESTONE_WIDTH_PX)
        }
      }
      // Add gaps if multiple fixed columns
      if (totalFixedCols > 1) {
        fixedRegionWidthPx += (totalFixedCols - 1) * COLUMN_GAP_PX
      }
      // Add gap between regular and fixed regions
      fixedRegionWidthPx += COLUMN_GAP_PX
    }

    // Create positioned cards
    for (const groupCard of group.cards) {
      const { topPx, heightPx } = calculateVerticalPosition(
        groupCard.experience,
        totalHeightPx,
        timelineStart,
        timelineEnd,
        now,
      )

      const isFixed = groupCard.cardType !== 'regular'

      cards.push({
        experience: groupCard.experience,
        topPx,
        heightPx,
        cardType: groupCard.cardType,
        regularColumn: isFixed ? 0 : (regularColumns.get(groupCard.experience.id) ?? 0),
        totalRegularColumns: regularExps.length > 0 ? totalRegularCols : 1,
        fixedColumn: isFixed ? (fixedColumns.get(groupCard.experience.id) ?? 0) : 0,
        totalFixedColumns: totalFixedCols,
        fixedRegionWidthPx,
      })
    }
  }

  // Resolve vertical overlaps for cards in the same column
  resolveVerticalOverlaps(cards, now)

  return cards
}

function resolveVerticalOverlaps(cards: Array<PositionedCard>, now: Date): void {
  const sortedCards = [...cards].sort((a, b) => a.topPx - b.topPx)

  for (let i = 0; i < sortedCards.length - 1; i++) {
    const current = sortedCards[i]
    const next = sortedCards[i + 1]

    // Only adjust if they're in the same visual column
    const currentIsFixed = current.cardType !== 'regular'
    const nextIsFixed = next.cardType !== 'regular'

    if (currentIsFixed !== nextIsFixed) continue

    const sameColumn = currentIsFixed
      ? current.fixedColumn === next.fixedColumn
      : current.regularColumn === next.regularColumn

    if (!sameColumn) continue

    const currentBottom = current.topPx + current.heightPx
    const gap = next.topPx - currentBottom

    const isConsecutive = areConsecutive(
      next.experience.endDateParsed,
      current.experience.startDateParsed,
      now,
    )

    if (isConsecutive || gap < VERTICAL_GAP_PX) {
      const desiredHeight = next.topPx - current.topPx - VERTICAL_GAP_PX

      if (desiredHeight >= MIN_EXPERIENCE_HEIGHT_PX) {
        current.heightPx = desiredHeight
      } else {
        current.heightPx = MIN_EXPERIENCE_HEIGHT_PX
        const shift = current.topPx + MIN_EXPERIENCE_HEIGHT_PX + VERTICAL_GAP_PX - next.topPx
        for (let j = i + 1; j < sortedCards.length; j++) {
          const isFixedJ = sortedCards[j].cardType !== 'regular'
          if (isFixedJ === currentIsFixed) {
            const sameColJ = currentIsFixed
              ? sortedCards[j].fixedColumn === current.fixedColumn
              : sortedCards[j].regularColumn === current.regularColumn
            if (sameColJ) {
              sortedCards[j].topPx += shift
            }
          }
        }
      }
    }
  }
}

// ============================================================================
// Card Rendering
// ============================================================================

interface CardProps {
  card: PositionedCard
  onClick?: () => void
}

function Card({ card, onClick }: CardProps) {
  const {
    experience,
    topPx,
    heightPx,
    cardType,
    regularColumn,
    totalRegularColumns,
    fixedColumn,
    fixedRegionWidthPx,
  } = card
  const isVeryShortDuration = experience.durationMonths <= 6
  const isFixed = cardType !== 'regular'

  // Calculate position based on card type
  let style: React.CSSProperties

  if (isFixed) {
    // Fixed cards: positioned from right, content-width
    const rightOffset = fixedColumn * (DEPRIORITIZED_WIDTH_PX + COLUMN_GAP_PX)

    style = {
      position: 'absolute',
      top: topPx,
      height: cardType === 'milestone' ? 'auto' : heightPx,
      right: rightOffset,
      width: 'auto',
    }
  } else {
    // Regular cards: positioned from left, fill remaining space
    const totalGapPx = totalRegularColumns > 1 ? (totalRegularColumns - 1) * COLUMN_GAP_PX : 0
    const availableWidth = `calc(100% - ${fixedRegionWidthPx}px)`
    const columnWidth = `calc((${availableWidth} - ${totalGapPx}px) / ${totalRegularColumns})`
    const leftOffset =
      regularColumn === 0
        ? '0px'
        : `calc(${regularColumn} * (${availableWidth} - ${totalGapPx}px) / ${totalRegularColumns} + ${regularColumn * COLUMN_GAP_PX}px)`

    style = {
      position: 'absolute',
      top: topPx,
      height: heightPx,
      left: leftOffset,
      width: columnWidth,
    }
  }

  if (cardType === 'milestone') {
    return (
      <div style={style}>
        <MilestoneEntry experience={experience} onClick={onClick} />
      </div>
    )
  }

  return (
    <div style={style}>
      <ExperienceEntryCard
        experience={experience}
        isVeryShortDuration={isVeryShortDuration}
        onClick={onClick}
        className="h-full w-full"
      />
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export function CareerCalendar({
  experiences,
  className,
  onExperienceClick,
}: CareerCalendarProps) {
  const now = useMemo(() => new Date(), [])

  const { years, ceilingYear, timelineStart, timelineEnd } = useMemo(
    () => calculateTimelineBounds(experiences, now),
    [experiences, now],
  )

  const totalHeightPx = years.length * YEAR_HEIGHT_PX

  const positionedCards = useMemo(
    () => buildPositionedCards(experiences, totalHeightPx, timelineStart, timelineEnd, now),
    [experiences, totalHeightPx, timelineStart, timelineEnd, now],
  )

  if (experiences.length === 0) {
    return (
      <CareerCalendarSkeleton yearCount={years.length} className={className} />
    )
  }

  return (
    <div
      className={cn(
        'border rounded-sm py-8 px-4 max-sm:py-4 max-sm:px-2 bg-neutral-50',
        className,
      )}
    >
      <div className="flex">
        {/* Year labels column */}
        <div
          className="shrink-0 w-10 relative"
          style={{ height: totalHeightPx }}
        >
          <div
            className="absolute left-0 right-0 flex items-center"
            style={{ top: 0, transform: 'translateY(-50%)' }}
          >
            <span className="text-[10px] font-medium text-muted-foreground leading-none">
              {ceilingYear}
            </span>
          </div>

          {years.map((year, index) => {
            const yearBottomPx = (index + 1) * YEAR_HEIGHT_PX
            return (
              <div
                key={year}
                className="absolute left-0 right-0 flex items-center"
                style={{ top: yearBottomPx, transform: 'translateY(-50%)' }}
              >
                <span className="text-[10px] font-medium text-muted-foreground leading-none">
                  {year}
                </span>
              </div>
            )
          })}
        </div>

        {/* Timeline container */}
        <div
          className="flex-1 relative pl-4 max-sm:pl-2"
          style={{ height: totalHeightPx }}
        >
          {/* Year boundary lines */}
          <div
            className="absolute h-px bg-border"
            style={{ top: 0, left: 0, right: 0 }}
          />
          {years.map((year, index) => {
            const lineTopPx = (index + 1) * YEAR_HEIGHT_PX
            return (
              <div
                key={`line-${year}`}
                className="absolute h-px bg-border"
                style={{ top: lineTopPx, left: 0, right: 0 }}
              />
            )
          })}

          {/* Experience cards */}
          <div className="absolute top-0 bottom-0 left-4 max-sm:left-2 right-0">
            {positionedCards.map((card) => (
              <Card
                key={card.experience.id}
                card={card}
                onClick={
                  onExperienceClick
                    ? () => onExperienceClick(card.experience)
                    : undefined
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
