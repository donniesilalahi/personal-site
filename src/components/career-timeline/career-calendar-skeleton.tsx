import { YEAR_HEIGHT_PX } from './career-calendar.constants'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface CareerCalendarSkeletonProps {
  yearCount: number
  className?: string
}

/**
 * Skeleton loading state for CareerCalendar.
 * Shown during the measurement phase while fixed-width cards are being measured.
 */
export function CareerCalendarSkeleton({
  yearCount,
  className,
}: CareerCalendarSkeletonProps) {
  const totalHeight = yearCount * YEAR_HEIGHT_PX

  return (
    <div
      className={cn(
        'border rounded-sm py-8 px-4 max-sm:py-4 max-sm:px-2 bg-neutral-50',
        className,
      )}
    >
      <div className="flex">
        {/* Year labels skeleton */}
        <div className="shrink-0 w-10 relative" style={{ height: totalHeight }}>
          {/* Ceiling year + each year lane bottom */}
          {Array.from({ length: yearCount + 1 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 flex items-center"
              style={{
                top: i * YEAR_HEIGHT_PX,
                transform: 'translateY(-50%)',
              }}
            >
              <Skeleton className="h-2.5 w-8" />
            </div>
          ))}
        </div>

        {/* Timeline container skeleton */}
        <div className="flex-1 relative pl-4" style={{ height: totalHeight }}>
          {/* Horizontal indicator lines */}
          {Array.from({ length: yearCount + 1 }).map((_, i) => (
            <div
              key={`line-${i}`}
              className="absolute h-px bg-border"
              style={{
                top: i * YEAR_HEIGHT_PX,
                left: 0,
                right: 0,
              }}
            />
          ))}

          {/* Experience cards skeleton container */}
          <div className="absolute top-0 bottom-0 left-4 right-0">
            {/* Primary card skeleton - larger, top area */}
            <Skeleton
              className="absolute rounded-sm"
              style={{
                top: 8,
                left: 0,
                right: 56,
                height: Math.min(totalHeight * 0.3, 80),
              }}
            />

            {/* Secondary card skeleton - middle area */}
            <Skeleton
              className="absolute rounded-sm"
              style={{
                top: Math.min(totalHeight * 0.35, 96),
                left: 0,
                width: '60%',
                height: Math.min(totalHeight * 0.25, 64),
              }}
            />

            {/* Deprioritized card skeleton - narrow, right side */}
            <Skeleton
              className="absolute rounded-sm"
              style={{
                top: Math.min(totalHeight * 0.2, 48),
                right: 0,
                width: 48,
                height: Math.min(totalHeight * 0.5, 120),
              }}
            />

            {/* Milestone skeleton - small, middle-right */}
            <Skeleton
              className="absolute rounded-sm"
              style={{
                top: Math.min(totalHeight * 0.45, 112),
                right: 56,
                width: 64,
                height: 16,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
