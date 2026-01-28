# Career Calendar Flex Positioning

**Status**: completed
**Priority**: p1
**Date**: 2025-01-28

## What Changed

Complete refactor of the career calendar positioning system to use CSS Flexbox for horizontal layout.

### `src/components/career-timeline/career-calendar.algorithm.ts`

- Simplified to output `OverlapGroup` objects with cards sorted by start date
- No more complex CSS calculations (`cssLeft`, `cssRight`, `cssWidth`)
- Each card has `flexBehavior: 'grow' | 'content'` for flexbox rendering
- Cards in each group sorted by `startDateParsed` ASC (earlier = leftmost)

### `src/components/career-timeline/career-calendar.tsx`

- Renders each overlap group as a flex container with `display: flex`
- Regular cards: `flex: 1 1 0` (grow to fill remaining space)
- Deprioritized/milestone cards: `flex: 0 0 auto` (content width only)
- Vertical positioning handled via absolute positioning within flex items
- Removed all complex width calculation logic

### `src/components/career-timeline/career-calendar.types.ts`

- Simplified to essential types: `PositionedCard`, `RenderedOverlapGroup`
- Removed complex CSS positioning fields

### `src/components/career-timeline/career-calendar.algorithm.test.ts`

- Rewrote all tests to match new API
- Tests verify: overlap grouping, card ordering, flex behavior assignment
- 16 tests passing

## Why

The previous approach tried to calculate exact pixel widths using `calc()` expressions and absolute positioning for horizontal layout. This was fragile and produced incorrect results.

The new approach uses CSS Flexbox, which is designed for exactly this use case:
- Regular cards grow to fill available space (`flex: 1 1 0`)
- Fixed-width cards (deprioritized/milestone) only take content width (`flex: 0 0 auto`)

## Key Principles

1. **Earlier start date = leftmost position** (sort by startDateParsed ASC)
2. **Regular cards**: `flex: 1 1 0` - grow to fill remaining space
3. **Deprioritized cards**: `flex: 0 0 auto` - vertical text, content width only
4. **Milestone cards**: `flex: 0 0 auto` - link-style, content width only

## Verify

- `npm run build` → passes
- `npm run test` → all 16 algorithm tests pass
- Visual: overlapping experiences render side-by-side with correct ordering
