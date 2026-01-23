# TanStack Start Reference

**Framework**: TanStack Start (Meta-Framework)
**Purpose**: Full-stack React application framework with server functions and SSR

## Overview

TanStack Start is a full-stack React meta-framework built on **TanStack Router** and **Vite**. It provides:

- Industry-leading type-safe routing
- Server functions for RPC-style server/client communication
- Composable middleware at request and function levels
- Selective SSR (full, data-only, client-only per route)
- Universal deployment (Cloudflare Workers, Netlify, Vercel, Node.js, Docker)

## Core Concepts

### 1. Router-First Architecture

TanStack Start is **100% powered by TanStack Router** for routing:

```tsx
// src/routes/posts/$postId.tsx
export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params }) => {
    const post = await fetchPost(params.postId)
    return { post }
  },
  staleTime: 10_000, // Client cache: fresh for 10 seconds
  gcTime: 5 * 60_000, // Client cache: keep for 5 minutes
  component: PostComponent,
})
```

### 2. Server Functions (RPC Pattern)

Server functions provide type-safe RPC between client and server:

```tsx
// Define server function
const getUser = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ userId: z.string() }))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    return db.users.findUnique({ where: { id: data.userId } })
  })

// Call from anywhere with full type safety
const user = await getUser({ data: { userId: '123' } })
```

**Key Characteristics**:

- Functions run on server, callable from client
- Full input validation with Zod integration
- Composable middleware (client and server)
- Automatic serialization of errors, redirects, not-found
- Function IDs are SHA256 hashes for bundle compactness

### 3. Execution Model

TanStack Start uses an **isomorphic-by-default** approach:

| Code Pattern           | Server      | Client       |
| ---------------------- | ----------- | ------------ |
| Regular functions      | ✅ Runs     | ✅ Runs      |
| `createServerFn()`     | ✅ Server   | Network call |
| `createServerOnlyFn()` | ✅ Server   | ❌ Throws    |
| `createClientOnlyFn()` | ❌ Throws   | ✅ Client    |
| `createIsomorphicFn()` | Server impl | Client impl  |
| Route loaders          | ✅ Runs     | ✅ Runs      |

```tsx
// Server-only utility (crashes on client)
const getSecret = createServerOnlyFn(() => process.env.SECRET_KEY)

// Client-only utility (crashes on server)
const saveToStorage = createClientOnlyFn((key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value))
})

// Different implementations per environment
const logger = createIsomorphicFn()
  .server((msg) => console.log(`[SERVER]: ${msg}`))
  .client((msg) => console.log(`[CLIENT]: ${msg}`))
```

### 4. Selective SSR

Fine-grained control over SSR behavior per route:

```tsx
// Full SSR (default)
export const Route = createFileRoute('/posts/$postId')({
  ssr: true,
})

// Client-only (no SSR)
export const Route = createFileRoute('/dashboard')({
  ssr: false,
})

// Data-only SSR (server fetches data, renders client)
export const Route = createFileRoute('/editor/$docId')({
  ssr: 'data-only',
})

// Dynamic SSR based on params/search
export const Route = createFileRoute('/docs/$type/$id')({
  ssr: ({ params, search }) => {
    if (params.value.type === 'sheet') return false
    if (search.value.details) return 'data-only'
    return true
  },
})
```

### 5. Composable Middleware

Two types of middleware with different scopes:

**Request Middleware** (all server requests):

```tsx
const loggingMiddleware = createMiddleware().server(
  async ({ next, context }) => {
    console.log('Request:', context.request.url)
    return next()
  },
)
```

**Server Function Middleware** (client + server execution):

```tsx
const authMiddleware = createMiddleware({ type: 'function' })
  .client(async ({ next }) => {
    return next({ headers: { Authorization: `Bearer ${getToken()}` } })
  })
  .server(async ({ next, context }) => {
    const user = await validateToken(context.headers.authorization)
    return next({ context: { user } })
  })

// Apply to server function
const protectedData = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    return { user: context.user }
  })
```

**Middleware characteristics**:

- Global middleware runs for all requests
- Middleware can depend on other middleware (dependency-first execution)
- Context passing between layers via `next({ context })`
- Client-to-server and server-to-client context transmission supported

### 6. Server Routes

Define API endpoints alongside routes in the same files:

```tsx
// src/routes/api/users/$userId.ts
export const Route = createFileRoute('/api/users/$userId')({
  server: {
    middleware: [authMiddleware],
    handlers: ({ createHandlers }) =>
      createHandlers({
        GET: {
          middleware: [authorizationMiddleware],
          handler: async ({ params }) => {
            const user = await db.users.find(params.userId)
            return Response.json({ user })
          },
        },
        PATCH: {
          middleware: [ownerOnlyMiddleware],
          handler: async ({ params, request }) => {
            const data = await request.json()
            await db.users.update(params.userId, data)
            return Response.json({ success: true })
          },
        },
      }),
  },
})
```

## Environment Variables

Two-tier system for security:

```bash
# .env (server-only - no prefix required)
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
JWT_SECRET=your-secret-key

# .env.local (client-safe - VITE_ prefix required)
VITE_API_URL=https://api.example.com
VITE_APP_NAME=SEMUA SUMATERA
```

