---
name: analyzing-problems
description: Root cause analysis when plans fail or bugs surface. Documents why something isn't working and informs revised planning.
---

# Analyzing Problems Skill

## What I Do

When a plan fails or a bug surfaces, I create a concise analysis (50-100 lines) that:
- Describes the problem and expected vs actual behavior
- Identifies root cause (not just symptoms)
- Recommends revised approach or fixes
- Links to the failed plan and next steps

This breaks the cycle of repeated failures by understanding why something didn't work.

## When to Use

- Plan implementation doesn't reach its objective
- Unexpected bug or behavior discovered
- Previous approach failed and needs rethinking
- Need to understand root cause before retrying

## Critical: Thread-Level Todo Integration

**Use `todo_read()` and `todo_write()` to track analysis and follow-up actions**:

```typescript
// At start of thread: Load analysis investigation todos
todo_read()  // Check existing todos
todo_write([
  { id: "analysis-1", content: "Investigate root cause", status: "in-progress" },
  { id: "analysis-2", content: "Verify hypothesis with testing", status: "todo" },
  { id: "followup-1", content: "Create revised plan based on findings", status: "todo" },
])

// As you investigate: Update status
todo_write([
  { id: "analysis-1", content: "Investigate root cause", status: "completed" },
  { id: "analysis-2", content: "Verify hypothesis with testing", status: "in-progress" },
])

// After analysis: Update .agents/memory-bank/analysis/YYYY-MM-DD-XXXX_{problem}.md
```

**Why this matters**:
- Analysis files survive in markdown (repo-persistent)
- Todos show investigation progress in Amp UI
- Cross-references connect to failed plan and revised plan
- Creates clear audit trail of "why we changed direction"

## Format & Location

**Location**: `.agents/memory-bank/analysis/`
**File naming**: `YYYY-MM-DD-hhmm_{problem-name}.md` (e.g., `2025-12-31-1430_auth-race-condition.md`, `2025-12-31-1530_schema-mismatch.md`)
**Index**: `.agents/memory-bank/analysis/_index_analyses.md`
**Template**: `.agents/memory-bank/analysis/_template_analysis.md`

**Do NOT use**: Phase numbers, generic terms like "bug", vague names

## Analysis Template

```markdown
# {Problem Name}

**Status**: investigating | resolved | blocked  
**Severity**: p1 | p2 | p3  
**Date**: YYYY-MM-DD  
**Related Plan**: [YYYY-MM-DD-XXXX_plan-name.md](../planning/YYYY-MM-DD-XXXX_plan-name.md) *(if plan failed)*

## Problem Statement

[What is broken? What should happen vs what actually happens?]

## Root Cause

[Why is this happening? Actual mechanism, not symptoms.]

## Evidence

- [Test case or reproduction steps]
- [Data, logs, or observations proving cause]
- [Hypothesis verification]

## Solution/Next Steps

- [Recommended fix or revised approach]
- [Link to revised plan: ../planning/YYYY-MM-DD-XXXX_revised-plan.md]

## Notes

[Optional: Related issues, dependencies, design implications]
```

## Example

**File**: `.claude/memory-bank/analysis/2025-12-31-1430_auth-gate-race-condition.md`

```markdown
# Auth Gate Race Condition

**Status**: resolved  
**Severity**: p1  
**Date**: 2025-12-31
**Related Plan**: [2025-12-30-1430_auth-redirect-flow.md](../planning/2025-12-30-1430_auth-redirect-flow.md)

## Problem Statement

Auth gate redirects authenticated users to `/login` on initial page load. Expected: User stays on protected page. Actual: Brief flash to `/login` then redirects back.

## Root Cause

Session validation check runs BEFORE auth context is initialized. Gate checks `user == null` (truthy during async load) and redirects before session resolves.

Race condition: `useAuth()` hook doesn't block rendering until auth state is known.

## Evidence

- Reproduction: Load `/dashboard` directly → see `/login` flash
- Browser console: No auth errors, just timing issue
- Network tab: Auth request succeeds, but redirect happens before response
- Code inspection: `useAuth()` returns `{user: null}` during load, gate treats as unauthenticated

## Solution/Next Steps

- Wrap auth context with loading state
- Gate checks `isAuthLoading` first, shows spinner
- Only redirect when `isAuthLoading === false AND user === null`
- See revised plan: [2025-12-31-1430_auth-gate-race-condition-fix.md](../planning/2025-12-31-1430_auth-gate-race-condition-fix.md)

## Notes

- Root cause was premature null check, not session validation failure
- Solution is gate-level, not auth service level
- Loading state prevents all race conditions in protected routes
```

## Best Practices

1. **Reproduce first** - Confirm you can see the problem
2. **Test hypothesis** - Don't guess, verify root cause
3. **Name by problem** - What's broken, not what to do about it
4. **Link failed plan** - Reference the plan that didn't work
5. **Provide evidence** - Show logs, test cases, data
6. **Recommend next steps** - Create revised plan, don't just list issues
7. **Maintain index** - Add entry to `_index_analyses.md`

## Cross-Reference Pattern

Analysis connects failed work to revised planning:

```
Plan (fails)
  ↓
Analysis (diagnoses why)
  ↓
Revised Plan (informed by analysis)
  ↓
Implementation (fixes it)
```

**File linking in analysis**:
- `**Related Plan**: [2025-12-30-1430_plan-name.md](../planning/2025-12-30-1430_plan-name.md)` ← What failed
- `**Revised Plan**: [2025-12-31-1430_revised-plan.md](../planning/2025-12-31-1430_revised-plan.md)` ← What to do instead

**File linking in revised plan**:
- `**Prompted by Analysis**: [2025-12-31-1430_analysis.md](../analysis/2025-12-31-1430_analysis.md)` ← Why we changed direction

**File linking in implementation**:
- `**Resolves Analysis**: [2025-12-31-1430_analysis.md](../analysis/2025-12-31-1430_analysis.md)` ← What issue we fixed

## Workflow

1. Plan fails or bug discovered
2. Create analysis file: `.agents/memory-bank/analysis/YYYY-MM-DD-hhmm_{problem}.md` (use `_template_analysis.md`)
3. Investigate root cause (update thread todos as you go)
4. Document findings and recommended solution
5. Add to `_index_analyses.md`
6. Commit: `git commit -m "analysis: {problem-name}"`
7. Create revised plan referencing analysis
8. Execute revised plan

## Commit Pattern

```
analysis: auth gate race condition

- Diagnosed: session validation check runs before auth context initializes
- Root cause: useAuth() returns {user: null} during async load, gate redirects prematurely
- Evidence: reproduction steps and network timeline analysis
- Recommended fix: add isAuthLoading guard before redirect check

See: .agents/memory-bank/analysis/2025-12-31-1430_auth-gate-race-condition.md
Revised plan: .agents/memory-bank/planning/2025-12-31-1430_auth-gate-race-condition-fix.md
```

## When NOT to Use

❌ Simple bugs with obvious fix → Just fix and commit  
❌ Performance optimization → Use planning skill  
❌ Feature requests → Use planning skill  
❌ Refactoring without failures → Use planning skill
