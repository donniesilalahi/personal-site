# Centralized Markdown Renderer

**Status**: completed  
**Priority**: p2  
**Date**: 2025-01-31

## What Changed

- Created `/src/components/ui/markdown-renderer.tsx` - Single source of truth for markdown rendering
- Removed duplicated ReactMarkdown config from `/src/components/career-timeline/experience-dialog-drawer.tsx`
- Removed duplicated ReactMarkdown config from `/src/routes/writing/$slug.tsx`
- Both components now import and use `<MarkdownRenderer content={...} className={...} />`
- Eliminated ~160 lines of duplicated code

## Why

DRY principle: Markdown rendering configuration was identically duplicated in two places. A single component ensures:
- Consistent styling across all markdown content (experiences, writings)
- Reduced maintenance burden
- Easier to update styling in one place
- Follows Shadcn component composition patterns

## What It Handles

Element support: h1-h6, p, ul, ol, li, blockquote, code (inline/block), pre, a, strong, em, del, hr, img, table (table/thead/tbody/tr/th/td)

Styling: Uses semantic color tokens (secondary-foreground, tertiary-foreground, muted-foreground) and Tailwind utilities for consistent typography.

## Verify

- `npm run dev` → Navigate to `/writing/*` page → markdown renders correctly
- Visit experience item (career-timeline) → modal/drawer opens → markdown content renders
- All headings, lists, code blocks, tables, links display with correct styling
- `npm run build` succeeds
- No TypeScript errors

## Notes

- Component accepts optional `className` prop for additional wrapper styling
- Uses `react-markdown` already in dependencies
- All markdown elements mapped to custom styled components
- Ready for future markdown-heavy features (blog, notes, etc.)
