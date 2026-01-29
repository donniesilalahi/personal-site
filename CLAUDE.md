# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Commands

```bash
# Development
npm run dev              # Start dev server on port 3000
npm run dev:clean        # Kill stuck dev ports + restart
npm run build            # Production build (TanStack Start → Nitro)
npm run preview          # Preview production build

# Quality
npm run test             # Run all tests (vitest)
npm run test -- src/path/to/file.test.ts  # Single test file
npm run lint             # ESLint check
npm run check            # prettier --write + eslint --fix
```

## Architecture

**Framework**: TanStack Start (React 19 + Vite) deployed to Cloudflare Workers via GitHub Actions

**Key directories**:
- `src/routes/` — File-based routing (TanStack Router)
- `src/components/` — React components (Shadcn UI in `ui/`)
- `src/lib/` — Utilities, hooks, data loaders
- `content/experiences/` — Markdown files with YAML frontmatter (auto-loaded via Vite glob)

**Imports**: Use `@/` alias for absolute imports (`@/components`, `@/lib`)

## Career Timeline System

The career timeline uses a custom positioning algorithm:

1. **Content** (`content/experiences/*.md`): Markdown files with frontmatter defining company, role, dates, category (primary/secondary/tertiary), subcategory, arrangement
2. **Loader** (`lib/experiences/loader.ts`): Uses `import.meta.glob()` to load all experience files at build time
3. **Algorithm** (`components/career-timeline/career-calendar.algorithm.ts`): Groups overlapping experiences into "connected components" and calculates CSS Grid positions
4. **Rendering**: `CareerCalendar` → `GroupRenderer` → `ExperienceEntryCard`

Experience files use this frontmatter format:
```yaml
company: "Company Name"
role: "Job Title"
startDate: "2023-01"
endDate: "2023-12"
category: "primary"        # primary | secondary | tertiary
subcategory: "work"        # work | entrepreneurship | teaching | etc.
arrangement: "full-time"   # full-time | part-time | contract | etc.
```

## Code Style

- **TypeScript**: Strict mode, no `any`, explicit return types, interfaces over types
- **Styling**: Tailwind CSS v4, CSS variables in `styles.css`, use `cn()` utility for class merging
- **Components**: Functional only, single responsibility, composition over inheritance

## Deployment

**Golden rule**: Only deploy via `git push` → GitHub Actions handles Cloudflare Workers deployment.

Never use `npm run deploy` or `wrangler deploy` directly.

## Memory Bank

Check `.claude/memory-bank/` for project context:
- `analysis/` — Root cause investigations
- `planning/` — Task plans
- `implementations/` — Implementation specs (written after features)
- `lessons-learned/` — Reusable patterns

## MCP Tools

Available MCPs for documentation and tooling:
- **TanStack MCP**: Router, Start, Query docs
- **Shadcn MCP**: Component examples
- **Context7 MCP**: Search any tech docs
- **GitHub MCP**: PRs, issues, commits
- **Chrome DevTools MCP**: Browser testing
