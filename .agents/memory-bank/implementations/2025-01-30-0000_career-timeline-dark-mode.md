# Career Timeline Dark Mode Support

**Status**: completed  
**Priority**: p2  
**Date**: 2025-01-30

## What Changed

- `src/components/career-timeline/career-calendar.tsx` - Added `dark:bg-neutral-950` to container
- `src/components/career-timeline/experience-entry-card.tsx` - Added dark variants to career break card (bg, border, hover, stripe pattern)
- `src/lib/experiences/types.ts` - Updated `SUBCATEGORY_COLORS` with dark mode variants for all 8 subcategories (bg, bgHover, border)

## Why

Theme switcher was implemented but career timeline components didn't respond to light/dark mode changes. Components used hardcoded light mode colors without `dark:` Tailwind variants.

## Verify

- `npm run dev`
- Open career timeline section
- Toggle theme switcher in header
- All experience cards change from white/neutral-50 (light) to neutral-900/neutral-800 (dark)
- Career break cards show yellow stripes (light) and brown stripes (dark)

## Notes

- Dark hover state: `neutral-800` instead of `neutral-50`
- Dark stripe pattern uses `#713f12` (amber-900) for visibility
- All subcategories (work, consulting, teaching, etc.) now support dark mode
