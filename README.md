# HelpServizi Monorepo

# Frontend: Vite + React + TypeScript + Tailwind CSS 3.4.0
# Backend: Node + Express + TypeScript + Prisma (SQLite)

## Quick start

1. Backend (API)
   - From `backend/`:
     - `npm install`
     - `npx prisma migrate dev` (already run once)
     - `npm run dev` to start http://localhost:4000

2. Frontend (Web)
   - From `frontend/`:
     - `npm install`
     - `npm run dev` to start http://localhost:5173
     - During dev, `/api/*` is proxied to the backend

## Admin Panel (Leads)

Landing page submissions are stored as `Lead` records (see `backend/prisma/schema.prisma`).

Endpoints:
 - POST `/api/leads` (public) body: `{ name, lastName, email, phone?, cafFlag, unemployed, consent }`
 - GET `/api/admin/leads` (basic auth) returns JSON list
 - GET `/api/admin/leads/export` (basic auth) returns CSV download

Authentication: HTTP Basic Auth using env variables `ADMIN_USER` / `ADMIN_PASS`.

Default (if env not set): `admin / changeme` (change these in production!)

Example curl:
```
curl -u admin:changeme http://localhost:4000/api/admin/leads
```

Set credentials in `backend/.env`:
```
ADMIN_USER=admin
ADMIN_PASS=supersecret 
```

After changing the Prisma schema run:
```
cd backend
npx prisma migrate dev
```

## Notes
 - Tailwind 3.4.0 is pinned and configured in `frontend/`.
 - Prisma generates client in `backend/generated/prisma`.
 - Example resource: `Task` with CRUD endpoints under `/api/tasks`.
  - New resource: `Lead` with public create and admin list/export.
  - Frontend admin UI: open `http://localhost:5173/#admin` and login with the same Basic Auth credentials (only stored locally, no session persisted).
  - Troubleshooting login:
    * 403 invalid credentials => backend restarted after editing .env? Use the same values you set.
    * If you did NOT create `.env`, default is admin / changeme.
    * Change password: edit `.env`, then restart `npm run dev` in backend.
    * Ensure no leading/trailing spaces when copying credentials.