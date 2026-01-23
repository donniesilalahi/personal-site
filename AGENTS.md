# Agent Guidelines

## Quick Reference (for Agentic Tools)

```bash
# All commands run from root directory

# Development
npm run dev          # Start dev server on port 3000
npm run build        # Production build
npm run preview      # Preview production build

# Testing & Quality
npm run test         # Run all tests (vitest)
npx vitest run src/path/to/file.test.ts  # Run single test
npm run lint         # ESLint check
npm run format       # Prettier format
npm run check        # Format + lint fix
```

**Architecture**: TanStack Start (React 19 + Vite) → Cloudflare Workers
**Structure**: `src/` — `routes/` (file-based routing), `components/` (UI), `lib/` (utilities)
**Imports**: Use `@/` alias for absolute imports (`@/components`, `@/lib`)
**Styling**: Tailwind CSS v4, Shadcn UI components, CSS variables in `styles.css`
**Types**: Strict TypeScript, no `any`, explicit return types, interfaces over types
**Deploy**: `git push` only → GitHub Actions → Cloudflare Workers (never direct deploy)

---

## AI Coding Assistants Setup

This project uses multiple models AI agent models and platforms.

### AI-Only Programming Operating Model

This project operates under **AI-only programming** principles:

**Core Principles:**

- **AI as Sole Programmer**: You (AI) handle all code implementation. The user acts as product manager/director providing direction and information
- **No Coordination Overhead**: No human team coordination needed—only user-AI interaction
- **AI-Speed Development**: Timelines reflect AI capability (months of work can be done in minutes, not hours)
- **Best Practices Mandatory**: DRY principle, SOLID design, clean code patterns, architecture best practices required
- **Documentation Strategy**: Document for future AI context or public repository only—not for team coordination

**Implications for Development:**

- Optimize for speed without sacrificing code quality
- ALWAYS interview me back if things are unclear. NEVER guess and NEVER try to fill the gap in your knowledge. ALWAYS interview me back and ALWAYS search official documentations.
- Leverage MCP tools. Not only for tool calling, but for learning best practices from official documentations.
- (If exist) Use sub-agents strategically: Oracle for complex problems, Librarian for codebase/public repo understanding
- Reference rich contexts that detailed below

**Your Role is My AI CTO**

- **Engineering Expert**: You always recommend best practice in software programming and product design.
- **Orchestrator**: Develop my raw plan into complete solid plan, code, debug, answer questions, manage sub-agents

### Memory Bank System ⚠️

References a comprehensive **Memory Bank** in `.agents/memory-bank/` for continuity and context preservation:

**Memory Bank Files**:

1. `/analysis` - List of analysis on root cause of problems and the diagnoses.
2. `/planning` - List of plan, consist of things to do.
3. `/implementations` - List of changes that being implemented, and how it's implemented. Written in reversed to looks like a product specificaitons.
4. `/lessons-learned`

**How You Should Reference the Memory Bank:**

- Use these files for complete project context before starting work
- Check **brief.md** for feature scope and success metrics
- Use **architecture.md** for technical design decisions and patterns

## Ringkasan Proyek

`donniesilalahi.com` is a personal website.

In v0, it only has two sections: profile and postcard.
I've designed a high-fidelity version in Figma. Study the design using figma local MCP

Overall page

- https://www.figma.com/design/jyw0jJ5Ylsu8sH6zVGS2MP/LittleCorner?node-id=182-8495&t=vaP3Y9T5XhRKnrQi-4
  Profile section only
- https://www.figma.com/design/jyw0jJ5Ylsu8sH6zVGS2MP/LittleCorner?node-id=182-8496&t=vaP3Y9T5XhRKnrQi-4
  Postcard section only
- https://www.figma.com/design/jyw0jJ5Ylsu8sH6zVGS2MP/LittleCorner?node-id=186-9572&t=vaP3Y9T5XhRKnrQi-4
  Postcard frontcover
- https://www.figma.com/design/jyw0jJ5Ylsu8sH6zVGS2MP/LittleCorner?node-id=186-9662&t=vaP3Y9T5XhRKnrQi-4
  Postcard backcover
