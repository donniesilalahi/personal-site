'use client'

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
      <div className="size-8">
        {experience.icon?.trim() && (
          <img
            src={experience.icon}
            alt={experience.company}
            className={cn('size-8 object-contain rounded-sm', colors.text)}
          />
        )}
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-base">{experience.role}</span>
        <span className="text-[10px] font-bricolage text-muted-foreground">
          @
        </span>
        {experience.companyWebsite ? (
          <a
            href={experience.companyWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base hover:underline flex items-center gap-0.5"
          >
            {experience.company}
            <LucideIcons.ArrowUpRight className="size-3" />
          </a>
        ) : (
          <span className="text-base">{experience.company}</span>
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
    <div className="text-sm leading-relaxed">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl text-muted-foreground font-normal mt-6 mb-3">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl text-muted-foreground font-normal mt-6 mb-3">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl text-muted-foreground font-normal mt-6 mb-3">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg text-muted-foreground font-normal mt-6 mb-3">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-base text-muted-foreground font-normal mt-6 mb-3">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-sm text-muted-foreground font-normal mt-6 mb-3">
              {children}
            </h6>
          ),
          p: ({ children }) => (
            <p className="text-muted-foreground my-2">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-6 my-3 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 my-3 space-y-1">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-muted-foreground">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-muted-foreground/30 pl-4 italic text-muted-foreground my-3">
              {children}
            </blockquote>
          ),
          code: ({ className, children }) => {
            return className ? (
              <code className="block bg-muted-foreground/10 text-muted-foreground p-4 rounded-lg overflow-x-auto text-xs my-3">
                {children}
              </code>
            ) : (
              <code className="bg-muted-foreground/10 text-muted-foreground px-1.5 py-0.5 rounded text-xs">
                {children}
              </code>
            )
          },
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="text-foreground font-semibold">
              {children}
            </strong>
          ),
          hr: () => <hr className="border-muted-foreground/20 my-4" />,
        }}
      >
        {experience.description}
      </ReactMarkdown>
    </div>
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
        <DrawerHeader className="p-4">
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
