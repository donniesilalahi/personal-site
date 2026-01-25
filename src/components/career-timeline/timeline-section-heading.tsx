import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface TimelineSectionHeadingProps {
  label: string
  totalExperience: string
  className?: string
}

export function TimelineSectionHeading({
  label,
  totalExperience,
  className,
}: TimelineSectionHeadingProps) {
  return (
    <div className={cn('flex items-center gap-3 w-full', className)}>
      {/* Section Label */}
      <span className="text-xl font-semibold text-muted-foreground shrink-0">
        {label}
      </span>

      {/* Divider Line */}
      <Separator className="flex-1 bg-border" />

      {/* Experience Duration */}
      <span className="text-sm text-muted-foreground shrink-0">
        {totalExperience}
      </span>
    </div>
  )
}
