# Git Rule

Git workflow for StudyQuest v1. Complements `03_development/development_rule.md`
(one feature per implementation step) and `02_design/coding_standard.md`
(code-level rules). Written to mirror real-world team practice, since this
project's goal (per `CLAUDE.md`) includes learning the real software
development process, not just shipping code.

---

## 1. Branch Naming Rule

- **`main`** is the trunk branch. It must always be in a working, deployable
  state. Never commit directly to `main`.
- All work happens on a feature branch, one branch per `development_rule.md`
  implementation step (i.e. one branch per feature-group slice, not one
  branch for multiple features).
- Pattern:
  ```
  <type>/<short-kebab-description>
  <type>/<issue-number>-<short-kebab-description>   (preferred once issues exist, see §3)
  ```
- `<type>` matches the commit type (§2): `feat`, `fix`, `docs`, `refactor`,
  `style`, `test`, `chore`.
- Examples:
  - `feat/12-study-timer`
  - `feat/subject-crud`
  - `fix/xp-overflow-on-levelup`
  - `docs/git-rule`
- Lowercase, kebab-case, no spaces, no ticket-only names (`feat/12` alone is
  not descriptive enough).

---

## 2. Conventional Commit Format (with Body)

```
<type>(<scope>): <short summary, imperative mood, no trailing period>

<body — what changed and why, wrap at ~72 chars, bullet points allowed>

<footer — optional: Refs #<issue>, Closes #<issue>, BREAKING CHANGE: ...>
```

- **Types**: `feat`, `fix`, `docs`, `refactor`, `style`, `test`, `chore`
  (matches `CLAUDE.md`'s Git Rule).
- **Scope**: the folder/feature touched — `timer`, `character`, `subject`,
  `shop`, `dashboard`, `lib`, `types`, `store`, `docs`. Keep it to one scope
  per commit; if a change spans multiple scopes, it's a sign the commit (or
  the implementation step) should be split.
- **Subject line**: imperative mood ("add", not "added"/"adds"), under ~50
  characters where possible.
- **Body is required** for anything beyond a trivial one-line change — it
  should explain *why*, not restate the diff. A docs typo fix doesn't need a
  body; a new formula, a new component, or a schema change does.
- **Footer** links the commit to an issue (§3) when one exists.

---

## 3. Issue-Based Workflow

- Every implementation step from `development_rule.md` §2 (build order) or
  §1 (one feature per step) starts as a **GitHub issue** before any branch is
  created, mirroring real team process.
- Issue title mirrors the feature-group name from `requirements.md`
  §3 (e.g. "Study Timer: start/stop/pause/resume").
- Issue description references the relevant FR-IDs and the `user_flow.md`
  section, so the acceptance criteria are traceable back to the docs.
- Branch is created from the issue (§1 naming pattern including the issue
  number).
- Commits reference the issue in the footer where useful (`Refs #12`).
- The PR that closes the issue includes `Closes #12` in its description so
  the issue auto-closes on merge (§4).
- Trivial doc fixes or typo corrections don't need an issue — use judgment;
  anything that maps to a `development_rule.md` implementation step does.

---

## 4. Pull Request Checklist

Every PR must satisfy `development_rule.md` §4 (Testing Checklist Per
Feature) **and** the following before it's ready to merge:

- [ ] PR covers exactly **one** feature-group step (no bundling unrelated
      changes — mirrors §1 "One Feature Per Implementation Step")
- [ ] PR description states what changed and why, and links the issue
      (`Closes #<issue>`)
- [ ] Self-reviewed the full diff before requesting review (no leftover
      debug code, console logs, or commented-out blocks)
- [ ] All `development_rule.md` §4 testing checklist items pass
- [ ] No direct `window.localStorage` calls outside `lib/storage.ts`
      (`coding_standard.md` §4)
- [ ] No business logic inside components (`coding_standard.md` §3)
- [ ] Docs updated in the same PR if implementation revealed a needed change
      (`development_rule.md` §5)
- [ ] Branch is up to date with `main` before merge (rebase or merge `main`
      in, resolve conflicts locally)

---

## 5. When to Commit and Push

**Commit** after each coherent, self-contained unit of work within a feature
step — not one giant commit per feature, not one commit per line changed.
Roughly: one commit per layer touched in `development_rule.md` §3 (e.g. add
types → separate commit; add the `lib/` calculation function → separate
commit; wire the store → separate commit; build the component → separate
commit). Each commit should:

- Leave the codebase in a working state (compiles, lints)
- Be independently understandable from its message

**Push** to the remote feature branch:

- After every commit, or at minimum at the end of each work session, so work
  isn't lost and progress is visible
- Never push directly to `main` — always through a PR (§4)
- Force-push only to clean up a not-yet-reviewed feature branch's own
  history (e.g. after a rebase); never force-push `main` or a branch others
  are reviewing without warning them first

---

## 6. Example Commit Messages

**docs**
```
docs(requirements): define XP and coin economy rules

Add session reward formulas, leveling curve, and level-up bonuses
so lib/ functions have a single source of truth to implement against.
```

**types**
```
feat(types): add Subject, StudySession, and Item domain types

Model the shapes defined in data_model.md, including Item.currency
and Subject.isArchived, so lib/ and store code can be typed against
a single source of truth instead of inline shapes.
```

**lib**
```
feat(lib): add XP and level calculation functions

Implement calculateSessionXp and calculateLevel per
requirements.md §4: 1 XP/minute, non-cumulative duration bonus
tiers, and the currentLevel * 100 leveling curve. Pure functions,
unit-testable without React.

Refs #14
```

**store**
```
feat(store): wire session completion to XP, coin, and level updates

Zustand store now calls lib/xpCalculation and lib/storage on
session stop, applying rewards to both User and Subject state and
persisting the result. Components will consume this via actions
in the next step.

Refs #14
```

**features**
```
feat(timer): add start/stop/pause/resume controls

Implements FR-T1-T4. Timer UI reads/writes only via store actions;
no XP/coin logic lives in the component (coding_standard.md §3).

Closes #14
```

```
fix(subject): archive subjects with session history instead of deleting

Deleting a subject with existing StudySession records broke
dashboard totals. Subjects with history are now archived
(isArchived: true) and hidden from selection instead, per
requirements.md FR-S3.

Closes #21
```
