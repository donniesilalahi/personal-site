# Career Calendar Flex Positioning

**Status**: broken  
**Priority**: p1  
**Date**: 2025-01-28

## What Changed

- `src/components/career-timeline/career-calendar.algorithm.ts` - Refactored `calculatePositioning()`:
  - Changed from equal-width columns to flex-based approach
  - Fixed cards (deprioritized/milestone): use `cssRight` positioning with `width: auto`
  - Regular cards: use `cssWidth: 'flex'` signal for renderer to calculate
  - Added `numFixedToRight`, `directOverlapCount` to `ExperiencePositioning`
  - Uses `experiencesOverlap()` to find DIRECT overlaps (not transitive)

- `src/components/career-timeline/career-calendar.tsx` - Updated renderer:
  - Added width calculation for `cssWidth === 'flex'` cards
  - Fixed cards use `right` positioning: `{ right: cssRight, left: 'auto', width: 'auto' }`
  - Regular cards use `calc(100% - fixedWidthSum - gaps)` based on measured widths
  - Added `COLUMN_GAP_PX` import

- `src/components/career-timeline/career-calendar.types.ts` - Added fields:
  - `numFixedToRight?: number`
  - `numFixedToLeft?: number`  
  - `directOverlapCount?: number`

## Why

Attempted to fix: Regular cards should flex (`flex: 1 1 0`) to fill remaining space, while deprioritized/milestone cards should only take content width (`flex: 0 0 auto`). Previous implementation gave equal 33% width to all overlapping cards.

## Current Bug

Side-by-side layout NOT working for overlapping regular cards. Only fixed cards (deprioritized/milestone) position correctly. The issue is likely in the renderer's width calculation logic or the algorithm's `cssWidth: 'flex'` handling.

## Key Files

- `src/components/career-timeline/career-calendar.algorithm.ts` (lines 242-324)
- `src/components/career-timeline/career-calendar.tsx` (lines 469-580)

## Verify

- `npm run dev` → visit `/` → scroll to Career timeline
- 2019-2020 overlap: Aspire + Katalis + TEDx should show side-by-side
- Regular card (Aspire) should fill remaining space after fixed cards

## To Fix

1. Debug why `cssWidth === 'flex'` path doesn't produce correct layout
2. Verify `directOverlaps` detection works correctly
3. Consider simpler approach: CSS Grid or actual flexbox container for overlap groups
