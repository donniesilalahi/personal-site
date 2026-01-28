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
import type { CareerCalendarProps, TimelineBounds } from './career-calendar.types'

import type { Experience } from '@/lib/experiences'
import { cn } from '@/lib/utils'

// ============================================================================
// Types
// ============================================================================

type CardType = 'regular' | 'deprioritized' | 'milestone'

interface ProcessedCard {
  experience: Experience
  topPx: number
  heightPx: number
  column: number
  cardType: CardType
}

interface ProcessedColumn {
  index: number
  isRegular: boolean
  cards: Array<ProcessedCard>
}

interface ProcessedGroup {
  id: string
  topPx: number
  heightPx: number
  columns: Array<ProcessedColumn>
}

// ============================================================================
// Timeline Bounds
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
    if (exp.startDateParsed < minDate) minDate = new Date(exp.startDateParsed)
    const endDate = exp.endDateParsed ?? now
    if (endDate > maxDate) maxDate = endDate
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

// ============================================================================
// Vertical Position
// ============================================================================

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

// ============================================================================
// Card Type
// ============================================================================

function getCardType(exp: Experience): CardType {
  if (exp.isDeprioritized) return 'deprioritized'
  if (exp.isMilestone) return 'milestone'
  return 'regular'
}

// ============================================================================
// Processing Algorithm
// ============================================================================

