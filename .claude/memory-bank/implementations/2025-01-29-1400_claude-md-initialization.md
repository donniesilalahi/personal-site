# CLAUDE.md Initialization

**Status**: completed
**Priority**: p1
**Date**: 2025-01-29

## What Changed

- `/CLAUDE.md` - Created quick reference guide for Claude Code instances
  - Quick commands (dev, test, lint, deploy)
  - Architecture overview (TanStack Start, directories, imports)
  - Career timeline algorithm explanation (content → loader → algorithm → rendering)
  - Code style (TypeScript strict, Tailwind, cn() utility)
  - Deployment rules (git push only)
  - Memory bank & MCP tools reference

## Why

Future Claude Code instances need rapid onboarding without reading entire AGENTS.md or exploring codebase manually. Non-repetitive guide captures essential context: commands, architecture patterns, the custom career timeline algorithm (requires understanding multiple files), and critical deployment rule.

## Verify

- `cat CLAUDE.md` - File exists with all sections
- New Claude instance can: run `npm run dev`, understand file structure, implement features, deploy via git push
- No duplication with AGENTS.md (that remains comprehensive reference)

## Notes

- Focuses on "big picture" requiring multi-file understanding (career timeline system)
- Avoids listing every component (discoverable via exploration)
- Career timeline section key: connects loader → algorithm → rendering for future work on that subsystem
- AGENTS.md remains comprehensive source for memory bank, skills, documentation standards
