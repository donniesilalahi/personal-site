'use client'

import * as React from 'react'
import * as LucideIcons from 'lucide-react'
import ReactMarkdown from 'react-markdown'
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
import { Badge } from '@/components/ui/badge'
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

type LucideIconComponent = React.ComponentType<{ className?: string }>

function getIconComponent(iconName: string): LucideIconComponent | null {
  const pascalCase = iconName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')

  const icons = LucideIcons as Record<string, any>
  const IconComponent = icons[pascalCase] as LucideIconComponent | undefined
  return IconComponent || null
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
  const IconComponent = getIconComponent(experience.icon)
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
      <div className="flex items-center gap-1.5">
        {IconComponent && (
          <IconComponent className={cn('size-5', colors.text)} />
        )}
        {experience.companyWebsite ? (
          <a
            href={experience.companyWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium hover:underline flex items-center gap-0.5"
          >
            {experience.company}
            <LucideIcons.ArrowUpRight className="size-3" />
          </a>
        ) : (
          <span className="text-sm font-medium">{experience.company}</span>
        )}
      </div>
      <div className="text-sm">{experience.role}</div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="uppercase">
          {experience.arrangement.replace('-', ' ')}
        </span>
        <span className="text-muted-foreground">·</span>
        <span>
          {formatDuration(experience.startDateParsed, experience.endDateParsed)}
        </span>
        <span className="text-muted-foreground">·</span>
        <Badge variant="outline" className="text-[10px] py-0.5 px-2">
          {experience.subcategory.toUpperCase()}
        </Badge>
      </div>
    </div>
  )

  const ContentBody = (
    <div className="prose prose-sm max-w-none dark:prose-invert prose-p:text-muted-foreground prose-h2:text-foreground prose-h2:font-semibold prose-h2:text-base prose-h2:mt-6 prose-h2:mb-3">
      <ReactMarkdown>{experience.description}</ReactMarkdown>
    </div>
  )

  const FooterContent = (
    <div className="flex items-center justify-between gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevious}
        disabled={currentIndex === 0}
      >
        <LucideIcons.ChevronLeft className="size-4" />
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
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
          <DialogHeader className="p-6 pb-4">
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
          <div className="flex-1 overflow-y-auto p-6">{ContentBody}</div>
          <Separator className="mt-0" />
          <div className="p-4">{FooterContent}</div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh] flex flex-col">
        <DrawerHeader className="p-4 pb-3">
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
        <div className="flex-1 overflow-y-auto px-4 py-4">{ContentBody}</div>
        <Separator className="mt-0" />
        <div className="p-4 sticky bottom-0 bg-background">{FooterContent}</div>
      </DrawerContent>
    </Drawer>
  )
}
