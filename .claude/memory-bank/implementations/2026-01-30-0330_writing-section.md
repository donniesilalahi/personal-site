# Writing Section

**Status**: completed
**Priority**: p1
**Date**: 2026-01-30-0330

## What Changed

### Content Layer
- `/content/writings/` — New directory for writing markdown files
- `/content/writings/_template_writing.md` — Template with frontmatter schema
- `/content/topics/` — New directory for topic/category markdown files
- `/content/topics/_template_topic.md` — Template for topic definitions
- Sample content: 3 writings + 3 topics (product-design, growth, reflections)

### Data Layer (`/src/lib/writings/`)
- `types.ts` — Type definitions for Writing, GrowthStage, WritingFrontmatter
- `topic-types.ts` — Type definitions for Topic, TopicFrontmatter
- `loader.ts` — Vite glob-based loader for writings (parseFrontmatter, validateFrontmatter, getAllWritings, getWritingBySlug, getWritingsByTopic, getRecentWritings)
- `topic-loader.ts` — Vite glob-based loader for topics (getAllTopics, getTopicBySlug)
- `index.ts` — Module exports

### UI Components (`/src/components/writing/`)
- `writing-card.tsx` — Card component with growth stage icon, title, date, optional description
- `writing-section-heading.tsx` — Section header with "View More" button linking to /writings
- `writing-section.tsx` — Homepage section displaying recent writings
- `index.ts` — Component exports

### Routes
- `/src/routes/writings.tsx` — All writings page with topic filter buttons
- `/src/routes/writing/$slug.tsx` — Individual writing page with SEO meta, markdown rendering
- `/src/routes/topic/$slug.tsx` — Topic-filtered writings page
- `/src/routes/index.tsx` — Added WritingSection to homepage

### Configuration
- `vite.config.ts` — Added `server.watch.ignored` for `/content/**` to prevent HMR loops

## Why

Implements new Writing section per design reference. Enables:
- Content-driven blog with markdown files (like experiences system)
- Growth stage visualization (seedling, budding, evergreen) for idea maturity
- Topic-based categorization with dedicated routes
- Full SEO support (title, description, OG image per article)
- File-based content management without database

## Verify

1. `npm run dev` → Visit `/` → Scroll to "Writing" section
2. Verify 3 articles displayed with growth stage icons (seedling/budding/evergreen)
3. Click article → Opens `/writing/{slug}` with full content, topic link, meta info
4. Click topic link → Opens `/topic/{slug}` with filtered articles
5. Click "View More" → Opens `/writings` with all articles and topic filter buttons
6. `npm run build` → Completes without errors

## Notes

### Architecture Decisions
- Mirrors experiences loader pattern (Vite `import.meta.glob` with eager loading)
- Growth stage icons from `/public/images/ideas_growth_stages/` (SVG)
- `showDescription` boolean controls card layout (title-only vs title+description)
- Topics are separate markdown files enabling future expansion (icons, descriptions)

### Content Schema
Writing frontmatter: title, slug, description, publishedAt, topic, growthStage, showDescription, seoTitle, seoDescription, seoImage
Topic frontmatter: name, slug, description, icon (optional)

### HMR Fix
Added `server.watch.ignored: ['**/content/**']` to prevent infinite reload loops when Vite's glob patterns detect content changes.

### Future Improvements
- Add prose styling for rendered markdown content
- Implement proper markdown parser (remark/rehype) instead of simple string splitting
- Add reading time calculation
- Add related articles suggestions
