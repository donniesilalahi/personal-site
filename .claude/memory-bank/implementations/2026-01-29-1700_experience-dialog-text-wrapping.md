# Experience Dialog Text Wrapping

**Status**: completed
**Priority**: p3
**Date**: 2026-01-29

## What Changed

- `src/components/career-timeline/experience-dialog-drawer.tsx:81-98` - Converted "role @ company" from flexbox to inline layout with `align-middle` vertical alignment for @ symbol

## Why

Improves text wrapping behavior in experience detail cards. Previously, the flex layout forced "role", "@", and "company" into separate lines. Inline flow allows natural word-break wrapping when space is limited, with proper vertical centering of the smaller @ symbol.

## Verify

- `npm run dev` → Click any experience card → Verify "Role @ Company" wraps cleanly on narrow viewports
- Check that @ symbol appears vertically centered with surrounding text

## Notes

Changed from `flex items-center gap-1.5` to inline elements with `align-middle` on the @ span. Link uses `inline-flex` to keep arrow icon aligned while participating in text flow.
