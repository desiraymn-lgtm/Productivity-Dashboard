# The Ledger — Personal Productivity Dashboard

A single-page daily dashboard: tasks with priority/due dates, a habit tracker with
streaks, and quick notes. Built with Next.js 14 (App Router, Server Actions) and
Neon Postgres. No client-side state library and no API routes — reads happen in a
Server Component, writes happen through Server Actions, and the whole page revalidates
after every action.

## Stack

- **Next.js 14** — App Router, Server Components, Server Actions
- **Neon** — serverless Postgres, accessed via `@neondatabase/serverless`
- **Vercel** — hosting
- Plain CSS (no Tailwind/UI kit) — see `app/globals.css`

## 1. Create the Neon database

1. Sign up / log in at [console.neon.tech](https://console.neon.tech) and create a project.
2. Open **Connection Details** and copy the **pooled** connection string
   (it looks like `postgres://user:password@ep-xxxx-pooler.region.aws.neon.tech/dbname?sslmode=require`).
   Use the pooled one — it's what serverless functions on Vercel need.
3. Copy `.env.example` to `.env.local` and paste the string in as `DATABASE_URL`.

## 2. Install dependencies and create the tables

```bash
npm install
npm run db:init
```

`db:init` runs `db/schema.sql` against `DATABASE_URL` and creates the `tasks`,
`habits`, `habit_logs`, and `notes` tables (safe to re-run — everything is
`create table if not exists`).

## 3. Run it locally

```bash
npm run dev
```

Visit `http://localhost:3000`.

## 4. Deploy to Vercel

```bash
npm install -g vercel   # if you don't have it
vercel
```

Or connect the GitHub repo in the Vercel dashboard. Either way:

1. In the Vercel project's **Settings → Environment Variables**, add `DATABASE_URL`
   with the same pooled Neon connection string, for the Production (and Preview)
   environment.
2. Deploy. Vercel will run `npm run build` automatically.
3. If you haven't already run `npm run db:init` against this database, do it once
   (from your machine, pointed at the same `DATABASE_URL`) before using the app —
   the dashboard doesn't create tables itself.

Neon and Vercel also have an official integration (Vercel dashboard → Storage →
Neon) that provisions the database and sets `DATABASE_URL` for you automatically,
if you'd rather skip step 1 above.

## Project structure

```
app/
  page.tsx           # Server Component — fetches tasks/habits/notes, computes streaks
  layout.tsx          # Fonts + <html>/<body> shell
  actions.ts           # 'use server' — every mutation (add/toggle/delete)
  globals.css         # Design system
components/
  Sidebar.tsx          # Date header + stat summary
  TaskList.tsx / AddTaskForm.tsx
  HabitTracker.tsx / AddHabitForm.tsx
  QuickNotes.tsx / AddNoteForm.tsx
lib/
  db.ts               # Neon client (`sql` tagged template)
  streaks.ts           # Habit streak calculation
  types.ts             # Shared TypeScript types
db/schema.sql          # Table definitions
scripts/init-db.mjs    # Applies schema.sql to DATABASE_URL
```

## Notes on how it's wired together

- **No API routes.** Forms call Server Actions directly (`<form action={someAction}>`),
  including bound actions like `toggleTask.bind(null, task.id, task.status)` for
  per-row buttons. This works without JavaScript and Next progressively enhances it.
- **`revalidatePath('/')`** after every mutation re-runs the Server Component's data
  fetch, so the UI is always reading straight from Postgres — no client cache to
  invalidate.
- **Streaks** are computed in `lib/streaks.ts` from the raw `habit_logs` rows rather
  than stored — simpler and always correct.

## Extending it

- Add a `user_id` column (or auth via Vercel/Clerk/NextAuth) if this needs to serve
  more than one person.
- Swap the raw `@neondatabase/serverless` queries for Drizzle or Prisma if the schema
  grows past these four tables.
- The `.card` layout in `app/globals.css` is a CSS grid (`auto-fit, minmax(300px, 1fr)`),
  so dropping a fourth card component into `app/page.tsx` will slot in automatically.
