/** Fixed height per year in pixels (allows 3 non-overlapping 4-month experiences) */
export const YEAR_HEIGHT_PX = 80

/** Minimum height for very short experiences (in pixels) */
export const MIN_EXPERIENCE_HEIGHT_PX = 24

/** Gap between side-by-side columns (in pixels) */
export const COLUMN_GAP_PX = 2

/** Gap between vertically stacked cards (in pixels) */
export const VERTICAL_GAP_PX = 2

/** Fixed width for deprioritized (vertical text) cards (in pixels)
 * Layout: icon (12px) + gap (4px) + role@company (~12px) + gap (4px) + dates (~10px) + padding (6px) ≈ 48px
 */
export const DEPRIORITIZED_CARD_WIDTH_PX = 48

/** Estimated width for milestone cards when overlapping (in pixels)
 * Used for regular card spacing calculation. Actual milestone uses auto width.
 * Layout: dot (4px) + gap (4px) + text (~40px) + buffer ≈ 56px
 */
export const MILESTONE_CARD_WIDTH_PX = 56
