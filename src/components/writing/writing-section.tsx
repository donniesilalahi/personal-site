'use client'

import { WritingSectionHeading } from './writing-section-heading'
import { WritingCard } from './writing-card'
import { getRecentWritings } from '@/lib/writings'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

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
      <Card className="border-none shadow-none bg-white rounded-lg">
        <CardContent className="p-4">
          {writings.length > 0 ? (
            writings.map((writing) => (
              <WritingCard key={writing.id} writing={writing} />
            ))
          ) : (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No writings yet. Check back soon!
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
