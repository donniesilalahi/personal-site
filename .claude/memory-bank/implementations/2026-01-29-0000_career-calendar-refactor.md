# Career Calendar Refactor

**Status**: completed
**Priority**: p2
**Date**: 2026-01-29

## What Changed

- `src/components/career-timeline/career-calendar.tsx` - Main component reduced from 566 to 122 lines
- `src/components/career-timeline/career-calendar-group.tsx` - New file (169 lines) with `GroupRenderer`, `GridColumn`, `CardWrapper`, `SingleCard`
- `src/components/career-timeline/career-calendar.processing.ts` - New file (159 lines) with `processExperiences`, overlap group building, column assignment, vertical overlap resolution
- `src/components/career-timeline/career-calendar.utils.ts` - Extended with `calculateTimelineBounds`, `calculateVerticalPosition`, `getCardType`
- `src/components/career-timeline/career-calendar.types.ts` - Updated with `CardType`, `ProcessedCard`, `ProcessedColumn`, `ProcessedGroup`

## Why

Main component was 566 lines with mixed concerns (processing logic, rendering, layout). Split into focused modules for maintainability: processing logic separate from presentation, sub-components in dedicated file. Improves readability and future extensibility.

## Verify

- `npm run build` - Builds successfully
- `npm run dev` - Career timeline renders correctly with all card types (regular, deprioritized, milestone)
- Overlapping experiences layout horizontally as before
- Year labels and timeline lines display properly

## Notes

- Main component now 122 lines (within 200-350 target)
- All logic extracted to testable modules
- No behavior changes, pure refactor
- Build passes without errors