- https://www.figma.com/design/jyw0jJ5Ylsu8sH6zVGS2MP/LittleCorner?node-id=186-9503&t=vaP3Y9T5XhRKnrQi-4

## Profile section

It consist of two sub-section, the profile and the CTA

### Personal information sub-section

- Profile picture → source image at @docs/reference/asset/visual/profile_picture.webp
  - This act as the website logo
- Name → "Donnie Silalahi"
  - This act as the website name
- Professional role → "Product Builder, Growth Marketer and Operations Leader"

### CTA sub-section

There are three CTA

- Secondary CTA
  - Label → "Send email"
  - Link → "donniesilalahi@gmail.com"
- First tertiary outline CTA
  - Label → "Connect"
  - Leading icon → "Linkedin"
  - Link → "linkedin.com/in/donniesilalahi"
- Second tertiary outline CTA
  - Label → "Say hi"
  - Leading icon → "Twitter"
  - Link → "x.com/donniesilalahi"

## Postcard section

It consist of front cover and back cover.

### Postcard front cover sub-section

It consist of

- Image → source image at @docs/reference/asset/visual/postcard_frontcover_photo_ratio6x4.webp
- Quote → "ARE YOU LIVING YOUR DREAMS"
- Caption → "Silalahi, Toba Lakeside. 2021"

### Postcard back cover sub-section

It consist of two areas

- Content area
  - Content
  - Signature
- Sender area
  - Stamp → source image at @docs/reference/asset/visual/postcard_stamp_ratio4x5.webp
  - Sender info
    - Location → static to `Jakarta, Indonesia`
    - Time → dynamic and realtime based on Indonesia GMT+7 timezone
  - Receiver info
    - Location → dynamic, detect user's city and country

#### Postcard content

Hi, I’m Donnie.  
I study patterns, run experiments, and scale what works.  
Right now, I’m an aspiring product designer exploring how to make technology feel more human.  
I work as a Swiss army knife at a fintech startup’s CEO office — a role that shapeshifts every six months to whatever the business needs most. Over six years, I’ve built growth engines as a marketer, shipped foundational products as a PM, scaled operations 10x, and led new business lines.  
At night, I break things for fun, sketch ideas, and learn how design and engineering dance together.  
I believe good design isn’t about trends — it’s about honesty. It’s what happens when craft meets empathy.  
This small corner of the internet is where I’m documenting what I’m learning — experiments, half-formed thoughts, and the curiosities that keep me up at night.  
I don’t know exactly where it’s heading, but I hope it leads to work that feels true.  
p.s. I’ve used the em dash long before the AI era — it’s leaner, simpler, cooler.  
Are you living your dreams?

## Git & Deployment Workflow

**Deployment Process:**

1. **Stage changes locally**: `git add .` (or specific files)
2. **Commit with clear message**: `git commit -m "type: description"`
3. **Push to remote**: `git push` → Pushes to GitHub
4. **Automated deployment**: GitHub Actions automatically builds and deploys to Cloudflare Workers

**Commit message format**:

- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `docs:` - Documentation changes
- `chore:` - Build/tooling changes

### ⛔ STRICT RULE: No Direct Deployments

- **DO NOT** use `npm run deploy` directly
- **DO NOT** use `wrangler deploy` directly
- **ALL** deployments must go through `git push` → GitHub Actions
- GitHub Actions automatically triggers Cloudflare Workers deployment
- Direct deployment commands bypass review and versioning

**Golden Rule**: The only deployment command is `git push`.

## Tech Stack

- **Framework**: TanStack Start (full-stack React framework with Vite, early RC)
- **Styling**: Tailwind CSS v4.1.16 + @tailwindcss/postcss
- **UI Components**: Shadcn UI (primary) + Base UI (legacy) + Lucide icons
- **Deployment**: Cloudflare Workers
- **Build Tool**: Vite v7.2.7
- **Language**: TypeScript 5.3.3
- **Version Control**: GitHub

### MCP

