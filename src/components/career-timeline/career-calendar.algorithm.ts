/**
 * Unified Positioning Algorithm for Career Calendar
 *
 * Single source of truth for all card positioning logic.
 *
 * Card Types:
 * 1. Regular cards: Flex to fill available space, sorted by start date (earliest = leftmost)
 * 2. Deprioritized cards: Content-hugging width, always positioned at rightmost edge
 * 3. Milestones with overlap: Content-hugging width, positioned to the left of deprioritized cards
 * 4. Milestones without overlap: Ghost button style, positioned at left edge
 *
 * Key Principles:
 * - Earlier start date = leftmost column (for regular cards)
 * - Deprioritized cards are always rightmost
 * - All positioning is calculated here, renderer just applies values
 * - Gap logic is consolidated in one place (calculateFixedSectionLayout)
 */

import { COLUMN_GAP_PX } from './career-calendar.constants'
import { intervalsOverlap } from './career-calendar.utils'
import type { Experience } from '@/lib/experiences'
import type {
  ExperiencePositioning,
  MeasurableExperience,
  MeasuredWidths,
} from './career-calendar.types'

interface OverlapGroup {
  experiences: Array<Experience>
  regularCards: Array<Experience>
  deprioritizedCards: Array<Experience>
  milestonesWithOverlap: Array<Experience>
  milestonesNoOverlap: Array<Experience>
}

/**
 * Check if two experiences overlap in time
 */
function experiencesOverlap(a: Experience, b: Experience, now: Date): boolean {
  const aStart = a.startDateParsed
  const aEnd = a.endDateParsed ?? now
  const bStart = b.startDateParsed
  const bEnd = b.endDateParsed ?? now
  return intervalsOverlap(aStart, aEnd, bStart, bEnd)
}

/**
 * Find all experiences that overlap with a given experience
 */
function findOverlapping(
  exp: Experience,
  allExperiences: Array<Experience>,
  now: Date,
): Array<Experience> {
  return allExperiences.filter(
    (other) => other.id !== exp.id && experiencesOverlap(exp, other, now),
  )
}

/**
 * Categorize an experience based on its type and overlap status
 */
function categorizeExperience(
  exp: Experience,
  overlapping: Array<Experience>,
): 'regular' | 'deprioritized' | 'milestone' | 'milestone-no-overlap' {
  if (exp.isDeprioritized) return 'deprioritized'
  if (exp.isMilestone) {
    return overlapping.length > 0 ? 'milestone' : 'milestone-no-overlap'
  }
  return 'regular'
}

/**
 * Build overlap groups - connected components of overlapping experiences
 * Each group contains experiences that transitively overlap with each other
 */
function buildOverlapGroups(
  experiences: Array<Experience>,
  now: Date,
): Array<OverlapGroup> {
  const visited = new Set<string>()
  const groups: Array<OverlapGroup> = []

  for (const exp of experiences) {
    if (visited.has(exp.id)) continue

    // BFS to find all connected experiences
    const groupExps: Array<Experience> = []
    const queue: Array<Experience> = [exp]

    while (queue.length > 0) {
      const current = queue.shift()!
      if (visited.has(current.id)) continue

      visited.add(current.id)
      groupExps.push(current)

      // Find all overlapping experiences
      for (const other of experiences) {
        if (!visited.has(other.id) && experiencesOverlap(current, other, now)) {
          queue.push(other)
        }
      }
    }

    // Categorize experiences in this group
    const regularCards: Array<Experience> = []
    const deprioritizedCards: Array<Experience> = []
    const milestonesWithOverlap: Array<Experience> = []
    const milestonesNoOverlap: Array<Experience> = []

    for (const e of groupExps) {
      const overlapping = findOverlapping(e, groupExps, now)
      const category = categorizeExperience(e, overlapping)

      switch (category) {
        case 'regular':
          regularCards.push(e)
          break
        case 'deprioritized':
          deprioritizedCards.push(e)
          break
        case 'milestone':
          milestonesWithOverlap.push(e)
          break
        case 'milestone-no-overlap':
          milestonesNoOverlap.push(e)
          break
      }
    }

    groups.push({
      experiences: groupExps,
      regularCards,
      deprioritizedCards,
      milestonesWithOverlap,
      milestonesNoOverlap,
    })
  }

  return groups
}

/**
 * Assign columns to regular cards using greedy leftmost algorithm
 * Sort by start date ASC → earlier starters get lower column numbers (leftmost)
 */
