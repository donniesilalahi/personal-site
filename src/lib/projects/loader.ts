/**
 * Project content loader
 * Uses Vite's import.meta.glob for static imports at build time
 */

import { VALID_PROJECT_STATUSES } from './types'
import type { Project, ProjectFrontmatter, ProjectStatus } from './types'

/**
 * Parse frontmatter from markdown content
 */
function parseFrontmatter(content: string): {
  frontmatter: Record<string, unknown>
  body: string
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)

  if (!match) {
    return { frontmatter: {}, body: content }
  }

  const [, frontmatterStr, body] = match
  const frontmatter: Record<string, unknown> = {}

  const lines = frontmatterStr.split('\n')
  let currentKey: string | null = null
  let currentArray: Array<string> | null = null

  for (const line of lines) {
    // Skip comments and empty lines
    if (line.trim().startsWith('#') || !line.trim()) {
      continue
    }

    // Check if this is an array item
    if (line.trim().startsWith('- ') && currentKey && currentArray !== null) {
      let value = line.trim().slice(2).trim()
      // Remove quotes if present
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      currentArray.push(value)
      continue
    }

    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue

    // Save previous array if we're starting a new key
    if (currentKey && currentArray !== null) {
      frontmatter[currentKey] = currentArray
      currentArray = null
      currentKey = null
    }

    const key = line.slice(0, colonIndex).trim()
    let value: unknown = line.slice(colonIndex + 1).trim()

    // Check if this is the start of an array
    if (value === '' || value === '[]') {
      currentKey = key
      currentArray = []
      continue
    }

    // Handle inline arrays like [item1, item2]
    if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
      const arrayContent = value.slice(1, -1)
      if (arrayContent.trim() === '') {
        frontmatter[key] = []
      } else {
        frontmatter[key] = arrayContent.split(',').map((item) => {
          let trimmed = item.trim()
          if (
            (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
            (trimmed.startsWith("'") && trimmed.endsWith("'"))
          ) {
            trimmed = trimmed.slice(1, -1)
          }
          return trimmed
        })
      }
      continue
    }

    if (typeof value === 'string') {
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
    }

    if (value === 'TRUE' || value === 'true') value = true
    if (value === 'FALSE' || value === 'false') value = false

    frontmatter[key] = value
  }

  // Save final array if we ended with one
  if (currentKey && currentArray !== null) {
    frontmatter[currentKey] = currentArray
  }

  return { frontmatter, body: body.trim() }
}

/**
 * Validate and convert frontmatter to typed ProjectFrontmatter
 */
function validateFrontmatter(
  frontmatter: Record<string, unknown>,
  filename: string,
): ProjectFrontmatter {
  const errors: Array<string> = []

  if (typeof frontmatter.title !== 'string' || !frontmatter.title) {
    errors.push('title is required')
  }
  if (typeof frontmatter.slug !== 'string' || !frontmatter.slug) {
    errors.push('slug is required')
  }
  if (typeof frontmatter.description !== 'string') {
    errors.push('description is required')
  }
  if (typeof frontmatter.publishedAt !== 'string' || !frontmatter.publishedAt) {
    errors.push('publishedAt is required')
  }

  // Validate visuals array
  if (!Array.isArray(frontmatter.visuals)) {
    errors.push('visuals must be an array')
  } else if (frontmatter.visuals.length === 0) {
    errors.push('visuals must have at least one image')
  } else if (frontmatter.visuals.length > 3) {
    errors.push('visuals cannot have more than 3 images')
  }

  // Validate roles array
  if (!Array.isArray(frontmatter.roles)) {
    errors.push('roles must be an array')
  } else if (frontmatter.roles.length === 0) {
    errors.push('roles must have at least one role')
  }

  // Validate tags array
  if (!Array.isArray(frontmatter.tags)) {
    errors.push('tags must be an array')
  }

  const status = frontmatter.status as ProjectStatus
  if (!VALID_PROJECT_STATUSES.includes(status)) {
    errors.push(`status must be one of: ${VALID_PROJECT_STATUSES.join(', ')}`)
  }

  if (errors.length > 0) {
    throw new Error(
      `Invalid frontmatter in ${filename}:\n  - ${errors.join('\n  - ')}`,
    )
  }

  return {
    title: frontmatter.title as string,
    slug: frontmatter.slug as string,
    description: (frontmatter.description as string) || '',
    publishedAt: frontmatter.publishedAt as string,
    visuals: frontmatter.visuals as Array<string>,
    backgroundImage: (frontmatter.backgroundImage as string) || undefined,
    roles: frontmatter.roles as Array<string>,
    tags: frontmatter.tags as Array<string>,
    status,
    seoTitle: (frontmatter.seoTitle as string) || undefined,
    seoDescription: (frontmatter.seoDescription as string) || undefined,
    seoImage: (frontmatter.seoImage as string) || undefined,
  }
}

/**
 * Parse date string to Date object
 */
function parseDate(dateStr: string): Date {
  const parts = dateStr.split('-').map(Number)
  if (parts.length !== 3) {
    throw new Error(`Invalid date format: ${dateStr}. Expected YYYY-MM-DD`)
  }
  const [year, month, day] = parts
  if (
    !year ||
    !month ||
    month < 1 ||
    month > 12 ||
    !day ||
    day < 1 ||
    day > 31
  ) {
    throw new Error(`Invalid date format: ${dateStr}. Expected YYYY-MM-DD`)
  }
  return new Date(year, month - 1, day)
}

/**
 * Extract ID from filename
 */
function extractId(filepath: string): string {
  const filename = filepath.split('/').pop() || filepath
  return filename.replace(/\.md$/, '')
}

/**
 * Process raw markdown content into Project object
 */
function processProject(content: string, filepath: string): Project | null {
  if (filepath.includes('_template')) return null

  const { frontmatter, body } = parseFrontmatter(content)
  const validated = validateFrontmatter(frontmatter, filepath)

  const publishedAtParsed = parseDate(validated.publishedAt)

  return {
    ...validated,
    id: extractId(filepath),
    content: body,
    publishedAtParsed,
  }
}

/**
 * Import all project markdown files
 */
const projectModules = import.meta.glob<string>('/content/projects/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

/**
 * Filter projects to only include published content
 */
function filterPublished(projects: Array<Project>): Array<Project> {
  return projects.filter((project) => project.status === 'published')
}

/**
 * Get all projects (internal, includes drafts), sorted by published date (newest first)
 */
function getAllProjectsInternal(): Array<Project> {
  const projects: Array<Project> = []

  for (const [filepath, content] of Object.entries(projectModules)) {
    try {
      const project = processProject(content, filepath)
      if (project) {
        projects.push(project)
      }
    } catch (error) {
      console.error(`Error processing ${filepath}:`, error)
    }
  }

  return projects.sort(
    (a, b) => b.publishedAtParsed.getTime() - a.publishedAtParsed.getTime(),
  )
}

/**
 * Get all published projects, sorted by published date (newest first)
 */
export function getAllProjects(): Array<Project> {
  return filterPublished(getAllProjectsInternal())
}

/**
 * Get a single published project by slug
 */
export function getProjectBySlug(slug: string): Project | undefined {
  return getAllProjects().find((project) => project.slug === slug)
}

/**
 * Get recent published projects (limited)
 */
export function getRecentProjects(limit: number = 5): Array<Project> {
  return getAllProjects().slice(0, limit)
}
