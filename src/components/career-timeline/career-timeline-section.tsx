import { TimelineSectionHeading } from './timeline-section-heading'
import { CareerCalendar } from './career-calendar'
import { cn } from '@/lib/utils'
import { calculateTotalExperience, getAllExperiences } from '@/lib/experiences'

interface CareerTimelineSectionProps {
  className?: string
}

/**
 * Career Timeline Section
 * Displays career experiences in a single-lane calendar-style vertical timeline
 */
export function CareerTimelineSection({
  className,
}: CareerTimelineSectionProps) {
  const experiences = getAllExperiences()
  const { formatted: totalExperience } = calculateTotalExperience()

  return (
    <section className={cn('flex flex-col gap-6', className)}>
      <TimelineSectionHeading
        label="Career timeline"
        totalExperience={totalExperience}
      />
      <CareerCalendar experiences={experiences} />
    </section>
  )
}
