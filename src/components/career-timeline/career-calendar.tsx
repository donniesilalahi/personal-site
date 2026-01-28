import { useMemo } from 'react'

import { ExperienceEntryCard, MilestoneEntry } from './experience-entry-card'
import { CareerCalendarSkeleton } from './career-calendar-skeleton'
import { calculatePositioning } from './career-calendar.algorithm'
import type { OverlapGroup } from './career-calendar.algorithm'
import {
  COLUMN_GAP_PX,
  MIN_EXPERIENCE_HEIGHT_PX,
  VERTICAL_GAP_PX,
  YEAR_HEIGHT_PX,
} from './career-calendar.constants'
import { areConsecutive, dateToPercent } from './career-calendar.utils'
import type {
  CareerCalendarProps,
  PositionedCard,
  RenderedOverlapGroup,
  TimelineBounds,
} from './career-calendar.types'

import type { Experience } from '@/lib/experiences'
import { cn } from '@/lib/utils'

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Calculate timeline bounds from experiences
 */
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

  // Build years array (descending - newest at top)
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

/**
 * Calculate vertical position for a single card
 */
function calculateCardPosition(
  exp: Experience,
  totalHeightPx: number,
  timelineStart: Date,
  timelineEnd: Date,
  now: Date,
): { topPx: number; heightPx: number } {
  const start = exp.startDateParsed
  const end = exp.endDateParsed ?? now

  // Top = where experience ends (newest point)
  const topPercent = dateToPercent(end, timelineStart, timelineEnd)
  const topPx = (topPercent / 100) * totalHeightPx

  // Height = duration
  const startPercent = dateToPercent(start, timelineStart, timelineEnd)
  let heightPx = ((startPercent - topPercent) / 100) * totalHeightPx

  // Enforce minimum height
  if (heightPx < MIN_EXPERIENCE_HEIGHT_PX) {
    heightPx = MIN_EXPERIENCE_HEIGHT_PX
  }

  return { topPx: Math.round(topPx), heightPx: Math.round(heightPx) }
}

/**
 * Convert algorithm groups to rendered groups with vertical positions
 */
function buildRenderedGroups(
  groups: Array<OverlapGroup>,
  totalHeightPx: number,
  timelineStart: Date,
  timelineEnd: Date,
  now: Date,
): Array<RenderedOverlapGroup> {
  return groups.map((group) => {
    // Calculate position for each card in the group
    const cards: Array<PositionedCard> = group.cards.map((card) => {
      const { topPx, heightPx } = calculateCardPosition(
        card.experience,
        totalHeightPx,
        timelineStart,
        timelineEnd,
        now,
      )

      return {
        experience: card.experience,
        topPx,
        heightPx,
        flexBehavior: card.flexBehavior,
        cardType: card.cardType,
        hasOverlap: !group.isSolo,
      }
    })

    // Resolve vertical overlaps within the group
    // Sort by topPx (newest/higher cards first)
    const sortedCards = [...cards].sort((a, b) => a.topPx - b.topPx)

    for (let i = 0; i < sortedCards.length - 1; i++) {
      const current = sortedCards[i]
      const next = sortedCards[i + 1]

      const currentBottom = current.topPx + current.heightPx
      const gap = next.topPx - currentBottom

      // Check if these experiences are consecutive
      const isConsecutive = areConsecutive(
        next.experience.endDateParsed,
        current.experience.startDateParsed,
        now,
      )

      if (isConsecutive || gap < VERTICAL_GAP_PX) {
        // Ensure minimum gap
        const desiredHeight = next.topPx - current.topPx - VERTICAL_GAP_PX

        if (desiredHeight >= MIN_EXPERIENCE_HEIGHT_PX) {
          current.heightPx = desiredHeight
        } else {
          current.heightPx = MIN_EXPERIENCE_HEIGHT_PX
          const shift =
            current.topPx + MIN_EXPERIENCE_HEIGHT_PX + VERTICAL_GAP_PX - next.topPx
          for (let j = i + 1; j < sortedCards.length; j++) {
            sortedCards[j].topPx += shift
          }
        }
      }
    }

    // Calculate group bounds
    let groupTop = Infinity
    let groupBottom = 0
    for (const card of cards) {
      if (card.topPx < groupTop) groupTop = card.topPx
      const bottom = card.topPx + card.heightPx
      if (bottom > groupBottom) groupBottom = bottom
    }

    return {
      id: group.id,
      topPx: groupTop,
      heightPx: groupBottom - groupTop,
      cards,
    }
  })
}

