---
name: reverse-write-specifications
description: Create minimal implementation specifications after coding features. Documents what was built, why it matters, and how to verify.
---

# Reverse-Write Specifications Skill

## What I Do

After implementing a feature, I create a concise spec (50-120 lines) that:

- Describes what was built (files changed, key logic)
- Links to the problem it solves (priority, feature goal)
- Provides verification steps (how to test it works)

This creates a searchable record of implementation decisions using product-focused naming.

## When to Use

- Feature implementation complete
- Bug fix or refactor finished
- Database schema changes applied
- Need to document "what happened" for future reference

## Format & Location

**Location**: `.claude/memory-bank/implementations/`
**File naming**: `YYYY-MM-DD-HHmm_{feature-name}.md` (e.g., `2025-12-27-1430_campaign-crud.md`, `2025-12-27-1530_user-authentication.md`)
**Index**: `.claude/memory-bank/implementations/_index_implementations.md`
**Template**: `.claude/memory-bank/implementations/_template_implementations.md`

**Do NOT use**: Phase numbers, CAPSLOCK, generic terms

## Spec Template

```markdown
# {Feature Name}

**Status**: completed | in-progress | blocked  
**Priority**: p1 | p2 | p3  
**Date**: YYYY-MM-DD

## What Changed

- [Files modified/created, key methods/endpoints]
- [Schema or data model changes]
- [Key algorithms or business logic]

## Why

[1-2 sentences: problem solved, links to AGENTS.md priority or feature goal]

## Verify

- [Simple reproduction: "run X, visit /path, check Y appears"]
- [Database check: "Drizzle Studio: npm run db:studio"]
- [API test: endpoint response format/status]

## Notes

[Optional: Context, decisions, gotchas, follow-up work]
```

## Example

**File**: `.agents/memory-bank/implementations/2025-12-27-1430_campaign-crud.md`

```markdown
# Campaign CRUD

**Status**: completed  
**Priority**: p1  
**Date**: 2025-12-27

## What Changed

- `/src/routes/api/campaigns/{get,post,put,delete}.ts` - CRUD endpoints
- `/src/server/db.ts` - `campaigns` table queries
- `/src/components/demo/sections/CampaignForm.tsx` - Form + validation
- RLS policies added for ownership verification

## Why

Resolves Priority 1: Database Integration → implement CRUD → connect forms to storage.  
Campaigns are core V1 fundraising feature requiring full data persistence.

## Verify

- `npm run dev` → `/campaigns/new` → submit form → check Drizzle Studio
- GET `/api/campaigns` returns array of submitted records
- Edit/delete buttons work via PUT/DELETE endpoints

## Notes

- Form validation uses Zod for type safety
- Ownership check via auth context (user_id in session)
```

## Best Practices

1. **Write immediately** - While context is fresh
2. **Keep it focused** - 50-120 lines maximum
3. **Name by capability** - What does it do? Name that.
4. **Link to priorities** - Reference AGENTS.md or memory-bank
5. **Make verification simple** - Anyone (or future AI) can confirm it works
6. **Maintain index** - Add entry to `_index_implementations.md`

## Index File

Maintain `.agents/memory-bank/implementations/_index_implementations.md`:

```markdown
# Implementation Specs

| Spec                                                    | Status | Priority | Date       |
| ------------------------------------------------------- | ------ | -------- | ---------- |
| [campaign-crud](./2025-12-27-1430_campaign-crud.md)     | ✅     | P1       | 2025-12-27 |
| [form-validation](./2025-12-26-1200_form-validation.md) | ✅     | P2       | 2025-12-26 |
```

## Integration

1. Create spec in `.agents/memory-bank/implementations/YYYY-MM-DD-hhmm_{feature}.md` (use `_template_implementations.md`)
2. Commit together: `git commit -m "feat: {feature} + spec: reverse-write"`
3. Update `_index_implementations.md` with new spec
4. Reference in future work when building related features
