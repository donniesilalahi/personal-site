import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ProjectSectionHeadingProps {
  label: string
  currentIndex: number
  totalCount: number
  onPrevious: () => void
  onNext: () => void
  className?: string
}

export function ProjectSectionHeading({
  label,
  currentIndex,
  totalCount,
  onPrevious,
  onNext,
  className,
}: ProjectSectionHeadingProps) {
  const canGoPrevious = currentIndex > 0
  const canGoNext = currentIndex < totalCount - 1

  return (
    <div className={cn('flex items-center justify-between w-full', className)}>
      {/* Section Label */}
      <span className="text-xl font-normal text-secondary-foreground shrink-0 font-bricolage">
        {label}
      </span>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-1">
        <Button
          variant="secondary"
          size="sm"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="h-7 text-xs px-2 gap-1"
        >
          <ChevronLeft className="size-3" />
          <span>Back</span>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onNext}
          disabled={!canGoNext}
          className="h-7 text-xs px-2 gap-1"
        >
          <span>Next</span>
          <ChevronRight className="size-3" />
        </Button>
      </div>
    </div>
  )
}
