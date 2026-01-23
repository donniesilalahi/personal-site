# SEMUA SUMATERA System Architecture

## Overview

**SEMUA SUMATERA** is a full-stack React disaster relief directory application built on the **TanStack ecosystem** and deployed to **Cloudflare Workers**. This document provides the high-level architecture overview.

## Tech Stack

| Layer            | Technology          | Version      |
| ---------------- | ------------------- | ------------ |
| Meta-Framework   | TanStack Start      | Latest (RC)  |
| Router           | TanStack Router     | v1.140.5     |
| State Management | TanStack Query      | v5.x         |
| Reactive Store   | TanStack DB         | Latest       |
| Table UI         | TanStack Table      | v8.x         |
| Forms            | TanStack Form       | v1.x         |
| Client Store     | TanStack Store      | Latest       |
| Database         | Supabase PostgreSQL | Latest       |
| ORM              | Drizzle ORM         | v0.45.1      |
| Auth             | Supabase Auth       | Google OAuth |
| Deployment       | Cloudflare Workers  | Latest       |
| Build Tool       | Vite                | v7.x         |
| Runtime          | React               | 19.0.0-rc.0  |
| Language         | TypeScript          | 5.3.x        |

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Cloudflare Workers                          │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    TanStack Start                           │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │   │
│  │  │   Server    │  │   TanStack  │  │   TanStack Form     │  │   │
│  │  │   Functions │  │   Router    │  │   (Validation)      │  │   │
│  │  │   (RPC)     │  │   (Loaders) │  │                     │  │   │
│  │  └──────┬──────┘  └──────┬──────┘  └─────────────────────┘  │   │
│  │         │                 │                                  │   │
│  │         └────────┬────────┴──────────────┐                   │   │
│  │                  │                       │                   │   │
│  │                  ▼                       ▼                   │   │
│  │         ┌─────────────────┐     ┌─────────────────┐          │   │
│  │         │  TanStack Query │     │  TanStack Form  │          │   │
│  │         │  (v5) Caching   │     │  (Type-Safe)    │          │   │
│  │         └────────┬────────┘     └─────────────────┘          │   │
│  │                  │                                          │   │
│  │         ┌───────┴───────┐                                  │   │
│  │         ▼               ▼                                  │   │
│  │  ┌─────────────┐  ┌─────────────────┐                      │   │
│  │  │ TanStack DB │  │ TanStack Store  │                      │   │
│  │  │ Collections │  │ (Client State)  │                      │   │
│  │  └─────────────┘  └─────────────────┘                      │   │
│  │                                                           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│              ┌─────────────────────────────────┐                  │
│              │      Supabase PostgreSQL         │                  │
│              │  (Drizzle ORM Type-Safe Access)  │                  │
│              └─────────────────────────────────┘                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         React Client (CSR)                          │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              TanStack Router (Client Navigation)             │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │   │
│  │  │   TanStack  │  │  TanStack   │  │   TanStack Table    │  │   │
│  │  │   Query     │  │   Store     │  │   (Data Grids)      │  │   │
│  │  │   (Cache)   │  │   (UI)      │  │                     │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘  │   │
│  │                                                           │   │
│  │  UI Components (Shadcn UI + Tailwind CSS)                 │   │
│  │  - Forms, Tables, Cards, Navigation                       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Core Architecture Patterns

### 1. Router-First Data Loading

TanStack Router loaders handle SSR-first, route-coupled data fetching:

```tsx
// src/routes/dashboard.tsx
export const Route = createFileRoute('/dashboard')({
  loader: async ({ context }) => {
    const campaigns = await getCampaigns({ status: 'active' })
    const stats = await getDashboardStats()
    return { campaigns, stats }
  },
  component: DashboardPage,
})
```

### 2. Client-Side Caching

TanStack Query provides fine-grained client-side control:

```tsx
function DashboardPage() {
  const { data: campaigns } = Route.useLoaderData()

  const { data: realTimeStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => fetchStats(),
    staleTime: 30_000, // 30 second cache
    refetchInterval: 60_000, // Refresh every minute
  })
}
```

### 3. Server Functions (RPC)

Type-safe server-side operations callable from anywhere:

```tsx
const submitCampaign = createServerFn({ method: 'POST' })
  .inputValidator(campaignSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    return db.campaigns.create({
      ...data,
      userId: context.user.id,
    })
  })
```

