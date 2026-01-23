# TanStack Router Reference

**Library**: TanStack Router (`@tanstack/react-router`)
**Version**: v1.140.5
**Purpose**: Type-safe file-based routing with built-in caching and data loading

## Overview

TanStack Router is a fully typesafe router for React providing:

- **File-based routing** with automatic code-splitting
- **Nested routing** with full type safety
- **Search param management** with type inference
- **Route loaders** with built-in SWR caching
- **Deferred data loading** for streaming SSR

## Core Concepts

### File-Based Routing

Routes are defined as files in the `src/routes/` directory:

```
src/routes/
├── __root.tsx              # Root route
├── index.tsx               # / (homepage)
├── about.tsx               # /about
├── posts/
│   ├── index.tsx           # /posts
│   ├── $postId.tsx         # /posts/$postId
│   └── $postId.edit.tsx    # /posts/$postId/edit
└── _authed.tsx             # Pathless layout (auth guard)
```

### Route Definition

```tsx
// src/routes/posts/$postId.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params }) => {
    const post = await fetchPost(params.postId)
    return { post }
  },
  component: PostComponent,
})

function PostComponent() {
  const { post } = Route.useLoaderData()
  return <article>{post.title}</article>
}
```

### Dynamic Parameters

```tsx
// Route with multiple params
export const Route = createFileRoute('/users/$userId/posts/$postId')({
  loader: async ({ params }) => {
    const { userId, postId } = params
    return fetchPost({ userId, postId })
  },
})
```

### Search Parameters

```tsx
export const Route = createFileRoute('/posts')({
  validateSearch: z.object({
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(10),
    status: z.enum(['all', 'active', 'closed']).default('all'),
  }),
  loader: async ({ search }) => {
    return fetchPosts({
      page: search.page,
      limit: search.limit,
      status: search.status,
    })
  },
  component: PostsPage,
})

function PostsPage() {
  const { page, limit, status } = Route.useSearch()
  // ...
}
```

## Data Loading

### Route Loaders

Loaders run on both server (SSR) and client (hydration):

```tsx
export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params, context }) => {
    const post = await db.posts.find({
      where: { id: params.postId },
      include: { author: true },
    })
    if (!post) throw notFound()
    return { post }
  },
  component: PostComponent,
})
```

### Built-in Caching

TanStack Router loaders include SWR caching:

```tsx
export const Route = createFileRoute('/posts')({
  loader: async () => fetchPosts(),
  staleTime: 10_000, // Data is "fresh" for 10 seconds
  gcTime: 5 * 60_000, // Keep in cache for 5 minutes
})
```

### Deferred Data Loading

For streaming SSR with Suspense:

```tsx
export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params }) => {
    return {
      post: fetchPost(params.postId), // Awaited - blocks
      comments: defer(fetchComments(params.postId)), // Deferred - non-blocking
    }
  },
  component: PostComponent,
})

function PostComponent() {
  const { post, comments } = Route.useLoaderData()

  return (
    <article>
      <h1>{post.title}</h1>
      <Suspense fallback={<CommentsSkeleton />}>
        <CommentsList comments={comments} />
      </Suspense>
    </article>
  )
}
```

## Nested Routing

### Layout Routes

```tsx
// src/routes/_authed.tsx (pathless layout)
export const Route = createFileRoute('/_authed')({
  component: AuthedLayout,
})

function AuthedLayout({ children }) {
  const { user } = useAuth()
  return (
    <div>
      <Sidebar user={user} />
      <main>{children}</main>
    </div>
  )
}

// src/routes/_authed/dashboard.tsx
export const Route = createFileRoute('/_authed/dashboard')({
  component: DashboardPage,
})
// Automatically wrapped by _authed layout
```

### Nested Routes

```
src/routes/
├── posts/
│   ├── index.tsx           # /posts (list)
│   ├── $postId.tsx         # /posts/$postId (detail)
│   └── $postId.comments.tsx # /posts/$postId/comments (nested)
```

## Protected Routes

### Auth Guard Pattern

```tsx
// src/routes/_auth.tsx (public layout)
export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
})

function AuthLayout({ children }) {
  const { user, isLoading } = useAuth()

  if (isLoading) return <LoadingSpinner />

  if (user) {
    return <Navigate to="/dashboard" />
  }

  return <>{children}</>
}
```

