# TanStack Query Reference

**Library**: TanStack Query (`@tanstack/react-query`)
**Version**: v5.x
**Purpose**: Server-state management, caching, and data fetching

## Overview

TanStack Query is a powerful async state management library for:

- **Fetching** and caching server data
- **Optimistic updates** with automatic rollback
- **Background refetching** and cache invalidation
- **Dependent queries** and parallel loading

## Core Concepts

### Three Core Concepts

1. **Queries** - Fetching and caching data
2. **Mutations** - Creating, updating, deleting data
3. **Query Invalidation** - Keeping cache fresh

### Query Client Setup

```tsx
// src/lib/query-client.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // 1 minute
      gcTime: 5 * 60_000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// src/app.tsx
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
```

## Queries

### Basic Query

```tsx
import { useQuery } from '@tanstack/react-query'

type Post = { id: string; title: string; body: string }

function PostsList() {
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['posts'],
    queryFn: async (): Promise<Post[]> => {
      const response = await fetch('/api/posts')
      if (!response.ok) throw new Error('Failed to fetch posts')
      return response.json()
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error: {error.message}</div>

  return (
    <ul>
      {data.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

### Query with Parameters

```tsx
function PostDetail({ postId }: { postId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['posts', postId],
    queryFn: () => fetchPost(postId),
    staleTime: 5 * 60_000, // Cache for 5 minutes
  })

  if (isLoading) return <PostSkeleton />
  return <article>{data.title}</article>
}
```

### Query Options Reference

| Option                 | Type                 | Default   | Description                                 |
| ---------------------- | -------------------- | --------- | ------------------------------------------- |
| `queryKey`             | `readonly unknown[]` | Required  | Unique cache key                            |
| `queryFn`              | `() => Promise<T>`   | Required  | Data fetcher                                |
| `staleTime`            | `number`             | 0         | Time before data is stale (ms)              |
| `gcTime`               | `number`             | 300000    | Time before cache is garbage collected (ms) |
| `enabled`              | `boolean`            | true      | Enable/disable query                        |
| `retry`                | `number \| boolean`  | 3         | Number of retry attempts                    |
| `refetchInterval`      | `number`             | false     | Auto-refetch interval (ms)                  |
| `refetchOnWindowFocus` | `boolean`            | false     | Refetch on window focus                     |
| `initialData`          | `T`                  | undefined | Hydrate from SSR                            |

## Mutations

### Basic Mutation

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

function AddTodo() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (newTodo: string) =>
      fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTodo }),
      }).then((res) => res.json()),
    onSuccess: () => {
      // Invalidate and refetch todos
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        mutation.mutate(e.target.todo.value)
      }}
    >
      <input name="todo" />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Adding...' : 'Add Todo'}
      </button>
    </form>
  )
}
```

### Optimistic Updates

```tsx
const updateTodoMutation = useMutation({
  mutationFn: ({ id, text }: { id: string; text: string }) =>
    fetch(`/api/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ text }),
    }).then((res) => res.json()),
  onMutate: async (newTodo) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['todos'] })

    // Snapshot previous value
    const previousTodos = queryClient.getQueryData(['todos'])

    // Optimistically update
    queryClient.setQueryData(['todos'], (old: Todo[]) =>
      old.map((todo) =>
        todo.id === newTodo.id ? { ...todo, text: newTodo.text } : todo,
      ),
    )

    return { previousTodos }
  },
  onError: (err, newTodo, context) => {
    // Rollback on error
    if (context?.previousTodos) {
      queryClient.setQueryData(['todos'], context.previousTodos)
    }
  },
  onSettled: () => {
    // Refetch to ensure sync
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})
```

### Simplified Optimistic Updates (v5)

```tsx
const addTodoMutation = useMutation({
  mutationFn: (text: string) => axios.post('/api/todos', { text }),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
})

