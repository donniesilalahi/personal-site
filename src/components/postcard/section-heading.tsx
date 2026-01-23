import { Maximize2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
      <span className="text-sm text-primitives-colors-gray-light-mode-600 shrink-0">
        {label}
      </span>

      {/* Divider Line */}
      <div className="flex-1 h-px bg-primitives-colors-gray-light-mode-300" />

      {/* CTA Buttons */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onFlip}>
          <RotateCcw className="size-4" />
          Flip
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={onExpand}
          className="bg-primitives-colors-gray-light-mode-800 hover:bg-primitives-colors-gray-light-mode-900"
        >
          <Maximize2 className="size-4" />
          Expand
        </Button>
      </div>
    </div>
  )
}
