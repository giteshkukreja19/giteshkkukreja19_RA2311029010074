# Notification System Design

## Stage 1 — Priority Inbox Algorithm

### Problem
Students lose track of important notifications due to high notification volume. We need a **Priority Inbox** that always surfaces the top `n` most important unread notifications first.

### Priority Logic
Priority is determined by two factors:

1. **Type Weight** (higher = more important):
   - `Placement` → weight **3** (highest)
   - `Result` → weight **2**
   - `Event` → weight **1** (lowest)

2. **Recency**: Within the same type weight, newer timestamps rank higher.

### Algorithm

```typescript
function getTopNPriorityNotifications(
  notifications: Notification[],
  n: number
): Notification[] {
  const WEIGHTS = { Placement: 3, Result: 2, Event: 1 };

  return [...notifications]
    .sort((a, b) => {
      const wA = WEIGHTS[a.Type] ?? 0;
      const wB = WEIGHTS[b.Type] ?? 0;

      // Primary: weight (descending)
      if (wB !== wA) return wB - wA;

      // Tie-break: recency (newer first)
      return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
    })
    .slice(0, n);
}
```

### Complexity
- **Time**: O(N log N) for the sort — N = total fetched notifications.
- **Space**: O(N) for the sorted copy (non-destructive).

### Efficient Maintenance as New Notifications Arrive
Since new notifications arrive continuously, we use a **Max-Heap (Priority Queue)** approach for production scale:

- Maintain a heap of size `n` (top-N).
- On each new notification, compare its composite priority score with the heap minimum.
- If higher → push and pop the min.
- **Result**: Each insert is O(log n) vs O(N log N) for full re-sort.

#### Composite Priority Score Formula:
```
score = (type_weight × 10^12) + unix_timestamp_ms
```
This encodes both type priority and recency in a single numeric key for O(1) comparison.

### Approach: Fetch-then-sort (Current Frontend Implementation)
For the frontend, we:
1. Fetch a large page (`limit=50`) from the API once.
2. Sort client-side using the comparator above.
3. Slice to top `n`.
4. Cache in state — refresh on user demand or on a polling interval.

This avoids N+1 API calls while keeping sort logic transparent and testable.

---

## Stage 2 — Frontend Architecture

### Tech Stack
- **React 18** with TypeScript
- **Material UI v5** (only styling library used)
- **React Router v6** for page navigation
- **Custom Hooks** for data + state management

### State Management Approach
We use **local component state via custom hooks** — no Redux or Zustand. Rationale:
- The data model is simple (flat list of notifications + read state).
- Shared state is minimal (auth token in `sessionStorage`, read IDs in `localStorage`).
- Custom hooks encapsulate fetch logic, keep pages thin, and are trivially testable.

If the app scales to real-time feeds (WebSocket), we'd graduate to Zustand for the notification store.

### Project Structure
```
src/
├── components/         # Pure UI components (NotificationCard, FilterBar, Pagination, etc.)
├── hooks/              # Data hooks (useNotifications, usePriorityNotifications, useAuth)
├── services/           # API layer (notificationService, authService)
├── middleware/         # Logging (logger.ts — wraps all console.log)
├── utils/              # Pure helpers (formatters, readStore)
├── styles/             # MUI theme
├── types/              # TypeScript interfaces
├── config/             # Constants and API config
└── pages/              # Route-level components (DashboardPage, PriorityPage)
```

### Performance Optimisations
1. **`React.memo`** on all list-item components (NotificationCard, NotificationList) to prevent re-renders when parent re-renders.
2. **`useCallback`** on all event handlers passed as props — stable references prevent child re-renders.
3. **Pagination** limits DOM nodes — at most `limit` cards are in the DOM at once.
4. **`useRef` fetch guard** in `useNotifications` prevents duplicate in-flight requests under React StrictMode double-invoke.
5. **`localStorage` read store** — read state survives page refreshes without re-fetching the API.
6. **Auth token caching** in `sessionStorage` — re-auth only happens when the token is missing or expired.

### Read/Unread Mechanism
- All notifications default to **unread** (highlighted, bold text, coloured left border).
- On click or mark-read button → `markAsRead(id)` writes to `localStorage`.
- State propagates via `setNotifications` update (immutable map), triggering re-render of only the affected card.
- Read state persists across page reloads.

### Logging Strategy
Every significant event is logged via `Log(stack, level, package, message)`:

| Event               | Level  | Package    |
|---------------------|--------|------------|
| App mounted         | info   | page       |
| API call started    | info   | api        |
| API call failed     | error  | api        |
| Auth success        | info   | auth       |
| Auth failure        | error  | auth       |
| User clicks filter  | info   | component  |
| Notification read   | info   | component  |
| Page navigation     | info   | component  |
| State change        | debug  | state      |
| Token cache hit     | debug  | auth       |

Logs are shipped to `POST /evaluation-service/logs` asynchronously and never block the UI.

### How Logging Helps Debugging
- **Timeline reconstruction**: By replaying logs in order, we can see exactly what API calls fired, in what sequence, and what the user was doing.
- **Error attribution**: `error`/`fatal` logs include the HTTP status and raw error message — no guessing which endpoint failed.
- **User behaviour tracing**: `component` package logs capture every interaction — "which notification did the user click?", "what filter was active?".
- **Auth flow visibility**: `auth` package logs show every token check, refresh, and registration attempt — invaluable for debugging 401 loops.
