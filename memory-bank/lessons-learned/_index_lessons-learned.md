# Lessons Learned Index

Repository of reusable patterns from each phase. All files follow the [\_template_lessons-learned.md](./_template_lessons-learned.md).

## Available Lessons

| Pattern                                                                                              | When to Use                                                                                                                                           |
| ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| [TanStack Start Meta-Framework Adoption](./tanstack-start-meta-framework-adoption.md)                | Migrating to full-stack meta-framework (Next.js, Remix, TanStack Start, SvelteKit)                                                                    |
| [Server-Side Auth Handling](./server-side-auth-handling.md)                                          | Building authentication with single createServerFn implementation across server and client                                                            |
| [Reference Table Foreign Key Strategy](./reference-table-foreign-key-strategy.md)                    | Creating reference tables for shared status/options across multiple entities                                                                          |
| [Serialization Layer](./serialization-layer.md)                                                      | Database schema differs from API format (snake_case ↔ camelCase)                                                                                      |
| [Activity Logging](./activity-logging.md)                                                            | Tracking workflow state + audit trail (submit → review → approve)                                                                                     |
| [Platform-Specific ORM Testing](./platform-orm-testing.md)                                           | Using ORM on edge platforms (Cloudflare Workers, Lambda)                                                                                              |
| [Permission Hierarchy](./permission-hierarchy.md)                                                    | Multi-tier permission system (public users vs admins)                                                                                                 |
| [Shadcn Accordion Migration](./shadcn-accordion-migration.md)                                        | Migrating custom accordions to Shadcn with custom styling                                                                                             |
| [Schema Validation as Priority 0](./schema-validation-priority.md)                                   | Preventing data loading failures caused by Drizzle/database schema mismatches                                                                         |
| [TanStack Start Server Function Handler](./tanstack-start-server-function-handler.md)                | Passing options to TanStack Start server functions (handler receives `{ data, context, request }`)                                                    |
| [Entity-Based Pattern vs Items Arrays](./entity-based-pattern-over-items-arrays.md)                  | Refactoring UI components from callback arrays to entity context patterns                                                                             |
| [Persistent Auth Testing with Supabase](./persistent-auth-testing-supabase.md)                       | Testing authenticated flows with persistent sessions without automating OAuth                                                                         |
| [TanStack Start Meta-Framework Adoption](./tanstack-start-meta-framework-adoption.md)                | Understanding TanStack Start as full-stack React meta-framework, its router-first design, server functions, selective SSR, and deployment flexibility |
| [React Hooks Order in Complex Forms](./react-hooks-order-complex-forms.md)                           | Building complex forms with loading states, error states, and multiple form store subscriptions                                                       |
| [Database Column Name Verification Before Insert/Update](./verify-db-column-names-before-inserts.md) | Writing INSERT/UPDATE queries against Supabase tables with mixed naming conventions                                                                   |

---

**How to Use**: Before implementing similar features, scan this index for applicable patterns. Reference the specific lesson for implementation details.

**Last Updated**: January 8, 2026

---

## Latest Lessons (January 5, 2026)

Two critical lessons from TanStack Start auth consolidation and CSS/SSR fix work:

1. **TanStack Start Meta-Framework Adoption** - Framework is an environment, not a library. Understanding execution contexts (server vs client) is critical.
2. **Server-Side Auth Handling** - Single `createServerFn` implementation beats dual client/server auth code. Consolidation prevents DRY violations and build errors.
