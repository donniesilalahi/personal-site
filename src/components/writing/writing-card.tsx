import { Link } from '@tanstack/react-router'
import type { Writing } from '@/lib/writings'
import { GROWTH_STAGE_ICONS } from '@/lib/writings'
import { cn } from '@/lib/utils'

interface WritingCardProps {
  writing: Writing
  className?: string
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

export function WritingCard({ writing, className }: WritingCardProps) {
  return (
    <Link
      to="/writing/$slug"
      params={{ slug: writing.slug }}
      className={cn(
        'group flex flex-col gap-1 py-4 border-b border-dashed border-neutral-200 last:border-b-0',
        'hover:bg-neutral-50/50 transition-colors -mx-2 px-2 rounded-sm',
        className,
      )}
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          {/* Growth stage icon */}
          <img
            src={GROWTH_STAGE_ICONS[writing.growthStage]}
            alt={writing.growthStage}
            className="w-5 h-5 shrink-0"
          />
          {/* Title */}
          <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
            {writing.title}
          </h3>
        </div>
        {/* Date */}
        <span className="text-sm text-muted-foreground shrink-0">
          {formatDate(writing.publishedAtParsed)}
        </span>
      </div>

      {/* Description (conditional) */}
      {writing.showDescription && writing.description && (
        <p className="text-sm text-muted-foreground pl-7 line-clamp-2">
          {writing.description}
        </p>
      )}
    </Link>
  )
}
