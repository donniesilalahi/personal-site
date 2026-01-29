# Career Calendar Positioning Refactor

**Context**: Current algorithm has inconsistent sorting (ASC for regular cards, DESC for fixed-width cards), violating the principle that earlier start date = leftmost column. Card type categories are mixed with positioning logic instead of being purely visual.  
**Status**: superseded by flexbox refactor  
**Created**: 2025-01-28

## Goals

- Earlier start date = leftmost column for ALL card types
- Card type only affects visual rendering, not positioning
- Single positioning algorithm (DRY principle)
- Cleaner separation of concerns

## Tasks

- [x] Task 1: Unify positioning algorithm
  - [x] Remove dual sorting logic (lines 156-158 vs 324-329)
  - [x] Single sort: ALL experiences by `startDateParsed` ASC
  - [x] Apply same column assignment logic to all card types
  - [x] Remove `sortedDeprioritized` and `sortedMilestones` separate arrays

- [x] Task 2: Separate positioning from visual concerns
  - [x] Keep `buildOverlapGroups()` for overlap detection only
  - [x] Remove card-type-specific positioning in `calculatePositioning()`
  - [x] Card type derived from experience properties (not positioning logic)
  - [x] Added `deriveCardType()` helper in types file

- [x] Task 3: Simplify fixed-width handling
  - [x] Measure ALL cards that need content-hugging (milestone + deprioritized)
  - [x] Position them using same column logic as regular cards
  - [x] Width calculation: fixed-width cards use measured px, regular cards flex

- [x] Task 4: Clean up renderer
  - [x] Simplified render loop (removed `cssRight` usage)
  - [x] Unified milestone rendering (both overlap and no-overlap use same positioning)
  - [x] Removed redundant conditional branches

- [x] Task 5: Add tests and verify
  - [x] Test: 3 overlapping experiences → leftmost has earliest start date
  - [x] Test: milestone + regular overlap → correct left-to-right order
  - [x] Test: deprioritized + regular overlap → correct left-to-right order
  - [x] Build passes
  - [x] Visual verification in browser (Chrome DevTools MCP)

## Notes

### Current Bug

- Aspire (2019-05) should be leftmost
- Katalis (2019-06) should be second
- TEDxUNDIP (2019-11) should be rightmost
- Currently: TEDxUNDIP appears before Katalis due to DESC sort on fixed-width cards

### Architecture After Refactor

```
calculatePositioning()
├── buildOverlapGroups()     # Find which experiences overlap
├── assignColumns()          # ALL cards: sort ASC, greedy leftmost
└── calculateCssValues()     # Width: measured px OR flex %

Renderer (career-calendar.tsx)
├── positionedExperiences    # Uses positioning data
└── deriveCardType()         # Experience → visual variant
    ├── isMilestone → MilestoneEntry
    ├── isDeprioritized → vertical ExperienceEntryCard
    └── else → regular ExperienceEntryCard
```

### Files to Modify

- `src/components/career-timeline/career-calendar.algorithm.ts` (main changes)
- `src/components/career-timeline/career-calendar.tsx` (simplify render)
- `src/components/career-timeline/career-calendar.types.ts` (simplify types)
