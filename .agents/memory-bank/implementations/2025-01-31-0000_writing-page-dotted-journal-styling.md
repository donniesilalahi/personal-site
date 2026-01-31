# Writing Page Dotted Journal Styling

**Status**: completed  
**Priority**: p2  
**Date**: 2025-01-31

## What Changed

- `/src/components/postcard/postcard-frame.tsx` - Added `DottedLinesOverlay` component for dot grid pattern, exported for reuse
- `/src/routes/writing/$slug.tsx` - Imported and applied `DottedLinesOverlay` to content card, removed fixed aspect ratio for dynamic height expansion
- `/src/styles.css` - Added `.dotted-lines-overlay` CSS component with light/dark mode variants using radial-gradient dot pattern
- PostcardFrame: Removed `cursor-pointer` class (now shows normal text cursor on hover), added `md:aspect-auto` override for writing page

**Key changes**:
- Dot grid: 24px spacing, 1.5px radius dots, using `radial-gradient` for crisp appearance
- Light mode: Black dots at 15% opacity (`rgb(0 0 0 / 0.15)`)
- Dark mode: White dots at 15% opacity (`rgb(255 255 255 / 0.15)`)
- Content card: Removed `h-full` constraint and `md:aspect-[3/2]`, now expands dynamically with writing length
- Cursor behavior: Changed from pointer to auto/text for better UX when hovering content

## Why

Creates visual journal aesthetic for writing articles matching Figma design intent. Dotted grid pattern evokes dotted notebook paper (Bullet Journal style). Dynamic height prevents awkward white space on short posts or content overflow on long articles. Cursor change improves usability—content is readable text, not clickable elements.

## Verify

- `npm run dev` → `/writing/[any-slug]` → View dotted grid overlay on white background
- Toggle dark mode: Grid dots switch from black to white
- Short article: Card height minimal
- Long article: Card expands to fit all content without scroll
- Hover over content: Cursor is text/auto, not pointer
- Grid dots: 24px spacing, visible but subtle (~15% opacity)

## Notes

- Dot grid implemented via single `radial-gradient` for performance (no SVG, no multiple layers)
- Dark mode uses CSS custom property `.dark` selector for Tailwind dark mode compatibility
- `DottedLinesOverlay` component is reusable—can apply to other PostcardFrame sections if needed
- Removed `cursor-pointer` from PostcardFrame base to avoid interfering with interactive elements within cards
