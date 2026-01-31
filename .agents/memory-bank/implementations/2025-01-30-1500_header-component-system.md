# Header Component System

**Status**: completed  
**Priority**: p1  
**Date**: 2025-01-30

## What Changed

- `/src/components/header/header.tsx` - Main header component with animated profile picture logo, navigation menu, and theme toggle
- `/src/components/header/theme-toggle.tsx` - Reusable dark/light mode toggle with rotation animation
- `/src/components/header/index.ts` - Barrel export
- `/src/hooks/use-theme.ts` - Theme state management with localStorage persistence and system preference detection
- `/src/hooks/use-profile-visibility.ts` - Context + hook with scrollProgress tracking for smooth animations
- `/src/components/providers.tsx` - Root provider with IntersectionObserver for profile visibility and scroll progress calculation
- `/src/components/profile-section.tsx` - Simplified layout (name + tagline only), profile picture moved to header logo
- `/src/routes/__root.tsx` - Integrated Header in RootComponent

**Key animations**:
- Logo size: 64px → 40px (animated on homepage only via scrollProgress)
- Header height: 80px → 56px (animated on homepage only)
- Header border: hidden at top, fades in on scroll
- All transitions use 300ms duration with ease-out

## Why

Implements Figma design spec: responsive header with animated profile picture logo that shrinks as user scrolls, intelligent header height reduction, and persistent theme toggle. Profile section simplified to text-only (name + professional role), with profile photo repositioned to header as animated logo. Resolves V1 layout requirement: sophisticated scroll-triggered animations, responsive menu, and theme switching.

## Verify

- `npm run dev` → Visit `/` → Logo shrinks from 64px to 40px on scroll, header height contracts 80px → 56px
- Header border hidden at top of page, appears on scroll (shows when scrollProgress > 0)
- Menu items: Desktop shows all items inline, mobile hides all items except theme toggle under "Menu" dropdown
- Theme toggle: Sun/moon icon rotates 360°, color scheme persists on reload
- Profile section: Shows only name and tagline, profile picture appears only in header
- Other pages (`/about`, `/now`, etc.): Show compact header immediately (no animations)
- Inspector: scrollProgress 0-1 tracks profile bottom position relative to header height

## Notes

- ScrollProgress calculated from profileRect.bottom vs header (56px) and profile height
- Animation only triggers on homepage (isHomePage context flag)
- Logo uses same object-cover crop `object-[50%_30%]` as original design
- Menu collapsedMobile flag separates desktop vs mobile visibility
- Header: `fixed top-0 left-0 right-0 z-50` with backdrop-blur for translucency
- No external animation libraries—uses CSS transitions and style interpolation
