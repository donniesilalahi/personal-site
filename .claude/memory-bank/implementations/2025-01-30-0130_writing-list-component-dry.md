# Writing List Component (DRY Refactor)

**Status**: completed  
**Priority**: p2  
**Date**: 2025-01-30

## What Changed

- Created `/src/components/writing/writing-list.tsx` - Reusable container component for writing lists
- Updated `WritingSection`, `/writings`, `/topic/$slug` to use `WritingList`
- Each card now has 16px padding + `rounded-sm` border radius
- List uses `divide-y` for 4px gaps above/below dividers
- Removed 40+ lines of duplicated Card/CardContent boilerplate

## Why

Eliminated code duplication across 3 routes. Single source of truth for writing list styling, layout, and empty states reduces maintenance burden.

## Verify

- Homepage `/` → Writing section displays with border, padding, dividers
- `/writings` → All writings + topic tabs render correctly
- `/topic/growth` → Single topic list displays properly
- All dividers visible, spacing consistent (4px gaps)
- Card padding 16px respected on all sides

## Notes

- Component accepts `writings` array, `from` prop, custom `emptyMessage`
- Container: 16px padding, border-neutral-200, rounded-md
- Cards: 16px padding, rounded-sm (smaller than container)
- Dividers: `divide-y` with 4px padding on each side
