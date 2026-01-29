/**
 * Experience content loader
 * Uses Vite's import.meta.glob for static imports at build time
 */

import type {
  Experience,
  ExperienceArrangement,
  ExperienceCategory,
  ExperienceFrontmatter,
  ExperienceSubcategory,
} from './types'

/** Valid category values */
const VALID_CATEGORIES: Array<ExperienceCategory> = [
  'primary',
  'secondary',
  'tertiary',
]

/** Valid subcategory values */
const VALID_SUBCATEGORIES: Array<ExperienceSubcategory> = [
  'work',
  'side project',
  'entrepreneurship',
  'teaching',
  'study',
  'volunteer',
  'consulting',
  'agency',
]

/** Valid arrangement values */
const VALID_ARRANGEMENTS: Array<ExperienceArrangement> = [
  'full-time',
  'part-time',
  'contract',
  'self-employed',
  'internship',
  'seasonal',
  'freelance',
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

  // Parse YAML-like frontmatter (simple key: value pairs)
  const lines = frontmatterStr.split('\n')
  for (const line of lines) {
    // Skip comments and empty lines
    if (line.trim().startsWith('#') || !line.trim()) continue

    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue

    const key = line.slice(0, colonIndex).trim()
    let value: unknown = line.slice(colonIndex + 1).trim()

    // Remove quotes if present
    if (typeof value === 'string') {
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
    }

    // Parse boolean values
    if (value === 'TRUE' || value === 'true') value = true
    if (value === 'FALSE' || value === 'false') value = false

    frontmatter[key] = value
  }

  return { frontmatter, body: body.trim() }
}

/**
 * Validate and convert frontmatter to typed ExperienceFrontmatter
 */
function validateFrontmatter(
  frontmatter: Record<string, unknown>,
  filename: string,
): ExperienceFrontmatter {
  const errors: Array<string> = []

  // Required fields
  if (typeof frontmatter.company !== 'string' || !frontmatter.company) {
    errors.push('company is required')
  }
  if (typeof frontmatter.role !== 'string' || !frontmatter.role) {
    errors.push('role is required')
  }
  if (typeof frontmatter.startDate !== 'string' || !frontmatter.startDate) {
    errors.push('startDate is required')
  }
  if (typeof frontmatter.endDate !== 'string' || !frontmatter.endDate) {
    errors.push('endDate is required')
  }

  // Validate category
  const category = frontmatter.category as ExperienceCategory
  if (!VALID_CATEGORIES.includes(category)) {
    errors.push(`category must be one of: ${VALID_CATEGORIES.join(', ')}`)
  }

  // Validate subcategory
  const subcategory = frontmatter.subcategory as ExperienceSubcategory
  if (!VALID_SUBCATEGORIES.includes(subcategory)) {
    errors.push(`subcategory must be one of: ${VALID_SUBCATEGORIES.join(', ')}`)
  }

  // Validate arrangement
  const arrangement = frontmatter.arrangement as ExperienceArrangement
  if (!VALID_ARRANGEMENTS.includes(arrangement)) {
    errors.push(`arrangement must be one of: ${VALID_ARRANGEMENTS.join(', ')}`)
  }

  // Validate isMilestone
  if (typeof frontmatter.isMilestone !== 'boolean') {
    errors.push('isMilestone must be TRUE or FALSE')
  }

  // Validate isDeprioritized (optional, defaults to false)
  if (
    frontmatter.isDeprioritized !== undefined &&
    typeof frontmatter.isDeprioritized !== 'boolean'
  ) {
    errors.push('isDeprioritized must be TRUE or FALSE')
  }

  // Validate isCareerBreak (optional, defaults to false)
  if (
    frontmatter.isCareerBreak !== undefined &&
    typeof frontmatter.isCareerBreak !== 'boolean'
  ) {
    errors.push('isCareerBreak must be TRUE or FALSE')
  }

  if (errors.length > 0) {
    throw new Error(
      `Invalid frontmatter in ${filename}:\n  - ${errors.join('\n  - ')}`,
    )
  }

  return {
    company: frontmatter.company as string,
    role: frontmatter.role as string,
    startDate: frontmatter.startDate as string,
    endDate: frontmatter.endDate as string,
    companyWebsite: (frontmatter.companyWebsite as string) || undefined,
    category,
    subcategory,
    arrangement,
    icon: (frontmatter.icon as string) || '',
    location: (frontmatter.location as string) || undefined,
    isMilestone: frontmatter.isMilestone as boolean,
    isDeprioritized: (frontmatter.isDeprioritized as boolean) || false,
    isCareerBreak: (frontmatter.isCareerBreak as boolean) || false,
  }
}

/**
 * Parse date string to Date object with smart defaults.
 *
 * Supports formats:
 * - "present" → null (ongoing)
 * - "YYYY-MM-DD" → exact date
 * - "YYYY-MM" → smart default based on isEndDate:
 *   - Start dates: 1st of the month (people typically start on day 1)
 *   - End dates: last day of the month (people typically leave after final paycheck)
 *
 * @param dateStr - Date string in YYYY-MM or YYYY-MM-DD format, or "present"
 * @param isEndDate - Whether this is an end date (affects YYYY-MM default day)
 */