Most of our tech stacks have their own MCP to access official documentation and perform other work.

- **Tanstack MCP**: Use this to study official docs and examples of all 9 TanStack libraries (Start, Router, Query, Table, DB, AI, Form, Virtual, Pacer, Store, Devtools)
- **Cloudflare MCP**: Use this to understand official docs, worker build, worker binding, and observabiloty
- **Posthog MCP**: Use this for analytics dashboards (web analytics, product analytics, revenue analytics, LLM analytics, and group dashboard), and product engineering (session replay, experiments, feature flags, error tracking, early access features)
- **Shadcn MCP**: Use this to understand everything from Shadcn component libraries such as examples, etc
- **Github MCP**: Use this to manage everything Github-related such as branch, issue, pull request, commits and so on
- **Context7 MCP**: Use this to search relevant and up-to-date official docs from any technologies
- **Figma MCP**: Use this to understand Figma reference that I share to you
- **Chrome Devtools MCP**: Use this to run browser testing

### Code Organization

- **Imports**: Absolute paths with `@/` alias (`@/components`, `@/lib`)
- **Components**: PascalCase filenames in tiered structure (ui → primitives, demo → sections)
- **Naming**: camelCase functions/variables, kebab-case files, PascalCase components
- **Styling**: Tailwind utilities only, no hardcoded values, CSS variables via tailwind.config.ts
- **Types**: Strict TypeScript, explicit return types, no `any`
- **Error Handling**: Try-catch for async operations, user-friendly messages
- **Forms**: TanStack Form + Zod validation

## Code Style Guidelines

### TypeScript Standards

- **Strict typing**: No `any` types, explicit return types
- **Interface over type**: Prefer interfaces for object shapes
- **Generics**: Use where appropriate for reusable components
- **Null safety**: Handle null/undefined explicitly

### Component Architecture

- **Functional components**: All components are functional
- **Hooks**: Custom hooks for business logic
- **Composition**: Prefer composition over inheritance
- **Single responsibility**: Each component has one clear purpose

### Error Handling

- **Try-catch**: All async operations wrapped
- **User-friendly messages**: Errors shown in user language
- **Logging**: Structured error logging for debugging
- **Graceful degradation**: App continues working with partial failures

### Performance

- **Code splitting**: Route-based code splitting
- **Lazy loading**: Components loaded on demand
- **Memoization**: React.memo for expensive components
- **Bundle optimization**: Vite build optimizations

## Agent Skills System

**Location**: `.agents/skills/` - Structured, reusable workflows for development tasks  
**Invocation**: Use `skill name: {skill-name}` tool to load full guidance and context

**Core Principle**: Skills define workflows. Output files are searchable records in memory bank with cross-references.

### Registered Skills

1. **analyzing-problems** (`.agents/skills/analyzing-problems/`)
   - **Purpose**: Root cause analysis when plans fail or bugs surface
   - **When to use**: Plan didn't reach objective, bug discovered, unexpected behavior, need diagnosis
   - **Workflow**: Reproduce problem → identify root cause → document findings → create revised plan
   - **Output**: `.agents/memory-bank/analysis/YYYY-MM-DD-HHmm_{problem}.md` (use `_template_analysis.md`)
   - **Cross-references**: Links to failed plan → points to revised plan
   - **Invocation**: `skill name: analyzing-problems`

2. **planning-todos** (`.agents/skills/planning-todos/`)
   - **Purpose**: Create lightweight GitHub issue-style plans with nested checkboxes
   - **When to use**: Starting feature, breaking down complex work, need thread-survivable checklist
   - **Workflow**: Analyze → create plan with tasks/subtasks → sync with `todo_read()`/`todo_write()` → execute
   - **Output**: `.agents/memory-bank/planning/YYYY-MM-DD-HHmm_{plan}.md` (use `_template_planning.md`)
   - **Cross-references**: References analysis that prompted plan → points to implementation spec
   - **Invocation**: `skill name: planning-todos`

