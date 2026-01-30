import { useMemo } from 'react'

import { GroupRenderer } from './career-calendar-group'
import { CareerCalendarSkeleton } from './career-calendar-skeleton'
import { YEAR_HEIGHT_PX } from './career-calendar.constants'
import { processExperiences } from './career-calendar.processing'
import { calculateTimelineBounds } from './career-calendar.utils'
import type { CareerCalendarProps } from './career-calendar.types'

import { cn } from '@/lib/utils'

export function CareerCalendar({
  experiences,
  className,
  onExperienceClick,
}: CareerCalendarProps) {
  const now = useMemo(() => new Date(), [])

  const { years, ceilingYear, timelineStart, timelineEnd } = useMemo(
    () => calculateTimelineBounds(experiences, now),
    [experiences, now],
  )

  const totalHeightPx = years.length * YEAR_HEIGHT_PX

  const processedGroups = useMemo(
    () =>
      processExperiences(
        experiences,
        totalHeightPx,
        timelineStart,
        timelineEnd,
        now,
      ),
    [experiences, totalHeightPx, timelineStart, timelineEnd, now],
  )

  if (experiences.length === 0) {
    return (
      <CareerCalendarSkeleton yearCount={years.length} className={className} />
    )
  }

  return (
    <div
      className={cn(
        'border rounded-sm py-8 px-4 max-sm:py-4 max-sm:px-2 bg-neutral-50 dark:bg-neutral-950',
        className,
      )}
    >
      <div className="flex">
        <YearLabels
          years={years}
          ceilingYear={ceilingYear}
          totalHeightPx={totalHeightPx}
        />
        <Timeline
          years={years}
          totalHeightPx={totalHeightPx}
          processedGroups={processedGroups}
          onExperienceClick={onExperienceClick}
        />
      </div>
    </div>
  )
}

interface YearLabelsProps {
  years: Array<number>
  ceilingYear: number
  totalHeightPx: number
}

function YearLabels({ years, ceilingYear, totalHeightPx }: YearLabelsProps) {
  return (
    <div className="shrink-0 w-10 relative" style={{ height: totalHeightPx }}>
      <YearLabel year={ceilingYear} topPx={0} />
      {years.map((year, index) => (
        <YearLabel
          key={year}
          year={year}
          topPx={(index + 1) * YEAR_HEIGHT_PX}
        />
      ))}
    </div>
  )
}

function YearLabel({ year, topPx }: { year: number; topPx: number }) {
  return (
    <div
      className="absolute left-0 right-0 flex items-center"
      style={{ top: topPx, transform: 'translateY(-50%)' }}
    >
      <span className="text-[10px] font-medium text-muted-foreground leading-none">
        {year}
      </span>
    </div>
  )
}

interface TimelineProps {
  years: Array<number>
  totalHeightPx: number
  processedGroups: ReturnType<typeof processExperiences>
  onExperienceClick?: CareerCalendarProps['onExperienceClick']
}

function Timeline({
  years,
  totalHeightPx,
  processedGroups,
  onExperienceClick,
}: TimelineProps) {
  return (
    <div
      className="flex-1 relative pl-4 max-sm:pl-2"
      style={{ height: totalHeightPx }}
    >
      <YearLines years={years} />
      <div className="absolute top-0 bottom-0 left-4 max-sm:left-2 right-0">
        {processedGroups.map((group) => (
          <GroupRenderer
            key={group.id}
            group={group}
            onExperienceClick={onExperienceClick}
          />
        ))}
      </div>
    </div>
  )
}

function YearLines({ years }: { years: Array<number> }) {
  return (
    <>
      <div
        className="absolute h-px bg-border"
        style={{ top: 0, left: 0, right: 0 }}
      />
      {years.map((year, index) => (
        <div
          key={`line-${year}`}
          className="absolute h-px bg-border"
          style={{ top: (index + 1) * YEAR_HEIGHT_PX, left: 0, right: 0 }}
        />
      ))}
    </>
  )
}
