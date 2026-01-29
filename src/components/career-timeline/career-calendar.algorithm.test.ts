/**
 * Tests for Career Calendar Positioning Algorithm
 *
 * Key behaviors:
 * 1. Experiences are grouped by overlap (connected components)
 * 2. Within each group, cards are sorted by start date ASC (earlier = leftmost)
 * 3. Regular cards have flexBehavior: 'grow' (flex: 1 1 0)
 * 4. Deprioritized/milestone cards have flexBehavior: 'content' (flex: 0 0 auto)
 */

import { describe, expect, it } from 'vitest'
import {
  calculatePositioning,
  getFixedWidthExperiences,
} from './career-calendar.algorithm'
import type { Experience } from '@/lib/experiences'

// Helper to create test experiences
function createExperience(
  id: string,
  startDate: string,
  endDate: string | null,
  options?: {
    isMilestone?: boolean
    isDeprioritized?: boolean
  },
): Experience {
  const startDateParsed = new Date(startDate)
  const endDateParsed = endDate ? new Date(endDate) : null

  const end = endDateParsed ?? new Date()
  const durationMonths =
    (end.getFullYear() - startDateParsed.getFullYear()) * 12 +
    (end.getMonth() - startDateParsed.getMonth())

  return {
    id,
    role: `Role ${id}`,
    company: `Company ${id}`,
    startDate,
    endDate: endDate ?? '',
    companyWebsite: '',
    category: 'primary' as const,
    subcategory: 'work' as const,
    arrangement: 'full-time' as const,
    icon: 'briefcase',
    location: '',
    isMilestone: options?.isMilestone ?? false,
    isDeprioritized: options?.isDeprioritized ?? false,
    description: '',
    startDateParsed,
    endDateParsed,
    durationMonths,
  }
}

