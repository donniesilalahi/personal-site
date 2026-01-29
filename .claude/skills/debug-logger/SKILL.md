---
name: debug-logger
description: Structured debug logging utility for troubleshooting auth-gated pages. Captures context, session state, and diagnostic information for easy sharing.
---

# Debug Logger Skill

## What I Do

I provide a portable debug logging utility that captures structured diagnostic information for auth-gated pages. The logger:

- Captures auth state, session data, and route context
- Uses structured JSON format with timestamps
- Supports multiple log levels (debug, info, warn, error)
- Includes contextual metadata (user, session, route, timestamp)
- Outputs logs in a format easy to copy/share in conversations

## When to Use

- Testing auth-gated pages you cannot directly access
- Debugging session handling and token issues
- Capturing auth flow diagnostics to share
- Investigating redirect behavior in protected routes
- Troubleshooting RLS policy issues
- Verifying user context in protected endpoints

## Debug Logger Implementation

Add this logger utility to your project:

```typescript
// src/lib/debug-logger.ts

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  timestamp: string
  level: LogLevel
  namespace: string
  message: string
  userId?: string
  sessionId?: string
  route?: string
  authState?: string
  metadata?: Record<string, unknown>
}

const DEBUG_ENABLED =
  process.env.DEBUG === 'true' || process.env.NODE_ENV === 'development'

function formatTimestamp(): string {
  return new Date().toISOString()
}

function createLogEntry(
  level: LogLevel,
  namespace: string,
  message: string,
  metadata?: Record<string, unknown>,
): LogContext {
  return {
    timestamp: formatTimestamp(),
    level,
    namespace,
    message,
    metadata,
  }
}

export const debugLogger = {
  debug: (
    namespace: string,
    message: string,
    metadata?: Record<string, unknown>,
  ) => {
    if (!DEBUG_ENABLED) return
    const entry = createLogEntry('debug', namespace, message, metadata)
    console.debug(JSON.stringify(entry, null, 2))
    return entry
  },

  info: (
    namespace: string,
    message: string,
    metadata?: Record<string, unknown>,
  ) => {
    const entry = createLogEntry('info', namespace, message, metadata)
    console.info(JSON.stringify(entry, null, 2))
    return entry
  },

  warn: (
    namespace: string,
    message: string,
    metadata?: Record<string, unknown>,
  ) => {
    const entry = createLogEntry('warn', namespace, message, metadata)
    console.warn(JSON.stringify(entry, null, 2))
    return entry
  },

  error: (
    namespace: string,
    message: string,
    error?: Error,
    metadata?: Record<string, unknown>,
  ) => {
    const errorMeta = error
      ? { errorMessage: error.message, stack: error.stack }
      : {}
    const entry = createLogEntry('error', namespace, message, {
      ...metadata,
      ...errorMeta,
    })
    console.error(JSON.stringify(entry, null, 2))
    return entry
  },

  auth: (
    message: string,
    authState: {
      userId?: string
      sessionId?: string
      isAuthenticated?: boolean
      tokenExpiry?: string
    },
  ) => {
    const entry = createLogEntry('debug', 'auth', message, {
      authState,
      isAuthenticated: authState.isAuthenticated ?? false,
    })
    console.debug(JSON.stringify(entry, null, 2))
    return entry
  },

  route: (
    message: string,
    routeContext: {
      path?: string
      params?: Record<string, string>
      query?: Record<string, string>
    },
  ) => {
    const entry = createLogEntry('debug', 'route', message, { routeContext })
    console.debug(JSON.stringify(entry, null, 2))
    return entry
  },

  session: (
    message: string,
    sessionData: {
      sessionId?: string
      userId?: string
      createdAt?: string
      expiresAt?: string
    },
  ) => {
    const entry = createLogEntry('debug', 'session', message, { sessionData })
    console.debug(JSON.stringify(entry, null, 2))
    return entry
  },

  database: (
    message: string,
    dbContext: {
      table?: string
      operation?: 'select' | 'insert' | 'update' | 'delete'
      recordId?: string
      success?: boolean
      duration?: number
    },
  ) => {
    const entry = createLogEntry('debug', 'database', message, { dbContext })
    console.debug(JSON.stringify(entry, null, 2))
    return entry
  },

  captureAll: (): string => {
    return `[DEBUG-LOG-CAPTURE-${Date.now()}]\nCheck browser console for full log output.\nNamespace: auth, route, session, database\nLog levels: debug, info, warn, error`
  },
}

export default debugLogger
```

## Usage in Auth-Gated Pages

### Basic Debug Logging

```typescript
import { debugLogger } from '@/lib/debug-logger'

// Debug auth state
debugLogger.auth('Checking authentication', {
  userId: user?.id,
  sessionId: session?.id,
  isAuthenticated: !!user,
})

// Debug route access
debugLogger.route('Accessing protected route', {
  path: window.location.pathname,
  params: { id: '123' },
})

// Debug session data
debugLogger.session('Session validation', {
  sessionId: session?.id,
  userId: user?.id,
  expiresAt: session?.expires_at,
})

// Debug database operations
debugLogger.database('Fetching protected data', {
  table: 'user_profiles',
  operation: 'select',
  recordId: user?.id,
})
```

