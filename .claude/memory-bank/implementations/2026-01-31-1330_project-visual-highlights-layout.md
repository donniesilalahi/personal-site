# Project Visual Highlights Layout & Frame Styling

**Status**: completed
**Priority**: p1
**Date**: 2026-01-31

## What Changed

- `/src/components/projects/project-visual-highlights.tsx` - Frame styling & position fixes
  - Frame: added `border-neutral-200`, `rounded-md`, shadow `1px 2px 4px rgba(0,0,0,0.1)`
  - Removed inner padding from visual container
  - 2-image layout: front at left-bottom (z-10), back at right-top
  - 3-image layout: back at top-right, middle at center (z-10), front at bottom-left (z-20)
  - All layouts centered horizontally and vertically via flex parent

## Why

Visual highlights needed postcard-like frame styling (border, shadow) and corrected positioning for proper depth/overlap effects matching design specs.

## Verify

- `npm run dev` → visit project cards
- 2-image project: left-bottom image on top, right-top behind, both rotated ±4°
- 3-image project: three-layer stack with proper z-ordering and scattered placement
- Frame has subtle border and xy shadow, no inner padding

## Notes

- Rotations (±4°) applied via CSS transform on parent divs
- All containers centered using flex parent + relative positioning
