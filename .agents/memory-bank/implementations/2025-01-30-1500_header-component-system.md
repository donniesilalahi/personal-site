# Header Component System

**Status**: completed  
**Priority**: p1  
**Date**: 2025-01-30

## What Changed

- `/src/components/header/header.tsx` - Main header component with logo (logomark + logotype), navigation menu, and theme toggle
- `/src/components/header/theme-toggle.tsx` - Reusable dark/light mode toggle with rotation animation
- `/src/components/header/index.ts` - Barrel export
- `/src/hooks/use-theme.ts` - Theme state management with localStorage persistence and system preference detection
- `/src/hooks/use-profile-visibility.ts` - Context + hook for intersection observer pattern
- `/src/components/providers.tsx` - Root provider component managing profile visibility observer
- `/src/routes/__root.tsx` - Integrated Header in RootComponent

## Why

Implements the design spec from Figma: responsive header that hides when profile section is visible, shows navigation menu items hidden on mobile under dropdown, persistent dark/light mode toggle, and logo consisting of profile picture + "Donnie" signature in italianno font. Resolves V1 layout requirement: fixed header with intelligent visibility, responsive menu, and theme switching.

## Verify

- `npm run dev` → Visit `/` → Header visible only after scrolling past profile section
- Toggle theme button (sun/moon icon) → Colors switch → Reload page → Theme persists
- Desktop (≥768px): All menu items visible as buttons, logotype "Donnie" shows
- Mobile (<768px): All menu items collapsed under "Menu" dropdown, logotype hidden
- Resize browser: Header properly hides/shows based on profile visibility
- Inspector: Verify `dark` class on `<html>` element when theme is dark

## Notes

- Header uses `fixed` positioning with z-50, transitions visibility smoothly with `-translate-y-full`
- IntersectionObserver with `threshold: 0` detects when profile section leaves viewport
- Theme toggle animates with 300ms spin animation, accessible via keyboard
- Logo picture uses `scale-[1.8]` with `object-cover object-[50%_30%]` to crop profile pic same as profile-section
- Menu structure: collapsedMobile flag controls desktop vs mobile visibility
- Uses ProfileVisibilityContext for cross-component communication
- No external dependencies beyond lucide-react icons and existing shadcn components
