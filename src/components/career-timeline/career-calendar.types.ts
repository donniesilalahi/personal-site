import type { Experience } from '@/lib/experiences'

// ============================================================================
// Component Props
// ============================================================================

export interface CareerCalendarProps {
  experiences: Array<Experience>
  className?: string
  onExperienceClick?: (experience: Experience) => void
}

// ============================================================================
// Timeline Bounds
// ============================================================================

export interface TimelineBounds {
  years: Array<number>
  ceilingYear: number
  timelineStart: Date
  timelineEnd: Date
}

// ============================================================================
// Card Types
// ============================================================================

export type CardType = 'regular' | 'deprioritized' | 'milestone'

export interface ProcessedCard {
  experience: Experience
  topPx: number
  heightPx: number
  column: number
  cardType: CardType
}

export interface ProcessedColumn {
  index: number
  isRegular: boolean
  cards: Array<ProcessedCard>
}

export interface ProcessedGroup {
  id: string
  topPx: number
  heightPx: number
  columns: Array<ProcessedColumn>
}
