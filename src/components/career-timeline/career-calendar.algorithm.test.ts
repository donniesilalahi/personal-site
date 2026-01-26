/**
 * Tests for Google Calendar-style "Forward Packing" algorithm
 *
 * Test scenarios based on the Google Calendar reference image:
 * 1. Pure Vertical Stack (Test 7 + Test 8)
 * 2a. Side-by-Side Overlap (Test 3, Test 2, Test 4)
 * 2b. Partial Overlay - Early Starter (Test 1 vs Test 3+2+4 group)
 * 2ba. Early Starter Priority (Test 0 + Test 1)
 * 2c. Late Joiner Contained (Test 8 + Test 9)
 */

import { describe, expect, it } from 'vitest'
import { calculatePositioning } from './career-calendar.algorithm'
import type { Experience } from '@/lib/experiences'

// Helper to create test experiences
function createExperience(
  id: string,
  startDate: string,
  endDate: string | null,
): Experience {
  const startDateParsed = new Date(startDate)
  const endDateParsed = endDate ? new Date(endDate) : null

  // Calculate duration in months
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
    isMilestone: false,
    isDeprioritized: false,
    description: '',
    startDateParsed,
    endDateParsed,
    durationMonths,
  }
}

describe('Forward Packing Algorithm', () => {
  const now = new Date('2024-12-31')

  describe('Pattern 1: Pure Vertical Stack (no overlap)', () => {
    it('should give 100% width to non-overlapping events', () => {
      // Test 7: 2020-2021
      // Test 8: 2022-2023 (no overlap)
      const experiences = [
        createExperience('test7', '2020-01-01', '2021-01-01'),
        createExperience('test8', '2022-01-01', '2023-01-01'),
      ]

      const result = calculatePositioning(experiences, now)

      const test7 = result.get('test7')!
      const test8 = result.get('test8')!

      // Both should get full width (no concurrency)
      expect(test7.widthPercent).toBe(100)
      expect(test8.widthPercent).toBe(100)

      // Both should be in column 0 (reused)
      expect(test7.column).toBe(0)
      expect(test8.column).toBe(0)

      // Both should start at left edge
      expect(test7.leftPercent).toBe(0)
      expect(test8.leftPercent).toBe(0)
    })
  })

  describe('Pattern 2a: Side-by-Side Overlap (simultaneous start)', () => {
    it('should split width equally for overlapping events', () => {
      // Test 3, Test 2, Test 4 all overlap
      const experiences = [
        createExperience('test3', '2022-06-01', '2023-02-01'),
        createExperience('test2', '2022-06-15', '2023-01-01'),
        createExperience('test4', '2022-07-01', '2023-01-01'),
      ]

      const result = calculatePositioning(experiences, now)

      const test3 = result.get('test3')!
      const test2 = result.get('test2')!
      const test4 = result.get('test4')!

      // All three overlap, so max concurrency = 3
      // Each should get 33.33% width
      const expectedWidth = 100 / 3
      expect(test3.widthPercent).toBeCloseTo(expectedWidth, 1)
      expect(test2.widthPercent).toBeCloseTo(expectedWidth, 1)
      expect(test4.widthPercent).toBeCloseTo(expectedWidth, 1)

      // Columns assigned in start order: 0, 1, 2
      expect(test3.column).toBe(0)
      expect(test2.column).toBe(1)
      expect(test4.column).toBe(2)

      // Left positions based on column * width
      expect(test3.leftPercent).toBeCloseTo(0, 1)
      expect(test2.leftPercent).toBeCloseTo(expectedWidth, 1)
      expect(test4.leftPercent).toBeCloseTo(expectedWidth * 2, 1)
    })
  })

  describe('Pattern 2b/2ba: Early Starter Priority', () => {
    it('should give earlier starters lower column numbers', () => {
      // Test 0: starts first (2020), runs long
      // Test 1: starts later (2021), ends earlier
      const experiences = [
        createExperience('test0', '2020-01-01', '2024-06-01'),
        createExperience('test1', '2021-06-01', '2023-01-01'),
      ]

      const result = calculatePositioning(experiences, now)

      const test0 = result.get('test0')!
      const test1 = result.get('test1')!

      // Test 0 started first → column 0
      // Test 1 started later → column 1
      expect(test0.column).toBe(0)
      expect(test1.column).toBe(1)

      // Both overlap, so maxConcurrency = 2, each gets 50%
      expect(test0.widthPercent).toBe(50)
      expect(test1.widthPercent).toBe(50)

      // Left positions
      expect(test0.leftPercent).toBe(0)
      expect(test1.leftPercent).toBe(50)
    })

    it('should handle complex chain: early starter + later group', () => {
      // Test 0: 2020 - 2024 (starts first, full span)
      // Test 1: 2020-06 - 2023-06 (starts second)
      // Test 3, 2, 4: all start in 2021-06
      const experiences = [
        createExperience('test0', '2020-01-01', '2024-09-01'),
        createExperience('test1', '2020-06-01', '2023-06-01'),
        createExperience('test3', '2021-06-01', '2023-02-01'),
        createExperience('test2', '2021-06-15', '2023-01-01'),
        createExperience('test4', '2021-07-01', '2023-01-01'),
      ]

      const result = calculatePositioning(experiences, now)

      const test0 = result.get('test0')!
      const test1 = result.get('test1')!
      const test3 = result.get('test3')!
      const test2 = result.get('test2')!
      const test4 = result.get('test4')!

      // All 5 events overlap at some point (during 2021-06 to 2023-01)
      // So max concurrency = 5, each gets 20%
      expect(test0.widthPercent).toBe(20)
      expect(test1.widthPercent).toBe(20)
      expect(test3.widthPercent).toBe(20)
      expect(test2.widthPercent).toBe(20)
      expect(test4.widthPercent).toBe(20)

      // Columns assigned by start order
      expect(test0.column).toBe(0)
      expect(test1.column).toBe(1)
      expect(test3.column).toBe(2)
      expect(test2.column).toBe(3)
      expect(test4.column).toBe(4)

      // Left positions sequential
      expect(test0.leftPercent).toBe(0)
      expect(test1.leftPercent).toBe(20)
      expect(test3.leftPercent).toBe(40)
      expect(test2.leftPercent).toBe(60)
      expect(test4.leftPercent).toBe(80)
    })
  })

  describe('Pattern 2c: Late Joiner (contained within earlier event)', () => {
    it('should share width when events overlap', () => {
      // Test 8: 2022-01 - 2023-06 (starts first)
      // Test 9: 2023-01 - 2023-12 (starts later, partially overlaps)
      const experiences = [
        createExperience('test8', '2022-01-01', '2023-06-01'),
        createExperience('test9', '2023-01-01', '2023-12-01'),
      ]

      const result = calculatePositioning(experiences, now)

      const test8 = result.get('test8')!
      const test9 = result.get('test9')!

      // Both overlap during 2023-01 to 2023-06
      // Max concurrency = 2, each gets 50%
      expect(test8.widthPercent).toBe(50)
      expect(test9.widthPercent).toBe(50)

      // Columns
      expect(test8.column).toBe(0)
      expect(test9.column).toBe(1)

      // Left positions
      expect(test8.leftPercent).toBe(0)
      expect(test9.leftPercent).toBe(50)
    })
  })

  describe('Column assignment', () => {
    it('should reuse columns when possible', () => {
      // A: 2020-2021
      // B: 2020-06 - 2022 (overlaps A)
      // C: 2023-2024 (no overlap, can reuse column 0)
      const experiences = [
        createExperience('A', '2020-01-01', '2021-01-01'),
        createExperience('B', '2020-06-01', '2022-01-01'),
        createExperience('C', '2023-01-01', '2024-01-01'),
      ]

      const result = calculatePositioning(experiences, now)

      expect(result.get('A')!.column).toBe(0)
      expect(result.get('B')!.column).toBe(1)
      expect(result.get('C')!.column).toBe(0) // Reuses column 0

      // A and B overlap (2 concurrent), C is alone (1 concurrent)
      expect(result.get('A')!.widthPercent).toBe(50)
      expect(result.get('B')!.widthPercent).toBe(50)
      expect(result.get('C')!.widthPercent).toBe(100)
    })
  })

  describe('Edge cases', () => {
    it('should handle single event', () => {
      const experiences = [createExperience('solo', '2020-01-01', '2022-01-01')]

      const result = calculatePositioning(experiences, now)
      const solo = result.get('solo')!

      expect(solo.column).toBe(0)
      expect(solo.leftPercent).toBe(0)
      expect(solo.widthPercent).toBe(100)
    })

    it('should handle empty array', () => {
      const result = calculatePositioning([], now)
      expect(result.size).toBe(0)
    })

    it('should handle ongoing events (null end date)', () => {
      const experiences = [
        createExperience('past', '2020-01-01', '2022-01-01'),
        createExperience('ongoing', '2021-01-01', null),
      ]

      const result = calculatePositioning(experiences, now)

      // They overlap (past: 2020-2022, ongoing: 2021-now)
      expect(result.get('past')!.widthPercent).toBe(50)
      expect(result.get('ongoing')!.widthPercent).toBe(50)
    })
  })
})