function assignColumnsToRegularCards(
  regularCards: Array<Experience>,
  now: Date,
): Map<string, number> {
  if (regularCards.length === 0) return new Map()

  // Sort by start date ASC (earlier = processed first = leftmost)
  const sorted = [...regularCards].sort(
    (a, b) => a.startDateParsed.getTime() - b.startDateParsed.getTime(),
  )

  const columnAssignments = new Map<string, number>()
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
    columnAssignments.set(exp.id, assignedColumn)
  }

  return columnAssignments
}

/**
 * SINGLE SOURCE OF TRUTH for fixed section layout calculation.
 *
 * Calculates the total width reserved for fixed-width cards (deprioritized + milestones)
 * and the right offset positions for each card.
 *
 * Gap logic is consolidated here:
 * - Gaps BETWEEN fixed cards: (n-1) * COLUMN_GAP_PX for n cards
 * - Gap between fixed section and regular cards: 1 * COLUMN_GAP_PX (only if fixed cards exist)
 *
 * @returns Object containing:
 *   - totalReservedWidth: Total width to reserve for fixed section (including gap to regular cards)
 *   - cardPositions: Map of experience ID to { rightOffset, width } for positioning
 */
function calculateFixedSectionLayout(
  sortedDeprioritized: Array<Experience>,
  sortedMilestones: Array<Experience>,
  measuredWidths: MeasuredWidths,
  gap: number,
): {
  totalReservedWidth: number
  cardPositions: Map<string, { rightOffset: number; width: number }>
} {
  const cardPositions = new Map<
    string,
    { rightOffset: number; width: number }
  >()

  // No fixed cards = no reserved space
  if (sortedDeprioritized.length === 0 && sortedMilestones.length === 0) {
    return { totalReservedWidth: 0, cardPositions }
  }

  // Build list of all fixed cards in order (rightmost first)
  // Order: deprioritized (rightmost) → milestones (left of deprioritized)
  const allFixedCards = [...sortedDeprioritized, ...sortedMilestones]

  // Calculate positions from right edge
  let currentRightOffset = 0

  for (let i = 0; i < allFixedCards.length; i++) {
    const exp = allFixedCards[i]
    const width = measuredWidths.get(exp.id) ?? 0

    // Position this card: right edge is at currentRightOffset
    cardPositions.set(exp.id, {
      rightOffset: currentRightOffset,
      width,
    })

    // Move offset for next card: add this card's width
    currentRightOffset += width

    // Add gap after this card (except for the last one in the fixed section)
    // The last card's gap will be added as the gap to regular cards
    if (i < allFixedCards.length - 1) {
      currentRightOffset += gap
    }
  }

  // Total reserved = all card widths + gaps between them + gap to regular cards
  // currentRightOffset already has all widths + (n-1) gaps
  // Add one more gap for separation from regular cards
  const totalReservedWidth = currentRightOffset + gap

  return { totalReservedWidth, cardPositions }
}

/**
 * Get all experiences that need width measurement before positioning.
 * These are "fixed-width" cards that hug their content:
 * - Deprioritized cards
 * - Milestones that overlap with other experiences
 */
export function getFixedWidthExperiences(
  experiences: Array<Experience>,
  now: Date,
): Array<MeasurableExperience> {
  const result: Array<MeasurableExperience> = []
  const groups = buildOverlapGroups(experiences, now)

  for (const group of groups) {
    // Deprioritized cards always need measurement
    for (const exp of group.deprioritizedCards) {
      result.push({ experience: exp, cardType: 'deprioritized' })
    }

    // Milestones with overlap need measurement
    for (const exp of group.milestonesWithOverlap) {
      result.push({ experience: exp, cardType: 'milestone' })
    }
  }

  return result
}

/**
 * Calculate final CSS positioning for all experiences.
 *
 * @param experiences - All experiences to position
 * @param now - Current date for ongoing experiences
 * @param measuredWidths - Map of experience ID to measured width in pixels
 *                         (required for deprioritized and milestone cards)
 */
