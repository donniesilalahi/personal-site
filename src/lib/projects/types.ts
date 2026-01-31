/**
 * Project content types for portfolio/projects
 */

/** Publication status */
export type ProjectStatus = 'draft' | 'published'

/** Valid publication status values */
export const VALID_PROJECT_STATUSES: Array<ProjectStatus> = ['draft', 'published']

/** Frontmatter schema for project markdown files */
export interface ProjectFrontmatter {
  title: string
  slug: string
  description: string // Short description shown in cards (2 lines max)
  publishedAt: string // Format: YYYY-MM-DD

  // Visual highlights (up to 3 images)
  visuals: Array<string> // Paths to visual highlight images (4:3 ratio)
  backgroundImage?: string // Optional background image for the visual area

  // Meta information
  roles: Array<string> // Array of roles (displayed as ROLE + ROLE)
  tags: Array<string> // Array of tags (displayed as #tag #tag)

  // Publication
  status: ProjectStatus

  // SEO fields (optional)
  seoTitle?: string
  seoDescription?: string
  seoImage?: string
}

/** Parsed project with computed fields */
export interface Project extends ProjectFrontmatter {
  id: string // Derived from filename
  content: string // Markdown content after frontmatter
  publishedAtParsed: Date
}