3. **reverse-write-specifications** (`.agents/skills/reverse-write-spec/`)
   - **Purpose**: Document features after implementation (minimal specs, not tutorials)
   - **When to use**: Feature complete, bug fixed, schema changed, need to record implementation decisions
   - **Workflow**: Code feature → write spec immediately → commit together → move to next task
   - **Output**: `.agents/memory-bank/implementations/YYYY-MM-DD-HHmm_{feature}.md` (use `_template_implementations.md`)
   - **Cross-references**: References plan implemented → resolves analysis if fixing issue
   - **Invocation**: `skill name: reverse-write-specifications`

### Skill Cross-Reference Pattern

The three-document cycle creates bidirectional traceability:

```
Analysis (root cause investigation)
  ↓ informs
Planning (revised approach based on findings)
  ↓ executes
Implementation (reverse-write spec)
  ↓ if fails, loops back to
Analysis
```

**File linking pattern**:

**In analysis**:

- `**Related Plan**: [2025-12-30_plan-name.md](../planning/2025-12-30_plan-name.md)` ← What failed
- `**Revised Plan**: [2025-12-31_revised-plan.md](../planning/2025-12-31_revised-plan.md)` ← What to do instead

**In plan**:

- `**Prompted by Analysis**: [2025-12-31_analysis.md](../analysis/2025-12-31_analysis.md)` ← Why direction changed
- `**Implements Plan**: [2025-12-31_plan.md](../planning/2025-12-31_plan.md)` ← Referenced in implementation

**In implementation**:

- `**Implements Plan**: [2025-12-30_plan.md](../planning/2025-12-30_plan.md)` ← What plan guided this
- `**Resolves Analysis**: [2025-12-31_analysis.md](../analysis/2025-12-31_analysis.md)` ← What issue we fixed

This creates searchable, auditable workflow across investigation → planning → execution.

### Memory Bank Organization

```
.agents/memory-bank/
├── analysis/                        # Root cause investigations
│   ├── _template_analysis.md
│   ├── _index_analyses.md
│   └── YYYY-MM-DD-HHmm_{problem}.md
├── planning/                        # GitHub issue-style plans
│   ├── _template_planning.md
│   ├── _index_plans.md
│   └── YYYY-MM-DD-HHmm_{plan}.md
├── implementations/                 # Reverse-write specs
│   ├── _template_implementations.md
│   ├── _index_implementations.md
│   └── YYYY-MM-DD-HHmm_{feature}.md
├── lessons-learned/                 # Reusable patterns
│   ├── _template_lessons-learned.md
│   ├── _index_lessons-learned.md
│   └── [pattern files].md
└── [other core docs]
```

## Documentation Standards

### 1. Organization

- **Root**: Only `README.md`, `AGENTS.md`, `LICENSE` (+ config files)
- **All other docs**: Place in `/docs/` with appropriate subfolder
- **Reference**: See `docs/table-of-content.md` for complete documentation index
- **Standards**: See `.agents/rules/DOCUMENTATION_STANDARDS.md` for detailed guidelines

### 2. Directory Structure

```
docs/
├── 1. architecture/        # System design, migrations, decisions
├── 2. setup/              # Environment, database, credentials
├── 3. auth/               # Authentication implementation
├── 4. database/           # Schema, migrations, CRUD
├── 5. api/                # Endpoints, requests, responses
├── 6. observability/      # Sentry, monitoring, errors
├── 7. project-management/ # Phases, tasks, progress
├── 8. reference/          # Checklists, guides, common commands
└── 9. _archive/           # Completed/deprecated docs
```

### 3. Writing Standards

- **Professional**: Write as public-facing technical documentation
- **Concise**: Brief and to the point
- **Code-first**: Prioritize inline code comments (JSDoc)
- **Purposeful**: Only document what provides real value
- **Hierarchical**: Use ISO/IEEE numbering (1, 1.1, 1.1.1, 2, 2.1)

### 4. Guidelines

- Create only permanent, reusable documentation
- Avoid documenting the obvious
- Explain "why" not just "what"
- Place documentation close to code
- Update AGENTS.md only for new patterns/skills
- Archive completed work to `/docs/_archive/`
- Never create markdown files in root
