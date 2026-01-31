import type { Writing } from '@/lib/writings'
import { WritingCard } from './writing-card'
import { cn } from '@/lib/utils'

interface WritingListProps {
  writings: Writing[]
  from?: 'home' | 'writings'
  emptyMessage?: string
  className?: string
}

export function WritingList({
  writings,
  from = 'home',
  emptyMessage = 'No writings yet. Check back soon!',
  className,
}: WritingListProps) {
  return (
    <div className={cn('border border-neutral-200 rounded-sm p-2', className)}>
      {writings.length > 0 ? (
        <ul>
          {writings.map((writing) => (
            <li key={writing.id}>
              <WritingCard writing={writing} from={from} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground py-4 text-center">
          {emptyMessage}
        </p>
      )}
    </div>
  )
}
