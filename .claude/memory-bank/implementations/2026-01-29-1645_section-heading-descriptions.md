# Section Heading Descriptions

**Status**: completed
**Priority**: p3
**Date**: 2026-01-29-1645

## What Changed

- `src/components/postcard/section-heading.tsx` - Added optional `description` prop, changed font weight from semibold to normal, added description text below heading
- `src/components/career-timeline/timeline-section-heading.tsx` - Added optional `description` prop, changed font weight from semibold to normal, added description text below heading
- `src/components/postcard/postcard-section.tsx` - Added description: "Hello, world! My 30 seconds message to you and the internet."
- `src/components/career-timeline/career-timeline-section.tsx` - Changed label from "Career timeline" to "Career journey", added description about career playground and 0→1/1→10 work

## Why

Enhance section headings with contextual forewords that entice visitors to engage with each section. Provides immediate value proposition and storytelling before users interact with the full content.

## Verify

- `npm run dev` → visit homepage
- Check Postcard section has lighter heading with description below
- Check Career journey section has lighter heading with description about playground/experiments
- Descriptions use text-xs, Inter font (font-sans), and muted-foreground color

## Notes

- Descriptions are optional props for flexibility
- Both components maintain backward compatibility (description can be omitted)
- Font explicitly set to `font-sans` (Inter Variable) for consistency
