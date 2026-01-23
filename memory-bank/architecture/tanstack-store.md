# TanStack Store Reference

**Library**: TanStack Store (`@tanstack/store`, `@tanstack/react-store`)
**Version**: Latest
**Purpose**: Framework-agnostic reactive state store

## Overview

TanStack Store is an **immutable, reactive data store**:

- **Framework adapters** for React, Solid, Vue, Svelte
- **Fine-grained updates** for performant state management
- **Derived state** with automatic dependency tracking
- **Foundation** for TanStack Query and TanStack DB

## Core Concepts

### Store Creation

```tsx
import { Store } from '@tanstack/store'

const store = new Store({
  dogs: 0,
  cats: 0,
  theme: 'light',
  sidebarOpen: true,
})
```

### State Access

```tsx
// Get current state
console.log(store.state.dogs) // 0
console.log(store.state.theme) // 'light'

// Get full state
console.log(store.state)
```

### State Updates

```tsx
// Functional update
store.setState((prev) => ({
  ...prev,
  dogs: prev.dogs + 1,
}))

// Direct value update
store.setState({ dogs: 5, cats: 3, theme: 'dark', sidebarOpen: true })
```

## React Integration

### useStore Hook

```tsx
import { useStore } from '@tanstack/react-store'

function Display({ animal }: { animal: 'dogs' | 'cats' }) {
  // Only re-renders when state[animal] changes
  const count = useStore(store, (state) => state[animal])
  return (
    <div>
      {animal}: {count}
    </div>
  )
}

function Increment({ animal }: { animal: 'dogs' | 'cats' }) {
  return (
    <button
      onClick={() => {
        store.setState((state) => ({
          ...state,
          [animal]: state[animal] + 1,
        }))
      }}
    >
      Add {animal}
    </button>
  )
}

function App() {
  return (
    <div>
      <Increment animal="dogs" />
      <Display animal="dogs" />
      <Increment animal="cats" />
      <Display animal="cats" />
    </div>
  )
}
```

### Selective Subscriptions

```tsx
// Subscribe to specific state slice
const theme = useStore(store, (state) => state.theme)
// Only re-renders when theme changes

// Multiple selections
const [dogs, cats] = useStore(store, (state) => [state.dogs, state.cats])
// Re-renders when either changes
```

## Derived State

### Basic Derived Value

```tsx
import { Store, Derived } from '@tanstack/store'

const count = new Store({ value: 5 })

const double = new Derived({
  fn: () => count.state.value * 2,
  deps: [count],
})

// Mount to activate
const unmount = double.mount()

console.log(double.state) // 10

count.setState({ value: 10 })
console.log(double.state) // 20

// Cleanup
unmount()
```

### Multi-Dependency Derived

```tsx
const firstName = new Store('John')
const lastName = new Store('Doe')

const fullName = new Derived({
  fn: ({ currDepVals }) => {
    const first = currDepVals[0]
    const last = currDepVals[1]
    return `${first} ${last}`
  },
  deps: [firstName, lastName],
})

const unmount = fullName.mount()

console.log(fullName.state) // "John Doe"

firstName.setState('Jane')
console.log(fullName.state) // "Jane Doe"

unmount()
```

## UI State Pattern

### Global UI Store

```tsx
// src/lib/stores/ui.ts
import { Store } from '@tanstack/store'

export interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  modalOpen: string | null
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'info'
    message: string
  }>
}

export const uiStore = new Store<UIState>({
  sidebarOpen: true,
  theme: 'light',
  modalOpen: null,
  notifications: [],
})

// Action creators
export function toggleSidebar() {
  uiStore.setState((state) => ({
    sidebarOpen: !state.sidebarOpen,
  }))
}

export function setTheme(theme: 'light' | 'dark') {
  uiStore.setState({ theme })
}

export function openModal(modalId: string) {
  uiStore.setState({ modalOpen: modalId })
}

export function closeModal() {
  uiStore.setState({ modalOpen: null })
}

export function addNotification(
  notification: Omit<UIState['notifications'][0], 'id'>,
) {
  const id = crypto.randomUUID()
  uiStore.setState((state) => ({
    notifications: [...state.notifications, { ...notification, id }],
  }))
  setTimeout(() => {
    uiStore.setState((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  }, 5000)
}
```

### Component Usage

```tsx
// src/components/layout/Sidebar.tsx
import { useStore } from '@tanstack/react-store'
import { uiStore, toggleSidebar } from '@/lib/stores/ui'

export function Sidebar() {
  const isOpen = useStore(uiStore, (state) => state.sidebarOpen)

  return (
    <aside className={isOpen ? 'open' : 'closed'}>
      <nav>...</nav>
      <button onClick={toggleSidebar}>{isOpen ? 'Collapse' : 'Expand'}</button>
    </aside>
  )
}

// src/components/ui/ThemeToggle.tsx
import { useStore } from '@tanstack/react-store'
import { uiStore, setTheme } from '@/lib/stores/ui'

export function ThemeToggle() {
  const theme = useStore(uiStore, (state) => state.theme)

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
```

## Comparison with Alternatives

