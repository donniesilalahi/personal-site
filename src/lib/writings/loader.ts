/**
 * Writing content loader
 * Uses Vite's import.meta.glob for static imports at build time
 */

import type { GrowthStage, Writing, WritingFrontmatter } from './types'

/** Valid growth stage values */
const VALID_GROWTH_STAGES: Array<GrowthStage> = [
  'seedling',
  'budding',
  'evergreen',
]

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
  for (const line of lines) {
    if (line.trim().startsWith('#') || !line.trim()) continue

    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue

    const key = line.slice(0, colonIndex).trim()
    let value: unknown = line.slice(colonIndex + 1).trim()

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

  return { frontmatter, body: body.trim() }
}

/**
 * Validate and convert frontmatter to typed WritingFrontmatter
 */
function validateFrontmatter(
  frontmatter: Record<string, unknown>,
  filename: string,
): WritingFrontmatter {
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
  if (typeof frontmatter.topic !== 'string' || !frontmatter.topic) {
    errors.push('topic is required')
  }

  const growthStage = frontmatter.growthStage as GrowthStage
  if (!VALID_GROWTH_STAGES.includes(growthStage)) {
    errors.push(`growthStage must be one of: ${VALID_GROWTH_STAGES.join(', ')}`)
  }

  if (typeof frontmatter.showDescription !== 'boolean') {
    errors.push('showDescription must be TRUE or FALSE')
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
    updatedAt: (frontmatter.updatedAt as string) || undefined,
    topic: frontmatter.topic as string,
    growthStage,
    showDescription: frontmatter.showDescription as boolean,
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
 * Process raw markdown content into Writing object
 */
function processWriting(content: string, filepath: string): Writing | null {
  if (filepath.includes('_template')) return null

  const { frontmatter, body } = parseFrontmatter(content)
  const validated = validateFrontmatter(frontmatter, filepath)

  const publishedAtParsed = parseDate(validated.publishedAt)
  const updatedAtParsed = validated.updatedAt
    ? parseDate(validated.updatedAt)
    : undefined

  return {
    ...validated,
    id: extractId(filepath),
    content: body,
    publishedAtParsed,
    updatedAtParsed,
  }
}

/**
 * Import all writing markdown files
 */
const writingModules = import.meta.glob<string>('/content/writings/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

/**
 * Get all writings, sorted by published date (newest first)
 */
export function getAllWritings(): Array<Writing> {
  const writings: Array<Writing> = []

  for (const [filepath, content] of Object.entries(writingModules)) {
    try {
      const writing = processWriting(content, filepath)
      if (writing) {
        writings.push(writing)
      }
    } catch (error) {
      console.error(`Error processing ${filepath}:`, error)
    }
  }

  return writings.sort(
    (a, b) => b.publishedAtParsed.getTime() - a.publishedAtParsed.getTime(),
  )
}

/**
 * Get writings filtered by topic
 */
export function getWritingsByTopic(topicSlug: string): Array<Writing> {
  return getAllWritings().filter((writing) => writing.topic === topicSlug)
}

/**
 * Get a single writing by slug
 */
export function getWritingBySlug(slug: string): Writing | undefined {
  return getAllWritings().find((writing) => writing.slug === slug)
}

/**
 * Get recent writings (limited)
 */
export function getRecentWritings(limit: number = 5): Array<Writing> {
  return getAllWritings().slice(0, limit)
}
