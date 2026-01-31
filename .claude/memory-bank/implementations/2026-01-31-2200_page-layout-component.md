# Page Layout Component

**Status**: completed
**Priority**: p2
**Date**: 2026-01-31

## What Changed

- Created `/src/components/page-layout.tsx` - Reusable layout wrapper with header clearance and consistent spacing
- Updated 6 routes to use `PageLayout`:
  - `src/routes/writings.tsx`
  - `src/routes/writing/$slug.tsx`
  - `src/routes/topic/$slug.tsx`
  - `src/routes/project/$slug.tsx`
  - `src/routes/colophon.tsx`
  - `src/routes/ai.tsx`

## Why

Pages with fixed header at `pt-[120px]` had hardcoded margin values scattered across routes, violating DRY principles. Centralizing header clearance in a single component prevents overlap with fixed header and ensures single source of truth for spacing. Any future header height changes only require one edit.

## Verify

- `npm run dev` → Visit `/writings`, `/colophon`, `/writing/[slug]` pages
- Verify content doesn't overlap with fixed header
- Check page layout has consistent max-width (720px), padding, and spacing
- Build succeeds: `npm run build`

## Notes

- `PageLayout` provides base `pt-[120px]` (header clearance) and `pb-16` (bottom padding)
- Inner div handles `max-w-[720px]` and horizontal padding (`px-4`)
- Accepts optional `className` prop for per-route customization (background color, font)
- Homepage (`index.tsx`) remains separate—uses custom centered layout with `ProfileSection`
