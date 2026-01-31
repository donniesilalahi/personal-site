# Projects Carousel Section

**Status**: completed
**Priority**: p1
**Date**: 2026-01-31

## What Changed

### Core Files Created
- `/src/lib/projects/types.ts` - Project interface with frontmatter schema (title, slug, description, visuals, roles, tags, status)
- `/src/lib/projects/loader.ts` - Vite `import.meta.glob()` loader with array/list parsing for frontmatter YAML
- `/src/lib/projects/index.ts` - Barrel exports
- `/src/components/projects/project-section.tsx` - Main carousel component with `useRef`, scroll tracking, navigation
- `/src/components/projects/project-section-heading.tsx` - Section heading with Back/Next buttons and index display
- `/src/components/projects/project-card.tsx` - Card component with title, description, visual highlights, roles/tags meta
- `/src/components/projects/project-visual-highlights.tsx` - Visual layout engine with 1/2/3-image rotation logic (±4° for 2-3 images)
- `/src/components/projects/index.ts` - Component barrel exports
- `/src/routes/project/$slug.tsx` - Individual project page with markdown rendering (mirrors writing/$slug.tsx pattern)

### Content Files Created
- `/content/projects/_template_project.md` - Template with frontmatter schema documentation
- `/content/projects/sample-project-one.md` - Example with 3 visuals
- `/content/projects/sample-project-two.md` - Example with 2 visuals
- `/content/projects/sample-project-three.md` - Example with 1 visual

### Integration
- `/src/routes/index.tsx` - Imported ProjectSection, positioned before WritingSection
- `/src/routeTree.gen.ts` - Auto-generated route tree (includes /project/$slug)
- `/public/images/placeholder.svg` - Placeholder checkerboard image for demo

### Key Algorithms
- **Frontmatter Parser** (`loader.ts`): Custom YAML parser handling arrays (list items with `- `) and inline arrays
- **Visual Highlights Layout** (`project-visual-highlights.tsx`):
  - 1 image: `w-[80%]` centered, no rotation
  - 2 images: `w-[55%]` each, positioned at left/right edges, rotated ±4°
  - 3 images: `w-[55%]` stacked with z-index, first +4°, middle 0°, last -4°
- **Carousel Navigation** (`project-section.tsx`): Scroll position tracking with `useEffect`, snap-based index detection, smooth scroll to card

## Why

Portfolio sections showcase work and demonstrate capability to visitors. The carousel layout (80% card width with peek of next card) creates intuitive "more content available" hint. File-based CMS mirrors existing experiences/writings pattern for consistency.

Resolves feature: Add Projects section with carousel gallery before Writing section on homepage, allowing users to browse project portfolio with individual detail pages.

## Verify

1. **Homepage Display**:
   - `npm run dev` → visit homepage
   - Projects section appears between Career Timeline and Writing sections
   - Carousel shows first project card at 80% width
   - Next project's left edge visible (hint for scrollability)

2. **Navigation**:
   - Click "Next" button → smooth scroll to next card, index updates
   - Click "Back" button → smooth scroll to previous card, disabled when at start
   - Manual scroll → index tracking updates current position

3. **Individual Project Pages**:
   - Click project card → navigate to `/project/{slug}`
   - Page displays title, date, roles (ALL CAPS), tags (#tag format)
   - Markdown content renders with MarkdownRenderer styling
   - Back button returns to homepage

4. **Visual Highlights**:
   - 1-image project: image displays at 80% width, no rotation, centered
   - 2-image project: two images visible, rotated ±4°, positioned at edges
   - 3-image project: three images stacked with overlapping effect, rotated +4°/0°/-4°

5. **Data Validation**:
   - Missing required fields (title, slug, description, publishedAt, visuals, roles, status) → build-time error
   - Visuals array must contain 1-3 images
   - Roles must have at least one entry
   - Status must be 'published' or 'draft' (only published visible)

## Notes

### Design Decisions
- **Array Parsing**: Custom YAML parser in loader handles both list-style (`- item`) and inline (`[item1, item2]`) arrays, supporting markdown frontmatter patterns
- **Carousel UX**: Used `w-[80%]` + gap to ensure next card is always partially visible, avoiding scrollbar confusion
- **Visual Rotation**: CSS transforms on parent divs (not images) maintain aspect ratio while applying rotation; shadow on images adds depth
- **Project Route**: Mirrors `/writing/$slug.tsx` pattern for consistency with existing architecture

### Follow-up Work
- Add more sample projects with actual images
- Consider drag/swipe support for mobile carousel navigation
- Implement project filtering/search if portfolio grows
- Add project category/collection support for organizing related work

### Files to Update When Adding Projects
1. Add markdown file to `/content/projects/`
2. Ensure frontmatter matches schema
3. Images go in `/public/images/projects/{slug}/`
4. No manual registration needed (glob loader auto-discovers)

### Architecture Notes
- Uses TanStack Start file-based routing (auto-generates routeTree.gen.ts)
- Follows "content in markdown + frontmatter, components consume via loader" pattern
- Carousel state managed via `useState` + `useRef` for scroll tracking
- Build-time validation ensures all projects meet schema requirements before deployment
