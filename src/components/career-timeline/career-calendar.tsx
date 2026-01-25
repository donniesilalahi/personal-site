import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import type { Experience, ExperienceCategory } from '@/lib/experiences'
import { LANE_LABELS } from '@/lib/experiences'
import { ExperienceEntryCard, MilestoneEntry } from './experience-entry-card'

interface CareerCalendarProps {
  experiences: Experience[]
  className?: string
}

/** Height per month in pixels */
const MONTH_HEIGHT_PX = 24

/** Minimum height for an entry card */
const MIN_ENTRY_HEIGHT_PX = 48

/** Threshold for compact mode (less than 3 months) */
const COMPACT_THRESHOLD_MONTHS = 3

interface TimelineRow {
  year: number
  months: number // Number of months in this year to display
}

interface PositionedExperience {
  experience: Experience
  top: number // Offset from timeline start in pixels
  height: number // Height in pixels
  isCompact: boolean // Whether to use compact layout
  spansBothLanes: boolean // Whether this entry spans both lanes
  lanePosition: 'left' | 'right' | 'full' // Position within lane for side-by-side
}

interface LaneData {
  category: ExperienceCategory
  label: string
  entries: PositionedExperience[]
}

/**
 * Check if two date ranges overlap
 */
function dateRangesOverlap(
  start1: Date,
  end1: Date | null,
  start2: Date,
  end2: Date | null,
): boolean {
  const effectiveEnd1 = end1 || new Date()
  const effectiveEnd2 = end2 || new Date()

  return start1 <= effectiveEnd2 && start2 <= effectiveEnd1
}

/**
 * Calculate the pixel offset from the timeline start
 */
function calculateTopOffset(startDate: Date, timelineStartDate: Date): number {
  const monthsDiff =
    (startDate.getFullYear() - timelineStartDate.getFullYear()) * 12 +
    (startDate.getMonth() - timelineStartDate.getMonth())
  return monthsDiff * MONTH_HEIGHT_PX
}

/**
 * Process experiences into positioned entries for a lane
 */
function processLaneExperiences(
  experiences: Experience[],
  timelineStartDate: Date,
  otherLaneExperiences: Experience[],
): PositionedExperience[] {
  const positioned: PositionedExperience[] = []

  for (const exp of experiences) {
    const top = calculateTopOffset(exp.startDateParsed, timelineStartDate)
    const rawHeight = exp.durationMonths * MONTH_HEIGHT_PX
    const height = Math.max(rawHeight, MIN_ENTRY_HEIGHT_PX)
    const isCompact = exp.durationMonths < COMPACT_THRESHOLD_MONTHS

    // Check if this experience overlaps with any in the other lane
    const hasOverlapWithOtherLane = otherLaneExperiences.some((other) =>
      dateRangesOverlap(
        exp.startDateParsed,
        exp.endDateParsed,
        other.startDateParsed,
        other.endDateParsed,
      ),
    )

    // Spans both lanes if no overlap with other lane
    const spansBothLanes = !hasOverlapWithOtherLane

    // Check for overlaps within the same lane for side-by-side placement
    const overlappingInLane = positioned.filter((p) =>
      dateRangesOverlap(
        exp.startDateParsed,
        exp.endDateParsed,
        p.experience.startDateParsed,
        p.experience.endDateParsed,
      ),
    )

    let lanePosition: 'left' | 'right' | 'full' = 'full'
    if (overlappingInLane.length > 0) {
      // Check which positions are taken
      const hasLeft = overlappingInLane.some((p) => p.lanePosition === 'left')
      const hasRight = overlappingInLane.some((p) => p.lanePosition === 'right')

      if (!hasLeft) {
        lanePosition = 'left'
      } else if (!hasRight) {
        lanePosition = 'right'
      } else {
        // Both positions taken, stack on the right
        lanePosition = 'right'
      }

      // Update overlapping entries to split position if they were full
      for (const overlap of overlappingInLane) {
        if (overlap.lanePosition === 'full') {
          overlap.lanePosition = 'left'
        }
      }
    }

    positioned.push({
      experience: exp,
      top,
      height,
      isCompact,
      spansBothLanes,
      lanePosition: spansBothLanes ? 'full' : lanePosition,
    })
  }

  return positioned
}

/**
 * Career Calendar Component
 * Displays experiences in a vertical calendar/timeline view
 */