```tsx
// Server function - all environment variables available
const getUser = createServerFn({ method: 'GET' }).handler(async () => {
  const db = await connect(process.env.DATABASE_URL) // ✅ Server-only
  return db.users.findFirst()
})

// Client component - only VITE_ prefixed variables
export function AppHeader() {
  const appName = import.meta.env.VITE_APP_NAME // ✅ Client-safe
  return <h1>{appName}</h1>
}
```

## Entry Points

### Client Entry Point (`src/client.tsx`)

```tsx
import { StartClient } from '@tanstack/react-start/client'
import { hydrateRoot } from 'react-dom/client'

hydrateRoot(document, <StartClient />)
```

### Server Entry Point (`src/server.ts`)

```tsx
import { createServerEntry } from '@tanstack/react-start/server-entry'

export default createServerEntry({
  async fetch(request) {
    return handler.fetch(request)
  },
})
```

### Root Route (`src/routes/__root.tsx`)

```tsx
export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'SEMUA SUMATERA' },
    ],
  }),
  component: RootComponent,
})
```

## Deployment

TanStack Start is **deployment agnostic** - deploy anywhere Vite works:

| Platform           | Support Level    |
| ------------------ | ---------------- |
| Cloudflare Workers | Official Partner |
| Netlify            | Official Partner |
| Vercel             | Via Nitro        |
| Node.js            | Full             |
| Docker             | Full             |
| Bun                | Full             |
| Railway/Fly.io     | Full             |

### Cloudflare Workers Configuration

```tsx
// vite.config.ts
export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tanstackStart(),
    viteReact(),
  ],
})
```

```json
// wrangler.jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "semua-sumatera",
  "compatibility_date": "2025-09-02",
  "compatibility_flags": ["nodejs_compat"],
  "main": "@tanstack/react-start/server-entry"
}
```

## Performance

### Development Experience

| Metric             | TanStack Start | Next.js   |
| ------------------ | -------------- | --------- |
| Dev server startup | Milliseconds   | Seconds   |
| HMR speed          | Instant        | Sluggish  |
| Dev resource usage | Lightweight    | Heavy     |
| Navigation speed   | Full-speed     | Throttled |

### Production Performance

- **Vite-optimized builds** with efficient code splitting
- **Built-in SWR caching** via TanStack Router
- **Streaming SSR** for progressive page loading
- **Selective SSR** reduces unnecessary server rendering
- **HTTP cache headers** for CDN integration (ISR pattern)

```tsx
// ISR via Cache-Control headers
export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => fetchPost(params.slug),
  headers: () => ({
    'Cache-Control':
      'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
  }),
})
```

## Comparison

### When to Choose TanStack Start

- **Maximum type safety** for routing and server functions
- **Deployment flexibility** without vendor lock-in
- **Composable, explicit patterns** over convention-based magic
- **Fine-grained SSR control** per route
- **Already using TanStack libraries** (Query, Router, Form)
- **Vite-first development** workflow

### Key Differentiators

| Feature                    | TanStack Start     | Next.js          | React Router v7 |
| -------------------------- | ------------------ | ---------------- | --------------- |
| Type-first architecture    | ✅                 | ❌               | ❌              |
| Server function middleware | ✅ Client + Server | ❌               | Server only     |
| Selective SSR              | ✅ Per-route       | Limited          | Limited         |
| Built-in SWR caching       | ✅ (via Router)    | Basic fetch only | ❌              |
| Dev HMR speed              | ⚡ Fast (Vite)     | 🐌 Slow          | ⚡ Fast (Vite)  |
| Vendor lock-in             | None               | Vercel-optimized | Minimal         |

## Anti-Patterns to Avoid

```tsx
// ❌ Exposing server secrets to client
const apiKey = process.env.SECRET_KEY // Exposed to client!

// ✅ Server-only access
const getSecret = createServerOnlyFn(() => process.env.SECRET_KEY)

// ❌ Assuming loaders are server-only
export const Route = createFileRoute('/users')({
  loader: () => {
    const secret = process.env.SECRET // Runs on BOTH server and client!
    return fetch(`/api?key=${secret}`)
  },
})

// ✅ Use server function for server-only operations
const getUsersSecurely = createServerFn().handler(() => {
  const secret = process.env.SECRET // Server-only
  return fetch(`/api?key=${secret}`)
})

// ❌ Hydration mismatch
function CurrentTime() {
  return <div>{new Date().toLocaleString()}</div>
}

// ✅ Consistent rendering
function CurrentTime() {
  const [time, setTime] = useState<string>()
  useEffect(() => {
    setTime(new Date().toLocaleString())
  }, [])
  return <div>{time || 'Loading...'}</div>
}
```

## Related Documents

- **Architecture Overview**: [architecture.md](./architecture.md)
- **TanStack Router**: [tanstack-router.md](./tanstack-router.md)
- **TanStack Query**: [tanstack-query.md](./tanstack-query.md)
- **TanStack Form**: [tanstack-form.md](./tanstack-form.md)
- **Official Docs**: https://tanstack.com/start/latest
- **GitHub**: https://github.com/TanStack/router

---

**Last Updated**: January 5, 2026
**Version**: 1.0.0
