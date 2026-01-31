'use client'

import * as LucideIcons from 'lucide-react'
import type { Experience } from '@/lib/experiences'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/use-media-query'
import { SUBCATEGORY_COLORS } from '@/lib/experiences'

interface ExperienceDialogDrawerProps {
  experience: Experience
  open: boolean
  onOpenChange: (open: boolean) => void
  onExperienceChange: (experience: Experience) => void
  allExperiences: Array<Experience>
}

function formatDate(date: Date): string {
  return date
    .toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    .toUpperCase()
}

function formatDuration(startDate: Date, endDate: Date | null): string {
  const start = formatDate(startDate)
  const end = endDate ? formatDate(endDate) : 'PRESENT'
  return `${start} - ${end}`
}

export function ExperienceDialogDrawer({
  experience,
  open,
  onOpenChange,
  onExperienceChange,
  allExperiences,
}: ExperienceDialogDrawerProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const colors: any = SUBCATEGORY_COLORS[experience.subcategory]

  const currentIndex = allExperiences.findIndex((e) => e.id === experience.id)

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onExperienceChange(allExperiences[currentIndex - 1])
    }
  }

  const handleNext = () => {
    if (currentIndex < allExperiences.length - 1) {
      onExperienceChange(allExperiences[currentIndex + 1])
    }
  }

  const HeaderContent = (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          'size-8 flex items-center justify-center rounded-full',
          !experience.icon.trim() &&
            (experience.isCareerBreak
              ? 'bg-yellow-200'
              : experience.isMilestone
                ? 'bg-emerald-200'
                : 'bg-neutral-200'),
        )}
      >
        {experience.icon.trim() ? (
          <img
            src={experience.icon}
            alt={experience.company}
            className={cn('size-8 object-contain rounded-sm', colors.text)}
          />
        ) : (
          <div
            className={cn(
              'rounded-full shrink-0',
              experience.isCareerBreak
                ? 'bg-yellow-500'
                : experience.isMilestone
                  ? 'bg-emerald-500'
                  : 'bg-neutral-500',
            )}
            style={{ width: '12px', height: '12px' }}
          />
        )}
      </div>
      <div className="text-base">
        <span className="text-secondary-foreground">{experience.role}</span>
        <span className="text-[10px] font-bricolage text-secondary-foreground align-middle">
          {' '}
          @{' '}
        </span>
        {experience.companyWebsite ? (
          <a
            href={experience.companyWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary-foreground hover:underline inline-flex items-center gap-0.5"
          >
            {experience.company}
            <LucideIcons.ArrowUpRight className="size-3" />
          </a>
        ) : (
          <span className="text-secondary-foreground">{experience.company}</span>
        )}
      </div>
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
        <span>
          {formatDuration(experience.startDateParsed, experience.endDateParsed)}
        </span>
        <span className="text-muted-foreground">·</span>
        <span className="uppercase">{experience.subcategory}</span>
        <span className="text-muted-foreground">·</span>
        <span className="uppercase">
          {experience.arrangement.replace('-', ' ')}
        </span>
      </div>
    </div>
  )

  const ContentBody = (
    <MarkdownRenderer content={experience.description} />
  )

  const FooterContent = (
    <div className="flex items-center justify-between gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={currentIndex === 0}
      >
        <LucideIcons.ChevronLeft className="size-4" />
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevious}
        disabled={currentIndex === allExperiences.length - 1}
      >
        Next
        <LucideIcons.ChevronRight className="size-4" />
      </Button>
    </div>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col p-0 gap-0">
          <DialogHeader className="p-4">
            <DialogTitle className="sr-only">
              {experience.role} at {experience.company}
            </DialogTitle>
            <DialogDescription className="sr-only">
              View details about {experience.role} position at{' '}
              {experience.company}
            </DialogDescription>
            {HeaderContent}
          </DialogHeader>
          <Separator className="mb-0" />
          <div className="flex-1 overflow-y-auto p-4">{ContentBody}</div>
          <Separator className="mt-0" />
          <div className="p-4">{FooterContent}</div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh] flex flex-col">
        <DrawerHeader className="p-4 text-left">
          <DrawerTitle className="sr-only">
            {experience.role} at {experience.company}
          </DrawerTitle>
          <DrawerDescription className="sr-only">
            View details about {experience.role} position at{' '}
            {experience.company}
          </DrawerDescription>
          {HeaderContent}
        </DrawerHeader>
        <Separator className="mb-0" />
        <div className="flex-1 overflow-y-auto p-4">{ContentBody}</div>
        <Separator className="mt-0" />
        <div className="p-4 sticky bottom-0 bg-background">{FooterContent}</div>
      </DrawerContent>
    </Drawer>
  )
}
