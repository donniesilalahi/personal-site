# Architecture Documentation Index

SEMUA SUMATERA's technical architecture is documented across multiple reference documents. This index provides navigation and context for the complete architecture.

## Document Structure

```
.agents/memory-bank/architecture/
├── index.md                    # This file - navigation and overview
├── architecture.md             # Core architecture overview
├── tanstack-start.md           # TanStack Start framework
├── tanstack-router.md          # TanStack Router
├── tanstack-query.md           # TanStack Query (v5)
├── tanstack-db.md              # TanStack DB
├── tanstack-table.md           # TanStack Table
├── tanstack-form.md            # TanStack Form
└── tanstack-store.md           # TanStack Store
```

## Quick Start

**New to the architecture?** Start here:

1. **[architecture.md](./architecture.md)** - System overview, high-level patterns, and deployment
2. **[tanstack-start.md](./tanstack-start.md)** - TanStack Start framework integration
3. **[tanstack-router.md](./tanstack-router.md)** - Routing and data loading

## Library Reference

| Document                                   | Library           | Purpose                                      |
| ------------------------------------------ | ----------------- | -------------------------------------------- |
| [tanstack-router.md](./tanstack-router.md) | TanStack Router   | Type-safe file-based routing with loaders    |
| [tanstack-query.md](./tanstack-query.md)   | TanStack Query v5 | Server-state caching and data fetching       |
| [tanstack-db.md](./tanstack-db.md)         | TanStack DB       | Reactive collections with optimistic updates |
| [tanstack-table.md](./tanstack-table.md)   | TanStack Table    | Headless table UI with sorting/filtering     |
| [tanstack-form.md](./tanstack-form.md)     | TanStack Form     | Type-safe form state management              |
| [tanstack-store.md](./tanstack-store.md)   | TanStack Store    | Client-side reactive state                   |

## Ecosystem Overview

```
TanStack Start (Meta-Framework)
├── TanStack Router (Routing + SSR Data Loading)
├── TanStack Query (Client-Side Caching)
├── TanStack DB (Reactive Collections)
├── TanStack Table (Data Grid UI)
├── TanStack Form (Form Management)
└── TanStack Store (Client State)
```

## When to Use Which Library

| Scenario                              | Library                          | Document                                   |
| ------------------------------------- | -------------------------------- | ------------------------------------------ |
| Route-coupled SSR data                | TanStack Router Loaders          | [tanstack-router.md](./tanstack-router.md) |
| Client-side caching with invalidation | TanStack Query                   | [tanstack-query.md](./tanstack-query.md)   |
| Optimistic updates with reactivity    | TanStack DB                      | [tanstack-db.md](./tanstack-db.md)         |
| Complex tables with server data       | TanStack Table + Query           | [tanstack-table.md](./tanstack-table.md)   |
| Forms with validation                 | TanStack Form + Server Functions | [tanstack-form.md](./tanstack-form.md)     |
| Global UI state (theme, sidebar)      | TanStack Store                   | [tanstack-store.md](./tanstack-store.md)   |

## Related Documentation

- **Tech Stack**: `.agents/memory-bank/tech.md`
- **Lessons Learned**: `.agents/memory-bank/lessons-learned/`
- **Analysis Documents**: `.agents/memory-bank/analysis/`

## Key Principles

1. **Type Safety First** - All TanStack libraries provide full TypeScript inference
2. **Server/Client Separation** - Use appropriate libraries for each context
3. **Composition Over Configuration** - Libraries work together without magic
4. **Explicit Over Implicit** - Control data flow and caching explicitly

---

**Last Updated**: January 5, 2026
**Version**: 1.0.0
