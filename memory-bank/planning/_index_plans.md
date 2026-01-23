# Plans

| Plan                                                                                                  | Status       | Created    |
| ----------------------------------------------------------------------------------------------------- | ------------ | ---------- |
| [important-contacts-page](./2025-01-07_important-contacts-page.md)                                    | ✅ completed | 2025-01-07 |
| [dashboard-server-side-status-filtering](./2026-01-11-1215_dashboard-server-side-status-filtering.md) | ✅ completed | 2026-01-11 |

GitHub issue-style development plans with nested checkboxes.

## Active Plans

| Plan                                                                                                  | Status       | Created    |
| ----------------------------------------------------------------------------------------------------- | ------------ | ---------- |
| [fix-form-error-display-crud](./2026-01-14-1930_fix-form-error-display-crud.md)                       | 📋 planning  | 2026-01-14 |
| [form-infrastructure-overhaul](./2026-01-14-1700_form-infrastructure-overhaul.md)                     | 📋 planning  | 2026-01-14 |
| [fix-form-select-display-values](./2026-01-14-1415_fix-form-select-display-values.md)                 | 🔄 active    | 2026-01-14 |
| [form-persistence-fixes](./2025-01-13-2045_form-persistence-fixes.md)                                 | 🔄 active    | 2025-01-13 |
| [fix-dashboard-user-filtering](./2026-01-11-1200_fix-dashboard-user-filtering.md)                     | 📋 planning  | 2026-01-11 |
| [fix-data-fetching-schema-mismatches](./2026-01-11-1600_fix-data-fetching-schema-mismatches.md)       | 📋 planning  | 2026-01-11 |
| [onboarding-progress-tracking](./2026-01-11-1700_onboarding-progress-tracking.md)                     | 🔄 active    | 2026-01-11 |
| [drizzle-orm-removal-plan](./2026-01-09-1430_drizzle-orm-removal-plan.md)                             | 🔄 planning  | 2026-01-09 |
| [fix-api-data-leakage-revised](./2025-01-09-1455_fix-api-data-leakage-revised.md)                     | ✅ completed | 2025-01-09 |
| [fix-api-data-leakage-investigation](./2025-01-09-1415_fix-api-data-leakage-investigation.md)         | ✅ completed | 2025-01-09 |
| [activity-revamp-syntax-fix](./2025-01-09-1700_activity-revamp-syntax-fix.md)                         | ✅ completed | 2025-01-09 |
| [user-profile-database-refactoring-plan](./2026-01-08-1410_user-profile-database-refactoring-plan.md) | 🔄 planning  | 2026-01-08 |
| [contact-data-flow-debug](./2025-01-07-1900_contact-data-flow-debug.md)                               | 🔄 active    | 2025-01-07 |
| [phonebutton-menu-structure](./2026-01-08-phonebutton-menu-structure.md)                              | ✅ completed | 2026-01-08 |

## Completed Plans

| Plan                                                                  | Status       | Created    |
| --------------------------------------------------------------------- | ------------ | ---------- |
| [metrics-data-layer-fix](./2026-01-08-1506_metrics-data-layer-fix.md) | ✅ completed | 2026-01-08 |

## Archive

(None yet)

---

## Quick Reference

### API Data Leakage Fix (My Submissions & Suggestions)

- **Goal**: Fix data leakage where both APIs show ALL submissions instead of filtered data
- **Status**: Planning (diagnosis phase starting)
- **Root Cause**: Activities table never populated with `performed_by_user_id` when entities submitted
- **Key Facts**:
  - `activity` table has 19 records, but `performed_by_user_id` is always NULL
  - My Submissions API has correct filtering logic, issue is upstream auth/session
  - My Suggestions API returns empty (correct, since no activities recorded) but frontend shows data
- **Investigation Phases**:
  1. ⏳ Locate entity creation handlers (campaigns, relief_centers, contacts)
  2. ⏳ Verify if activities ever created during submission
  3. ⏳ Check schema type for `performedByUserId` field
  4. ⏳ Debug frontend fallback logic
  5. ⏳ Implement activity recording if missing
  6. ⏳ Fix schema mismatches
  7. ⏳ Test API endpoints
  8. ⏳ Verify frontend displays correct data
- **Priority**: P1 - CRITICAL (Security/Data Privacy)
- **Full Plan**: `2025-01-09-1415_fix-api-data-leakage-investigation.md`
- **Related Analysis**: `2025-01-09-1405_api-data-leakage-my-submissions-suggestions.md`

### Contact Data Flow Debug

- **Goal**: Identify why ImportantContactsPage receives empty contact data
- **Status**: Active (debug logging added)
- **Key Steps**:
  1. ✅ Verified database has 94 contacts
  2. ✅ Verified schema is correct
  3. ✅ Added console.log tracing
  4. ⏳ Run dev server and monitor logs
  5. ⏳ Identify exact break point
  6. ⏳ Fix root cause
- **Files Modified**:
  - `src/hooks/useFetchContacts.ts` - Added debug logs
  - `src/server/functions/contacts.server.ts` - Added debug logs
- **Expected Outcome**: Page displays contacts with proper pagination
- **Full Plan**: `2025-01-07-1900_contact-data-flow-debug.md`

### PhoneButton Menu Structure Rework

- **Goal**: Refactor PhoneButton menu to align with MoreMenu's source of truth, fix wording issues, adopt DRY principle
- **Status**: Planning (not started)
- **Key Steps**:
  1. ⬜ Update props interface for entity context (entityId, entityType, entityTitle, entityData)
  2. ⬜ Restructure to 4 DropdownMenuGroups with separators
  3. ⬜ Fix Group 2 wording (No. Alternatif, show phoneAlternative value)
  4. ⬜ Fix Group 3 wording (Situs Web instead of Kunjungi Situs)
  5. ⬜ Replace Group 4 with MoreMenu source of truth (useMenuActions, useMenuActionModals, MenuItemsList)
  6. ⬜ Test all groups with and without entity context
  7. ⬜ Verify backward compatibility
- **Files to Modify**:
  - `src/components/ui/PhoneButton.tsx` - Main restructure
- **Source of Truth**:
  - `src/hooks/useMenuActions.tsx` - Menu items with auth gating
  - `src/hooks/useMenuActionModals.tsx` - Modal management
  - `src/components/ui/MenuItemsList.tsx` - Menu rendering
  - `src/lib/menu-actions.ts` - Menu action definitions
- **Expected Outcome**: PhoneButton uses same menu actions as MoreMenu, consistent wording across app, DRY principle adopted
- **Full Plan**: `2026-01-08-phonebutton-menu-structure.md`
  | [vite7-virtual-module-fix](./2026-01-10-1430_vite7-virtual-module-fix.md) | 📋 planning | 2026-01-10 |
  | [profile-edit-form-refactor](./2026-01-12_profile-edit-form-refactor.md) | 📋 planning | 2026-01-12 |
  | [import-relief-center-data](./2026-01-12-1200_import-relief-center-data.md) | 📋 planning | 2026-01-12 |
  | [visual-enhancements](./2026-01-12-1400_visual-enhancements.md) | 🔄 active | 2026-01-12 |