### Conditional Debug with Expensive Operations

```typescript
// Only compute expensive debug info when debug is enabled
if (DEBUG_ENABLED) {
  const expensiveData = computeDetailedAuthState()
  debugLogger.debug('auth', 'Detailed auth state', { ...expensiveData })
}
```

### Error Debugging with Stack Traces

```typescript
try {
  await protectedOperation()
} catch (error) {
  debugLogger.error('auth', 'Protected operation failed', error as Error, {
    userId: user?.id,
    route: currentRoute,
  })
}
```

## Structured Log Output Format

```json
{
  "timestamp": "2025-12-31T14:30:00.000Z",
  "level": "debug",
  "namespace": "auth",
  "message": "Checking authentication",
  "userId": "user-123",
  "sessionId": "sess-456",
  "authState": {
    "isAuthenticated": true
  },
  "metadata": {
    "tokenExpiry": "2025-12-31T18:00:00Z"
  }
}
```

## Log Levels

| Level   | Console Method  | Use Case                             |
| ------- | --------------- | ------------------------------------ |
| `debug` | `console.debug` | Detailed debugging info, only in dev |
| `info`  | `console.info`  | General information, always visible  |
| `warn`  | `console.warn`  | Warnings, non-critical issues        |
| `error` | `console.error` | Errors with stack traces             |

## Capturing Logs for Sharing

### Browser Console Capture

```typescript
// Add this to capture all logs to a variable
let capturedLogs: LogContext[] = []

const originalDebug = console.debug
const originalInfo = console.info
const originalWarn = console.warn
const originalError = console.error

console.debug = (...args) => {
  capturedLogs.push(createLogEntry('debug', 'console', args.join(' ')))
  originalDebug.apply(console, args)
}

console.info = (...args) => {
  capturedLogs.push(createLogEntry('info', 'console', args.join(' ')))
  originalInfo.apply(console, args)
}

// ... repeat for warn and error

export const getCapturedLogs = () => capturedLogs
export const clearCapturedLogs = () => {
  capturedLogs = []
}
export const exportLogs = () => JSON.stringify(capturedLogs, null, 2)
```

### Quick Copy Function

```typescript
function copyDebugLogs() {
  const logs = exportLogs()
  navigator.clipboard.writeText(logs)
  console.log('Logs copied to clipboard!')
}
```

## Best Practices

1. **Namespace your logs**: Use consistent prefixes (`auth:login`, `auth:session`, `route:protect`)
2. **Include context**: Always add userId, sessionId, route when available
3. **Use appropriate levels**: Debug for dev-only, info for general, warn/error for issues
4. **Lazy evaluate expensive data**: Wrap expensive operations in `if (DEBUG_ENABLED)`
5. **Structured metadata**: Use objects for additional context, not string concatenation
6. **Capture and share**: Use the capture functions to get logs to share in conversation

## Debugging Auth-Gated Pages Workflow

1. Add debug logging to the auth-gated page component
2. Include `auth`, `route`, `session` namespace logs
3. Reproduce the issue
4. Copy logs from browser console
5. Share the structured JSON in conversation

## Example Output for Sharing

```
=== DEBUG LOGS ===
[2025-12-31T14:30:00.000Z] [auth:debug] Checking authentication
{"timestamp":"2025-12-31T14:30:00.000Z","level":"debug","namespace":"auth","message":"Checking authentication","userId":"user-123","authState":{"isAuthenticated":true}}

[2025-12-31T14:30:00.001Z] [route:debug] Accessing protected route
{"timestamp":"2025-12-31T14:30:00.001Z","level":"debug","namespace":"route","message":"Accessing protected route","routeContext":{"path":"/dashboard"}}

[2025-12-31T14:30:00.002Z] [session:debug] Session validation
{"timestamp":"2025-12-31T14:30:00.002Z","level":"debug","namespace":"session","message":"Session validation","sessionData":{"sessionId":"sess-456","expiresAt":"2025-12-31T18:00:00Z"}}
```

## Integration Points

| Area             | Logger Method              | Key Data                           |
| ---------------- | -------------------------- | ---------------------------------- |
| Auth Context     | `debugLogger.auth()`       | userId, sessionId, isAuthenticated |
| Route Guard      | `debugLogger.route()`      | path, params, query                |
| Session Provider | `debugLogger.session()`    | sessionId, createdAt, expiresAt    |
| Database Queries | `debugLogger.database()`   | table, operation, recordId         |
| API Calls        | `debugLogger.debug('api')` | endpoint, method, response         |

## Related Skills

- [analyzing-problems](./analyzing-problems/SKILL.md) - Document root cause analysis
- [schema-validation-workflow](./schema-validation-workflow/SKILL.md) - Database debugging
