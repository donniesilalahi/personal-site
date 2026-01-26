'use client'

import { useState } from 'react'
import { TimelineSectionHeading } from './timeline-section-heading'
import { CareerCalendar } from './career-calendar'
import { ExperienceDialogDrawer } from './experience-dialog-drawer'
import type { Experience } from '@/lib/experiences'
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
  const [selectedExperience, setSelectedExperience] =
    useState<Experience | null>(null)
  const [open, setOpen] = useState(false)

  const handleExperienceClick = (experience: Experience) => {
    setSelectedExperience(experience)
    setOpen(true)
  }

  const handleExperienceChange = (experience: Experience) => {
    setSelectedExperience(experience)
  }

  return (
    <section className={cn('flex flex-col gap-6', className)}>
      <TimelineSectionHeading
        label="Career timeline"
        totalExperience={totalExperience}
      />
      <CareerCalendar
        experiences={experiences}
        onExperienceClick={handleExperienceClick}
      />
      {selectedExperience && (
        <ExperienceDialogDrawer
          experience={selectedExperience}
          open={open}
          onOpenChange={setOpen}
          onExperienceChange={handleExperienceChange}
          allExperiences={experiences}
        />
      )}
    </section>
  )
}