function parseDate(dateStr: string, isEndDate: boolean = false): Date | null {
  if (dateStr.toLowerCase() === 'present') return null

  const parts = dateStr.split('-').map(Number)

  // Full date: YYYY-MM-DD
  if (parts.length === 3) {
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
      throw new Error(
        `Invalid date format: ${dateStr}. Expected YYYY-MM-DD, YYYY-MM, or "present"`,
      )
    }
    return new Date(year, month - 1, day)
  }

  // Month only: YYYY-MM
  if (parts.length === 2) {
    const [year, month] = parts
    if (!year || !month || month < 1 || month > 12) {
      throw new Error(
        `Invalid date format: ${dateStr}. Expected YYYY-MM-DD, YYYY-MM, or "present"`,
      )
    }

    if (isEndDate) {
      // End date: last day of the month
      // new Date(year, month, 0) gives the last day of the previous month
      // So month (not month-1) gives last day of the target month
      return new Date(year, month, 0)
    }

    // Start date: first day of the month
    return new Date(year, month - 1, 1)
  }

  throw new Error(
    `Invalid date format: ${dateStr}. Expected YYYY-MM-DD, YYYY-MM, or "present"`,
  )
}

/**
 * Calculate duration in months between two dates
 */
function calculateDurationMonths(
  startDate: Date,
  endDate: Date | null,
): number {
  const end = endDate || new Date()
  const months =
    (end.getFullYear() - startDate.getFullYear()) * 12 +
    (end.getMonth() - startDate.getMonth()) +
    1
  return Math.max(1, months) // At least 1 month
}

/**
 * Extract ID from filename (remove extension and path)
 */
function extractId(filepath: string): string {
  const filename = filepath.split('/').pop() || filepath
  return filename.replace(/\.md$/, '')
}

/**
 * Process raw markdown content into Experience object
 */
function processExperience(
  content: string,
  filepath: string,
): Experience | null {
  // Skip template files
  if (filepath.includes('_template')) return null

  const { frontmatter, body } = parseFrontmatter(content)
  const validated = validateFrontmatter(frontmatter, filepath)

  const startDateParsed = parseDate(validated.startDate, false)
  if (!startDateParsed) {
    throw new Error(`Invalid startDate in ${filepath}`)
  }

  const endDateParsed = parseDate(validated.endDate, true)
  const durationMonths = calculateDurationMonths(startDateParsed, endDateParsed)

  return {
    ...validated,
    id: extractId(filepath),
    description: body,
    startDateParsed,
    endDateParsed,
    durationMonths,
  }
}

/**
 * Import all experience markdown files
 * Uses Vite's import.meta.glob for static analysis at build time
 */
const experienceModules = import.meta.glob<string>(
  '/content/experiences/*.md',
  {
    query: '?raw',
    import: 'default',
    eager: true,
  },
)

/**
 * Get all experiences, sorted by start date (newest first)
 */
export function getAllExperiences(): Array<Experience> {
  const experiences: Array<Experience> = []

  for (const [filepath, content] of Object.entries(experienceModules)) {
    try {
      const experience = processExperience(content, filepath)
      if (experience) {
        experiences.push(experience)
      }
    } catch (error) {
      console.error(`Error processing ${filepath}:`, error)
    }
  }

  // Sort by start date (newest first)
  return experiences.sort(
    (a, b) => b.startDateParsed.getTime() - a.startDateParsed.getTime(),
  )
}

/**
 * Get experiences filtered by category
 */
export function getExperiencesByCategory(
  category: ExperienceCategory,
): Array<Experience> {
  return getAllExperiences().filter((exp) => exp.category === category)
}

/**
 * Calculate total years of experience from all primary experiences
 */
export function calculateTotalExperience(): {
  years: number
  months: number
  formatted: string
} {
  const primaryExperiences = getExperiencesByCategory('primary')

  if (primaryExperiences.length === 0) {
    return { years: 0, months: 0, formatted: '0 years of experience' }
  }

  // Find earliest start date and latest end date
  let earliestStart = primaryExperiences[0].startDateParsed
  let latestEnd: Date = new Date()

  for (const exp of primaryExperiences) {
    if (exp.startDateParsed < earliestStart) {
      earliestStart = exp.startDateParsed
    }
    const endDate = exp.endDateParsed || new Date()
    if (endDate > latestEnd) {
      latestEnd = endDate
    }
  }

  const totalMonths =
    (latestEnd.getFullYear() - earliestStart.getFullYear()) * 12 +
    (latestEnd.getMonth() - earliestStart.getMonth())

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  // Format as "X.Y years of experience"
  const decimal = months > 0 ? `.${Math.round((months / 12) * 10)}` : ''
  const formatted = `${years}${decimal} years of experience`

  return { years, months, formatted }
}

/**
 * Get the year range covered by all experiences
 */
export function getExperienceYearRange(): {
  startYear: number
  endYear: number
} {
  const experiences = getAllExperiences().filter(
    (exp) => exp.category !== 'tertiary',
  )

  if (experiences.length === 0) {
    const currentYear = new Date().getFullYear()
    return { startYear: currentYear, endYear: currentYear }
  }

  let startYear = experiences[0].startDateParsed.getFullYear()
  let endYear = new Date().getFullYear()

  for (const exp of experiences) {
    const expStartYear = exp.startDateParsed.getFullYear()
    if (expStartYear < startYear) startYear = expStartYear

    const expEndYear =
      exp.endDateParsed?.getFullYear() || new Date().getFullYear()
    if (expEndYear > endYear) endYear = expEndYear
  }

  return { startYear, endYear }
}
