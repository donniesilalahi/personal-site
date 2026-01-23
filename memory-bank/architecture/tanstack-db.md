# TanStack DB Reference

**Library**: TanStack DB (`@tanstack/db`, `@tanstack/react-db`)
**Version**: Latest
**Purpose**: Reactive client store with collections and optimistic mutations

## Overview

TanStack DB builds on TanStack Query, adding:

- **Collections**: Entity-based data management with ID-based access
- **Live Queries**: Automatic reactivity when underlying data changes
- **Optimistic Mutations**: Instant UI updates with automatic server sync
- **Persistence Handlers**: Server synchronization callbacks

## Core Concepts

### Collection Pattern

A collection wraps TanStack Query with reactive updates:

```tsx
import { createCollection, queryCollectionOptions } from '@tanstack/db'
import { queryClient } from '@/lib/query-client'

// Define collection with TanStack Query backing
const campaignCollection = createCollection(
  queryCollectionOptions({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const response = await fetch('/api/campaigns')
      return response.json()
    },
    queryClient,
    getKey: (item) => item.id,
  }),
)
```

### Live Queries

Live queries automatically update when collection data changes:

```tsx
import { useLiveQuery } from '@tanstack/react-db'
import { campaignCollection } from '@/lib/collections/campaigns'

function CampaignList() {
  // Auto-updates when collection changes
  const { data: campaigns } = useLiveQuery((q) =>
    q
      .from({ campaign: campaignCollection })
      .where(({ campaign }) => eq(campaign.status, 'active'))
      .orderBy(({ campaign }) => campaign.createdAt, 'desc'),
  )

  return (
    <ul>
      {campaigns.map((campaign) => (
        <li key={campaign.id}>{campaign.title}</li>
      ))}
    </ul>
  )
}
```

## Configuration

### queryCollectionOptions

```tsx
const collection = createCollection(
  queryCollectionOptions({
    // Required
    queryKey: ['todos'],
    queryFn: fetchTodos,
    queryClient,
    getKey: (item) => item.id,

    // Optional
    schema: todoSchema, // Type inference
    select: (data) => data.items, // Transform response
    onInsert: async ({ transaction }) => {
      // Handle insert persistence
      await api.createTodos(transaction.mutations.map((m) => m.modified))
    },
    onUpdate: async ({ transaction }) => {
      // Handle update persistence
      await api.updateTodos(transaction.mutations)
    },
    onDelete: async ({ transaction }) => {
      // Handle delete persistence
      await api.deleteTodos(transaction.mutations.map((m) => m.key))
    },
  }),
)
```

### Collection Options Reference

| Option        | Type                         | Description           |
| ------------- | ---------------------------- | --------------------- |
| `queryKey`    | `readonly unknown[]`         | TanStack Query key    |
| `queryFn`     | `() => Promise<T>`           | Data fetcher          |
| `queryClient` | `QueryClient`                | Query client instance |
| `getKey`      | `(item) => string \| number` | Extract item ID       |
| `schema`      | `Schema`                     | Type inference        |
| `select`      | `(data) => T`                | Transform data        |
| `onInsert`    | `async ({ transaction })`    | Insert callback       |
| `onUpdate`    | `async ({ transaction })`    | Update callback       |
| `onDelete`    | `async ({ transaction })`    | Delete callback       |

## Mutations

### Insert

```tsx
// Insert single item
campaignCollection.insert({
  id: crypto.randomUUID(),
  title: 'Emergency Relief',
  status: 'active',
  createdAt: new Date(),
  updatedAt: new Date(),
})

// Insert multiple items
campaignCollection.insert([
  {
    id: '1',
    title: 'Campaign 1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Campaign 2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
])
```

### Update

```tsx
// Update single item
campaignCollection.update(campaignId, (draft) => {
  draft.title = 'Updated Title'
  draft.status = 'closed'
  draft.updatedAt = new Date()
})

// Update multiple items
campaignCollection.update([id1, id2], (drafts) => {
  drafts.forEach((draft) => {
    draft.status = 'closed'
  })
})
```

### Delete

```tsx
// Delete single item
campaignCollection.delete(campaignId)

// Delete multiple items
campaignCollection.delete([id1, id2, id3])
```

### With Metadata

```tsx
campaignCollection.update(
  campaignId,
  { metadata: { source: 'mobile', intent: 'complete' } },
  (draft) => {
    draft.completed = true
  },
)
```

### Disable Optimistic Updates

```tsx
// For server-validated operations
campaignCollection.insert(
  { id: '1', title: 'Server-validated', completed: false },
  { optimistic: false },
)
```

### Wait for Persistence

```tsx
const tx = campaignCollection.update(campaignId, (draft) => {
  draft.title = 'Updated'
})

try {
  await tx.isPersisted.promise
  console.log('Update persisted successfully')
} catch (error) {
  console.error('Update failed:', error)
}
```

## Live Queries

### Basic Live Query

```tsx
const { data, collection, isReady } = useLiveQuery((q) =>
  q.from({ campaign: campaignCollection }),
)
```

### With Filtering

```tsx
const { data: activeCampaigns } = useLiveQuery((q) =>
  q
    .from({ campaign: campaignCollection })
    .where(({ campaign }) => eq(campaign.status, 'active'))
    .orderBy(({ campaign }) => campaign.createdAt, 'desc'),
)
```

### With Joins

