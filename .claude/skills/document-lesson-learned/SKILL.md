---
name: document-lesson-learned
description: Capture and organize new lessons from completed work as reusable patterns.
---

# Document Lesson Learned Skill

**Purpose**: Standardized workflow for capturing and organizing new lessons from completed work

---

## When to Document

After completing significant feature or fixing architectural issue:

- Solved a problem similar to previous work? Document the pattern.
- Discovered platform incompatibility? Document it.
- Created reusable code pattern? Document it.

---

## Workflow

### 1. Create File

```bash
# File naming: kebab-case + context
# Location: .agents/memory-bank/lessons-learned/
# Example: database-migration-strategy.md
```

### 2. Follow TEMPLATE.md Structure

```markdown
# [Pattern Name]

**Phase**: [Phase number]
**Pattern**: [One-liner pattern name]
**When**: When you need to [problem statement]

## The Problem

[1-2 sentences: what breaks without this]

## The Solution

[Code example showing pattern]

## Why It Works

[2-3 sentences: benefit + insight]

## When to Use

- [Use case 1]
- [Use case 2]

## Anti-Pattern to Avoid

// ❌ Code showing what NOT to do

## Related Patterns

- [Link to related lesson]

---

**Reference**: [Commit hash]
**Last Updated**: [Date]
```

### 3. Keep It Concise

- **~100-150 lines** maximum (lessons are references, not tutorials)
- **One clear pattern** per file (don't mix unrelated learnings)
- **Always show code example** (problem + solution)
- **Never duplicate** - if similar lesson exists, reference it instead

### 4. Update \_index_lessons-learned.md

Add entry to `.claude/memory-bank/lessons-learned/_index_lessons-learned.md`:

```markdown
| [Pattern Name](./pattern-name.md) | When you need to [problem statement] |
```

### 5. Commit

```bash
git commit -m "docs: add lesson learned - [pattern name]

[1-2 sentence description of what you learned and why it matters]"
```

---

## Example: Adding New Lesson

**Scenario**: You discover a pattern for handling form validation across endpoints

1. **File**: `form-validation-strategy.md`
2. **Structure**: Problem (scattered validation) → Solution (centralized schema) → Why (DRY)
3. **Update \_index_lessons-learned.md**: Add row pointing to new lesson
4. **Commit**: `docs: add lesson learned - form validation centralization`

---

## Anti-Pattern: What NOT to Do

❌ **Long tutorial files** (>200 lines) → Keep to essentials only  
❌ **Duplicate patterns** across multiple files → Reference, don't repeat  
❌ **Team-level handholding** (extensive examples, walkthroughs) → Assume reader is technical  
❌ **Vague lessons** without code → Always include concrete example  
❌ **Organizing by phase instead of pattern** → Organize by reusable pattern, not timeline

---

**Last Updated**: December 27, 2025