| Feature        | TanStack Store | Redux     | Jotai | Recoil |
| -------------- | -------------- | --------- | ----- | ------ |
| Boilerplate    | Low            | High      | Low   | Low    |
| Type Safety    | Full           | Good      | Full  | Full   |
| Bundle Size    | Small          | Large     | Small | Medium |
| Learning Curve | Low            | High      | Low   | Medium |
| DevTools       | Basic          | Excellent | Good  | Good   |
| SSR Support    | Good           | Good      | Good  | Poor   |

## When to Use TanStack Store

| Use Case                       | Recommended                 |
| ------------------------------ | --------------------------- |
| Route-coupled SSR data         | Use TanStack Router Loaders |
| Server-state caching           | Use TanStack Query          |
| Reactive collections           | Use TanStack DB             |
| Form state                     | Use TanStack Form           |
| Global UI state                | ✅ TanStack Store           |
| Complex state logic            | ✅ TanStack Store           |
| Shared state across components | ✅ TanStack Store           |

## Best Practices

### 1. Store per Domain

```tsx
// Good - separate stores for separate concerns
export const uiStore = new Store({ theme: 'light', sidebarOpen: true })
export const authStore = new Store({ user: null, token: null })
export const preferencesStore = new Store({ language: 'id', notifications: true })

// Avoid - monolithic store
export const appStore = new Store({ ui: {}, auth: {}, preferences: {}, ... }) // ❌
```

### 2. Immutable Updates

```tsx
// Good - immutable update
store.setState((prev) => ({
  ...prev,
  items: [...prev.items, newItem],
}))

// Avoid - mutation
store.state.items.push(newItem) // ❌
```

### 3. Selective Subscriptions

```tsx
// Good - subscribe to specific slice
const theme = useStore(store, (state) => state.theme)
// Only re-renders when theme changes

// Avoid - full state subscription
const state = useStore(store) // ❌ Re-renders on any change
```

### 4. Derived State with Dependencies

```tsx
// Good - explicit dependencies
const total = new Derived({
  fn: () => items.state.items.reduce((sum, item) => sum + item.price, 0),
  deps: [items],
})

// Avoid - implicit/untracked derivation
const total = computed(() => items.state.items.reduce(...)) // ❌
```

## Advanced Patterns

### Store Middleware

```tsx
import { Store, createStore } from '@tanstack/store'

const withLogger = (store: Store) => {
  const originalSetState = store.setState.bind(store)
  store.setState = (updater) => {
    console.log('State changing...', store.state)
    originalSetState(updater)
    console.log('State changed!', store.state)
  }
  return store
}

const store = withLogger(new Store({ count: 0 }))
```

### Store Combination

```tsx
import { Store, Derived, createStore } from '@tanstack/store'

// Combine multiple stores
const store1 = new Store({ a: 1 })
const store2 = new Store({ b: 2 })

const combined = new Derived({
  fn: () => ({
    a: store1.state.a,
    b: store2.state.b,
    sum: store1.state.a + store2.state.b,
  }),
  deps: [store1, store2],
})

const unmount = combined.mount()
```

### SSR Hydration

```tsx
// Server-side
const initialState = { theme: 'dark', sidebarOpen: false }

// Client-side
export const uiStore = new Store(initialState)

// Rehydrate from server data
fetch('/api/state').then((serverState) => {
  uiStore.setState(serverState)
})
```

## API Reference

### Store Options

| Option  | Type | Description   |
| ------- | ---- | ------------- |
| `state` | `T`  | Initial state |

### Store Methods

| Method                | Returns      | Description            |
| --------------------- | ------------ | ---------------------- |
| `setState(updater)`   | `void`       | Update state           |
| `getState()`          | `T`          | Get current state      |
| `subscribe(listener)` | `() => void` | Subscribe to changes   |
| `mount()`             | `() => void` | Mount derived stores   |
| `unmount()`           | `void`       | Cleanup derived stores |

### Derived Options

| Option | Type          | Description         |
| ------ | ------------- | ------------------- |
| `fn`   | `(deps) => T` | Compute function    |
| `deps` | `Store[]`     | Dependencies        |
| `id`   | `string`      | Optional identifier |

### useStore Options

| Option       | Type                | Description       |
| ------------ | ------------------- | ----------------- |
| `selector`   | `(state) => T`      | State selector    |
| `equalityFn` | `(a, b) => boolean` | Equality function |

## Integration with TanStack Ecosystem

### Foundation for Query

TanStack Query uses TanStack Store internally for caching:

```tsx
// QueryClient internally uses TanStack Store
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // Stored in internal store
      gcTime: 5 * 60_000,
    },
  },
})
```

### Foundation for DB

TanStack DB collections use TanStack Store:

```tsx
// Collections are backed by TanStack Store
const campaignCollection = createCollection({
  // Internal store manages collection state
})
```

## Related Documents

- **Architecture Overview**: [architecture.md](./architecture.md)
- **TanStack Query**: [tanstack-query.md](./tanstack-query.md)
- **TanStack DB**: [tanstack-db.md](./tanstack-db.md)
- **TanStack Form**: [tanstack-form.md](./tanstack-form.md)
- **Official Docs**: https://tanstack.com/store/latest
- **GitHub**: https://github.com/TanStack/store

---

**Last Updated**: January 5, 2026
**Version**: 1.0.0
