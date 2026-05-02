# Campus Notification System — Frontend

A production-grade React + TypeScript + Material UI application for displaying campus notifications.

## Quick Start

```bash
cd notification_app_fe
npm install
npm start
```

App runs at **http://localhost:3000**

## Features

- **Dashboard** — Paginated, filterable notification list with read/unread state
- **Priority Inbox** — Top-N notifications sorted by type weight + recency
- **Filter** — All / Placement / Result / Event
- **Pagination** — Next/Prev with configurable page size (5/10/20/50)
- **Read/Unread** — Click to mark read; persists across page reloads via localStorage
- **Logging** — All events shipped to POST /logs via structured middleware

## Project Structure

```
logging_middleware/         ← Standalone reusable log package
notification_app_fe/
  src/
    components/             ← NotificationCard, NotificationList, FilterBar, Pagination, PrioritySection
    hooks/                  ← useNotifications, usePriorityNotifications, useAuth
    services/               ← notificationService, authService
    middleware/             ← logger.ts (Log function)
    utils/                  ← readStore.ts, formatters.ts
    styles/                 ← MUI theme
    types/                  ← TypeScript interfaces
    config/                 ← Constants
    pages/                  ← DashboardPage, PriorityPage
Notification_System_Design.md  ← Architecture + Stage 1 design doc
```

## Auth Credentials Used

- Email: gk7145@srmist.edu.in
- Roll No: RA2211028010151
- GitHub: giteshkkukreja19
- Access Code: QkbpxH

## Rules Followed

- ✅ No console.log anywhere
- ✅ Material UI only (no Tailwind, no ShadCN)
- ✅ TypeScript throughout
- ✅ All API calls logged via Log(stack, level, package, message)
- ✅ Read/unread state persisted in localStorage
- ✅ Responsive design (mobile + desktop)
- ✅ Production-grade error handling and loading states
