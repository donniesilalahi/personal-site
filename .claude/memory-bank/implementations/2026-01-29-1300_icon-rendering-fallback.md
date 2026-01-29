# Icon Rendering Graceful Fallback

**Status**: completed
**Priority**: p2
**Date**: 2026-01-29*1300

## What Changed

- `src/lib/experiences/loader.ts` - Changed default icon from `'briefcase'` to empty string for missing icons (line 162)
- `src/components/career-timeline/experience-entry-card.tsx` - Updated 3 icon containers to check `experience.icon?.trim()` before rendering `<img>` tag (deprioritized, short-duration, and normal card layouts)
- `src/components/career-timeline/experience-dialog-drawer.tsx` - Updated icon container to conditionally render `<img>` only when icon exists

## Why

Empty icon fields were being set to `'briefcase'` string literal, causing broken image placeholders (`<img src="briefcase">`) instead of rendering nothing. Fixed to show empty 12x12px containers with no image when icon is missing/empty.

## Verify

- `npm run dev` → View career timeline
- Career break card (2021-04) shows empty space instead of broken icon placeholder
- Dialog drawer shows empty container instead of broken image when icon is empty
- Cards with valid icons still render properly

## Notes

- Used `.trim()` check to handle both empty strings and whitespace-only values
- All three card layout types (deprioritized, short-duration, normal) now handle missing icons consistently
- Dialog drawer maintains 8px container size with conditional image rendering
