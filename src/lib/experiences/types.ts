/**
 * Experience content types for career timeline
 */

/** Category determines which lane the experience appears in */
export type ExperienceCategory = 'primary' | 'secondary' | 'tertiary'

/** Subcategory for color coding and filtering */
export type ExperienceSubcategory =
  | 'work'
  | 'side project'
  | 'entrepreneurship'
  | 'teaching'
  | 'study'
  | 'volunteer'
  | 'consulting'
  | 'agency'

/** Employment arrangement type */
export type ExperienceArrangement =
  | 'full-time'
  | 'part-time'
  | 'contract'
  | 'self-employed'
  | 'internship'
  | 'seasonal'
  | 'freelance'

/** Frontmatter schema for experience markdown files */
export interface ExperienceFrontmatter {
  company: string
  role: string
  startDate: string // Format: YYYY-MM
  endDate: string // Format: YYYY-MM or "present"
  companyWebsite?: string
  category: ExperienceCategory
  subcategory: ExperienceSubcategory
  arrangement: ExperienceArrangement
  icon: string // Lucide icon name
  location?: string
  isMilestone: boolean
  /** Mark as deprioritized for compact vertical display when overlapping more important experiences */
  isDeprioritized: boolean
}

/** Parsed experience with computed fields */
export interface Experience extends ExperienceFrontmatter {
  id: string // Derived from filename
  description: string // Markdown content after frontmatter
  startDateParsed: Date
  endDateParsed: Date | null // null if "present"
  durationMonths: number
}

/** Lane configuration for calendar view */
export interface TimelineLane {
  id: ExperienceCategory
  label: string
  experiences: Array<Experience>
}

/** Year marker for timeline */
export interface TimelineYear {
  year: number
  startMonth: number // 1-12
  endMonth: number // 1-12
}

/** Color scheme for subcategories */
export interface SubcategoryColorScheme {
  bg: string
  bgHover: string
  border: string
  text: string
  dot: string
}

/** Map of subcategory to color scheme */
export const SUBCATEGORY_COLORS: Record<
  ExperienceSubcategory,
  SubcategoryColorScheme
> = {
  // Primary category: white background
  work: {
    bg: 'bg-white',
    bgHover: 'hover:bg-slate-50',
    border: 'border-slate-200',
    text: 'text-foreground',
    dot: 'bg-slate-500',
  },
  // Secondary category: neutral tones (50 shades)
  // Teaching & Consulting share Slate
  consulting: {
    bg: 'bg-slate-50',
    bgHover: 'hover:bg-slate-100',
    border: 'border-slate-200',
    text: 'text-foreground',
    dot: 'bg-slate-400',
  },
  teaching: {
    bg: 'bg-slate-50',
    bgHover: 'hover:bg-slate-100',
    border: 'border-slate-200',
    text: 'text-foreground',
    dot: 'bg-slate-400',
  },
  // Entrepreneurship & Agency share Gray
  entrepreneurship: {
    bg: 'bg-gray-50',
    bgHover: 'hover:bg-gray-100',
    border: 'border-gray-200',
    text: 'text-foreground',
    dot: 'bg-gray-400',
  },
  agency: {
    bg: 'bg-gray-50',
    bgHover: 'hover:bg-gray-100',
    border: 'border-gray-200',
    text: 'text-foreground',
    dot: 'bg-gray-400',
  },
  // Other secondary subcategories
  'side project': {
    bg: 'bg-zinc-50',
    bgHover: 'hover:bg-zinc-100',
    border: 'border-zinc-200',
    text: 'text-foreground',
    dot: 'bg-zinc-400',
  },
  study: {
    bg: 'bg-neutral-50',
    bgHover: 'hover:bg-neutral-100',
    border: 'border-neutral-200',
    text: 'text-foreground',
    dot: 'bg-neutral-400',
  },
  volunteer: {
    bg: 'bg-stone-50',
    bgHover: 'hover:bg-stone-100',
    border: 'border-stone-200',
    text: 'text-foreground',
    dot: 'bg-stone-400',
  },
}
