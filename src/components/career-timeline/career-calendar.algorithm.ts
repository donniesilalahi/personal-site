/**
 * Unified Positioning Algorithm for Career Calendar
 *
 * SINGLE PRINCIPLE: Earlier start date = leftmost column
 *
 * This applies to ALL card types uniformly:
 * - Regular cards
 * - Deprioritized cards
 * - Milestone cards
 *
 * Card type only affects VISUAL RENDERING, not positioning.
 *
 * Key Design:
 * 1. Sort all experiences by start date ASC
 * 2. Assign columns using greedy leftmost algorithm
 * 3. Calculate CSS values based on column + measured widths
 * 4. Renderer derives visual variant from experience properties
 */

import { COLUMN_GAP_PX } from './career-calendar.constants'
import { intervalsOverlap } from './career-calendar.utils'
import type { Experience } from '@/lib/experiences'
import type {
  ExperiencePositioning,
  MeasurableExperience,
  MeasuredWidths,
} from './career-calendar.types'

// ============================================================================
// Types
// ============================================================================

interface OverlapGroup {
  experiences: Array<Experience>
}

interface ColumnAssignment {
  experienceId: string
  column: number
  needsMeasurement: boolean
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
 * Determine if an experience needs width measurement (content-hugging)
 */
function needsMeasurement(exp: Experience): boolean {
  return exp.isMilestone === true || exp.isDeprioritized === true
}

/**
 * Build overlap groups - connected components of overlapping experiences
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

      for (const other of experiences) {
        if (!visited.has(other.id) && experiencesOverlap(current, other, now)) {
          queue.push(other)
        }
      }
    }

    groups.push({ experiences: groupExps })
  }

  return groups
}

/**
 * Assign columns to ALL experiences using greedy leftmost algorithm
 * SINGLE SORT: All experiences sorted by start date ASC (earlier = leftmost)
 */
function assignColumns(
  experiences: Array<Experience>,
  now: Date,
): Map<string, ColumnAssignment> {
  if (experiences.length === 0) return new Map()

  // SINGLE SORT: ALL experiences by start date ASC
  const sorted = [...experiences].sort(
    (a, b) => a.startDateParsed.getTime() - b.startDateParsed.getTime(),
  )

  const assignments = new Map<string, ColumnAssignment>()
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
    assignments.set(exp.id, {
      experienceId: exp.id,
      column: assignedColumn,
      needsMeasurement: needsMeasurement(exp),
    })
  }

  return assignments
}

// ============================================================================
// Exported Functions
// ============================================================================

/**
 * Get all experiences that need width measurement before positioning.
 * These are "fixed-width" cards that hug their content:
 * - Deprioritized cards
 * - Milestone cards (all of them, not just overlapping ones)
 */
export function getFixedWidthExperiences(
  experiences: Array<Experience>,
): Array<MeasurableExperience> {
  const result: Array<MeasurableExperience> = []

  for (const exp of experiences) {
    if (exp.isDeprioritized) {
      result.push({ experience: exp, cardType: 'deprioritized' })
    } else if (exp.isMilestone) {
      result.push({ experience: exp, cardType: 'milestone' })
    }
  }

  return result
}

/**
 * Calculate final CSS positioning for all experiences.
 *
 * UNIFIED ALGORITHM:
 * 1. Build overlap groups (connected components)
 * 2. For each group, assign columns (earlier start = leftmost) - SAME for all card types
 * 3. Calculate CSS values: measured cards get fixed px width, flex cards share remaining space
 *
 * Key principle: Column assignment is uniform. Width calculation differs by card type.
 *
 * @param experiences - All experiences to position
 * @param now - Current date for ongoing experiences
 * @param measuredWidths - Map of experience ID to measured width in pixels
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
    const { experiences: groupExps } = group

    // Assign columns to all experiences in group (single unified sort by start date ASC)
    const columnAssignments = assignColumns(groupExps, now)

    // Calculate total columns
    const maxColumn = Math.max(
      0,
      ...Array.from(columnAssignments.values()).map((a) => a.column),
    )
    const totalColumns = groupExps.length > 0 ? maxColumn + 1 : 0

    // Single experience - simple case
    if (totalColumns === 1 && groupExps.length === 1) {
      const exp = groupExps[0]
      const cardType = exp.isDeprioritized
        ? 'deprioritized'
        : exp.isMilestone
          ? 'milestone-no-overlap'
          : 'regular'

      result.set(exp.id, {
        column: 0,
        leftPercent: 0,
        widthPercent: 100,
        overlapAtStart: 1,
        isOverlapped: false,
        cssLeft: '0%',
        cssWidth: cardType === 'regular' ? '100%' : 'auto',
        zIndex: 1,
        cardType,
      })
      continue
    }

    // Simple approach: use CSS custom properties for flex-like behavior
    // 1. Regular cards: flex: 1 1 0 (grow to fill)
    // 2. Fixed cards: flex: 0 0 auto (content width)
    // Position from right for fixed cards, from left for regular cards
    
    // Build per-experience info sorted by column
    const expInfos = groupExps
      .map((exp) => {
        const assignment = columnAssignments.get(exp.id)!
        const isFixed = assignment.needsMeasurement
        const cardType = exp.isDeprioritized
          ? 'deprioritized'
          : exp.isMilestone
            ? 'milestone'
            : 'regular'
        return { exp, column: assignment.column, isFixed, cardType }
      })
      .sort((a, b) => a.column - b.column)

    // For each card, determine its direct overlaps and calculate position
    for (const info of expInfos) {
      const { exp, column, isFixed, cardType } = info

      // Find experiences that DIRECTLY overlap with this one (not just transitively connected)
      const directOverlaps = expInfos.filter(
        (other) =>
          other.exp.id !== exp.id && experiencesOverlap(exp, other.exp, now),
      )

      // Count fixed cards to the right that directly overlap
      const fixedToRight = directOverlaps.filter(
        (o) => o.isFixed && o.column > column,
      )

      let cssLeft: string
      let cssRight: string | undefined
      let cssWidth: string

      if (isFixed) {
        // Fixed card: position from the right, width = auto
        // Calculate right offset: sum of widths of fixed cards further right + gaps
        // Since we use auto width, position using right offset based on column position from right
        const colsFromRight = totalColumns - 1 - column
        const gapsFromRight = colsFromRight * COLUMN_GAP_PX
        
        cssLeft = 'auto'
        cssRight = `${gapsFromRight}px`
        cssWidth = 'auto'
      } else {
        // Regular card: position from left, flex to fill remaining space
        // Width = 100% minus space for directly-overlapping fixed cards to the right
        const numDirectFixedRight = fixedToRight.length
        const gapsForFixed = numDirectFixedRight * COLUMN_GAP_PX
        
        // Use CSS custom property for fixed card width (set by renderer after measurement)
        // For now, use a reasonable estimate or let renderer handle it
        if (numDirectFixedRight === 0) {
          cssLeft = '0'
          cssWidth = '100%'
        } else {
          cssLeft = '0'
          // Width calculation will be handled by renderer using measured widths
          cssWidth = 'flex' // Signal to renderer to use flex: 1 1 0
        }
        cssRight = undefined
      }

      result.set(exp.id, {
        column,
        leftPercent: 0,
        widthPercent: 0,
        overlapAtStart: groupExps.length,
        isOverlapped: directOverlaps.length > 0,
        cssLeft,
        cssRight,
        cssWidth,
        zIndex: column + 1,
        cardType,
        numFixedToRight: fixedToRight.length,
        directOverlapCount: directOverlaps.length,
      })
    }
  }

  return result
}
