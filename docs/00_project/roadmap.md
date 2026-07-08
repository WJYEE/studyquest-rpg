# Roadmap

## v1.0 — Local MVP (Complete)

Full scope from `01_analysis/requirements.md` §2.1. See
`00_project/changelog.md` for the detailed release notes.

- [x] Study timer (start/pause/resume/stop, reward preview)
- [x] Subject management (create/rename/archive-or-delete)
- [x] Character XP & level system (with cascading multi-level-ups)
- [x] Subject-level XP & level system
- [x] Coin & diamond economy (session rewards + level-up bonuses)
- [x] Shop (static catalog, purchase, equip)
- [x] Dashboard (today/weekly/streak/subject breakdown + chart)
- [x] Consistent navigation shell across all routes
- [x] LocalStorage persistence, SSR-safe hydration

## v2 — Accounts & Backend

Per `CLAUDE.md`'s stated tech direction:

- Authentication / accounts (replaces the single hardcoded `local-user`)
- PostgreSQL database
- Backend API (replaces the LocalStorage wrapper in `lib/storage.ts`)
- **Ranking / leaderboard** — explicitly deferred from v1 in
  `requirements.md` §2.2 because comparing users requires accounts and a
  backend; add the `/ranking` route once both exist
- Data migration path from existing LocalStorage saves, if preserving
  early users' progress matters

### Smaller items deferred during v1 build-out

Worth reconsidering once the backend lands, or sooner if they turn out to
matter for v1 polish:

- **Unequip action** — v1 only supports equipping an item, not removing one
  (`features/shop`)
- **Multi-slot equipping** — v1 supports exactly one equipped item overall,
  not per-slot (hat + outfit simultaneously); would need a real sprite
  layering system first
- **Streak-based reward bonuses** — the dashboard shows a streak (v1), but
  streaks don't currently affect XP/coin rewards; `requirements.md` §4.5
  explicitly deferred this to avoid v1 complexity
- **All-time total study time stat** — the dashboard shows today/weekly
  totals; an all-time figure is implicit in the subject breakdown but isn't
  surfaced as its own stat
- **Calendar-aligned weekly view** — the dashboard's "week" is a rolling
  7-day window ending today, not a Mon–Sun calendar week
- **Real character/scene/item art + audio** — v1.2 gave the app a full RPG
  shell (window system, scene backgrounds, character animation states, HUD)
  documented in `ui_design.md`, built entirely from CSS gradients and
  inline SVG placeholders (`CharacterSprite.tsx`, `RpgBackground.tsx`), plus
  an asset folder structure (`public/assets/{characters,items,backgrounds,
  audio}`) — but no actual sprite art, scene art, item icons, or audio
  files exist yet. v1.1/v1.2 were the design system, not final art/audio
  production
- **Shop catalog admin/editing UI** — `lib/itemCatalog.ts` is static code;
  no in-app way to add/edit items
- **Real BGM/SFX playback** — `useAudioStore`/`useBgm` wire the mute-state
  architecture but intentionally play nothing (no audio files exist yet);
  wiring real `<audio>` playback is future work once
  `public/assets/audio` has files
- **Automated test suite** — v1 was verified via manual/scripted browser
  checks (Playwright) rather than a committed test suite; see
  `03_development/test_plan.md`
- **LocalStorage schema versioning** — `coding_standard.md` §4 explicitly
  scoped this out of v1; a real backend migration makes it moot anyway

## v3 — Mobile Application

Per `CLAUDE.md`. No design work has started; revisit after v2's backend
exists, since a mobile client will want the same API rather than duplicating
the LocalStorage model.
