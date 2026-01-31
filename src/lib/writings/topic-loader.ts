/**
 * Topic content loader
 * Uses Vite's import.meta.glob for static imports at build time
 */

import type { Topic, TopicFrontmatter } from './topic-types'

/**
 * Parse frontmatter from markdown content
 */
function parseFrontmatter(content: string): {
  frontmatter: Record<string, unknown>
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/
  const match = content.match(frontmatterRegex)

  if (!match) {
    return { frontmatter: {} }
  }

  const [, frontmatterStr] = match
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

    frontmatter[key] = value
  }

  return { frontmatter }
}

/**
 * Validate and convert frontmatter to typed TopicFrontmatter
 */
function validateFrontmatter(
  frontmatter: Record<string, unknown>,
  filename: string,
): TopicFrontmatter {
  const errors: Array<string> = []

  if (typeof frontmatter.name !== 'string' || !frontmatter.name) {
    errors.push('name is required')
  }
  if (typeof frontmatter.slug !== 'string' || !frontmatter.slug) {
    errors.push('slug is required')
  }
  if (typeof frontmatter.description !== 'string') {
    errors.push('description is required')
  }

  if (errors.length > 0) {
    throw new Error(
      `Invalid frontmatter in ${filename}:\n  - ${errors.join('\n  - ')}`,
    )
  }

  return {
    name: frontmatter.name as string,
    slug: frontmatter.slug as string,
    description: (frontmatter.description as string) || '',
    icon: (frontmatter.icon as string) || undefined,
  }
}

/**
 * Extract ID from filename
 */
function extractId(filepath: string): string {
  const filename = filepath.split('/').pop() || filepath
  return filename.replace(/\.md$/, '')
}

/**
 * Process raw markdown content into Topic object
 */
function processTopic(content: string, filepath: string): Topic | null {
  if (filepath.includes('_template')) return null

  const { frontmatter } = parseFrontmatter(content)
  const validated = validateFrontmatter(frontmatter, filepath)

  return {
    ...validated,
    id: extractId(filepath),
  }
}

/**
 * Import all topic markdown files
 */
const topicModules = import.meta.glob<string>('/content/topics/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

/**
 * Get all topics
 */
export function getAllTopics(): Array<Topic> {
  const topics: Array<Topic> = []

  for (const [filepath, content] of Object.entries(topicModules)) {
    try {
      const topic = processTopic(content, filepath)
      if (topic) {
        topics.push(topic)
      }
    } catch (error) {
      console.error(`Error processing ${filepath}:`, error)
    }
  }

  return topics.sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Get a single topic by slug
 */
export function getTopicBySlug(slug: string): Topic | undefined {
  return getAllTopics().find((topic) => topic.slug === slug)
}
