/**
 * Career Calendar Positioning Algorithm
 *
 * CORE PRINCIPLE: Use CSS Flexbox for horizontal layout of overlapping cards.
 *
 * For experiences that overlap in time:
 * 1. Group them into "overlap groups" (connected components)
 * 2. Within each group, sort by start date ASC (earlier = leftmost)
 * 3. Render as a flex container with:
 *    - Regular cards: flex: 1 1 0 (grow to fill remaining space)
 *    - Deprioritized/Milestone cards: flex: 0 0 auto (content width)
 *
 * Vertical positioning uses absolute positioning based on dates.
 */

import { intervalsOverlap } from './career-calendar.utils'
import type { Experience } from '@/lib/experiences'

// ============================================================================
// Types
// ============================================================================

/** Card flex behavior */
export type FlexBehavior = 'grow' | 'content'

/** A card within an overlap group */
export interface GroupedCard {
  experience: Experience
  /** Position within the group (0 = leftmost) */
  order: number
  /** Flex behavior: 'grow' for regular, 'content' for fixed-width */
  flexBehavior: FlexBehavior
  /** Card type for rendering */
  cardType: 'regular' | 'deprioritized' | 'milestone'
}

/** An overlap group - experiences that share time */
export interface OverlapGroup {
  /** Unique ID for this group */
  id: string
  /** Cards in this group, sorted by start date (leftmost first) */
  cards: Array<GroupedCard>
  /** Whether this is a solo card (no overlap) */
  isSolo: boolean
}

/** Result of the positioning algorithm */
export interface PositioningResult {
  /** Map from experience ID to its overlap group */
  experienceToGroup: Map<string, OverlapGroup>
  /** All overlap groups */
  groups: Array<OverlapGroup>
}

// ============================================================================
// Helper Functions
// ============================================================================

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
 * Determine flex behavior for a card
 */
function getFlexBehavior(exp: Experience): FlexBehavior {
  if (exp.isDeprioritized || exp.isMilestone) {
    return 'content' // flex: 0 0 auto
  }
  return 'grow' // flex: 1 1 0
}

/**
 * Determine card type for rendering
 */
function getCardType(
  exp: Experience,
): 'regular' | 'deprioritized' | 'milestone' {
  if (exp.isDeprioritized) return 'deprioritized'
  if (exp.isMilestone) return 'milestone'
  return 'regular'
}

/**
 * Build overlap groups using connected components algorithm
 */
function buildOverlapGroups(
  experiences: Array<Experience>,
  now: Date,
): Array<Array<Experience>> {
  const visited = new Set<string>()
  const groups: Array<Array<Experience>> = []

  for (const exp of experiences) {
    if (visited.has(exp.id)) continue

    // BFS to find all connected experiences
    const group: Array<Experience> = []
    const queue: Array<Experience> = [exp]

    while (queue.length > 0) {
      const current = queue.shift()!
      if (visited.has(current.id)) continue

      visited.add(current.id)
      group.push(current)

      for (const other of experiences) {
        if (!visited.has(other.id) && experiencesOverlap(current, other, now)) {
          queue.push(other)
        }
      }
    }

    groups.push(group)
  }

  return groups
}

// ============================================================================
// Main Algorithm
// ============================================================================

/**
 * Calculate positioning for all experiences.
 *
 * Returns overlap groups where cards are sorted by start date.
 * The renderer uses these groups to create flex containers.
 */
export function calculatePositioning(
  experiences: Array<Experience>,
  now: Date,
): PositioningResult {
  const experienceToGroup = new Map<string, OverlapGroup>()
  const groups: Array<OverlapGroup> = []

  // Build overlap groups
  const rawGroups = buildOverlapGroups(experiences, now)

  for (let groupIdx = 0; groupIdx < rawGroups.length; groupIdx++) {
    const groupExps = rawGroups[groupIdx]
    const groupId = `group-${groupIdx}`

    // Sort by start date ASC (earlier = leftmost)
    const sorted = [...groupExps].sort(
      (a, b) => a.startDateParsed.getTime() - b.startDateParsed.getTime(),
    )

    // Create grouped cards
    const cards: Array<GroupedCard> = sorted.map((exp, order) => ({
      experience: exp,
      order,
      flexBehavior: getFlexBehavior(exp),
      cardType: getCardType(exp),
    }))

    const group: OverlapGroup = {
      id: groupId,
      cards,
      isSolo: cards.length === 1,
    }

    groups.push(group)

    // Map each experience to its group
    for (const card of cards) {
      experienceToGroup.set(card.experience.id, group)
    }
  }

  return { experienceToGroup, groups }
}

/**
 * Get experiences that need width measurement.
 * Used during the measurement phase for content-hugging cards.
 */
export function getFixedWidthExperiences(
  experiences: Array<Experience>,
): Array<{ experience: Experience; cardType: 'deprioritized' | 'milestone' }> {
  const result: Array<{
    experience: Experience
    cardType: 'deprioritized' | 'milestone'
  }> = []

  for (const exp of experiences) {
    if (exp.isDeprioritized) {
      result.push({ experience: exp, cardType: 'deprioritized' })
    } else if (exp.isMilestone) {
      result.push({ experience: exp, cardType: 'milestone' })
    }
  }

  return result
}
