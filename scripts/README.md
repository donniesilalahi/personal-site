# Development Scripts

Helper scripts for common development tasks.

## kill-dev-ports.sh

Kills processes running on development ports (3000, 42069).

**Usage:**

```bash
# Direct execution
./scripts/kill-dev-ports.sh

# Or use npm script
npm run dev:clean
```

**When to use:**

- When `npm run dev` fails with "EADDRINUSE" error
- After forcefully stopping dev server (Ctrl+C)
- When switching between branches with dev server running

**Ports cleaned:**

- Port 3000: Main Vite dev server
- Port 42069: TanStack DevTools event bus
