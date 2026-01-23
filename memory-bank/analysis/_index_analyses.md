# Analyses Index

Investigation documents for diagnosed problems and root causes.

## Active Investigations

| Date       | Problem                                                            | Status        | Link                                                                                                                                   |
| ---------- | ------------------------------------------------------------------ | ------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-01-14 | Form Submission Failures - Silent Errors and No User Feedback      | investigating | [2026-01-14-1900_form-submission-silent-errors.md](./2026-01-14-1900_form-submission-silent-errors.md)                                 |
| 2026-01-14 | Critical Form CRUD Systemic Failures                               | investigating | [2026-01-14-1600_critical-form-crud-systemic-failures.md](./2026-01-14-1600_critical-form-crud-systemic-failures.md)                   |
| 2026-01-14 | Form Select Fields Missing Display Values in Edit Mode             | resolved      | [2026-01-14-1400_form-select-fields-missing-display-values.md](./2026-01-14-1400_form-select-fields-missing-display-values.md)         |
| 2026-01-11 | User Registration FK Violation - Role Column Missing               | investigating | [2026-01-11-1200_user-registration-fk-violation-role-column.md](./2026-01-11-1200_user-registration-fk-violation-role-column.md)       |
| 2026-01-11 | User Registration Fails - Missing Platform Role ID                 | investigating | [2026-01-11-1130_user-profile-trigger-missing-platform-role-id.md](./2026-01-11-1130_user-profile-trigger-missing-platform-role-id.md) |
| 2026-01-11 | Dashboard User Filtering Broken - Auth Mechanism Mismatch          | investigating | [2026-01-11-1200_dashboard-user-filtering-broken.md](./2026-01-11-1200_dashboard-user-filtering-broken.md)                             |
| 2026-01-11 | Dashboard Filtering Step 1 Findings - Data Analysis                | investigating | [2026-01-11-dashboard-filtering-step1-findings.md](./2026-01-11-dashboard-filtering-step1-findings.md)                                 |
| 2026-01-11 | Dashboard Filtering Not Working - User Submissions and Suggestions | investigating | [2026-01-11-dashboard-filtering-diagnosis.md](./2026-01-11-dashboard-filtering-diagnosis.md)                                           |
| 2026-01-11 | Data Fetching No Records Displayed                                 | investigating | [2026-01-11-1600_data-fetching-no-records-displayed.md](./2026-01-11-1600_data-fetching-no-records-displayed.md)                       |
| 2026-01-11 | TanStack Start Version Regression                                  | resolved      | [2026-01-11-1400_tanstack-start-version-regression.md](./2026-01-11-1400_tanstack-start-version-regression.md)                         |
| 2026-01-09 | Drizzle ORM Removal Decision                                       | investigating | [2026-01-09-1430_drizzle-orm-removal-decision.md](./2026-01-09-1430_drizzle-orm-removal-decision.md)                                   |
| 2026-01-09 | Dashboard View Mode Filtering Not Working                          | investigating | [2026-01-09-1200_dashboard-view-mode-filtering-not-working.md](./2026-01-09-1200_dashboard-view-mode-filtering-not-working.md)         |
| 2025-01-09 | Dashboard Data Leakage - Schema Blocking Investigation             | blocked       | [2025-01-09-1430_dashboard-data-leakage-schema-blocking.md](./2025-01-09-1430_dashboard-data-leakage-schema-blocking.md)               |
| 2025-01-09 | Diagnosis Phase: API Data Leakage Root Cause                       | resolved      | [2025-01-09-1450_diagnosis-phase-findings.md](./2025-01-09-1450_diagnosis-phase-findings.md)                                           |
| 2025-01-09 | API Data Leakage (My Submissions & Suggestions)                    | resolved      | [2025-01-09-1405_api-data-leakage-my-submissions-suggestions.md](./2025-01-09-1405_api-data-leakage-my-submissions-suggestions.md)     |
| 2025-01-09 | Activity System Revamp Syntax Errors                               | resolved      | [2025-01-09-1700_activity-revamp-syntax-errors.md](./2025-01-09-1700_activity-revamp-syntax-errors.md)                                 |
| 2026-01-08 | User Profile Database Refactoring                                  | resolved      | [2026-01-08-1400_user-profile-database-refactoring.md](./2026-01-08-1400_user-profile-database-refactoring.md)                         |
| 2026-01-08 | Public Metrics Data Not Loading                                    | investigating | [2026-01-08-1505_public-metrics-data-not-loading.md](./2026-01-08-1505_public-metrics-data-not-loading.md)                             |
| 2026-01-08 | PhoneButton Menu Structure Revision (Round 2)                      | investigating | [2026-01-08-XXXX_phonebutton-revision-round2.md](./2026-01-08-XXXX_phonebutton-revision-round2.md)                                     |
| 2026-01-08 | PhoneButton Menu Structure Revision                                | investigating | [2026-01-08-XXXX_phonebutton-revision-analysis.md](./2026-01-08-XXXX_phonebutton-revision-analysis.md)                                 |

