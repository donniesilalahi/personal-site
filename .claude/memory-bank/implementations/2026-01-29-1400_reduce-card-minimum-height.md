# Reduce Card Minimum Height

**Status**: completed
**Priority**: p2
**Date**: 2026-01-29

## What Changed

- `src/components/career-timeline/career-calendar.constants.ts` - reduced `MIN_EXPERIENCE_HEIGHT_PX` from 24 to 20 pixels

## Why

Reduces whitespace for very short experience cards, allowing more compact display of brief timeline entries while maintaining readability.

## Verify

- Check `.constants.ts` file shows `MIN_EXPERIENCE_HEIGHT_PX = 20`
- Render career timeline with short experiences to confirm smaller minimum height applied
