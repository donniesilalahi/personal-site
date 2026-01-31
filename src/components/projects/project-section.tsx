'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ProjectSectionHeading } from './project-section-heading'
import { ProjectCard } from './project-card'
import { getAllProjects } from '@/lib/projects'
import { cn } from '@/lib/utils'

interface ProjectSectionProps {
  className?: string
}

/**
 * Project section with horizontal carousel
 *
 * Features:
 * - One card takes ~80% of available width
 * - Next card's left edge is visible to hint at more content
 * - Navigation via heading buttons (Back/Next)
 * - Smooth scroll animation between slides
 */
export function ProjectSection({ className }: ProjectSectionProps) {
  const projects = getAllProjects()
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const scrollToIndex = useCallback((index: number) => {
    if (!carouselRef.current) return

    const container = carouselRef.current
    const cards = container.querySelectorAll('[data-project-card]')
    const targetCard = cards[index] as HTMLElement | undefined

    if (targetCard) {
      const containerRect = container.getBoundingClientRect()
      const cardRect = targetCard.getBoundingClientRect()

      // Calculate scroll position to center the card with some padding
      const scrollLeft = targetCard.offsetLeft - container.offsetLeft

      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      })
    }
  }, [])

  const handlePrevious = useCallback(() => {
    const newIndex = Math.max(0, currentIndex - 1)
    setCurrentIndex(newIndex)
    scrollToIndex(newIndex)
  }, [currentIndex, scrollToIndex])

  const handleNext = useCallback(() => {
    const newIndex = Math.min(projects.length - 1, currentIndex + 1)
    setCurrentIndex(newIndex)
    scrollToIndex(newIndex)
  }, [currentIndex, projects.length, scrollToIndex])

  // Update current index based on scroll position
  useEffect(() => {
    const container = carouselRef.current
    if (!container) return

    const handleScroll = () => {
      const cards = container.querySelectorAll('[data-project-card]')
      const containerScrollLeft = container.scrollLeft
      const containerWidth = container.clientWidth

      let closestIndex = 0
      let closestDistance = Infinity

      cards.forEach((card, index) => {
        const cardElement = card as HTMLElement
        const cardLeft = cardElement.offsetLeft - container.offsetLeft
        const distance = Math.abs(cardLeft - containerScrollLeft)

        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })

      if (closestIndex !== currentIndex) {
        setCurrentIndex(closestIndex)
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [currentIndex])

  if (projects.length === 0) {
    return null
  }

  return (
    <section className={cn('flex flex-col gap-6', className)}>
      <ProjectSectionHeading
        label="Projects"
        currentIndex={currentIndex}
        totalCount={projects.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />

      {/* Carousel container */}
      <div
        ref={carouselRef}
        className={cn(
          'flex gap-4 overflow-x-auto scroll-smooth',
          // Hide scrollbar but keep functionality
          'scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]',
          '[&::-webkit-scrollbar]:hidden',
          // Snap to cards
          'snap-x snap-mandatory',
        )}
      >
        {projects.map((project, index) => (
          <div
            key={project.id}
            data-project-card
            className={cn(
              // Each card takes 80% of container width
              'w-[80%] shrink-0 snap-start',
              // First card has no left padding, others have some
              index === 0 ? 'ml-0' : '',
              // Last card has right padding to allow scroll
              index === projects.length - 1 ? 'mr-4' : '',
            )}
          >
            <ProjectCard project={project} from="home" />
          </div>
        ))}
      </div>
    </section>
  )
}
