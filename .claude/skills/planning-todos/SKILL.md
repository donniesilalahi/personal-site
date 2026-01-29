---
name: planning-todos
description: Create lightweight GitHub-issue-style plans with nested markdown todos. Survives across threads, agent-readable, simple to update.
---

# Planning Todos Skill

## What I Do

After analyzing work or a problem, I create a concise plan (50-100 lines) that:
- Describes what needs to happen (goals, not rationale)
- Lists tasks as markdown checkboxes with subtasks
- Includes optional notes (decisions, gotchas, dependencies)

This creates a survivable, thread-persistent record using GitHub issue style.

## When to Use

- Planning a feature implementation
- Breaking down a complex bug fix
- Organizing refactoring work
- Starting a new task or phase
- Need checklist that survives across threads

## Critical: Thread-Level Todo Integration

**Use `todo_read()` and `todo_write()` to sync plan with Amp thread todos**:

```typescript
// At start of thread: Load plan into todos
todo_read()  // Check existing todos
todo_write([
  { id: "task-1.1", content: "Task 1: Description", status: "todo" },
  { id: "task-1.2", content: "Subtask 1.1: Detail", status: "todo" },
  { id: "task-2.1", content: "Task 2: Description", status: "todo" },
])

// As you work: Update todo status
todo_write([
  { id: "task-1.1", content: "Task 1: Description", status: "completed" },
  { id: "task-1.2", content: "Subtask 1.1: Detail", status: "in-progress" },
])

// Before finishing: Sync back to plan file
// Update .agents/memory-bank/planning/YYYY-MM-DD-XXXX_{name}.md with checked items
```

**Why this matters**:
- Plan survives in markdown file (repo-persistent)
- Todos show up in Amp UI for thread visibility
- Both stay in sync as you work
- Commit references the plan file

## Format & Location

**Location**: `.claude/memory-bank/planning/`
**File naming**: `YYYY-MM-DD-HHmm_{plan-name}.md` (e.g., `2025-12-30-1430_dashboard-api-refactor.md`, `2025-12-30-1530_user-auth-flow.md`)
**Index**: `.claude/memory-bank/planning/_index_plans.md`
**Template**: `.claude/memory-bank/planning/_template_planning.md`

**Do NOT use**: Phase numbers, generic terms like "improvements", multiple spaces

## Plan Template

```markdown
# {Plan Name}

**Context**: [1-2 sentences: what problem/feature/goal]  
**Status**: planning | active | completed  
**Created**: YYYY-MM-DD

## Goals

- [What success looks like]
- [What success looks like]

## Tasks

- [ ] Task 1: [clear description]
  - [ ] Subtask 1.1: [detail]
  - [ ] Subtask 1.2: [detail]
- [ ] Task 2: [clear description]
  - [ ] Subtask 2.1: [detail]

## Notes

[Optional: architectural decisions, gotchas, dependencies, blocked by X]
```

## Example

**File**: `.claude/memory-bank/planning/2025-12-30-1430_activity-timeline-api.md`

```markdown
# Activity Timeline API

**Context**: Need to expose user activity events for dashboard timeline component. Currently no API endpoint exists.  
**Status**: active  
**Created**: 2025-12-30

## Goals

- Create `/api/activities` endpoint
- Return paginated activity events with filters
- Support timestamp range and event type filtering

## Tasks

- [ ] Task 1: Define activity schema in Drizzle
  - [ ] Review `activity_logs` table structure
  - [ ] Verify all required fields (user_id, event_type, timestamp, metadata)
  - [ ] Check indexes for query performance
- [ ] Task 2: Build `/api/activities` endpoint
  - [ ] GET with pagination (limit, offset, page)
  - [ ] Add date range filters (from_date, to_date)
  - [ ] Add event type filter
  - [ ] Verify RLS policies
- [ ] Task 3: Test and verify
  - [ ] Unit test: pagination works
  - [ ] Unit test: date filtering works
  - [ ] Manual test: endpoint response format
  - [ ] Check Drizzle Studio for data

## Notes

- Pagination key: use `offset` pattern (simpler than cursor pagination for this use case)
- RLS: activities table should only show user's own activities
- Filters are optional - default to last 30 days
```

## Best Practices

1. **Write immediately** - Plan out loud while thinking
2. **Keep it focused** - 50-100 lines maximum
3. **Use clear task names** - What, not why
4. **Nest flexibly** - Task → subtask (1.1) → sub-subtask (1.1.1) as needed
5. **Update as you work** - Check off subtasks in real time
6. **Survive across threads** - Can be read/updated in any session
7. **Maintain index** - Add entry to `_index_plans.md`

## Index File

Maintain `.claude/memory-bank/planning/_index_plans.md`:

```markdown
# Plans

| Plan | Status | Created |
|------|--------|---------|
| [activity-timeline-api](./2025-12-30-1430_activity-timeline-api.md) | 🔄 active | 2025-12-30 |
| [dashboard-api-refactor](./2025-12-30-1530_dashboard-api-refactor.md) | ⬜ planning | 2025-12-30 |
```

## Workflow

1. Analyze problem/feature needed
2. Create plan file: `.agents/memory-bank/planning/YYYY-MM-DD-hhmm_{name}.md`
3. Fill template with goals + tasks/subtasks (use `_template_planning.md` as reference)
4. Add to `_index_plans.md`
5. Commit: `git commit -m "plan: {name}"`
6. Update as you work (check off subtasks)
7. When complete, change status to `completed`

## Commit Pattern

Reference the plan file in your commits:

```
feat: implement activity timeline API

- Closes activity-timeline-api plan: tasks 1, 2
- Added /api/activities endpoint with pagination
- Verified RLS policies for privacy

See: .agents/memory-bank/planning/2025-12-30-1430_activity-timeline-api.md
```

## When NOT to Use

❌ Long-running projects (>2 weeks) → Use task-groups instead  
❌ Team coordination needed → Use GitHub issues  
❌ Extensive scope → Break into multiple smaller plans  
❌ Daily logging → Use activity-timeline instead
