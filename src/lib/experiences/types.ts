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
  experiences: Experience[]
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
  // Primary lane colors (cooler tones)
  work: {
    bg: 'bg-slate-100',
    bgHover: 'hover:bg-slate-200',
    border: 'border-slate-300',
    text: 'text-slate-700',
    dot: 'bg-slate-500',
  },
  consulting: {
    bg: 'bg-cyan-50',
    bgHover: 'hover:bg-cyan-100',
    border: 'border-cyan-200',
    text: 'text-cyan-700',
    dot: 'bg-cyan-500',
  },
  agency: {
    bg: 'bg-indigo-50',
    bgHover: 'hover:bg-indigo-100',
    border: 'border-indigo-200',
    text: 'text-indigo-700',
    dot: 'bg-indigo-500',
  },
  // Secondary lane colors (warmer tones)
  entrepreneurship: {
    bg: 'bg-blue-50',
    bgHover: 'hover:bg-blue-100',
    border: 'border-blue-200',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
  },
  'side project': {
    bg: 'bg-emerald-50',
    bgHover: 'hover:bg-emerald-100',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
  },
  teaching: {
    bg: 'bg-amber-50',
    bgHover: 'hover:bg-amber-100',
    border: 'border-amber-200',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
  },
  study: {
    bg: 'bg-violet-50',
    bgHover: 'hover:bg-violet-100',
    border: 'border-violet-200',
    text: 'text-violet-700',
    dot: 'bg-violet-500',
  },
  volunteer: {
    bg: 'bg-rose-50',
    bgHover: 'hover:bg-rose-100',
    border: 'border-rose-200',
    text: 'text-rose-700',
    dot: 'bg-rose-500',
  },
}

/** Lane labels */
export const LANE_LABELS: Record<
  Exclude<ExperienceCategory, 'tertiary'>,
  string
> = {
  primary: 'Work',
  secondary: 'Hustle',
}
