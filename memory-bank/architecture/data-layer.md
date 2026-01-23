# Data Layer Architecture

**Stack**: TanStack Start + Drizzle ORM + Supabase PostgreSQL

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│  UI Components (React)                                  │
│  └─ Consumes hooks, handles loading/error/empty states │
├─────────────────────────────────────────────────────────┤
│  Data Hooks (useState/useEffect or TanStack Query)      │
│  └─ Calls server functions, manages client state        │
├─────────────────────────────────────────────────────────┤
│  Server Functions (TanStack Start)                      │
│  └─ createServerFn() - RPC boundary, serialization      │
├─────────────────────────────────────────────────────────┤
│  Repository (Drizzle ORM)                               │
│  └─ Type-safe queries, filters, joins, pagination       │
├─────────────────────────────────────────────────────────┤
│  Database (Supabase PostgreSQL)                         │
└─────────────────────────────────────────────────────────┘
```

## Layer Responsibilities

| Layer               | Location                   | Does                                        | Does NOT                     |
| ------------------- | -------------------------- | ------------------------------------------- | ---------------------------- |
| **Repository**      | `src/server/repositories/` | SQL queries, filters, joins, pagination     | Serialize dates, handle HTTP |
| **Server Function** | `src/server/functions/`    | Serialize dates, error handling, validation | Complex SQL logic            |
| **Hook**            | `src/hooks/`               | State management, loading states            | SQL, validation              |
| **Component**       | `src/components/`          | Render UI, handle user actions              | Data fetching logic          |

## Critical: Server Function Handler Signature

TanStack Start's `createServerFn().handler()` receives `{ data, context, request }`, NOT your input directly.

```typescript
// ❌ WRONG - data.limit is undefined, falls back to default 20
export const getContacts = createServerFn().handler(
  async (options: GetContactsOptions = {}) => { ... }
)

// ✅ CORRECT - destructure { data } from context
export const getContacts = createServerFn({ method: 'GET' }).handler(
  async ({ data: input }: { data?: GetContactsOptions }) => {
    const options = input ?? {}
    // options.limit is now correctly 1000
  }
)

// ✅ CALLER must pass { data: options }
getContacts({ data: { limit: 1000 } })
```

> 📚 **Context7**: Query TanStack Start docs for `createServerFn handler context` for latest API.

## Use Cases & Patterns

### 1. List Page (Read Many)

**Flow**: Component → Hook → Server Function → Repository → DB

**Repository**: Parallel data + count queries, apply filters

```typescript
const [rows, countResult] = await Promise.all([
  db.select({...}).from(table).where(where).limit(limit).offset(offset),
  db.select({ count: sql<number>`cast(count(*) as int)` }).from(table).where(where),
])
```

### 2. Detail Page (Read One)

**Repository**: Single record by ID with relations

```typescript
const result = await db.select({...})
  .from(table)
  .leftJoin(relatedTable, eq(table.foreignKey, relatedTable.id))
  .where(eq(table.id, id))
  .limit(1)
```

### 3. Create/Update (Mutations)

**Server Function**: Validate input, call repository, return result

```typescript
export const createContact = createServerFn({ method: 'POST' })
  .validator(createContactSchema) // Zod schema
  .handler(async ({ data }) => {
    const contact = await createContactInDb(data)
    return { success: true, data: contact }
  })
```

**Hook**: Call mutation, invalidate cache (if using TanStack Query)

```typescript
const { mutate } = useMutation({
  mutationFn: (data) => createContact({ data }),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contacts'] }),
})
```

### 4. Search & Filtering

**Repository**: Build dynamic WHERE conditions

```typescript
const conditions = []
conditions.push(eq(table.statusId, 'published'))

if (options.search) {
  conditions.push(sql`${table.name} ILIKE ${`%${options.search}%`}`)
}

const where = conditions.length > 0 ? and(...conditions) : undefined
```

### 5. Multiple Joins to Same Table

**Repository**: Use aliases

```typescript
import { alias } from 'drizzle-orm/pg-core'

const provinceArea = alias(geographyAreas, 'province')
const cityArea = alias(geographyAreas, 'city')

db.select({
  provinceName: provinceArea.geographyName,
  cityName: cityArea.geographyName,
})
  .from(contacts)
  .leftJoin(provinceArea, eq(contacts.coverageProvince, provinceArea.id))
  .leftJoin(cityArea, eq(contacts.coverageArea, cityArea.id))
```

## Do's and Don'ts

### ✅ DO

| Rule                                     | Why                                                      |
| ---------------------------------------- | -------------------------------------------------------- |
| Use Drizzle query builder                | Type-safe, catches schema drift at compile time          |
| Filter status at repository level        | Prevents exposing unpublished data                       |
| Serialize dates in server function       | `Date` objects don't survive JSON transport              |
| Return consistent response shape         | `{ success, data, total, error }`                        |
| Use `{ data }` destructuring in handlers | TanStack Start passes context object, not input directly |

### ❌ DON'T

| Rule                                           | Why                                             |
| ---------------------------------------------- | ----------------------------------------------- |
| Use raw SQL (`db.execute(sql\`...\`)`)         | Bypasses type safety, can drift from schema     |
| Filter on client for security                  | Exposes unpublished/unauthorized data           |
| Call server functions directly from components | Creates tight coupling, harder to test          |
| Use `useState/useEffect` for complex data      | TanStack Query handles caching, refetch, dedup  |
| Assume column names match schema               | Verify with Supabase MCP before writing queries |

## Response Shape Standard

```typescript
interface ApiResponse<T> {
  success: boolean
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
  error?: string
}
```

## File Naming Convention

```
src/server/
├── repositories/
│   └── {entity}.repository.ts    # getContactsFromDb, createContactInDb
├── functions/
│   └── {entity}.server.ts        # getContacts, createContact
src/hooks/
└── useFetch{Entity}s.ts          # useFetchContacts
```

## Related Resources

- **TanStack Start Server Functions**: Use Context7 MCP - query `/websites/tanstack_start` for `createServerFn`
- **Drizzle ORM**: Use Context7 MCP - query `/drizzle-team/drizzle-orm` for query builder
- **Analysis**: [2026-01-08-1014_server-function-handler-signature.md](../analysis/2026-01-08-1014_server-function-handler-signature.md)

---

**Last Updated**: 2026-01-08
