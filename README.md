## Demo

https://studyquest-rpg-three.vercel.app/


# StudyQuest 🎮

A gamification-based study management web app. Core concept: **"Study time
becomes character growth."** Study with a stopwatch, earn XP and coins, grow
your character, and analyze your learning patterns.

This is a v1.0 local MVP: frontend-only, no login, no backend, no database —
all state lives in the browser's LocalStorage.

---

## Tech Stack

- **Framework**: Next.js (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand (single store, `src/store/useAppStore.ts`)
- **Charts**: Recharts
- **Persistence**: LocalStorage (`src/lib/storage.ts`) — no backend, no database

## Features (v1.0)

- **Study timer** — start / pause / resume / stop, with a live reward preview
- **Subject management** — create, rename, and remove subjects; subjects
  with study history are archived rather than deleted, preserving stats
- **Character growth** — XP and leveling, both for the overall character and
  per-subject, with cascading multi-level-ups on long sessions
- **Coin & diamond economy** — deterministic, rule-based rewards (see
  `docs/01_analysis/requirements.md` §4); diamonds are a scarce, non-purchasable
  currency earned only via level-up milestones
- **Shop** — a static item catalog; purchase with coins or diamonds, equip a
  cosmetic on your character
- **Dashboard** — today's study time, a 7-day trend chart, per-subject
  breakdown, and current study streak

## Routes

| Route | Purpose |
|---|---|
| `/` | Home — welcome + navigation |
| `/subjects` | Manage subjects |
| `/timer` | Run a study session |
| `/character` | View character level, XP, currency, equipped item |
| `/shop` | Browse and buy items |
| `/dashboard` | Study stats and charts |

## Local Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No environment
variables or external services are required — everything runs client-side
against LocalStorage.

Other scripts:

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # ESLint
npx tsc --noEmit  # typecheck
```

## Project Structure

```
src/
  app/          Next.js routes (one folder per route above)
  components/   Shared, app-wide UI (NavBar, AppHydrator)
  features/     Domain features: subject, timer, character, shop, dashboard
  hooks/        Custom React hooks
  lib/          Pure business logic, utilities, LocalStorage wrapper
  store/        The single Zustand store
  types/        Shared TypeScript domain types
```

## Documentation

Design and process docs live under `docs/`:

- `docs/00_project/` — overview, roadmap, changelog
- `docs/01_analysis/` — requirements, user flow
- `docs/02_design/` — architecture, data model, folder structure, coding standard
- `docs/03_development/` — development rules, git rules, test plan
- `docs/04_release/` — deployment, retrospective

## Roadmap

v2+ ideas (auth, backend, ranking, and more) are tracked in
`docs/00_project/roadmap.md`.