### Role-Based Access

```tsx
export const Route = createFileRoute('/admin')({
  loader: async ({ context }) => {
    if (context.user.role !== 'admin') {
      throw redirect('/unauthorized')
    }
    return fetchAdminData()
  },
  component: AdminPage,
})
```

## Error Handling

### Route Error Component

```tsx
export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params }) => fetchPost(params.postId),
  errorComponent: PostError,
  component: PostComponent,
})

function PostError({ error }) {
  if (error instanceof NotFoundError) {
    return <div>Post not found</div>
  }
  return <div>Something went wrong</div>
}
```

### Global Error Handler

```tsx
// router.tsx
export function getRouter() {
  const router = createRouter({
    routeTree,
    defaultErrorComponent: ({ error }) => <ErrorBoundary error={error} />,
  })
  return router
}
```

## API Reference

### Route Configuration Options

| Option              | Type                     | Description             |
| ------------------- | ------------------------ | ----------------------- |
| `loader`            | `(ctx) => Promise<T>`    | Data loading function   |
| `validateSearch`    | `ZodSchema`              | Search param validation |
| `validateParams`    | `ZodSchema`              | Param validation        |
| `staleTime`         | `number`                 | Cache freshness (ms)    |
| `gcTime`            | `number`                 | Cache retention (ms)    |
| `ssr`               | `boolean \| 'data-only'` | SSR behavior            |
| `component`         | `Component`              | Route component         |
| `errorComponent`    | `Component`              | Error boundary          |
| `notFoundComponent` | `Component`              | 404 fallback            |

### Hooks

| Hook              | Returns        | Description             |
| ----------------- | -------------- | ----------------------- |
| `useLoaderData()` | `T`            | Loader return data      |
| `useSearch()`     | `SearchParams` | Search parameters       |
| `useParams()`     | `Params`       | Route parameters        |
| `useMatch()`      | `Match`        | Current route match     |
| `useNavigate()`   | `NavigateFn`   | Programmatic navigation |
| `useRouter()`     | `Router`       | Router instance         |

## Best Practices

### 1. Type-Safe Parameters

```tsx
// Always use Zod for validation
const postSchema = z.object({
  postId: z.string().uuid(),
})

export const Route = createFileRoute('/posts/$postId')({
  validateParams: postSchema,
  loader: async ({ params }) => {
    // params.postId is fully typed
    return fetchPost(params.postId)
  },
})
```

### 2. Loader Composition

```tsx
// Share loader logic
async function getPostData(postId: string) {
  const [post, author, comments] = await Promise.all([
    db.posts.find(postId),
    db.users.find(post.authorId),
    db.comments.find({ postId }),
  ])
  return { post, author, comments }
}

export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params }) => getPostData(params.postId),
})
```

### 3. Error Handling Strategy

```tsx
// Centralized error types
class NotFoundError extends Error {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`)
    this.name = 'NotFoundError'
  }
}

// Use in loaders
export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params }) => {
    const post = await db.posts.find(params.postId)
    if (!post) throw new NotFoundError('Post', params.postId)
    return post
  },
})
```

## Integration with TanStack Query

Use TanStack Query alongside loaders for client-side features:

```tsx
export const Route = createFileRoute('/posts')({
  loader: () => fetchPosts(), // SSR data
  component: PostsPage,
})

function PostsPage() {
  const { data: initialPosts } = Route.useLoaderData()

  // Additional client-side query
  const { data: filteredPosts } = useQuery({
    queryKey: ['posts-filtered'],
    queryFn: () => fetchFilteredPosts(),
    initialData: initialPosts, // Hydrate from loader
  })

  return <PostList posts={filteredPosts} />
}
```

## Related Documents

- **Architecture Overview**: [architecture.md](./architecture.md)
- **TanStack Start**: [tanstack-start.md](./tanstack-start.md)
- **TanStack Query**: [tanstack-query.md](./tanstack-query.md)
- **Official Docs**: https://tanstack.com/router/latest
- **GitHub**: https://github.com/TanStack/router

---

**Last Updated**: January 5, 2026
**Version**: 1.0.0