### 4. Type-Safe Forms

TanStack Form with server validation:

```tsx
const contactFormOpts = formOptions({
  defaultValues: { name: '', email: '', message: '' },
  validators: {
    onChange: z.object({
      name: z.string().min(2),
      email: z.string().email(),
      message: z.string().min(10),
    }),
  },
})

function ContactForm() {
  const form = useForm({
    ...contactFormOpts,
    onSubmit: async ({ value }) => {
      await submitContact(value)
    },
  })
}
```

## State Management Architecture

| State Type    | Library         | Storage            | Persistence        |
| ------------- | --------------- | ------------------ | ------------------ |
| Route Data    | TanStack Router | SSR + Client Cache | Navigator cache    |
| Server Cache  | TanStack Query  | In-memory          | Configurable TTL   |
| Reactive Data | TanStack DB     | In-memory          | Optimistic updates |
| UI State      | TanStack Store  | In-memory          | Session only       |
| Form State    | TanStack Form   | Controlled         | Client only        |

## Deployment Architecture

### Cloudflare Workers

- **Serverless Runtime**: Global edge network
- **SSR**: Full server-side rendering capability
- **Server Functions**: RPC-style server operations
- **Environment Variables**: Secure server-only access

### Deployment Pipeline

```
Development → Build → Deploy
     ↓           ↓        ↓
   Vite      TypeScript  Wrangler
   HMR       Bundle      Deploy
                      Cloudflare
```

## Database Architecture

### Supabase PostgreSQL

- **Auth**: Supabase Auth with Google OAuth
- **Data**: Drizzle ORM for type-safe queries
- **RLS**: Row Level Security policies
- **Real-time**: Subscription support

### Schema Pattern

```typescript
// Core tables pattern
- auth.users (managed by Supabase)
- user_profile (UUID PK → auth.users.id)
- campaigns (relief campaigns)
- relief_centers (distribution points)
- contacts (emergency contacts)
- help_requests (user submissions)
```

## Security Architecture

### Authentication

- OAuth 2.0 with Google via Supabase
- HTTP-only session cookies
- JWT token validation

### Data Security

- Input validation with Zod schemas
- Drizzle ORM prevents SQL injection
- Server-only environment variables
- RLS policies on PostgreSQL

### Infrastructure

- HTTPS enforced via Cloudflare
- CORS properly configured
- Security headers auto-applied

## Performance Strategy

### Frontend

- Code splitting by routes
- Vite-optimized bundles
- TanStack Query caching reduces fetches
- Shadcn UI for lightweight components

### Backend

- Connection pooling for database
- Edge caching via Cloudflare
- Selective SSR per route
- Static prerendering for public pages

## Directory Structure

```
src/
├── routes/                    # TanStack Router file-based routing
│   ├── __root.tsx            # Root route
│   ├── index.tsx             # Homepage
│   ├── dashboard.tsx         # Protected dashboard
│   └── api/                  # Server routes
├── components/               # React components
│   ├── ui/                   # Shadcn primitives
│   ├── tables/               # TanStack Table components
│   └── forms/                # TanStack Form components
├── lib/                      # Utilities
│   ├── collections/          # TanStack DB collections
│   ├── stores/               # TanStack Store instances
│   └── db/                   # Drizzle schema & queries
├── server/                   # Server-side
│   ├── auth.ts               # Auth configuration
│   └── db.ts                 # Database connection
├── client.tsx                # Client entry point
├── server.ts                 # Server entry point
└── router.tsx                # Router configuration
```

## Related Documents

| Document                                   | Description                      |
| ------------------------------------------ | -------------------------------- |
| [tanstack-start.md](./tanstack-start.md)   | TanStack Start framework details |
| [tanstack-router.md](./tanstack-router.md) | Routing and data loading         |
| [tanstack-query.md](./tanstack-query.md)   | Server-state caching             |
| [tanstack-db.md](./tanstack-db.md)         | Reactive collections             |
| [tanstack-table.md](./tanstack-table.md)   | Data table UI                    |
| [tanstack-form.md](./tanstack-form.md)     | Form management                  |
| [tanstack-store.md](./tanstack-store.md)   | Client state                     |

---

**Last Updated**: January 5, 2026
**Version**: 1.0.0
