# Writing Page Folded Corner Effect

**Status**: completed
**Priority**: p2
**Date**: 2026-01-31

## What Changed

- `/src/routes/writing/$slug.tsx` - Added folded corner effect to writing detail page card
  - Curved fold shape using `borderBottomLeftRadius: 100%`
  - Gradient background (#e5e5e5 → #d5d5d5) showing paper backside
  - Subtle box-shadow for depth
  - Hover animation: fold grows from 20px to 28px
  - Card has `borderRadius: '8px 0 8px 8px'` (no radius on folded corner)
- DottedLinesOverlay moved to cover entire card container (header + content)

## Why

Visual polish for writing detail page - sticky note aesthetic with folded corner effect that enhances the journaling/paper feel of the writing section.

## Verify

- `npm run dev` → navigate to any writing (e.g., `/writing/design-honesty`)
- Top-right corner shows curved gray fold
- Hover over card → fold grows larger
- Dotted lines visible across entire card background

## Notes

- Multiple approaches attempted (CSS border triangles, SVG paths) before settling on simple `borderBottomLeftRadius: 100%` solution
- Key insight: simple CSS often beats complex SVG for subtle effects
