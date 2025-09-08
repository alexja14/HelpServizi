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

## Notes
 - Tailwind 3.4.0 is pinned and configured in `frontend/`.
 - Prisma generates client in `backend/generated/prisma`.
 - Example resource: `Task` with CRUD endpoints under `/api/tasks`.