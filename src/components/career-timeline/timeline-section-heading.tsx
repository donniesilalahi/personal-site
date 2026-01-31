import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface TimelineSectionHeadingProps {
  label: string
  description?: string
  totalExperience: string
  className?: string
}

export function TimelineSectionHeading({
  label,
  description,
  totalExperience,
  className,
}: TimelineSectionHeadingProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center gap-3 w-full">
        {/* Section Label */}
        <span className="text-xl font-normal text-secondary-foreground shrink-0 font-bricolage">
          {label}
        </span>

        {/* Divider Line */}
        <Separator className="flex-1 bg-border" />

        {/* Experience Duration */}
        <span className="text-sm text-muted-foreground shrink-0">
          {totalExperience}
        </span>
      </div>

      {/* Section Description */}
      {description && (
        <p className="font-sans text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