## Completed Investigations

| Date       | Problem                           | Status   | Link                                                                                                           |
| ---------- | --------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| 2026-01-08 | Profile Form React Hook Violation | resolved | [2026-01-08-1420_profile-form-hook-violation.md](./2026-01-08-1420_profile-form-hook-violation.md)             |
| 2026-01-08 | Server Function Handler Signature | resolved | [2026-01-08-1014_server-function-handler-signature.md](./2026-01-08-1014_server-function-handler-signature.md) |
| 2025-01-07 | Contact Data Not Displaying       | resolved | [2025-01-07-1800_contact-data-not-displaying.md](./2025-01-07-1800_contact-data-not-displaying.md)             |

## Archive

(None yet)

---

## Quick Reference

### Dashboard Filtering Diagnosis (2026-01-11)

- **Problem**: `my-submissions` and `my-suggestions` return ALL records, not user-specific data
- **Root Cause Analysis (Hypotheses)**:
  1. `session.user.id` from `getSessionWithMetadata()` might return wrong ID type
  2. `submitted_by_profile_id` field might be NULL in most records
  3. Type mismatch between session ID and stored profile IDs
  4. `my-suggestions`: Activity type mismatch - expecting activity types that don't exist in DB
- **Evidence**:
  - API endpoints have correct `.eq('submitted_by_profile_id', userId)` syntax
  - Client-side filtering only applies status check for `browse-all` mode
  - Activity DB only contains: `created`, `verified`, `reported`, `update_suggested`
  - Code expects: `update_verified`, `update_applied`, `update_rejected`, etc.
- **Next Steps** (No code changes):
  1. Add debug logging to API endpoints
  2. Ask user to share console logs showing `userId` vs `submittedByProfileId`
  3. Run SQL query to check if `submitted_by_profile_id` has matching values
- **Documentation**: `2026-01-11-dashboard-filtering-diagnosis.md`

### Dashboard View Mode Filtering (2026-01-09)

- **Problem**: `my-submissions` and `my-suggestions` return all records instead of user-specific data
- **Root Cause**: Drizzle schema column name mismatch - schema defines `submittedByProfileId` (camelCase) but database has `submitted_by_profile_id` (snake_case)
- **Impact**: All user filters fail silently, returning unfiltered data
- **Security**: CRITICAL - User data exposed to other users
- **Affected Files**:
  - `src/server/schema.ts` (lines 344, 390, 658, 710, 436)
  - `src/routes/api/dashboard/my-submissions.ts` (lines 68-73, 110-116, 152-160, 192-199)
  - `src/routes/api/dashboard/my-suggestions.ts` (lines 60-76, 123-129, 167-173, 210-217, 251-257)
- **Fix Required**: Regenerate Drizzle schema from database with `npm run db:pull`
- **Documentation**: `2026-01-09-1200_dashboard-view-mode-filtering-not-working.md`

### API Data Leakage Issue (My Submissions & Suggestions)

- **Problem**: Both APIs show ALL submissions instead of filtered data
- **Root Cause**: Activity table never populated with `performed_by_user_id` during submissions
- **My Submissions**: Has correct filtering logic, but may have auth/session issue upstream
- **My Suggestions**: Returns empty results (correct, because no activities recorded) but frontend shows data anyway
- **Key Finding**: All 19 activities in DB have `unique_users: 0` = `performed_by_user_id` is always NULL
- **Critical Issue**: Activity recording feature never implemented in submission workflow
- **Next Step**: Locate entity creation handlers and verify activity recording is happening
- **Documentation**:
  - Analysis: `2025-01-09-1405_api-data-leakage-my-submissions-suggestions.md`
  - Planning: `2025-01-09-1415_fix-api-data-leakage-investigation.md`

### Contact Data Flow Issue

- **Problem**: ImportantContactsPage shows "Belum ada kontak" despite 94 contacts in database
- **Database**: ✅ 94 contacts exist in `contact` table
- **Schema**: ✅ Correctly mapped `contacts` → `'contact'` table
- **API Endpoint**: ✅ Works, returns data
- **Server Function**: ❓ Unverified - Debug logs added
- **Hook**: ❓ Unverified - Debug logs added
- **Component**: ✅ Logic correct
- **Next**: Run `npm run dev`, monitor console logs, identify break point
- **Documentation**:
  - Analysis: `2025-01-07-1800_contact-data-not-displaying.md`
  - Planning: `.agents/memory-bank/planning/2025-01-07-1900_contact-data-flow-debug.md`
  - Debug Guide: `CONTACT_DEBUG_FINDINGS.md` (in repo root)
  - Quick Start: `DEBUG_CONTACT_FLOW.md` (in repo root)
    | 2026-01-10 | Vite 7 Virtual Module Resolution Error | investigating | [2026-01-10-1430_vite7-virtual-module-resolution-error.md](./2026-01-10-1430_vite7-virtual-module-resolution-error.md) |
