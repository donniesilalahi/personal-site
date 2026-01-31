# Bricolage Grotesque Typography

**Status**: completed  
**Priority**: p2  
**Date**: 2025-01-31

## What Changed

- `/src/components/ui/markdown-renderer.tsx` - All heading levels (h1-h6) use Bricolage Grotesque with specific weights:
  - h1: `font-black`
  - h2: `font-bold`
  - h3, h4: `font-semibold`
  - h5, h6: `font-normal`
- `/src/routes/writing/$slug.tsx` - Article title (h1) uses Bricolage Grotesque with `font-black`
- `/src/routes/writings.tsx` - Page h1 uses Bricolage Grotesque with `font-medium`
- `/src/routes/topic/$slug.tsx` - Topic page h1 uses Bricolage Grotesque with `font-medium`
- `/src/components/profile-section.tsx` - "Donnie Silalahi" name uses Bricolage Grotesque (no weight change)
- `/src/components/postcard/section-heading.tsx` - Section labels use Bricolage Grotesque (no weight change)
- `/src/components/career-timeline/timeline-section-heading.tsx` - Section labels use Bricolage Grotesque (no weight change)
- `/src/components/writing/writing-section-heading.tsx` - Section labels use Bricolage Grotesque (no weight change)

## Why

Applied consistent brand typography using Bricolage Grotesque (already imported in `styles.css`) for all headings across the site. Font was configured in Tailwind theme as `--font-bricolage`. Specific weight assignments create visual hierarchy: highest emphasis (h1 black) → medium (h2 bold) → light (h3/h4 semibold). Section labels and other headings use the font without weight changes to maintain existing hierarchy.

## Verify

- `npm run dev` → Visit `/` → Verify "Donnie Silalahi" uses Bricolage
- Visit `/writings` → Check "Writing" title uses Bricolage
- Visit any `/writing/[slug]` → Verify article title uses Bricolage with heavy weight
- Check section headings (Postcard, Career Timeline, Writing sections) use Bricolage
- All h2-h6 in markdown content render with Bricolage font

## Notes

- Bricolage Grotesque is a variable font, enabling smooth weight transitions
- All existing weight values preserved on non-heading sections
- Font is loaded via `@fontsource-variable/bricolage-grotesque` in `styles.css`
