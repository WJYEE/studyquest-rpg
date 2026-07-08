# Development Rule

Defines how work is planned, sequenced, and verified for StudyQuest v1. Complements
`02_design/coding_standard.md` (code-level rules) and `03_development/git_rule.md`
(commit rules). Source docs: `CLAUDE.md`, `01_analysis/requirements.md`,
`01_analysis/user_flow.md`, `02_design/architecture.md`,
`02_design/folder_structure.md`.

---

## 1. One Feature Per Implementation Step

Never implement multiple features in the same step. This mirrors `CLAUDE.md`'s
rule to "implement small units" and keeps every change reviewable and testable
in isolation.

- **Unit of work** = one functional requirement group from `requirements.md`
  §3 (e.g. "Study Timer", not "Timer + Shop together"). If a group is large
  (e.g. Timer's FR-T1–T5), it may be split further into smaller steps (e.g.
  "start/stop" first, "pause/resume" second) — but never combined across
  feature groups.
- **Before starting a step**: read the relevant `requirements.md` section, the
  matching `user_flow.md` flow, and the `data_model.md` entities involved.
  Explain the implementation plan before writing code (per `CLAUDE.md`).
- **No scope creep**: if implementing one feature surfaces a bug or gap in
  another, note it and move on — don't fix it inline in the same step.
- Each step should be small enough to map to one Conventional Commit
  scope (see `git_rule.md`), e.g. `feat(timer): add start/stop controls`.

---

## 2. Recommended Build Order (v1)

Features have dependencies on each other's data. Building in this order means
every feature can be tested against real state produced by the previous step,
not mocks:

1. `types/` — `User`, `Subject`, `StudySession`, `Item` (from `data_model.md`)
2. `lib/` pure functions — XP calculation, level calculation, LocalStorage
   wrapper (§4 in `coding_standard.md`)
3. Zustand store — state shape + actions, persisted via the `lib/` storage
   wrapper
4. `features/subject` — subjects must exist before a session can reference one
5. `features/timer` — depends on subject selection + store actions
6. `features/character` — XP/level display, depends on store updates the
   timer produces
7. `features/shop` — depends on coin/diamond balances existing
8. `app/dashboard` — depends on accumulated session data across all of the
   above

Do not start a later step until the earlier one it depends on satisfies the
testing checklist (§4).

---

## 3. Separation of Concerns

Every implementation step touches some subset of these layers. Each layer has
exactly one job:

| Layer | Responsibility | Folder | Rule |
|---|---|---|---|
| UI Component | Render markup + local presentational state (e.g. modal open/closed) | `app/`, `components/`, `features/*/components/` | Zero business logic. No inline calculations (e.g. no `xp * 10` in JSX). Reads data via store selectors or props only. |
| Business Logic | Pure input→output rules (XP, leveling, pricing) | `lib/` | No React imports, no side effects beyond explicit storage helpers. Fully unit-testable without rendering anything. |
| Types | Domain data shapes | `types/` | Interfaces/types only — no logic, no default values beyond const assertions. |
| Utilities | Generic, feature-agnostic helpers (formatting, id generation, date math) | `lib/` | Stateless, reusable by any feature. |
| State (Zustand store) | Orchestration: calls `lib/` logic, calls the storage wrapper, exposes actions | `features/*/store.ts` or a shared store | Only layer allowed to call LocalStorage helpers. Components call store actions — never mutate persisted state directly, never call storage helpers themselves. |

A step is not complete if a component contains logic that belongs in `lib/`,
or if `lib/` code imports React/DOM APIs.

---

## 4. Testing Checklist Per Feature

Run through this before marking any feature step done. Numeric limits
referenced below are defined in `coding_standard.md` §2.

- [ ] Matches the acceptance criteria of its FR-ID(s) in `requirements.md`
- [ ] Follows the corresponding flow in `user_flow.md` (screens/transitions match)
- [ ] Business logic (`lib/`) has no React dependency and is callable/testable in isolation
- [ ] State persists correctly to LocalStorage and survives a page reload
- [ ] No business logic present inside UI components (spot check per §3)
- [ ] File size and component complexity within `coding_standard.md` §2 limits
- [ ] TypeScript compiles with no errors and no `any`
- [ ] ESLint passes with no warnings
- [ ] Manually verified in the browser for the golden path
- [ ] Manually verified for at least one edge case relevant to the feature
      (e.g. insufficient coins, no subjects created yet, sub-1-minute session,
      starting a timer while one is already running)
- [ ] Commit message(s) follow Conventional Commit format (`git_rule.md`)

A feature step is **done** only when every applicable box above is checked.

---

## 5. Documentation Sync

If implementation reveals that a doc decision no longer fits (e.g. a formula
needs adjusting, a flow needs an extra step), update the relevant doc
(`requirements.md`, `user_flow.md`, `data_model.md`) in the same step —
docs and code should never drift silently.
