import {
  MIN_EXPERIENCE_HEIGHT_PX,
  VERTICAL_GAP_PX,
} from './career-calendar.constants'
import {
  areConsecutive,
  calculateVerticalPosition,
  getCardType,
  intervalsOverlap,
} from './career-calendar.utils'
import type { Experience } from '@/lib/experiences'
import type {
  ProcessedCard,
  ProcessedColumn,
  ProcessedGroup,
} from './career-calendar.types'

/**
 * Resolve vertical overlaps between cards in a column
 */
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
        const shift =
          current.topPx +
          MIN_EXPERIENCE_HEIGHT_PX +
          VERTICAL_GAP_PX -
          next.topPx
        for (let j = i + 1; j < cards.length; j++) {
          cards[j].topPx += shift
        }
      }
    }
  }
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

    groups.push(group)
  }

  return groups
}

/**
 * Assign experiences to columns using greedy leftmost algorithm
 */
function assignColumns(
  experiences: Array<Experience>,
  now: Date,
): Array<Array<Experience>> {
  const sorted = [...experiences].sort(
    (a, b) => a.startDateParsed.getTime() - b.startDateParsed.getTime(),
  )

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

  return columnContents
}

/**
 * Process experiences into groups with columns and positioned cards
 */
export function processExperiences(
  experiences: Array<Experience>,
  totalHeightPx: number,
  timelineStart: Date,
  timelineEnd: Date,
  now: Date,
): Array<ProcessedGroup> {
  if (experiences.length === 0) return []

  const rawGroups = buildOverlapGroups(experiences, now)
  const processedGroups: Array<ProcessedGroup> = []

  for (let groupIdx = 0; groupIdx < rawGroups.length; groupIdx++) {
    const columnContents = assignColumns(rawGroups[groupIdx], now)

    const columns: Array<ProcessedColumn> = []
    let groupTop = Infinity
    let groupBottom = 0

    for (let colIdx = 0; colIdx < columnContents.length; colIdx++) {
      const colExps = columnContents[colIdx]
      const hasRegular = colExps.some((e) => getCardType(e) === 'regular')

      const cards: Array<ProcessedCard> = colExps.map((exp) => {
        const { topPx, heightPx } = calculateVerticalPosition(
          exp,
          totalHeightPx,
          timelineStart,
          timelineEnd,
          now,
        )
        return {
          experience: exp,
          topPx,
          heightPx,
          column: colIdx,
          cardType: getCardType(exp),
        }
      })

      cards.sort((a, b) => a.topPx - b.topPx)
      resolveVerticalOverlaps(cards, now)

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
