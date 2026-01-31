# Header Universal Animation

**Status**: completed  
**Priority**: p2  
**Date**: 2026-01-31

## What Changed

- `src/components/header/header.tsx` - Removed `isHomePage` conditions from logo sizing, header height, and border visibility
- All pages now start with large logo (64px) + tall header (80px) + no border
- Animations driven purely by scroll progress instead of page context

## Why

Header styling should be consistent across all pages. Previously only homepage had the animated collapse effect; other pages showed the compact state immediately. This creates a unified, polished experience.

## Verify

- Visit homepage → logo is big, header is tall, no border
- Scroll down → logo shrinks, header collapses, border appears  
- Navigate to `/about` → verify same large state on initial load
- Scroll on `/about` → verify collapse animation works identically

## Notes

Logic now: `logoSize = LOGO_SIZE_LARGE - (LOGO_SIZE_LARGE - LOGO_SIZE_SMALL) * scrollProgress`

Scroll progress still driven by `useProfileVisibility()` hook, which works globally.
