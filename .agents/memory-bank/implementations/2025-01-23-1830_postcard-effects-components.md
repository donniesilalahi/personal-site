# Postcard Effects Components

**Status**: completed  
**Priority**: p1  
**Date**: 2025-01-23

## What Changed

- `postcard-frame.tsx` - Reusable frame with 16px padding, drop shadow (x=0, y=3.17, blur=0, spread=0, #000000 25%), texture (size 0.4, radius 0.4), noise (mono, size 0.2, density 100%, #F6F3F1 10%)
- `image-effects.tsx` - Photo presets: misty (soft/dreamy), vintage (sepia/warm film), with custom filter support
- `postcard-front-cover.tsx` - Refactored to use PostcardFrame + ImageEffects (vintage default)
- `postcard-back-cover.tsx` - Refactored to use TextureOverlay + NoiseOverlay from postcard-frame

## Why

DRY: Effects duplicated across both covers. Single source for texture/noise/shadow enables consistent styling and future reuse. Vintage/misty presets provide quick photo grading without manual filters.

## Verify

- Build passes: npm run build ✓
- Lint passes: npm run lint --fix ✓
- Front cover applies vintage preset by default
- Back cover applies texture/noise correctly