export function calculatePositioning(
  experiences: Array<Experience>,
  now: Date,
  measuredWidths: MeasuredWidths,
): Map<string, ExperiencePositioning> {
  const result = new Map<string, ExperiencePositioning>()

  // Build overlap groups
  const groups = buildOverlapGroups(experiences, now)

  for (const group of groups) {
    const {
      regularCards,
      deprioritizedCards,
      milestonesWithOverlap,
      milestonesNoOverlap,
    } = group

    // Assign columns to regular cards
    const regularColumnMap = assignColumnsToRegularCards(regularCards, now)
    const numRegularColumns =
      Math.max(0, ...Array.from(regularColumnMap.values())) +
      (regularCards.length > 0 ? 1 : 0)

    // Sort fixed cards by start date DESC (later = rightmost)
    const sortedDeprioritized = [...deprioritizedCards].sort(
      (a, b) => b.startDateParsed.getTime() - a.startDateParsed.getTime(),
    )
    const sortedMilestones = [...milestonesWithOverlap].sort(
      (a, b) => b.startDateParsed.getTime() - a.startDateParsed.getTime(),
    )

    // Calculate fixed section layout (SINGLE SOURCE OF TRUTH for gaps)
    const { totalReservedWidth, cardPositions } = calculateFixedSectionLayout(
      sortedDeprioritized,
      sortedMilestones,
      measuredWidths,
      COLUMN_GAP_PX,
    )

    // Position deprioritized cards (rightmost)
    for (const exp of sortedDeprioritized) {
      const pos = cardPositions.get(exp.id)
      const width = pos?.width ?? 0
      const rightOffset = pos?.rightOffset ?? 0

      result.set(exp.id, {
        column:
          numRegularColumns +
          milestonesWithOverlap.length +
          sortedDeprioritized.indexOf(exp),
        leftPercent: 0,
        widthPercent: 0,
        overlapAtStart: group.experiences.length,
        isOverlapped: false,
        // Position from right: right edge at rightOffset, so left edge at rightOffset + width
        cssLeft: `calc(100% - ${rightOffset + width}px)`,
        cssWidth: `${width}px`,
        zIndex: 0,
        cardType: 'deprioritized',
      })
    }

    // Position milestones with overlap (to the left of deprioritized)
    for (const exp of sortedMilestones) {
      const pos = cardPositions.get(exp.id)
      const rightOffset = pos?.rightOffset ?? 0

      result.set(exp.id, {
        column: numRegularColumns + sortedMilestones.indexOf(exp),
        leftPercent: 0,
        widthPercent: 0,
        overlapAtStart: group.experiences.length,
        isOverlapped: false,
        cssLeft: 'auto',
        // Milestone's right edge is at rightOffset from container's right edge
        cssRight: `${rightOffset}px`,
        cssWidth: 'auto', // Keep auto for milestones to hug content
        zIndex: 1,
        cardType: 'milestone',
      })
    }

    // Position regular cards (fill remaining space)
    for (const exp of regularCards) {
      const column = regularColumnMap.get(exp.id) ?? 0

      let cssLeft: string
      let cssWidth: string

      if (totalReservedWidth > 0) {
        // Space is shared: (100% - totalReservedWidth) / numRegularColumns
        const availableSpace = `(100% - ${totalReservedWidth}px)`
        cssWidth =
          numRegularColumns > 0
            ? `calc(${availableSpace} / ${numRegularColumns})`
            : `calc(${availableSpace})`
        cssLeft =
          numRegularColumns > 0
            ? `calc(${availableSpace} / ${numRegularColumns} * ${column} + ${column * COLUMN_GAP_PX}px)`
            : '0%'
      } else if (numRegularColumns > 1) {
        // No fixed cards, but multiple regular cards
        const widthPercent = 100 / numRegularColumns
        const leftPercent = column * widthPercent
        cssWidth = `calc(${widthPercent}% - ${COLUMN_GAP_PX}px)`
        cssLeft = `calc(${leftPercent}% + ${column * COLUMN_GAP_PX}px)`
      } else {
        // Single card, full width
        cssWidth = '100%'
        cssLeft = '0%'
      }

      result.set(exp.id, {
        column,
        leftPercent: (column / Math.max(1, numRegularColumns)) * 100,
        widthPercent: 100 / Math.max(1, numRegularColumns),
        overlapAtStart: group.experiences.length,
        isOverlapped: column < numRegularColumns - 1 || totalReservedWidth > 0,
        cssLeft,
        cssWidth,
        zIndex: column + 2,
        cardType: 'regular',
      })
    }

    // Position milestones without overlap (positioned at left edge, ghost style)
    for (const exp of milestonesNoOverlap) {
      result.set(exp.id, {
        column: 0,
        leftPercent: 0,
        widthPercent: 100,
        overlapAtStart: 1,
        isOverlapped: false,
        cssLeft: '0px',
        cssWidth: 'auto',
        zIndex: 10,
        cardType: 'milestone-no-overlap',
      })
    }
  }

  return result
}
