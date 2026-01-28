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
// Positioned Card (for vertical positioning)
// ============================================================================

/** Card with calculated vertical position */
export interface PositionedCard {
  experience: Experience
  /** Top position in pixels from timeline top */
  topPx: number
  /** Height in pixels */
  heightPx: number
  /** Flex behavior: 'grow' for regular, 'content' for deprioritized/milestone */
  flexBehavior: 'grow' | 'content'
  /** Card type for rendering */
  cardType: 'regular' | 'deprioritized' | 'milestone'
  /** Whether this card is in an overlap group with others */
  hasOverlap: boolean
}

// ============================================================================
// Overlap Group (for horizontal layout via flexbox)
// ============================================================================

/** A group of cards that overlap in time */
export interface RenderedOverlapGroup {
  /** Unique ID for this group */
  id: string
  /** Top of the group (earliest end date = highest on timeline) */
  topPx: number
  /** Height of the group (from earliest start to latest end) */
  heightPx: number
  /** Cards in this group, sorted by start date (leftmost first) */
  cards: Array<PositionedCard>
}