function processExperiences(
  experiences: Array<Experience>,
  totalHeightPx: number,
  timelineStart: Date,
  timelineEnd: Date,
  now: Date,
): Array<ProcessedGroup> {
  if (experiences.length === 0) return []

  // Build overlap groups (connected components)
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
          const cStart = current.startDateParsed
          const cEnd = current.endDateParsed ?? now
          const oStart = other.startDateParsed
          const oEnd = other.endDateParsed ?? now
          if (intervalsOverlap(cStart, cEnd, oStart, oEnd)) {
            queue.push(other)
          }
        }
      }
    }

    rawGroups.push(group)
  }

  // Process each group
  const processedGroups: Array<ProcessedGroup> = []

  for (let groupIdx = 0; groupIdx < rawGroups.length; groupIdx++) {
    const groupExps = rawGroups[groupIdx]

    // Sort by start date ASC
    const sorted = [...groupExps].sort(
      (a, b) => a.startDateParsed.getTime() - b.startDateParsed.getTime(),
    )

    // Assign columns using greedy leftmost
    const columnContents: Array<Array<Experience>> = []

    for (const exp of sorted) {
      const start = exp.startDateParsed
      const end = exp.endDateParsed ?? now

      let assignedColumn = -1
      for (let colIdx = 0; colIdx < columnContents.length; colIdx++) {
        const hasOverlap = columnContents[colIdx].some((existing) => {
          const eStart = existing.startDateParsed
          const eEnd = existing.endDateParsed ?? now
          return intervalsOverlap(start, end, eStart, eEnd)
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
    }

    // Build columns
    const columns: Array<ProcessedColumn> = []
    let groupTop = Infinity
    let groupBottom = 0

    for (let colIdx = 0; colIdx < columnContents.length; colIdx++) {
      const colExps = columnContents[colIdx]
      const hasRegular = colExps.some((e) => getCardType(e) === 'regular')

      const cards: Array<ProcessedCard> = colExps.map((exp) => {
        const { topPx, heightPx } = calculateVerticalPosition(
          exp, totalHeightPx, timelineStart, timelineEnd, now,
        )
        return {
          experience: exp,
          topPx,
          heightPx,
          column: colIdx,
          cardType: getCardType(exp),
        }
      })

      // Sort and resolve vertical overlaps
      cards.sort((a, b) => a.topPx - b.topPx)
      resolveVerticalOverlaps(cards, now)

      // Update group bounds
      for (const card of cards) {
        if (card.topPx < groupTop) groupTop = card.topPx
        const bottom = card.topPx + card.heightPx
        if (bottom > groupBottom) groupBottom = bottom
      }

      columns.push({ index: colIdx, isRegular: hasRegular, cards })
    }

    processedGroups.push({
      id: `group-${groupIdx}`,
      topPx: groupTop,
      heightPx: groupBottom - groupTop,
      columns,
    })
  }

  return processedGroups
}

function resolveVerticalOverlaps(cards: Array<ProcessedCard>, now: Date): void {
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
// Group Renderer - Uses CSS Grid for proper flex-grow + content-width
// ============================================================================

interface GroupRendererProps {
  group: ProcessedGroup
  onExperienceClick?: (experience: Experience) => void
}

function GroupRenderer({ group, onExperienceClick }: GroupRendererProps) {
  const { topPx, heightPx, columns } = group

  // Single column - no grid needed
  if (columns.length === 1) {
    const column = columns[0]
    return (
      <>
        {column.cards.map((card) => (
          <SingleCardRenderer
            key={card.experience.id}
            card={card}
            isFullWidth={column.isRegular}
            onClick={onExperienceClick ? () => onExperienceClick(card.experience) : undefined}
          />
        ))}
      </>
    )
  }

  // Multiple columns - use CSS Grid
  // Grid template: 1fr for regular columns, auto for fixed columns
  const gridCols = columns.map((col) => (col.isRegular ? '1fr' : 'auto')).join(' ')

  return (
    <div
      className="absolute left-0 right-0 grid"
      style={{
        top: topPx,
        height: heightPx,
        gridTemplateColumns: gridCols,
        gap: COLUMN_GAP_PX,
      }}
    >
      {columns.map((column) => (
        <div key={column.index} className="relative min-w-0">
          {column.cards.map((card) => {
            const relativeTop = card.topPx - topPx
            return (
              <CardInColumn
                key={card.experience.id}
                card={card}
                relativeTop={relativeTop}
                isRegularColumn={column.isRegular}
                onClick={onExperienceClick ? () => onExperienceClick(card.experience) : undefined}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// Card Renderers
// ============================================================================

interface SingleCardRendererProps {
  card: ProcessedCard
  isFullWidth: boolean
  onClick?: () => void
}

function SingleCardRenderer({ card, isFullWidth, onClick }: SingleCardRendererProps) {
  const { experience, topPx, heightPx, cardType } = card
  const isVeryShortDuration = experience.durationMonths <= 6

  if (cardType === 'milestone') {
    return (
      <div
        className="absolute"
        style={{ top: topPx, left: 0 }}
        onClick={onClick}
      >
        <MilestoneEntry experience={experience} />
      </div>
    )
  }

  return (
    <div
      className="absolute"
      style={{
        top: topPx,
        height: heightPx,
        left: 0,
        right: isFullWidth ? 0 : undefined,
        width: isFullWidth ? undefined : 'auto',
      }}
      onClick={onClick}
    >
      <ExperienceEntryCard
        experience={experience}
        isVeryShortDuration={isVeryShortDuration}
        className={cn('h-full', isFullWidth && 'w-full')}
      />
    </div>
  )
}

interface CardInColumnProps {
  card: ProcessedCard
  relativeTop: number
  isRegularColumn: boolean
  onClick?: () => void
}

function CardInColumn({ card, relativeTop, isRegularColumn, onClick }: CardInColumnProps) {
  const { experience, heightPx, cardType } = card
  const isVeryShortDuration = experience.durationMonths <= 6

  if (cardType === 'milestone') {
    // Milestone: just position at top, don't stretch
    return (
      <div
        className="absolute left-0"
        style={{ top: relativeTop }}
        onClick={onClick}
      >
        <MilestoneEntry experience={experience} />
      </div>
    )
  }

  // Regular column: stretch to fill width
  // Fixed column: let content determine width
  return (
    <div
      className={cn('absolute', isRegularColumn && 'left-0 right-0')}
      style={{
        top: relativeTop,
        height: heightPx,
        left: isRegularColumn ? 0 : undefined,
        right: isRegularColumn ? 0 : undefined,
      }}
      onClick={onClick}
    >
      <ExperienceEntryCard
        experience={experience}
        isVeryShortDuration={isVeryShortDuration}
        className={cn('h-full', isRegularColumn && 'w-full')}
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

  const processedGroups = useMemo(
    () => processExperiences(experiences, totalHeightPx, timelineStart, timelineEnd, now),
    [experiences, totalHeightPx, timelineStart, timelineEnd, now],
  )

  if (experiences.length === 0) {
    return <CareerCalendarSkeleton yearCount={years.length} className={className} />
  }

  return (
    <div
      className={cn(
        'border rounded-sm py-8 px-4 max-sm:py-4 max-sm:px-2 bg-neutral-50',
        className,
      )}
    >
      <div className="flex">
        {/* Year labels */}
        <div className="shrink-0 w-10 relative" style={{ height: totalHeightPx }}>
          <div
            className="absolute left-0 right-0 flex items-center"
            style={{ top: 0, transform: 'translateY(-50%)' }}
          >
            <span className="text-[10px] font-medium text-muted-foreground leading-none">
              {ceilingYear}
            </span>
          </div>
          {years.map((year, index) => (
            <div
              key={year}
              className="absolute left-0 right-0 flex items-center"
              style={{ top: (index + 1) * YEAR_HEIGHT_PX, transform: 'translateY(-50%)' }}
            >
              <span className="text-[10px] font-medium text-muted-foreground leading-none">
                {year}
              </span>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="flex-1 relative pl-4 max-sm:pl-2" style={{ height: totalHeightPx }}>
          {/* Year lines */}
          <div className="absolute h-px bg-border" style={{ top: 0, left: 0, right: 0 }} />
          {years.map((year, index) => (
            <div
              key={`line-${year}`}
              className="absolute h-px bg-border"
              style={{ top: (index + 1) * YEAR_HEIGHT_PX, left: 0, right: 0 }}
            />
          ))}

          {/* Cards */}
          <div className="absolute top-0 bottom-0 left-4 max-sm:left-2 right-0">
            {processedGroups.map((group) => (
              <GroupRenderer
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