export function CareerCalendar({
  experiences,
  className,
}: CareerCalendarProps) {
  // Separate experiences by category
  const primaryExperiences = useMemo(
    () =>
      experiences
        .filter((e) => e.category === 'primary' && !e.isMilestone)
        .sort(
          (a, b) => a.startDateParsed.getTime() - b.startDateParsed.getTime(),
        ),
    [experiences],
  )

  const secondaryExperiences = useMemo(
    () =>
      experiences
        .filter((e) => e.category === 'secondary' && !e.isMilestone)
        .sort(
          (a, b) => a.startDateParsed.getTime() - b.startDateParsed.getTime(),
        ),
    [experiences],
  )

  const milestones = useMemo(
    () =>
      experiences
        .filter((e) => e.isMilestone)
        .sort(
          (a, b) => a.startDateParsed.getTime() - b.startDateParsed.getTime(),
        ),
    [experiences],
  )

  // Calculate timeline range
  const { timelineStartDate, years } = useMemo(() => {
    const allExperiences = [
      ...primaryExperiences,
      ...secondaryExperiences,
      ...milestones,
    ]
    if (allExperiences.length === 0) {
      const now = new Date()
      return {
        timelineStartDate: new Date(now.getFullYear(), 0, 1),
        years: [{ year: now.getFullYear(), months: now.getMonth() + 1 }],
      }
    }

    // Find min start date and max end date
    let minStart = allExperiences[0].startDateParsed
    let maxEnd = allExperiences[0].endDateParsed || new Date()

    for (const exp of allExperiences) {
      if (exp.startDateParsed < minStart) minStart = exp.startDateParsed
      const end = exp.endDateParsed || new Date()
      if (end > maxEnd) maxEnd = end
    }

    // Normalize to start of year for cleaner display
    const startDate = new Date(minStart.getFullYear(), 0, 1)
    const endDate = maxEnd

    // Generate year rows
    const yearRows: TimelineRow[] = []
    for (let y = startDate.getFullYear(); y <= endDate.getFullYear(); y++) {
      const isFirstYear = y === startDate.getFullYear()
      const isLastYear = y === endDate.getFullYear()

      let monthsInYear = 12
      if (isFirstYear && isLastYear) {
        monthsInYear = endDate.getMonth() - startDate.getMonth() + 1
      } else if (isLastYear) {
        monthsInYear = endDate.getMonth() + 1
      }

      yearRows.push({ year: y, months: monthsInYear })
    }

    return {
      timelineStartDate: startDate,
      years: yearRows,
    }
  }, [primaryExperiences, secondaryExperiences, milestones])

  // Process positioned experiences for each lane
  const primaryLane: LaneData = useMemo(
    () => ({
      category: 'primary',
      label: LANE_LABELS.primary,
      entries: processLaneExperiences(
        primaryExperiences,
        timelineStartDate,
        secondaryExperiences,
      ),
    }),
    [primaryExperiences, secondaryExperiences, timelineStartDate],
  )

  const secondaryLane: LaneData = useMemo(
    () => ({
      category: 'secondary',
      label: LANE_LABELS.secondary,
      entries: processLaneExperiences(
        secondaryExperiences,
        timelineStartDate,
        primaryExperiences,
      ),
    }),
    [secondaryExperiences, primaryExperiences, timelineStartDate],
  )

  // Position milestones
  const positionedMilestones = useMemo(
    () =>
      milestones.map((m) => ({
        experience: m,
        top: calculateTopOffset(m.startDateParsed, timelineStartDate),
      })),
    [milestones, timelineStartDate],
  )

  // Calculate total timeline height
  const totalHeight = useMemo(() => {
    const totalMonths = years.reduce((acc, y) => acc + y.months, 0)
    return totalMonths * MONTH_HEIGHT_PX
  }, [years])

  return (
    <div className={cn('flex gap-4', className)}>
      {/* Year Timeline (leftmost) */}
      <div className="flex flex-col shrink-0 w-12">
        {years.map((yearRow) => (
          <div
            key={yearRow.year}
            className="flex items-start justify-end pr-2 text-sm font-medium text-muted-foreground"
            style={{ height: yearRow.months * MONTH_HEIGHT_PX }}
          >
            {yearRow.year}
          </div>
        ))}
      </div>

      {/* Timeline Line */}
      <div className="relative w-px bg-border shrink-0">
        {/* Milestones on the timeline */}
        {positionedMilestones.map((m) => (
          <div
            key={m.experience.id}
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: m.top }}
          >
            <MilestoneEntry experience={m.experience} />
          </div>
        ))}
      </div>

      {/* Lanes Container */}
      <div className="flex-1 flex gap-4">
        {/* Primary Lane (Work) */}
        <div className="flex-1 flex flex-col">
          <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
            {primaryLane.label}
          </div>
          <div className="relative" style={{ height: totalHeight }}>
            {primaryLane.entries.map((entry) => (
              <div
                key={entry.experience.id}
                className={cn(
                  'absolute',
                  entry.spansBothLanes ? 'left-0 right-0' : '',
                  !entry.spansBothLanes &&
                    entry.lanePosition === 'left' &&
                    'left-0 w-[48%]',
                  !entry.spansBothLanes &&
                    entry.lanePosition === 'right' &&
                    'right-0 w-[48%]',
                  !entry.spansBothLanes &&
                    entry.lanePosition === 'full' &&
                    'left-0 right-0',
                )}
                style={{
                  top: entry.top,
                  minHeight: entry.height,
                }}
              >
                <ExperienceEntryCard
                  experience={entry.experience}
                  isCompact={entry.isCompact}
                  className="h-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Lane (Hustle) */}
        <div className="flex-1 flex flex-col">
          <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
            {secondaryLane.label}
          </div>
          <div className="relative" style={{ height: totalHeight }}>
            {secondaryLane.entries.map((entry) => (
              <div
                key={entry.experience.id}
                className={cn(
                  'absolute',
                  entry.spansBothLanes ? 'left-0 right-0' : '',
                  !entry.spansBothLanes &&
                    entry.lanePosition === 'left' &&
                    'left-0 w-[48%]',
                  !entry.spansBothLanes &&
                    entry.lanePosition === 'right' &&
                    'right-0 w-[48%]',
                  !entry.spansBothLanes &&
                    entry.lanePosition === 'full' &&
                    'left-0 right-0',
                )}
                style={{
                  top: entry.top,
                  minHeight: entry.height,
                }}
              >
                <ExperienceEntryCard
                  experience={entry.experience}
                  isCompact={entry.isCompact}
                  className="h-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
