import { useMemo } from 'react'

import { ExperienceEntryCard, MilestoneEntry } from './experience-entry-card'
import { CareerCalendarSkeleton } from './career-calendar-skeleton'
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
// Types
// ============================================================================

interface PositionedCard {
  experience: Experience
  topPx: number
  heightPx: number
  column: number
  cardType: 'regular' | 'deprioritized' | 'milestone'
}

interface Column {
  index: number
  isRegular: boolean // true if contains any regular card, false if only fixed cards
  cards: Array<PositionedCard>
}

interface OverlapGroup {
  id: string
  topPx: number
  heightPx: number
  columns: Array<Column>
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

function getCardType(exp: Experience): 'regular' | 'deprioritized' | 'milestone' {
  if (exp.isDeprioritized) return 'deprioritized'
  if (exp.isMilestone) return 'milestone'
  return 'regular'
}

/**
 * Build overlap groups with column assignments.
 *
 * Algorithm:
 * 1. Find connected components (experiences that transitively overlap)
 * 2. Within each group, assign columns using greedy leftmost (sorted by start date)
 * 3. Determine column types: regular (flex-grow) if contains any regular card
 */
function buildOverlapGroups(
  experiences: Array<Experience>,
  totalHeightPx: number,
  timelineStart: Date,
  timelineEnd: Date,
  now: Date,
): Array<OverlapGroup> {
  if (experiences.length === 0) return []

  // Build connected components
  const visited = new Set<string>()
  const rawGroups: Array<Array<Experience>> = []

  for (const exp of experiences) {
    if (visited.has(exp.id)) continue

    const group: Array<Experience> = []
    const queue: Array<Experience> = [exp]

    while (queue.length > 0) {
      const current = queue.shift()!
      if (visited.has(current.id)) continue

      visited.add(current.id)
      group.push(current)

      for (const other of experiences) {
        if (!visited.has(other.id)) {
          const currentStart = current.startDateParsed
          const currentEnd = current.endDateParsed ?? now
          const otherStart = other.startDateParsed
          const otherEnd = other.endDateParsed ?? now
          if (intervalsOverlap(currentStart, currentEnd, otherStart, otherEnd)) {
            queue.push(other)
          }
        }
      }
    }

    rawGroups.push(group)
  }

  // Process each group
  const overlapGroups: Array<OverlapGroup> = []

  for (let groupIdx = 0; groupIdx < rawGroups.length; groupIdx++) {
    const groupExps = rawGroups[groupIdx]

    // Sort by start date ASC (earlier = leftmost column)
    const sorted = [...groupExps].sort(
      (a, b) => a.startDateParsed.getTime() - b.startDateParsed.getTime(),
    )

    // Assign columns using greedy leftmost algorithm
    const columnAssignments = new Map<string, number>()
    const columnContents: Array<Array<Experience>> = []

    for (const exp of sorted) {
      const start = exp.startDateParsed
      const end = exp.endDateParsed ?? now

      // Find leftmost column without overlap
      let assignedColumn = -1

      for (let colIdx = 0; colIdx < columnContents.length; colIdx++) {
        const hasOverlap = columnContents[colIdx].some((existing) => {
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
        assignedColumn = columnContents.length
        columnContents.push([])
      }

      columnContents[assignedColumn].push(exp)
      columnAssignments.set(exp.id, assignedColumn)
    }

    // Build positioned cards and columns
    const columns: Array<Column> = []

    for (let colIdx = 0; colIdx < columnContents.length; colIdx++) {
      const colExps = columnContents[colIdx]
      const cards: Array<PositionedCard> = []
      let hasRegular = false

      for (const exp of colExps) {
        const { topPx, heightPx } = calculateVerticalPosition(
          exp,
          totalHeightPx,
          timelineStart,
          timelineEnd,
          now,
        )
        const cardType = getCardType(exp)
        if (cardType === 'regular') hasRegular = true

        cards.push({
          experience: exp,
          topPx,
          heightPx,
          column: colIdx,
          cardType,
        })
      }

      // Sort cards by topPx for vertical overlap resolution
      cards.sort((a, b) => a.topPx - b.topPx)

      columns.push({
        index: colIdx,
        isRegular: hasRegular,
        cards,
      })
    }

    // Resolve vertical overlaps within each column
    for (const column of columns) {
      resolveVerticalOverlaps(column.cards, now)
    }

    // Calculate group bounds
    let groupTop = Infinity
    let groupBottom = 0
    for (const column of columns) {
      for (const card of column.cards) {
        if (card.topPx < groupTop) groupTop = card.topPx
        const bottom = card.topPx + card.heightPx
        if (bottom > groupBottom) groupBottom = bottom
      }
    }

    overlapGroups.push({
      id: `group-${groupIdx}`,
      topPx: groupTop,
      heightPx: groupBottom - groupTop,
      columns,
    })
  }

  return overlapGroups
}

function resolveVerticalOverlaps(cards: Array<PositionedCard>, now: Date): void {
  for (let i = 0; i < cards.length - 1; i++) {
    const current = cards[i]
    const next = cards[i + 1]

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
        for (let j = i + 1; j < cards.length; j++) {
          cards[j].topPx += shift
        }
      }
    }
  }
}

// ============================================================================
// Rendering
// ============================================================================

interface OverlapGroupRendererProps {
  group: OverlapGroup
  onExperienceClick?: (experience: Experience) => void
}

function OverlapGroupRenderer({ group, onExperienceClick }: OverlapGroupRendererProps) {
  const { topPx, heightPx, columns } = group

  // Single column - render without flex container
  if (columns.length === 1) {
    const column = columns[0]
    return (
      <>
        {column.cards.map((card) => (
          <CardRenderer
            key={card.experience.id}
            card={card}
            onClick={
              onExperienceClick
                ? () => onExperienceClick(card.experience)
                : undefined
            }
          />
        ))}
      </>
    )
  }

  // Multiple columns - use flex container
  return (
    <div
      className="absolute left-0 right-0 flex"
      style={{ top: topPx, height: heightPx, gap: COLUMN_GAP_PX }}
    >
      {columns.map((column) => {
        // Regular columns: flex-grow, Fixed columns: content-width
        const flexClass = column.isRegular
          ? 'flex-1 min-w-0 relative'
          : 'flex-none relative'

        return (
          <div key={column.index} className={flexClass}>
            {column.cards.map((card) => {
              const relativeTop = card.topPx - topPx
              const isVeryShortDuration = card.experience.durationMonths <= 6

              if (card.cardType === 'milestone') {
                return (
                  <div
                    key={card.experience.id}
                    className="absolute left-0"
                    style={{ top: relativeTop }}
                    onClick={
                      onExperienceClick
                        ? () => onExperienceClick(card.experience)
                        : undefined
                    }
                  >
                    <MilestoneEntry experience={card.experience} />
                  </div>
                )
              }

              return (
                <div
                  key={card.experience.id}
                  className="absolute left-0 right-0"
                  style={{ top: relativeTop, height: card.heightPx }}
                  onClick={
                    onExperienceClick
                      ? () => onExperienceClick(card.experience)
                      : undefined
                  }
                >
                  <ExperienceEntryCard
                    experience={card.experience}
                    isVeryShortDuration={isVeryShortDuration}
                    className="h-full w-full"
                  />
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

interface CardRendererProps {
  card: PositionedCard
  onClick?: () => void
}

function CardRenderer({ card, onClick }: CardRendererProps) {
  const { experience, topPx, heightPx, cardType } = card
  const isVeryShortDuration = experience.durationMonths <= 6

  if (cardType === 'milestone') {
    return (
      <div
        className="absolute left-0"
        style={{ top: topPx }}
        onClick={onClick}
      >
        <MilestoneEntry experience={experience} />
      </div>
    )
  }

  // For solo cards (deprioritized or regular), use full width or auto
  const widthClass = cardType === 'deprioritized' ? '' : 'right-0'

  return (
    <div
      className={`absolute left-0 ${widthClass}`}
      style={{ top: topPx, height: heightPx }}
      onClick={onClick}
    >
      <ExperienceEntryCard
        experience={experience}
        isVeryShortDuration={isVeryShortDuration}
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

  const overlapGroups = useMemo(
    () => buildOverlapGroups(experiences, totalHeightPx, timelineStart, timelineEnd, now),
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
            {overlapGroups.map((group) => (
              <OverlapGroupRenderer
                key={group.id}
                group={group}
                onExperienceClick={onExperienceClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
