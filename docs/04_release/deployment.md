# Deployment

StudyQuest v1.0 is a static, frontend-only Next.js app — no backend, no
database, no environment variables. Every route in `src/app/` prerenders as
static content (confirmed via `npm run build`), and all app state lives in
the browser's LocalStorage (`src/lib/storage.ts`). Deployment is just
"host the built output somewhere."

## Recommended: Vercel

Vercel is the natural fit for a Next.js app and requires no configuration.

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. In the Vercel dashboard, "Add New Project" → import the repo.
3. Framework preset: Vercel auto-detects Next.js. Leave the default build
   command (`next build`) and output settings as-is.
4. **Environment variables: none required.** There is nothing to configure.
5. Deploy. Every push to the connected branch redeploys automatically.

## Alternative: Self-hosted / any Node host

```bash
npm install
npm run build
npm run start
```

`next start` serves the production build on port 3000 by default. Any host
that can run a long-lived Node process (Render, Fly.io, a VPS, etc.) works
the same way — there's no StudyQuest-specific setup beyond these three
commands.

## Important Caveat: Data Is Per-Browser, Not Per-Deployment

Because v1.0 has no accounts or backend, **a user's study data lives only
in the browser/device where they used the app** — LocalStorage under the
`studyquest:*` keys (`user`, `subjects`, `sessions`, `inventory`; see
`02_design/coding_standard.md` §4). Deploying a new build does not migrate,
back up, or share this data:

- Clearing site data / browser storage in that browser erases progress.
- Switching browsers or devices starts a fresh profile.
- There is no way to export/import a save file in v1.0.

This is expected for the v1.0 scope (`01_analysis/requirements.md` §2.2
explicitly excludes accounts/database) — call it out to users before a
public release so it isn't a surprise. Solving it is the core reason for
the v2 backend work tracked in `00_project/roadmap.md`.

## Pre-Deploy Checklist

- [ ] `npx tsc --noEmit` passes
- [ ] `npx eslint .` passes
- [ ] `npm run build` succeeds (all routes prerender as static)
- [ ] Manual pass through `03_development/test_plan.md`'s golden paths
- [ ] `package.json` version matches the release (currently `1.0.0`)
