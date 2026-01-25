import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import type { Experience } from '@/lib/experiences'
import { ExperienceEntryCard, MilestoneEntry } from './experience-entry-card'

interface CareerCalendarProps {
  experiences: Array<Experience>
  className?: string
}

/** Fixed height per year row in pixels */
const YEAR_ROW_HEIGHT_PX = 40

interface PositionedExperience {
  experience: Experience
  top: number // Absolute position from timeline start
  height: number // Total height spanning multiple years
  isShortDuration: boolean
  hasOverlap: boolean
  column: number // 0 = full, 1 = left, 2 = right
}

interface PositionedMilestone {
  experience: Experience
  top: number
}

/**
 * Check if two experiences overlap in time
 */
function experiencesOverlap(a: Experience, b: Experience): boolean {
  const aEnd = a.endDateParsed || new Date()
  const bEnd = b.endDateParsed || new Date()
  return a.startDateParsed <= bEnd && b.startDateParsed <= aEnd
}

/**
 * Career Calendar Component
 * Displays experiences in a single-lane vertical calendar with fixed year rows
 * Experience cards span across year boundaries based on their actual duration
 */
export function CareerCalendar({
  experiences,
  className,
}: CareerCalendarProps) {
  // Separate regular experiences from milestones
  const regularExperiences = useMemo(
    () =>
      experiences
        .filter((e) => !e.isMilestone)
        .sort(
          (a, b) => b.startDateParsed.getTime() - a.startDateParsed.getTime(),
        ),
    [experiences],
  )

  const milestones = useMemo(
    () =>
      experiences
        .filter((e) => e.isMilestone)
        .sort(
          (a, b) => b.startDateParsed.getTime() - a.startDateParsed.getTime(),
        ),
    [experiences],
  )

  // Calculate year range (newest first, descending order)
  const { years, timelineStartYear, timelineEndYear } = useMemo(() => {
    const allExperiences = [...regularExperiences, ...milestones]
    if (allExperiences.length === 0) {
      const now = new Date().getFullYear()
      return { years: [now], timelineStartYear: now, timelineEndYear: now }
    }

    let minYear = Infinity
    let maxYear = -Infinity

    for (const exp of allExperiences) {
      const startYear = exp.startDateParsed.getFullYear()
      const endYear =
        exp.endDateParsed?.getFullYear() ?? new Date().getFullYear()
      if (startYear < minYear) minYear = startYear
      if (endYear > maxYear) maxYear = endYear
    }

    // Years in descending order (newest at top)
    const yearList: Array<number> = []
    for (let y = maxYear; y >= minYear; y--) {
      yearList.push(y)
    }

    return {
      years: yearList,
      timelineStartYear: maxYear, // Top of timeline
      timelineEndYear: minYear, // Bottom of timeline
    }
  }, [regularExperiences, milestones])

  // Total timeline height
  const totalHeight = years.length * YEAR_ROW_HEIGHT_PX

  // Calculate year offset from top (year at top = 0)
  const getYearOffset = (year: number): number => {
    return (timelineStartYear - year) * YEAR_ROW_HEIGHT_PX
  }

  // Calculate position for an experience based on its dates
  // Timeline is displayed newest (top) to oldest (bottom)
  // Year row = 40px. Each year label marks the START of that year.
  // So 2026 line is at top=0, 2025 line at top=40, etc.
  const getExperiencePosition = (
    exp: Experience,
  ): { top: number; height: number } => {
    const endDate = exp.endDateParsed || new Date()
    const endYear = endDate.getFullYear()
    const endMonth = endDate.getMonth() // 0-11

    const startYear = exp.startDateParsed.getFullYear()
    const startMonth = exp.startDateParsed.getMonth() // 0-11

    // Top position: where the experience ENDS (newest point)
    // If ends in Jan 2026 (month 0), and timeline starts at 2026, top = 0
    // If ends in Dec 2025 (month 11), top = (2026-2025) * 40 - (11/12) * 40 = 40 - 36.67 = 3.33px
    const yearsFromTop = timelineStartYear - endYear
    const monthFractionFromYearStart = endMonth / 12
    const top = Math.max(
      0,
      (yearsFromTop - monthFractionFromYearStart) * YEAR_ROW_HEIGHT_PX,
    )

    // Bottom position: where the experience STARTS (oldest point)
    const startYearsFromTop = timelineStartYear - startYear
    const startMonthFraction = startMonth / 12
    const bottom = (startYearsFromTop - startMonthFraction + 1) * YEAR_ROW_HEIGHT_PX

    // Height: from top to bottom
    const height = Math.max(bottom - top, 32)

    return { top, height }
  }

  // Position experiences with overlap detection
  // When experiences overlap, put them side by side
  const positionedExperiences: Array<PositionedExperience> = useMemo(() => {
    const positioned: Array<PositionedExperience> = []

    // Sort by end date (newest first) to process in timeline order
    const sortedExperiences = [...regularExperiences].sort((a, b) => {
      const aEnd = a.endDateParsed || new Date()
      const bEnd = b.endDateParsed || new Date()
      return bEnd.getTime() - aEnd.getTime()
    })

    for (const exp of sortedExperiences) {
      const { top, height } = getExperiencePosition(exp)
      const isShortDuration = exp.durationMonths < 12

      // Check for overlaps with already positioned experiences
      const overlapping = positioned.filter((p) =>
        experiencesOverlap(exp, p.experience),
      )

      let column = 0 // Full width by default
      const hasOverlap = overlapping.length > 0

      if (hasOverlap) {
        // Count already assigned columns
        const leftCount = overlapping.filter((p) => p.column === 1).length
        const rightCount = overlapping.filter((p) => p.column === 2).length
        const fullCount = overlapping.filter((p) => p.column === 0).length

        // If there are full-width entries, they need to be split
        if (fullCount > 0) {
          // Primary goes left, secondary goes right
          if (exp.category === 'primary') {
            column = 1
            for (const overlap of overlapping) {
              if (overlap.column === 0) {
                overlap.column = 2
                overlap.hasOverlap = true
              }
            }
          } else {
            column = 2
            for (const overlap of overlapping) {
              if (overlap.column === 0) {
                overlap.column = 1
                overlap.hasOverlap = true
              }
            }
          }
        } else {
          // Put in the less crowded column, preferring left for primary
          if (exp.category === 'primary') {
            column = leftCount <= rightCount ? 1 : 2
          } else {
            column = rightCount <= leftCount ? 2 : 1
          }
        }
      }

      positioned.push({
        experience: exp,
        top,
        height,
        isShortDuration,
        hasOverlap,
        column,
      })
    }

    return positioned
  }, [regularExperiences, timelineStartYear])

  // Position milestones
  const positionedMilestones: Array<PositionedMilestone> = useMemo(() => {
    return milestones.map((m) => {
      const year = m.startDateParsed.getFullYear()
      const month = m.startDateParsed.getMonth()
      const yearFromTop = timelineStartYear - year
      const monthOffset = month / 12
      const top = (yearFromTop + monthOffset) * YEAR_ROW_HEIGHT_PX

      return { experience: m, top }
    })
  }, [milestones, timelineStartYear])

  return (
    <div
      className={cn(
        'border rounded-lg p-4 max-sm:p-2 bg-background',
        className,
      )}
    >
      <div className="flex">
        {/* Year labels column */}
        <div className="flex flex-col shrink-0 w-10 relative">
          {years.map((year) => (
            <div
              key={year}
              className="h-10 flex items-start justify-end pr-2"
            >
              <span className="text-[8px] font-medium text-muted-foreground leading-none pt-0.5">
                {year}
              </span>
            </div>
          ))}
        </div>

        {/* Timeline container with horizontal lines and cards */}
        <div className="flex-1 relative" style={{ height: totalHeight }}>
          {/* Horizontal year divider lines (lined journal style) */}
          {years.map((year) => {
            const top = getYearOffset(year)
            return (
              <div
                key={`line-${year}`}
                className="absolute left-0 right-0 h-px bg-border"
                style={{ top }}
              />
            )
          })}
          {/* Bottom line */}
          <div
            className="absolute left-0 right-0 h-px bg-border"
            style={{ top: totalHeight }}
          />

          {/* Experience cards */}
          {positionedExperiences.map((entry, index) => (
            <div
              key={entry.experience.id}
              className={cn(
                'absolute px-0.5',
                entry.column === 0 && 'left-0 right-0',
                entry.column === 1 && 'left-0 w-1/2 pr-0.5',
                entry.column === 2 && 'left-1/2 w-1/2 pl-0.5',
              )}
              style={{
                top: entry.top,
                height: entry.height,
                zIndex: positionedExperiences.length - index, // Newer experiences on top
              }}
            >
              <ExperienceEntryCard
                experience={entry.experience}
                isShortDuration={entry.isShortDuration}
                hasOverlap={entry.hasOverlap}
                className="h-full"
              />
            </div>
          ))}

          {/* Milestones */}
          {positionedMilestones.map((m) => (
            <div
              key={m.experience.id}
              className="absolute left-0"
              style={{ top: m.top }}
            >
              <MilestoneEntry experience={m.experience} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