describe('Career Calendar Positioning Algorithm', () => {
  const now = new Date('2024-12-31')

  describe('Overlap Groups', () => {
    it('should create separate groups for non-overlapping experiences', () => {
      const experiences = [
        createExperience('A', '2020-01-01', '2021-01-01'),
        createExperience('B', '2022-01-01', '2023-01-01'),
      ]

      const result = calculatePositioning(experiences, now)

      // Should create 2 groups (no overlap)
      expect(result.groups.length).toBe(2)

      // Each group should have 1 card
      expect(result.groups[0].cards.length).toBe(1)
      expect(result.groups[1].cards.length).toBe(1)

      // Both should be solo groups
      expect(result.groups[0].isSolo).toBe(true)
      expect(result.groups[1].isSolo).toBe(true)
    })

    it('should group overlapping experiences together', () => {
      const experiences = [
        createExperience('A', '2020-01-01', '2021-06-01'),
        createExperience('B', '2021-01-01', '2022-01-01'),
      ]

      const result = calculatePositioning(experiences, now)

      // Should create 1 group (overlap)
      expect(result.groups.length).toBe(1)
      expect(result.groups[0].cards.length).toBe(2)
      expect(result.groups[0].isSolo).toBe(false)
    })

    it('should handle transitive overlaps', () => {
      // A overlaps B, B overlaps C, so all three should be in same group
      const experiences = [
        createExperience('A', '2020-01-01', '2020-06-01'),
        createExperience('B', '2020-05-01', '2020-10-01'),
        createExperience('C', '2020-09-01', '2021-01-01'),
      ]

      const result = calculatePositioning(experiences, now)

      expect(result.groups.length).toBe(1)
      expect(result.groups[0].cards.length).toBe(3)
    })
  })

  describe('Card Ordering (Earlier Start = Leftmost)', () => {
    it('should order cards by start date ascending', () => {
      const experiences = [
        createExperience('C', '2020-07-01', '2021-01-01'), // Third
        createExperience('A', '2020-01-01', '2021-01-01'), // First
        createExperience('B', '2020-04-01', '2021-01-01'), // Second
      ]

      const result = calculatePositioning(experiences, now)

      // All should be in one group
      expect(result.groups.length).toBe(1)
      const group = result.groups[0]

      // Cards should be sorted by start date
      expect(group.cards[0].experience.id).toBe('A')
      expect(group.cards[0].order).toBe(0)
      expect(group.cards[1].experience.id).toBe('B')
      expect(group.cards[1].order).toBe(1)
      expect(group.cards[2].experience.id).toBe('C')
      expect(group.cards[2].order).toBe(2)
    })

    it('should maintain order for real-world scenario: Aspire, Katalis, TEDx', () => {
      // Aspire starts first (May 2019), should be leftmost
      // Katalis starts second (June 2019)
      // TEDx starts last (Nov 2019)
      const experiences = [
        createExperience('tedx', '2019-11-01', '2020-02-01', {
          isDeprioritized: true,
        }),
        createExperience('aspire', '2019-05-01', '2020-06-01'),
        createExperience('katalis', '2019-06-01', '2020-02-01'),
      ]

      const result = calculatePositioning(experiences, now)

      const group = result.groups[0]
      expect(group.cards[0].experience.id).toBe('aspire') // Leftmost
      expect(group.cards[1].experience.id).toBe('katalis')
      expect(group.cards[2].experience.id).toBe('tedx') // Rightmost
    })
  })

  describe('Flex Behavior', () => {
    it('should assign grow behavior to regular cards', () => {
      const experiences = [
        createExperience('regular', '2020-01-01', '2021-01-01'),
      ]

      const result = calculatePositioning(experiences, now)

      expect(result.groups[0].cards[0].flexBehavior).toBe('grow')
      expect(result.groups[0].cards[0].cardType).toBe('regular')
    })

    it('should assign content behavior to deprioritized cards', () => {
      const experiences = [
        createExperience('dep', '2020-01-01', '2021-01-01', {
          isDeprioritized: true,
        }),
      ]

      const result = calculatePositioning(experiences, now)

      expect(result.groups[0].cards[0].flexBehavior).toBe('content')
      expect(result.groups[0].cards[0].cardType).toBe('deprioritized')
    })

    it('should assign content behavior to milestone cards', () => {
      const experiences = [
        createExperience('milestone', '2020-06-01', '2020-06-01', {
          isMilestone: true,
        }),
      ]

      const result = calculatePositioning(experiences, now)

      expect(result.groups[0].cards[0].flexBehavior).toBe('content')
      expect(result.groups[0].cards[0].cardType).toBe('milestone')
    })

    it('should handle mixed card types in overlap group', () => {
      const experiences = [
        createExperience('regular', '2020-01-01', '2021-01-01'),
        createExperience('dep', '2020-03-01', '2020-10-01', {
          isDeprioritized: true,
        }),
        createExperience('milestone', '2020-06-01', '2020-06-01', {
          isMilestone: true,
        }),
      ]

      const result = calculatePositioning(experiences, now)

      const group = result.groups[0]
      expect(group.cards.length).toBe(3)

      // Regular should be first (earliest start)
      expect(group.cards[0].cardType).toBe('regular')
      expect(group.cards[0].flexBehavior).toBe('grow')

      // Deprioritized second
      expect(group.cards[1].cardType).toBe('deprioritized')
      expect(group.cards[1].flexBehavior).toBe('content')

      // Milestone last
      expect(group.cards[2].cardType).toBe('milestone')
      expect(group.cards[2].flexBehavior).toBe('content')
    })
  })

  describe('experienceToGroup mapping', () => {
    it('should correctly map experiences to their groups', () => {
      const experiences = [
        createExperience('A', '2020-01-01', '2021-01-01'),
        createExperience('B', '2020-06-01', '2021-01-01'),
        createExperience('C', '2023-01-01', '2024-01-01'),
      ]

      const result = calculatePositioning(experiences, now)

      // A and B should be in same group
      const groupA = result.experienceToGroup.get('A')
      const groupB = result.experienceToGroup.get('B')
      const groupC = result.experienceToGroup.get('C')

      expect(groupA).toBe(groupB) // Same group
      expect(groupA).not.toBe(groupC) // Different groups
    })
  })

  describe('Edge cases', () => {
    it('should handle single experience', () => {
      const experiences = [createExperience('solo', '2020-01-01', '2022-01-01')]

      const result = calculatePositioning(experiences, now)

      expect(result.groups.length).toBe(1)
      expect(result.groups[0].isSolo).toBe(true)
      expect(result.groups[0].cards[0].order).toBe(0)
    })

    it('should handle empty array', () => {
      const result = calculatePositioning([], now)

      expect(result.groups.length).toBe(0)
      expect(result.experienceToGroup.size).toBe(0)
    })

    it('should handle ongoing experiences (null end date)', () => {
      const experiences = [
        createExperience('past', '2020-01-01', '2022-01-01'),
        createExperience('ongoing', '2021-01-01', null),
      ]

      const result = calculatePositioning(experiences, now)

      // Should be in same group (they overlap)
      expect(result.groups.length).toBe(1)
      expect(result.groups[0].cards.length).toBe(2)

      // Past started earlier, should be first
      expect(result.groups[0].cards[0].experience.id).toBe('past')
      expect(result.groups[0].cards[1].experience.id).toBe('ongoing')
    })
  })

  describe('Fixed-width experiences helper', () => {
    it('should identify deprioritized and milestone cards', () => {
      const experiences = [
        createExperience('regular', '2020-01-01', '2021-01-01'),
        createExperience('dep', '2020-01-01', '2021-01-01', {
          isDeprioritized: true,
        }),
        createExperience('milestone', '2020-06-01', '2020-06-01', {
          isMilestone: true,
        }),
      ]

      const fixedWidth = getFixedWidthExperiences(experiences)

      expect(fixedWidth.length).toBe(2)
      expect(fixedWidth.some((e) => e.experience.id === 'dep')).toBe(true)
      expect(fixedWidth.some((e) => e.experience.id === 'milestone')).toBe(true)
      expect(fixedWidth.some((e) => e.experience.id === 'regular')).toBe(false)
    })

    it('should return correct card types', () => {
      const experiences = [
        createExperience('dep', '2020-01-01', '2021-01-01', {
          isDeprioritized: true,
        }),
        createExperience('milestone', '2020-06-01', '2020-06-01', {
          isMilestone: true,
        }),
      ]

      const fixedWidth = getFixedWidthExperiences(experiences)

      const dep = fixedWidth.find((e) => e.experience.id === 'dep')
      const milestone = fixedWidth.find((e) => e.experience.id === 'milestone')

      expect(dep?.cardType).toBe('deprioritized')
      expect(milestone?.cardType).toBe('milestone')
    })

    it('should return empty array for no fixed-width cards', () => {
      const experiences = [
        createExperience('A', '2020-01-01', '2021-01-01'),
        createExperience('B', '2021-01-01', '2022-01-01'),
      ]

      const fixedWidth = getFixedWidthExperiences(experiences)

      expect(fixedWidth.length).toBe(0)
    })
  })
})
