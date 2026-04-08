# Digital Vision Dashboard

[中文说明](./README.md)

Digital Vision Dashboard is a React + TypeScript application for exploring mobile SoCs, comparing chip performance, and planning PC builds. It combines curated static datasets with Supabase authentication so users can save and revisit their hardware selections in a polished, dashboard-style interface.

## Highlights

- SoC analytics dashboard with radar, bar, and scatter charts powered by ECharts
- Filterable SoC library with detail pages and side-by-side comparison
- PC build assistant covering CPU, GPU, motherboard, RAM, SSD, PSU, and case
- Supabase-based sign-in/sign-up flow for personal build storage
- Fallback to browser `localStorage` when the `saved_builds` table has not been created yet
- Persistent light/dark theme with animated theme transition

## Tech Stack

- React 19
- TypeScript
- Vite 7
- React Router 7
- Tailwind CSS 4 with custom CSS variables and handcrafted layout styles
- ECharts 6 via `echarts-for-react`
- Supabase Auth + Postgres
- Vitest, Testing Library, and Playwright

## Routes

- `/`: overview dashboard for SoC and desktop hardware insights
- `/soc`: SoC list with filters
- `/soc/:id`: SoC detail page
- `/soc/compare`: multi-chip comparison page
- `/builder`: PC build planner
- `/login`: sign-in and registration page
- `/my-builds`: saved build management

## Data Model

- Static catalog data lives in [`src/data`](./src/data) as JSON files
- User-specific saved builds are stored in the Supabase `saved_builds` table
- Hardware item records include product links such as JD URLs, but catalog values are still static and curated inside the repo

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- A Supabase project if you want authentication and cloud-backed saved builds

### Install dependencies

```bash
npm install
```

### Configure environment variables

1. Copy `.env.example` to `.env.local`.
2. Set the following variables:

```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

If the Supabase variables are missing, the app can still render the static dashboards and builder UI, but login and cloud persistence will not be available.

### Create the `saved_builds` table

Apply [`supabase/migrations/001_saved_builds.sql`](./supabase/migrations/001_saved_builds.sql) to your Supabase project. The migration:

- creates the `saved_builds` table
- enables row-level security
- adds policies scoped to the authenticated user
- keeps `updated_at` in sync with a trigger

If Supabase auth is configured but the `saved_builds` table is still missing, build CRUD falls back to browser `localStorage` instead of failing outright.

### Start the dev server

```bash
npm run dev
```

Then open `http://localhost:5173`.

## Available Scripts

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm run test
npm run test:watch
npm run test:e2e
npm run preview
```

## Project Structure

```text
.
|-- src/
|   |-- components/       # Reusable UI and chart components
|   |-- data/             # Static SoC and hardware datasets
|   |-- hooks/            # Auth and build state hooks
|   |-- layouts/          # App shell and navigation layout
|   |-- lib/              # Data loaders, theme helpers, Supabase client, persistence helpers
|   |-- pages/            # Route-level pages
|   |-- styles/           # Style-level tests and contracts
|   `-- types/            # Shared TypeScript types
|-- supabase/
|   `-- migrations/       # SQL migrations for Supabase
|-- docs/
|   |-- en/
|   `-- zh-cn/
`-- server/               # Reserved backend workspace
```

## Additional Docs

- English developer guide: [`docs/en/developer-guide.md`](./docs/en/developer-guide.md)
- Chinese developer guide: [`docs/zh-cn/developer-guide.md`](./docs/zh-cn/developer-guide.md)

## License

This repository does not currently declare a license.
