/**
 * Unified Positioning Algorithm for Career Calendar
 *
 * Single source of truth for all card positioning logic.
 *
 * Card Types:
 * 1. Regular cards: Flex to fill available space, sorted by start date (earliest = leftmost)
 * 2. Deprioritized cards: Fixed width, always positioned at rightmost edge
 * 3. Milestones with overlap: Fixed width, positioned to the left of deprioritized cards
 * 4. Milestones without overlap: Ghost button style, positioned at left edge
 *
 * Key Principles:
 * - Earlier start date = leftmost column (for regular cards)
 * - Deprioritized cards are always rightmost
 * - All positioning is calculated here, renderer just applies values
 */

import {
  COLUMN_GAP_PX,
  DEPRIORITIZED_CARD_WIDTH_PX,
  MILESTONE_CARD_WIDTH_PX,
} from './career-calendar.constants'
import { intervalsOverlap } from './career-calendar.utils'
import type { Experience } from '@/lib/experiences'
import type { ExperiencePositioning } from './career-calendar.types'

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
 * Calculate final CSS positioning for all experiences
 */
export function calculatePositioning(
  experiences: Array<Experience>,
  now: Date,
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

    // Calculate total fixed-width space on the right
    // Order from right: deprioritized cards, then milestones with overlap
    const totalDeprioritizedWidth =
      deprioritizedCards.length * (DEPRIORITIZED_CARD_WIDTH_PX + COLUMN_GAP_PX)
    const totalMilestoneWidth =
      milestonesWithOverlap.length * (MILESTONE_CARD_WIDTH_PX + COLUMN_GAP_PX)
    const totalFixedWidth = totalDeprioritizedWidth + totalMilestoneWidth

    // Sort deprioritized by start date DESC (later = rightmost)
    const sortedDeprioritized = [...deprioritizedCards].sort(
      (a, b) => b.startDateParsed.getTime() - a.startDateParsed.getTime(),
    )

    // Sort milestones by start date DESC (later = rightmost, but left of deprioritized)
    const sortedMilestones = [...milestonesWithOverlap].sort(
      (a, b) => b.startDateParsed.getTime() - a.startDateParsed.getTime(),
    )

    // Position deprioritized cards (rightmost)
    let rightOffset = 0
    for (const exp of sortedDeprioritized) {
      rightOffset += DEPRIORITIZED_CARD_WIDTH_PX

      result.set(exp.id, {
        column:
          numRegularColumns +
          milestonesWithOverlap.length +
          sortedDeprioritized.indexOf(exp),
        leftPercent: 0,
        widthPercent: 0,
        overlapAtStart: group.experiences.length,
        isOverlapped: false,
        cssLeft: `calc(100% - ${rightOffset}px)`,
        cssWidth: `${DEPRIORITIZED_CARD_WIDTH_PX}px`,
        zIndex: 0,
        cardType: 'deprioritized',
      })

      rightOffset += COLUMN_GAP_PX
    }

    // Position milestones with overlap (to the left of deprioritized)
    for (const exp of sortedMilestones) {
      rightOffset += MILESTONE_CARD_WIDTH_PX

      result.set(exp.id, {
        column: numRegularColumns + sortedMilestones.indexOf(exp),
        leftPercent: 0,
        widthPercent: 0,
        overlapAtStart: group.experiences.length,
        isOverlapped: false,
        cssLeft: `calc(100% - ${rightOffset}px)`,
        cssWidth: `${MILESTONE_CARD_WIDTH_PX}px`,
        zIndex: 1,
        cardType: 'milestone',
      })

      rightOffset += COLUMN_GAP_PX
    }

    // Position regular cards (fill remaining space)
    for (const exp of regularCards) {
      const column = regularColumnMap.get(exp.id) ?? 0
      const hasOverlap = regularCards.length > 1 || totalFixedWidth > 0

      let cssLeft: string
      let cssWidth: string

      if (totalFixedWidth > 0) {
        // Space is shared: (100% - fixedWidth) / numRegularColumns
        const availableSpace = `(100% - ${totalFixedWidth}px)`
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
        isOverlapped: column < numRegularColumns - 1 || totalFixedWidth > 0,
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