```tsx
const { data: commentsWithUsers } = useLiveQuery((q) =>
  q
    .from({ comment: commentsCollection })
    .join({ user: usersCollection }, ({ comment, user }) =>
      eq(comment.userId, user.id),
    )
    .where(({ comment }) => eq(comment.active, true))
    .select(({ comment, user }) => ({
      id: comment.id,
      content: comment.content,
      authorName: user.name,
    })),
)
```

### Subscribe to Collection

```tsx
// Direct collection access
const { data, collection, isReady } = useLiveQuery(existingQuery)

// Access collection methods
const handleToggle = (id: string) => {
  collection.value.update(id, (draft) => {
    draft.completed = !draft.completed
  })
}
```

## Query Builder

### Available Operations

| Operation                      | Description                  |
| ------------------------------ | ---------------------------- |
| `from({ collection })`         | Specify source collection    |
| `where(fn)`                    | Filter results               |
| `orderBy(fn, 'asc' \| 'desc')` | Sort results                 |
| `select(fn)`                   | Project specific fields      |
| `join(collection, on)`         | Join with another collection |
| `limit(n)`                     | Limit results                |
| `offset(n)`                    | Offset results               |

### Example

```tsx
q.from({ campaign: campaignCollection })
  .where(({ campaign }) =>
    and(eq(campaign.status, 'active'), gte(campaign.createdAt, startDate)),
  )
  .orderBy(({ campaign }) => campaign.createdAt, 'desc')
  .select(({ campaign }) => ({
    id: campaign.id,
    title: campaign.title,
    raised: campaign.raised,
  }))
  .limit(10)
```

## Integration with TanStack Start

### Server Function Persistence

```tsx
// src/lib/collections/campaigns.ts
import { createCollection, queryCollectionOptions } from '@tanstack/db'
import { queryClient } from '@/lib/query-client'
import {
  getCampaigns,
  updateCampaign,
  deleteCampaign,
} from '@/server/campaigns'

export const campaignCollection = createCollection(
  queryCollectionOptions({
    queryKey: ['campaigns'],
    queryFn: () => getCampaigns(),
    queryClient,
    getKey: (item) => item.id,

    onInsert: async ({ transaction }) => {
      await Promise.all(
        transaction.mutations.map((m) => createCampaign(m.modified)),
      )
    },

    onUpdate: async ({ transaction }) => {
      await Promise.all(
        transaction.mutations.map((m) => updateCampaign(m.key, m.changes)),
      )
    },

    onDelete: async ({ transaction }) => {
      await Promise.all(transaction.mutations.map((m) => deleteCampaign(m.key)))
    },
  }),
)
```

### Client Usage

```tsx
// src/routes/campaigns.tsx
import { useLiveQuery } from '@tanstack/react-db'
import { campaignCollection } from '@/lib/collections/campaigns'

export const Route = createFileRoute('/campaigns')({
  component: CampaignsPage,
})

function CampaignsPage() {
  const { data: campaigns } = useLiveQuery((q) =>
    q
      .from({ campaign: campaignCollection })
      .where(({ campaign }) => eq(campaign.status, 'active')),
  )

  const toggleStatus = (campaign: Campaign) => {
    // Optimistic update - instant UI
    campaignCollection.update(campaign.id, (draft) => {
      draft.status = draft.status === 'active' ? 'closed' : 'active'
    })
  }

  return (
    <ul>
      {campaigns.map((campaign) => (
        <li key={campaign.id}>
          {campaign.title}
          <button onClick={() => toggleStatus(campaign)}>Toggle Status</button>
        </li>
      ))}
    </ul>
  )
}
```

## Best Practices

### 1. Collection per Entity

```tsx
// Good - one collection per entity
const campaignCollection = createCollection(...)
const contactCollection = createCollection(...)
const reliefCenterCollection = createCollection(...)

// Avoid - monolithic collections
const appCollection = createCollection(...) // ❌
```

### 2. Handle Persistence Errors

```tsx
onUpdate: async ({ transaction }) => {
  try {
    await api.updateItems(transaction.mutations)
  } catch (error) {
    // TanStack DB will automatically rollback optimistic updates
    console.error('Update failed:', error)
  }
}
```

### 3. Use Appropriate Optimistic Settings

```tsx
// Enable for instant UI feedback
collection.update(id, (draft) => {
  draft.status = 'completed'
}) // optimistic: true (default)

// Disable for critical operations
collection.update(
  id,
  (draft) => {
    draft.approved = true
  },
  { optimistic: false },
)
```

## When to Use TanStack DB

| Scenario                 | Use TanStack DB?             |
| ------------------------ | ---------------------------- |
| Simple caching           | Use TanStack Query           |
| Real-time reactivity     | ✅ Yes                       |
| Complex entity editing   | ✅ Yes                       |
| Optimistic updates       | ✅ Yes                       |
| Offline-capable features | ✅ Yes                       |
| Server-only data         | Use Query + Server Functions |

## Related Documents

- **Architecture Overview**: [architecture.md](./architecture.md)
- **TanStack Query**: [tanstack-query.md](./tanstack-query.md)
- **TanStack Start**: [tanstack-start.md](./tanstack-start.md)
- **Official Docs**: https://tanstack.com/db/latest
- **GitHub**: https://github.com/TanStack/db

---

**Last Updated**: January 5, 2026
**Version**: 1.0.0
