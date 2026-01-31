import { Link } from '@tanstack/react-router'


import { ProjectVisualHighlights } from './project-visual-highlights'

import type { Project } from '@/lib/projects'
import { cn } from '@/lib/utils'

interface ProjectCardProps {
  project: Project
  from?: 'home' | 'projects'
  className?: string
}

/**
 * Project card component for carousel display
 *
 * Layout:
 * - Title and description at top
 * - Visual highlights in the middle
 * - Meta information (roles // tags) at bottom
 */
export function ProjectCard({ project, from = 'home', className }: ProjectCardProps) {
  const rolesText = project.roles.map((role) => role.toUpperCase()).join(' + ')
  const tagsText = project.tags.map((tag) => `#${tag.toLowerCase()}`).join(' ')

  return (
    <Link
      to="/project/$slug"
      params={{ slug: project.slug }}
      search={{ from }}
      className={cn(
        'flex flex-col bg-white rounded-lg border border-neutral-200 overflow-hidden',
        'hover:border-neutral-300 transition-colors cursor-pointer',
        className,
      )}
    >
      {/* Header: Title and Description */}
      <div className="flex gap-4 p-4 pb-0">
        <h3 className="text-base font-semibold text-secondary-foreground font-bricolage shrink-0">
          {project.title}
        </h3>
        <p className="text-sm text-tertiary-foreground line-clamp-2 flex-1">
          {project.description}
        </p>
      </div>

      {/* Visual Highlights */}
      <div className="p-4">
        <ProjectVisualHighlights
          visuals={project.visuals}
          backgroundImage={project.backgroundImage}
        />
      </div>

      {/* Meta Information */}
      <div className="px-4 pb-4 pt-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {/* Roles */}
          <span className="font-medium tracking-wide">{rolesText}</span>

          {/* Separator */}
          {project.tags.length > 0 && (
            <>
              <span className="text-muted-foreground/50">//</span>
              {/* Tags */}
              <span>{tagsText}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
