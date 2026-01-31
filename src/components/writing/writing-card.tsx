import { Link } from '@tanstack/react-router'
import type { Writing } from '@/lib/writings'
import { GROWTH_STAGE_ICONS, GROWTH_STAGE_LABELS } from '@/lib/writings'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface WritingCardProps {
  writing: Writing
  className?: string
  from?: 'home' | 'writings'
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

export function WritingCard({ writing, className, from = 'home' }: WritingCardProps) {
  return (
    <Link
      to="/writing/$slug"
      params={{ slug: writing.slug }}
      search={{ from }}
      className={cn(
        'group flex flex-col gap-1 p-4 rounded-sm',
        'hover:bg-neutral-100 transition-colors',
        className,
      )}
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          {/* Growth stage icon with tooltip */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <img
                  src={GROWTH_STAGE_ICONS[writing.growthStage]}
                  alt={writing.growthStage}
                  className="size-4 shrink-0"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{GROWTH_STAGE_LABELS[writing.growthStage]}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {/* Title */}
          <h3 className="font-normal text-foreground truncate group-hover:text-primary transition-colors">
            {writing.title}
          </h3>
        </div>
        {/* Date */}
        <span className="text-xs text-muted-foreground shrink-0 uppercase">
          {formatDate(writing.publishedAtParsed)}
        </span>
      </div>

      {/* Description (conditional) */}
      {writing.showDescription && writing.description && (
        <p className="text-sm text-muted-foreground pl-5 line-clamp-2">
          {writing.description}
        </p>
      )}
    </Link>
  )
}
