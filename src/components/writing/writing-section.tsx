'use client'

import { WritingSectionHeading } from './writing-section-heading'
import { WritingList } from './writing-list'
import { getRecentWritings } from '@/lib/writings'
import { cn } from '@/lib/utils'

interface WritingSectionProps {
  className?: string
}

export function WritingSection({ className }: WritingSectionProps) {
  const writings = getRecentWritings(5)

  return (
    <section className={cn('flex flex-col gap-6', className)}>
      <WritingSectionHeading
        label="Writing"
        description="Thoughts, daily observation, and reflection on things I make"
      />
      <WritingList writings={writings} />
    </section>
  )
}
