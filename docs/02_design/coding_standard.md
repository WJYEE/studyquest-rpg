# Coding Standard

Code-level rules for StudyQuest v1. Complements `03_development/development_rule.md`
(workflow/process rules). Source docs: `CLAUDE.md`, `02_design/folder_structure.md`,
`02_design/data_model.md`.

---

## 1. TypeScript Conventions

- **Strict mode** stays enabled (default from `create-next-app`) — never loosen it.
- **No `any`.** If a type is genuinely unknown, use `unknown` and narrow it.
- **`interface` vs `type`**: use `interface` for object shapes that model domain
  entities matching `data_model.md` (`User`, `Subject`, `StudySession`, `Item`);
  use `type` for unions, function signatures, and derived/utility types (e.g.
  `type ItemCurrency = "coin" | "diamond"`).
- **No enums** — use string literal union types instead, to keep values simple
  and directly JSON-serializable for LocalStorage (e.g.
  `type ItemCurrency = "coin" | "diamond"`, not `enum Currency`).
- **Shared types live in `types/`**, one file per domain concept
  (`types/user.ts`, `types/subject.ts`, `types/session.ts`, `types/item.ts`),
  re-exported from `types/index.ts`. Never redefine a domain shape inline in a
  component or store.
- **Component props** are named `<ComponentName>Props`, declared directly above
  the component in the same file — props are component-local, not domain data,
  so they don't belong in `types/`.
- **Exported `lib/` functions** must have explicit return types (catches logic
  errors early); local component-internal helpers may rely on inference.
- **Naming**: `camelCase` for variables/functions, `PascalCase` for components/
  types/interfaces, `SCREAMING_SNAKE_CASE` for module-level constants (e.g.
  `XP_PER_MINUTE`, `COIN_PER_MINUTES`).

---

## 2. File Size & Component Complexity Rules

| Rule | Limit |
|---|---|
| Component file length (excluding imports/types) | ~150 lines — split into subcomponents or move logic to `lib/`/hooks beyond this |
| `lib/` file length | ~200 lines — split by responsibility (e.g. `xpCalculation.ts` and `levelCalculation.ts`, not one `calculations.ts`) |
| Exports per file | One primary component/function per file |
| Props per component | ~5–6 max — beyond that, group related props into an object or reconsider decomposition |
| JSX conditional nesting | Max 2 levels — extract a subcomponent or use an early return instead of nesting further |
| Custom hook scope | One piece of stateful logic per hook (e.g. `useStopwatch`) — no general-purpose "do everything" hooks |

A component's job is to render **one** UI concern. If a component both renders
a form and computes XP, it must be split: computation moves to `lib/`,
rendering stays in the component.

---

## 3. Separation of UI / Logic / Types / Utilities

Concrete, code-level version of the layering defined in `development_rule.md` §3:

- **Components** (`app/`, `components/`, `features/*/components/`) — JSX plus
  purely presentational state (e.g. `isModalOpen`). Displayed values are always
  derived by calling a `lib/` function or reading a store selector — never an
  inline formula in JSX or a handler (no `xp * 10` written directly in a
  component).
- **Business logic** (`lib/`) — pure functions: same input always produces the
  same output, no React imports, no side effects other than the dedicated
  storage wrapper (§4). Every function here must be callable and testable
  without rendering anything.
- **Types** (`types/`) — interfaces/types only.
- **Utilities** (`lib/`) — stateless, feature-agnostic helpers (formatting,
  id generation, date math). Reusable by any feature, not tied to one domain
  entity's rules.
- **State** (Zustand, `features/*/store.ts`) — the only layer allowed to call
  the LocalStorage wrapper (§4) and the only layer allowed to call `lib/`
  business logic in order to compute a state transition. Components call store
  actions; they never call storage helpers or mutate persisted state directly.

---

## 4. LocalStorage Handling Rules

- All LocalStorage access goes through a **single wrapper module**
  (`lib/storage.ts`). No component and no store calls `window.localStorage`
  directly.
- The wrapper must be **SSR-safe**: guard every call with
  `typeof window !== "undefined"`, since Next.js renders on the server first.
- **One key per top-level entity collection**, namespaced with an app prefix
  to avoid collisions with other LocalStorage data, e.g.:
  - `studyquest:user`
  - `studyquest:subjects`
  - `studyquest:sessions`
  - `studyquest:inventory` — the user's shop ownership state (owned item ids,
    equipped item id), *not* a copy of the item catalog. The catalog itself
    is static code (`lib/itemCatalog.ts`), not per-user data, so it isn't
    persisted at all.
- All `JSON.stringify`/`JSON.parse` calls happen **inside** the wrapper —
  callers work with typed objects only, never raw strings.
- The wrapper must **fail defensively**: on a missing key or a parse error,
  return a typed default (e.g. `[]` for collections, a default `User`) rather
  than throwing. A corrupted LocalStorage entry must never crash the app.
- Writes are write-through on every relevant state change for v1 — no
  debouncing/batching. Data volume is small enough that this is not a
  performance concern; don't add complexity for a problem that doesn't exist
  yet.
- The Zustand store hydrates from LocalStorage **once**, at store
  initialization. Never re-read from LocalStorage inside a render function.
- No schema versioning/migration logic in v1 (there is no schema history
  yet). Keep the wrapper's shape simple enough that a `version` field could be
  added later without a rewrite — but do not build that now.

---

## 5. Testing Checklist

See `development_rule.md` §4 for the full per-feature testing checklist —
it applies to every file created or changed under the rules in this document.
