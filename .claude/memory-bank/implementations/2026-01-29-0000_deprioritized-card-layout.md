# Deprioritized Card Layout Improvements

**Status**: completed
**Priority**: p2
**Date**: 2026-01-29

## What Changed

- `src/components/career-timeline/experience-entry-card.tsx` - Refactored deprioritized card layout with new structure and manual text truncation
  - New `VerticalTruncatedText` component for handling vertical text with manual ellipsis (since CSS `text-overflow: ellipsis` doesn't work with `writing-mode: vertical-rl + transform`)
  - Icon + start date now grouped in same column (icon at bottom-left, start date at top-right)
  - Increased gap from 0.5 to 1.5 (6px spacing)
  - Role and company combined as single inline text (e.g., "Maker @ Katalis") instead of three separate parts
  - Both text columns use linear search to find optimal truncation point

## Why

Career timeline deprioritized experiences were hard to read with poor text layout. Grouping icon + date, treating role@company as atomic text, and proper vertical text truncation make cards more compact and readable when squeezed in timeline view.

## Verify

- `npm run dev` → Navigate to career timeline
- View deprioritized card (e.g., "Maker @ Katalis" 2019-2020)
- Verify: icon bottom-left, start date above it (same column)
- Verify: role @ company in second column as single text
- Squeeze card height → text should truncate with ".." instead of overflowing

## Notes

- Manual text truncation needed because browsers don't apply `textOverflow: ellipsis` with `vertical-rl` writing mode + rotation
- `VerticalTruncatedText` uses `scrollHeight` measurement and linear search for reliable truncation
- Start date: `alignEnd={false}` (top-aligned), Role@Company: `alignEnd={true}` (bottom-aligned)
- Future: Consider canvas-based text measurement if scrollHeight becomes unreliable