// ============================================================================
// Card Rendering
// ============================================================================

interface CardRendererProps {
  card: PositionedCard
  groupTopPx: number
  onClick?: () => void
}

function CardRenderer({ card, groupTopPx, onClick }: CardRendererProps) {
  const { experience, topPx, heightPx, cardType } = card
  const isVeryShortDuration = experience.durationMonths <= 6

  // Position relative to the group top
  const relativeTop = topPx - groupTopPx

  if (cardType === 'milestone') {
    return (
      <div
        className="absolute left-0 right-0"
        style={{ top: relativeTop }}
        onClick={onClick}
      >
        <MilestoneEntry experience={experience} />
      </div>
    )
  }

  return (
    <div
      className="absolute left-0 right-0"
      style={{ top: relativeTop, height: heightPx }}
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
// Overlap Group Rendering
// ============================================================================

interface OverlapGroupRendererProps {
  group: RenderedOverlapGroup
  onExperienceClick?: (experience: Experience) => void
}

function OverlapGroupRenderer({
  group,
  onExperienceClick,
}: OverlapGroupRendererProps) {
  const { cards, topPx, heightPx } = group

  // Single card - render directly without flex container
  if (cards.length === 1) {
    const card = cards[0]
    return (
      <div
        className="absolute left-0 right-0"
        style={{ top: topPx, height: heightPx }}
      >
        <CardRenderer
          card={card}
          groupTopPx={topPx}
          onClick={
            onExperienceClick
              ? () => onExperienceClick(card.experience)
              : undefined
          }
        />
      </div>
    )
  }

  // Multiple cards - use flex container for horizontal layout
  // Cards are already sorted by start date (leftmost first)
  return (
    <div
      className="absolute left-0 right-0 flex"
      style={{ top: topPx, height: heightPx, gap: COLUMN_GAP_PX }}
    >
      {cards.map((card) => {
        // Flex item: grow for regular, content for fixed-width
        const flexStyle =
          card.flexBehavior === 'grow'
            ? { flex: '1 1 0', minWidth: 0 }
            : { flex: '0 0 auto' }

        return (
          <div key={card.experience.id} className="relative" style={flexStyle}>
            <CardRenderer
              card={card}
              groupTopPx={topPx}
              onClick={
                onExperienceClick
                  ? () => onExperienceClick(card.experience)
                  : undefined
              }
            />
          </div>
        )
      })}
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

  // Calculate timeline bounds
  const { years, ceilingYear, timelineStart, timelineEnd } = useMemo(
    () => calculateTimelineBounds(experiences, now),
    [experiences, now],
  )

  // Total timeline height
  const totalHeightPx = years.length * YEAR_HEIGHT_PX

  // Calculate positioning (overlap groups)
  const positioningResult = useMemo(
    () => calculatePositioning(experiences, now),
    [experiences, now],
  )

  // Build rendered groups with vertical positions
  const renderedGroups = useMemo(
    () =>
      buildRenderedGroups(
        positioningResult.groups,
        totalHeightPx,
        timelineStart,
        timelineEnd,
        now,
      ),
    [positioningResult.groups, totalHeightPx, timelineStart, timelineEnd, now],
  )

  // Show skeleton if no experiences
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
          {/* Ceiling year label at top */}
          <div
            className="absolute left-0 right-0 flex items-center"
            style={{ top: 0, transform: 'translateY(-50%)' }}
          >
            <span className="text-[10px] font-medium text-muted-foreground leading-none">
              {ceilingYear}
            </span>
          </div>

          {/* Year labels at the bottom of each year lane */}
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
          {/* Ceiling year line */}
          <div
            className="absolute h-px bg-border"
            style={{ top: 0, left: 0, right: 0 }}
          />

          {/* Year boundary lines */}
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

          {/* Experience cards container */}
          <div className="absolute top-0 bottom-0 left-4 max-sm:left-2 right-0">
            {renderedGroups.map((group) => (
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
