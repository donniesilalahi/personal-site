# Writing Page Card Layout & Lifted Corner Effect

**Status**: completed  
**Priority**: p2  
**Date**: 2025-01-31

## What Changed

- `src/routes/writing/$slug.tsx` - Refactored layout into card container with lifted corner effect, separated header/meta from content with divider
- `src/routes/writings.tsx` - Changed background to white, updated back button
- `src/routes/topic/$slug.tsx` - Changed background to white, updated back button
- Back buttons converted to styled Links (removed Button component)
- Removed `PostcardFrame` wrapper, description field removed
- Added paper-like lifted corner animation (2px default → 5px on hover/scroll)

## Why

Implements Figma design v1 for writing pages. Card-based layout with lifted corner effect creates paper aesthetic matching postcard section. White background provides cleaner reading experience for long-form content.

## Verify

- `npm run dev` → navigate to `/writing/design-honesty`
- Card container visible with white background and neutral-200 border
- Top-right corner shows lifted triangle effect (subtle by default)
- Hovering over card or scrolling increases lift (2px → 5px)
- Back button outside card with hover effect
- Header and content separated by horizontal divider
- No description text below title

## Notes

- Lifted corner uses CSS transform + border triangle technique
- Corner lift state managed via React hooks (onMouseEnter/Leave)
- Used Link component directly instead of Button wrapper for accessibility
- Background changed from `bg-secondary` to `bg-white` across all three files
- "Kembali" → "Back" label change for consistency
