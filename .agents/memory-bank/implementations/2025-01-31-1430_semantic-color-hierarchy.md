# Tertiary Color Token for Shadcn Theming

**Status**: completed  
**Priority**: p2  
**Date**: 2025-01-31

## What Changed

### Core Theme Variables
- `/src/styles.css` - Added `--tertiary` and `--tertiary-foreground` CSS variables in `:root` and `.dark`:
  - Light mode: `--tertiary: oklch(0.97 0 0)` / `--tertiary-foreground: oklch(0.467 0 0)`
  - Dark mode: `--tertiary: oklch(0.269 0 0)` / `--tertiary-foreground: oklch(0.708 0 0)`
- `@theme inline` directive registers `--color-tertiary` and `--color-tertiary-foreground` for Tailwind utilities

### Component Color Fixes
- `/src/components/profile-section.tsx` - Updated role text to use `text-tertiary-foreground` (line 27)
- `/src/routes/writing/$slug.tsx` - Changed page background from hardcoded `bg-primitives-colors-gray-light-mode-50` to `bg-secondary` (line 94)
- `/src/routes/writings.tsx` - Changed page background to `bg-secondary` (line 29)
- `/src/routes/topic/$slug.tsx` - Changed page background to `bg-secondary` (line 36)
- `/src/components/postcard/section-heading.tsx` - Uses semantic `text-muted-foreground` (line 27)
- `/src/components/writing/writing-section-heading.tsx` - Uses semantic `text-muted-foreground` (line 20)

### Removed
- Deprecated `emphasis-primary`, `emphasis-secondary` parallel color system that didn't integrate with Shadcn

## Why

Extends Shadcn's semantic color system (primary → secondary → muted) with a tertiary level between secondary and muted. Follows Shadcn's exact naming convention (`--{name}` / `--{name}-foreground`) so components automatically pick up the new level via `text-tertiary-foreground` / `bg-tertiary` without requiring a complete refactor.

Replaces the previous incorrect approach that created a parallel `emphasis-*` system which didn't integrate with Shadcn's theming.

## Color Hierarchy

| Level     | Use Case                           | Light fg  | Dark fg   |
|-----------|-----------------------------------|-----------|-----------|
| primary   | Main headings, key actions        | 0.205     | 0.87      |
| secondary | Section headings, secondary text  | 0.205     | 0.985     |
| tertiary  | Supporting text, labels           | 0.467     | 0.708     |
| muted     | Placeholders, disabled states     | 0.556     | 0.556     |

## Verify

- Build succeeds: `npm run build` (no TypeScript errors, no Tailwind warnings)
- Tailwind utilities work: Type `text-tertiary-foreground`, `bg-tertiary`, `bg-secondary` in component files
- Dark mode switches: Toggle theme on home page → all colors adapt via CSS variable cascade
- Profile section renders correctly with role text in tertiary foreground color
- Writing/topic pages have correct secondary background
- Section headings display with muted foreground color (correct semantic level)

## Notes

- Uses OKLCH color space (Tailwind v4 default)
- Components now fully use semantic color tokens instead of hardcoded class names
- All writing/topic/profile page backgrounds are now semantic (`bg-secondary`)
- Section headings follow proper hierarchy (muted for supporting UI labels)
- Future components can reference this 4-tier hierarchy for consistent semantic coloring
