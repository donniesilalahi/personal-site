# Remove Folded Corner Effect

**Status**: completed
**Priority**: p2
**Date**: 2026-01-31

## What Changed

- `/src/routes/writing/$slug.tsx` - Removed folded corner effect
  - Removed `cornerLift` state and hover handlers
  - Removed folded corner div element
  - Restored standard `rounded-lg` border-radius on all corners
  - Removed unused React import

## Why

Folded corner effect didn't achieve desired visual quality after multiple implementation attempts (CSS border triangles, SVG paths, borderBottomLeftRadius). Reverted to clean card design.

## Verify

- `npm run dev` → navigate to `/writing/design-honesty`
- Card has standard rounded corners on all sides
- No folded corner element visible
- Dotted lines overlay still visible across card
