import { cn } from '@/lib/utils'
import { getAllExperiences, calculateTotalExperience } from '@/lib/experiences'
import { TimelineSectionHeading } from './timeline-section-heading'
import { CareerCalendar } from './career-calendar'

interface CareerTimelineSectionProps {
  className?: string
}

/**
 * Career Timeline Section
 * Displays career experiences in a calendar-style vertical timeline
 *
 * Future: Will support different view modes (Calendar, Horizontal Timeline, Resume List)
 * v1 only implements Calendar view
 */
export function CareerTimelineSection({
  className,
}: CareerTimelineSectionProps) {
  const experiences = getAllExperiences()
  const { formatted: totalExperience } = calculateTotalExperience()

  return (
    <section className={cn('flex flex-col gap-6', className)}>
      {/* Section Heading */}
      <TimelineSectionHeading
        label="Career timeline"
        totalExperience={totalExperience}
      />

      {/* Calendar View (v1 only) */}
      <CareerCalendar experiences={experiences} />
    </section>
  )
}
