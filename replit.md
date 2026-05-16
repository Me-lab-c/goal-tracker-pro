# GoalTrack — Performance Portal

A production-ready goal setting and tracking portal for organizations, built as a hackathon submission.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied at `/api`)
- `pnpm --filter @workspace/goal-portal run dev` — run the frontend (port 21164, proxied at `/`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — session signing secret

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 + express-session (MemoryStore for dev)
- DB: PostgreSQL + Drizzle ORM
- Auth: bcryptjs (password hashing) + express-session (session management)
- Validation: Zod (`zod/v4`), `drizzle-zod`, generated Zod schemas from OpenAPI
- API codegen: Orval (from OpenAPI spec)
- Frontend: React + Vite + Tailwind CSS + shadcn/ui components
- Charts: Recharts
- Build: esbuild (CJS bundle for API server)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API contract)
- `lib/api-zod/` — Generated Zod validation schemas
- `lib/api-client-react/` — Generated React Query hooks
- `lib/db/src/schema/` — Drizzle ORM table definitions (source of truth for DB schema)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/api-server/src/middlewares/auth.ts` — requireAuth + requireRole middleware
- `artifacts/goal-portal/src/pages/` — Frontend page components
- `artifacts/goal-portal/src/lib/auth.tsx` — AuthProvider, useAuth, RequireAuth
- `artifacts/goal-portal/src/components/AppShell.tsx` — Sidebar navigation

## Architecture decisions

- **Contract-first API**: OpenAPI spec defined first; all hooks/schemas generated from it via Orval
- **Session-based auth**: bcryptjs hashes stored in DB; express-session MemoryStore for dev (upgrade to PgStore for production)
- **Role-based access**: `requireRole()` middleware fetches user role from DB on every protected request
- **Goal locking**: Goals are locked when approved; only managers/admins can unlock via the Admin panel
- **Audit logging**: All CRUD actions on goals/users are written to `audit_logs` table for traceability

## Product

**3 user roles** with distinct capabilities:
- **Employee**: Create/edit own goals, submit for approval, log quarterly check-ins, view own progress
- **Manager**: Review team goals, approve/reject with comments, view team analytics and progress
- **Admin**: Full user management, goal cycle management, goal unlock, system-wide analytics, audit log

**Key features**:
- Goal CRUD with weightage validation (must total 100%, max 8 goals, min 10% each)
- Approval workflow: Draft → Submitted → Approved/Rejected
- Quarterly check-ins (Q1–Q4) with achievement tracking and progress calculation
- Real-time analytics: pie charts, bar charts, line charts, team leaderboard
- Notifications for submissions/approvals/rejections
- Full audit log for all system actions
- Goal cycles (e.g. FY 2026) for organizing goals by period

## Demo credentials

All demo users share password: `admin123`
- `admin@company.com` — System Admin (all permissions, audit log, user management)
- `manager@company.com` — Sarah Manager (team goals, analytics, approve/reject)
- `employee@company.com` — Alice Employee (own goals, check-ins, notifications)
- `bob@company.com` — Bob Smith (employee, Engineering)
- `carol@company.com` — Carol Jones (employee, Marketing)

## User preferences

- Keep all passwords simple and identical for demo simplicity (all: `admin123`)
- Session-based auth preferred over JWT for web apps

## Gotchas

- Session store is MemoryStore (in-memory) — sessions lost on API server restart. For production, use connect-pg-simple with the `session` table already created in the DB.
- The `session` table must be manually created in PostgreSQL for connect-pg-simple to work (see DB setup notes).
- All users have the same password hash stored in the DB. Hash was generated with `bcryptjs.hashSync('admin123', 10)`.
- Run `pnpm --filter @workspace/db run push` after any schema changes before starting the server.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- OpenAPI spec is at `lib/api-spec/openapi.yaml` — edit this first before adding new endpoints
- After editing the spec, run `pnpm --filter @workspace/api-spec run codegen` to regenerate hooks/schemas
