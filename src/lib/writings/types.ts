/**
 * Writing content types for articles/posts
 */

/** Growth stage of the idea/article */
export type GrowthStage = 'seedling' | 'budding' | 'evergreen'

/** Frontmatter schema for writing markdown files */
export interface WritingFrontmatter {
  title: string
  slug: string
  description: string
  publishedAt: string // Format: YYYY-MM-DD
  updatedAt?: string // Format: YYYY-MM-DD
  topic: string // Topic slug (references topic file)
  growthStage: GrowthStage
  showDescription: boolean

  // SEO fields
  seoTitle?: string
  seoDescription?: string
  seoImage?: string // Path to OG image
}

/** Parsed writing with computed fields */
export interface Writing extends WritingFrontmatter {
  id: string // Derived from filename
  content: string // Markdown content after frontmatter
  publishedAtParsed: Date
  updatedAtParsed?: Date
}

/** Growth stage icon mapping */
export const GROWTH_STAGE_ICONS: Record<GrowthStage, string> = {
  seedling: '/images/ideas_growth_stages/ideagrowthstage_seedling.svg',
  budding: '/images/ideas_growth_stages/ideagrowthstage_budding.svg',
  evergreen: '/images/ideas_growth_stages/ideagrowthstage_evergreen.svg',
}

/** Growth stage labels */
export const GROWTH_STAGE_LABELS: Record<GrowthStage, string> = {
  seedling: 'Seedling',
  budding: 'Budding',
  evergreen: 'Evergreen',
}
