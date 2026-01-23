# TanStack Table Reference

**Library**: TanStack Table (`@tanstack/react-table`)
**Version**: v8.x
**Purpose**: Headless UI for building powerful tables and datagrids

## Overview

TanStack Table is a **headless** table library:

- **No UI components** - You control markup entirely
- **Headless logic** - Sorting, filtering, pagination, etc.
- **Framework agnostic** - Works with React, Vue, Solid, etc.
- **Type-safe** - Full TypeScript inference

## Core Concepts

### Column Definitions

```tsx
import { createColumnHelper } from '@tanstack/react-table'

type Campaign = {
  id: string
  title: string
  status: 'active' | 'closed' | 'draft'
  raised: number
  target: number
  createdAt: Date
}

const columnHelper = createColumnHelper<Campaign>()

const columns = [
  columnHelper.accessor('title', {
    header: 'Campaign',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => (
      <span className={`status-${info.getValue()}`}>{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor('raised', {
    header: 'Raised',
    cell: (info) => `$${info.getValue().toLocaleString()}`,
  }),
]
```

### Table Instance

```tsx
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'

function CampaignTable({ data, columns }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

## Row Models

Row models transform data for table features:

```tsx
import {
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
} from '@tanstack/react-table'

const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(), // Sorting
  getFilteredRowModel: getFilteredRowModel(), // Filtering
  getPaginationRowModel: getPaginationRowModel(), // Pagination
  getGroupedRowModel: getGroupedRowModel(), // Grouping
  getExpandedRowModel: getExpandedRowModel(), // Row expansion
})
```

## Sorting

### Basic Sorting

```tsx
const [sorting, setSorting] = useState([])

const table = useReactTable({
  data,
  columns,
  state: { sorting },
  onSortingChange: setSorting,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
})

// Sort by column on click
<th onClick={header.column.getToggleSortingHandler()}>
  {flexRender(header.column.columnDef.header, header.getContext())}
  {{
    asc: ' 🔼',
    desc: ' 🔽',
  }[header.column.getIsSorted() as string] ?? null}
</th>
```

### Multi-Sort

```tsx
// Click column while holding Shift for multi-sort
const table = useReactTable({
  data,
  columns,
  state: { sorting },
  onSortingChange: setSorting,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  maxMultiSortColCount: 3, // Limit to 3 columns
})
```

## Filtering

### Column Filtering

```tsx
const [columnFilters, setColumnFilters] = useState([])

const table = useReactTable({
  data,
  columns,
  state: { columnFilters },
  onColumnFiltersChange: setColumnFilters,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
})

// Filter UI
<input
  value={(columnFilterValue ?? '') as string}
  onChange={e => column.setFilterValue(e.target.value)}
  placeholder="Search..."
/>
```

### Built-in Filter Functions

| Filter Function  | Description                      |
| ---------------- | -------------------------------- |
| `includesString` | Case-insensitive substring match |
| `equalsString`   | Exact string match               |
| `arrIncludes`    | Array contains value             |
| `inNumberRange`  | Number within range              |
| `equals`         | Exact equality                   |

### Global Filtering

```tsx
const [globalFilter, setGlobalFilter] = useState('')

const table = useReactTable({
  data,
  columns,
  state: { globalFilter },
  onGlobalFilterChange: setGlobalFilter,
  globalFilterFn: 'includesString',
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
})
```

## Pagination

### Client-Side Pagination

```tsx
const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

const table = useReactTable({
  data,
  columns,
  state: { pagination },
  onPaginationChange: setPagination,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
})

return (
  <>
    <table>...</table>
    <div>
      <button
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        Previous
      </button>
      <span>
        Page {table.getState().pagination.pageIndex + 1} of{' '}
        {table.getPageCount()}
      </span>
      <button
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        Next
      </button>
    </div>
  </>
)
```

### Server-Side Pagination

```tsx
const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

const { data } = useQuery({
  queryKey: ['campaigns', pagination],
  queryFn: () => fetchCampaigns(pagination),
})

const table = useReactTable({
  data: data?.campaigns ?? [],
  columns,
  state: { pagination },
  onPaginationChange: setPagination,
  getCoreRowModel: getCoreRowModel(),
  manualPagination: true, // Tell table pagination is server-side
  pageCount: data?.totalPages ?? -1,
})

// Only render pagination controls
<PaginationControls table={table} />
```

## Column Ordering

```tsx
const [columnOrder, setColumnOrder] = useState(['title', 'status', 'raised', 'target'])

const table = useReactTable({
  data,
  columns,
  state: { columnOrder },
  onColumnOrderChange: setColumnOrder,
  getCoreRowModel: getCoreRowModel(),
})

