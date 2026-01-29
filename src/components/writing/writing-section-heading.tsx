import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface WritingSectionHeadingProps {
  label: string
  description?: string
  className?: string
}

export function WritingSectionHeading({
  label,
  description,
  className,
}: WritingSectionHeadingProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center gap-3 w-full">
        {/* Section Label */}
        <span className="text-xl font-normal text-muted-foreground shrink-0">
          {label}
        </span>

        {/* View More Button */}
        <Button variant="outline" size="sm" asChild className="shrink-0">
          <Link to="/writings">View More</Link>
        </Button>
      </div>

      {/* Section Description */}
      {description && (
        <p className="font-sans text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
