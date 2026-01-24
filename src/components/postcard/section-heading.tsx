import { Expand, FlipHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  label: string
  onExpand?: () => void
  onFlip?: () => void
  className?: string
}

export function SectionHeading({
  label,
  onExpand,
  onFlip,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('flex items-center gap-3 w-full', className)}>
      {/* Section Label */}
      <span className="text-xl font-semibold text-muted-foreground shrink-0">
        {label}
      </span>

      {/* Divider Line */}
      <Separator className="flex-1 bg-border" />

      {/* CTA Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={onExpand}
          className="hidden sm:flex"
        >
          <Expand className="size-4" />
          Expand
        </Button>
        <Button variant="default" size="sm" onClick={onFlip}>
          <FlipHorizontal className="size-4" />
          Flip
        </Button>
      </div>
    </div>
  )
}