// Reorder columns in UI
<table {...{ style: { width: table.getTotalWidth() } }}>
  <thead>
    {table.getLeftHeaderGroups().map(headerGroup => (
      <tr key={headerGroup.id} {...{ style: { position: 'absolute', left: 0 } }}>
        {headerGroup.headers.map(header => (
          <th key={header.id} {...header.column.getProps()}>
            {flexRender(header.column.columnDef.header, header.getContext())}
          </th>
        ))}
      </tr>
    ))}
  </thead>
</table>
```

## Row Selection

```tsx
const [rowSelection, setRowSelection] = useState({})

const table = useReactTable({
  data,
  columns: [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    },
    ...columns,
  ],
  state: { rowSelection },
  onRowSelectionChange: setRowSelection,
  getCoreRowModel: getCoreRowModel(),
})

// Selected rows
const selectedCampaigns = table
  .getSelectedRowModel()
  .rows.map((row) => row.original)
```

## Integration with TanStack Query

### Server-Side Table Data

```tsx
function CampaignsTable() {
  const [columnFilters, setColumnFilters] = useState([])
  const [sorting, setSorting] = useState([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  // TanStack Query fetches based on table state
  const { data, isLoading } = useQuery({
    queryKey: ['campaigns', columnFilters, sorting, pagination],
    queryFn: () => fetchCampaigns({ columnFilters, sorting, pagination }),
  })

  const table = useReactTable({
    data: data?.campaigns ?? [],
    columns,
    state: {
      columnFilters,
      sorting,
      pagination,
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
    pageCount: data?.totalPages ?? -1,
  })

  return <TableUI table={table} isLoading={isLoading} />
}
```

## Column Definition Types

### Accessor Column

```tsx
columnHelper.accessor('title', {
  header: 'Title',
  cell: (info) => info.getValue(),
  meta: {
    /* Custom metadata */
  },
})
```

### Function Column

```tsx
columnHelper.accessor((row) => row.firstName + ' ' + row.lastName, {
  header: 'Full Name',
  id: 'fullName',
})
```

### Group Column

```tsx
columnHelper.group({
  header: 'Campaign Details',
  columns: [
    columnHelper.accessor('title', { header: 'Title' }),
    columnHelper.accessor('status', { header: 'Status' }),
  ],
})
```

## Best Practices

### 1. Client vs Server Operations

| Data Size     | Strategy               |
| ------------- | ---------------------- |
| < 10,000 rows | Client-side operations |
| > 10,000 rows | Server-side operations |

> "TanStack Table can handle thousands of client-side rows with good performance. Don't rule out client-side operations without thought first."

### 2. Memoization

```tsx
// Memoize columns to prevent unnecessary re-renders
const columns = useMemo(
  () => [
    columnHelper.accessor('title', { header: 'Title' }),
    // ... other columns
  ],
  [],
)
```

### 3. Type-Safe Columns

```tsx
// Use createColumnHelper for type inference
const columnHelper = createColumnHelper<Campaign>()

// TypeScript will infer from generic
columnHelper.accessor('title', {
  header: 'Title',
  // cell: info is typed as { getValue: () => string }
})
```

## API Reference

### useReactTable Options

| Option             | Type                | Description            |
| ------------------ | ------------------- | ---------------------- |
| `data`             | `T[]`               | Table data             |
| `columns`          | `ColumnDef[]`       | Column definitions     |
| `getCoreRowModel`  | `() => RowModel<T>` | Core row model         |
| `state`            | `TableState`        | Controlled state       |
| `onStateChange`    | `(state) => void`   | State change handler   |
| `manualPagination` | `boolean`           | Server-side pagination |
| `manualFiltering`  | `boolean`           | Server-side filtering  |
| `manualSorting`    | `boolean`           | Server-side sorting    |

### Table Instance Methods

| Method              | Returns         | Description            |
| ------------------- | --------------- | ---------------------- |
| `getRowModel()`     | `RowModel<T>`   | Processed rows         |
| `getHeaderGroups()` | `HeaderGroup[]` | Table headers          |
| `getState()`        | `TableState`    | Current state          |
| `getAllColumns()`   | `Column[]`      | All columns            |
| `setGlobalFilter()` | `void`          | Set global filter      |
| `resetData()`       | `void`          | Reset to original data |

## Related Documents

- **Architecture Overview**: [architecture.md](./architecture.md)
- **TanStack Query**: [tanstack-query.md](./tanstack-query.md)
- **TanStack DB**: [tanstack-db.md](./tanstack-db.md)
- **Official Docs**: https://tanstack.com/table/latest
- **GitHub**: https://github.com/TanStack/table

---

**Last Updated**: January 5, 2026
**Version**: 1.0.0
