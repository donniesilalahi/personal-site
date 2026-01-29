/**
 * Topic content types for categorizing writings
 */

/** Frontmatter schema for topic markdown files */
export interface TopicFrontmatter {
  name: string
  slug: string
  description: string
  icon?: string // Optional icon path
}

/** Parsed topic with computed fields */
export interface Topic extends TopicFrontmatter {
  id: string // Derived from filename
}