// Use mutation.variables for pending state display
if (queryInfo.data) {
  return (
    <ul>
      {queryInfo.data.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
      {addTodoMutation.isPending && (
        <li style={{ opacity: 0.5 }}>{addTodoMutation.variables}</li>
      )}
    </ul>
  )
}
```

## Query Invalidation

### Invalidate by Key

```tsx
const queryClient = useQueryClient()

// Invalidate all queries with 'posts' key
queryClient.invalidateQueries({ queryKey: ['posts'] })

// Invalidate specific query
queryClient.invalidateQueries({
  queryKey: ['posts', '123'],
})
```

### Invalidate with Filters

```tsx
// Invalidate all 'posts' queries regardless of other keys
queryClient.invalidateQueries({
  queryKey: ['posts'],
  exact: false, // Default - matches partial keys
})

// Invalidate active queries only
queryClient.invalidateQueries({
  queryKey: ['posts'],
  refetchType: 'active',
})
```

### Invalidate on Mutation

```tsx
const createPostMutation = useMutation({
  mutationFn: createPost,
  onSuccess: () => {
    // Invalidate all list queries
    queryClient.invalidateQueries({ queryKey: ['posts'] })
    // Invalidate dashboard stats
    queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
  },
})
```

## Advanced Patterns

### Dependent Queries

```tsx
function UserPosts({ userId }: { userId: string }) {
  const { data: user } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => fetchUser(userId),
  })

  const { data: posts } = useQuery({
    queryKey: ['posts', 'user', userId],
    queryFn: () => fetchUserPosts(userId),
    enabled: !!user, // Only run when user is loaded
  })

  return <PostList posts={posts} />
}
```

### Parallel Queries

```tsx
function Dashboard() {
  const { data: campaigns } = useQuery({
    queryKey: ['campaigns'],
    queryFn: fetchCampaigns,
  })

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchStats,
  })

  const { data: contacts } = useQuery({
    queryKey: ['contacts'],
    queryFn: fetchContacts,
  })

  // All load in parallel
  return (
    <DashboardView campaigns={campaigns} stats={stats} contacts={contacts} />
  )
}
```

### Query Client Methods

| Method                    | Description             |
| ------------------------- | ----------------------- |
| `setQueryData(key, data)` | Directly set cache data |
| `getQueryData(key)`       | Get cached data         |
| `invalidateQueries(key)`  | Mark queries as stale   |
| `refetchQueries(key)`     | Force refetch queries   |
| `cancelQueries(key)`      | Cancel ongoing queries  |
| `prefetchQuery(key, fn)`  | Preload data into cache |
| `removeQueries(key)`      | Remove from cache       |

## Integration with TanStack Start

### Server Functions

```tsx
// Define server function
const getCampaigns = createServerFn({ method: 'GET' }).handler(async () => {
  return db.campaigns.findMany({ where: { status: 'active' } })
})

// Use with TanStack Query
function CampaignList() {
  const { data } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => getCampaigns(),
    staleTime: 60_000,
  })
}
```

### SSR Hydration

```tsx
// Server loader provides initial data
export const Route = createFileRoute('/campaigns')({
  loader: async () => {
    const campaigns = await getCampaigns()
    return { campaigns }
  },
  component: CampaignsPage,
})

function CampaignsPage() {
  const { campaigns } = Route.useLoaderData()

  // Hydrate query cache with SSR data
  const { data: clientCampaigns } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => getCampaigns(),
    initialData: campaigns, // Hydrate from SSR
  })

  return <CampaignList campaigns={clientCampaigns} />
}
```

## Best Practices

### 1. Use Appropriate staleTime

```tsx
// Static data - longer staleTime
useQuery({
  queryKey: ['countries'],
  queryFn: fetchCountries,
  staleTime: 24 * 60 * 60_000, // 24 hours
})

// Dynamic data - shorter staleTime
useQuery({
  queryKey: ['dashboard-stats'],
  queryFn: fetchStats,
  staleTime: 30_000, // 30 seconds
})
```

### 2. Key Naming Convention

```tsx
// Resource-based keys
queryKey: ['campaigns']
queryKey: ['campaigns', id]
queryKey: ['campaigns', 'list', { status: 'active', page: 1 }]

// Consistent pattern: [resource, id?, filter?]
```

### 3. Error Handling

```tsx
const { data, error, isError } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
  retry: 1,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
})

if (isError) {
  return <ErrorMessage error={error} retry={refetch} />
}
```

## Related Documents

- **Architecture Overview**: [architecture.md](./architecture.md)
- **TanStack Router**: [tanstack-router.md](./tanstack-router.md)
- **TanStack DB**: [tanstack-db.md](./tanstack-db.md)
- **TanStack Start**: [tanstack-start.md](./tanstack-start.md)
- **Official Docs**: https://tanstack.com/query/latest
- **GitHub**: https://github.com/TanStack/query

---

**Last Updated**: January 5, 2026
**Version**: 1.0.0
