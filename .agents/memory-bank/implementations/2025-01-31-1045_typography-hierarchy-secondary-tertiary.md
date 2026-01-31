# Typography Hierarchy: Secondary & Tertiary Text Colors

**Status**: completed  
**Priority**: p2  
**Date**: 2025-01-31

## What Changed

- **Section headings** (3 components):
  - `src/components/postcard/section-heading.tsx`
  - `src/components/writing/writing-section-heading.tsx`
  - `src/components/career-timeline/timeline-section-heading.tsx`
  - Changed label text from `text-muted-foreground` → `text-secondary-foreground`

- **Navigation menus** (`src/components/header/header.tsx`):
  - Desktop menu items: `text-muted-foreground` → `text-secondary-foreground`
  - Mobile menu items: `text-muted-foreground` → `text-secondary-foreground`

- **Experience cards** (`src/components/career-timeline/experience-entry-card.tsx`):
  - Role @ Company text (short duration layout): `text-muted-foreground` → `text-secondary-foreground`
  - Role @ Company text (long duration layout): `text-muted-foreground` → `text-secondary-foreground`

- **Experience dialog header** (`src/components/career-timeline/experience-dialog-drawer.tsx`):
  - Role @ Company heading: All text (`role`, `@`, `company`, `link`) → `text-secondary-foreground`
  - Markdown headings (h1-h6): `text-muted-foreground` → `text-secondary-foreground`
  - Markdown body text (p, li, blockquote, code): `text-muted-foreground` → `text-tertiary-foreground`

- **Writing article page** (`src/routes/writing/$slug.tsx`):
  - Article title (h1): `text-foreground` → `text-secondary-foreground`
  - Markdown headings (h1-h6): `text-muted-foreground` → `text-secondary-foreground`
  - Markdown body text (p, li, blockquote, code): `text-muted-foreground` → `text-tertiary-foreground`

## Why

Implements visual hierarchy to distinguish information importance levels:
- **Secondary-foreground**: Section labels, navigation, role/company context (metadata/navigation)
- **Tertiary-foreground**: Body content, article text (reading/detail)

This creates a three-tier emphasis system: primary (foreground) → secondary (secondary-foreground) → tertiary (tertiary-foreground).

## Verify

- Visit `/` → section headings (Profile, Postcard, Career Timeline) appear in secondary color
- Click header navigation items → appear in secondary color
- Hover over experience entries → role @ company in secondary color
- Click experience card → dialog opens showing role @ company in secondary, description in tertiary
- Visit any writing article → title in secondary, body text in tertiary
- Markdown headings in content → secondary, body paragraphs → tertiary

## Notes

- `text-secondary-foreground` (not `text-secondary`) is correct—secondary alone is background color
- Color hierarchy applies consistently across all markdown renderers
- Border colors (blockquotes, hr) also updated to tertiary for consistency
