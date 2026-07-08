# Changelog

Format loosely follows [Keep a Changelog](https://keepachangelog.com/).
Dates reflect when work was completed in this repo, not necessarily git
commit dates (see `03_development/git_rule.md` for commit conventions going
forward).

## [1.0.0] - 2026-07-08

v1.0 Local MVP — full scope from `01_analysis/requirements.md` §2.1 is
complete: study timer, subject management, character XP/leveling, coin/diamond
economy, shop, and dashboard, all running against LocalStorage with no
backend.

### Added

**Foundations**
- `types/` — `User`, `Subject`, `StudySession`, `Item`, `Inventory` domain types
- `lib/` economy engine — `xpCalculation`, `coinCalculation`, `levelCalculation`,
  `levelUpRewards`, `timerElapsed`, `shopValidation`, `dashboardStats`,
  `itemCatalog`, `storage` (SSR-safe LocalStorage wrapper), `id`
- `store/useAppStore.ts` — single Zustand store: user/subjects/sessions state,
  active-timer lifecycle, reward application, shop actions, LocalStorage
  hydration/persistence

**Subject management** (`/subjects`)
- Create, rename, and remove subjects
- Subjects with study history are archived (not deleted) to preserve
  historical dashboard stats; subjects with no history delete outright
- Archived subjects are excluded from selection UI (timer, etc.)

**Study timer** (`/timer`)
- Start / pause / resume / stop, with only one session active at a time
- Live elapsed-time display and a live reward preview (XP/coins) before stopping
- Duration recorded in whole minutes; sessions under 1 minute earn no reward
- Session-complete summary showing XP, coins, and any level-ups

**Character growth** (`/character`)
- Global character XP/level (`level * 100` XP per level, cascading multi-level-ups)
- Per-subject XP/level, tracked in parallel with the character
- Rule-based session rewards: 1 XP/minute + duration-tier bonus (30+/60+/120+
  minutes), 1 coin per 10 minutes
- Level-up bonus rewards: `+50 * level` coins per level gained, `+1` diamond
  every 5th level
- XP progress bar, coin/diamond display, a placeholder character sprite
  showing the currently equipped item

**Shop** (`/shop`)
- Static item catalog (coin- and diamond-priced cosmetics)
- Purchase with currency validation (insufficient funds / already owned /
  item not found, each with a specific message)
- Equip a purchased item; reflected on the character page

**Dashboard** (`/dashboard`)
- Today's total study time
- 7-day trend chart (Recharts) and weekly total
- Per-subject time breakdown (includes archived subjects, for historical accuracy)
- Current study streak (consecutive active days)

**App shell**
- Shared navigation bar across all routes, with active-route highlighting
- Home page (`/`) replacing the `create-next-app` placeholder
- One-time LocalStorage hydration on client mount (`AppHydrator`)

**Documentation**
- Filled in `01_analysis/requirements.md` and `user_flow.md`
- Filled in `02_design/data_model.md`, `coding_standard.md`
- Filled in `03_development/development_rule.md`, `git_rule.md`
- This changelog, plus `00_project/roadmap.md` and `03_development/test_plan.md`

### Changed

- `data_model.md`'s `Item` gained a `currency: "coin" | "diamond"` field;
  `Subject` gained `isArchived`
- The LocalStorage key originally planned as `studyquest:items` (a raw
  `Item[]`) was redesigned as `studyquest:inventory`, storing per-user
  ownership/equip state instead — `Item` itself turned out to be static
  catalog content, not per-user data

### Known Gaps (deliberately out of scope for v1.0)

See `roadmap.md` for the full v2+ list. Notably: no ranking/leaderboard, no
accounts/backend/database, no item unequip action, no multi-slot equipping,
no streak-based reward bonuses, no automated test suite (verification this
release was manual/scripted — see `test_plan.md`).
