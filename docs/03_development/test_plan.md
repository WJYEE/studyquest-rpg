# Test Plan

v1.0 has no committed automated test suite (no Jest/RTL — not part of the
v1 stack, see `roadmap.md` v2 backlog). Every scenario below was verified
manually/via scripted browser automation during development and should be
re-run before each release. This doc is that checklist, kept up to date as
new features land.

## Tooling

- **Lib-level checks**: pure functions in `src/lib/` were verified with
  standalone `tsx` scripts asserting expected outputs against hand-computed
  values (e.g. XP/coin formulas, leveling cascades, streak edge cases).
- **Browser end-to-end checks**: `npm run dev` + Playwright (`chromium`),
  using the [Clock API](https://playwright.dev/docs/clock) to fast-forward
  simulated time instead of waiting on real minutes/days. Console errors
  (`page.on("console")`/`"pageerror"`) were asserted empty on every run.
- Verification scripts were written ad hoc per feature and deleted after
  passing — they are not committed. Re-creating them from the scenarios
  below (or writing them as a real Jest/Playwright suite) is tracked in
  `roadmap.md`.

---

## 1. Subject Management (`/subjects`)

| Scenario | Steps | Expected |
|---|---|---|
| Empty state | Load `/subjects` with no subjects | "No subjects yet…" message shown |
| Create | Fill name, click Add Subject | Appears in list: Level 1 · 0 XP · 0 min |
| Rename | Click a subject's name, edit, press Enter | New name persists, shown immediately |
| Remove (no history) | Remove a subject with zero sessions | Deleted outright, disappears from list |
| Archive (has history) | Remove a subject with ≥1 session | Hidden from the list (not shown as active/selectable), but its past sessions remain in dashboard stats |
| Persistence | Add a subject, reload the page | Subject still present (LocalStorage hydration) |

## 2. Study Timer (`/timer`)

| Scenario | Steps | Expected |
|---|---|---|
| Subject selector | Open `/timer` | Dropdown lists only non-archived subjects; Start disabled until one is chosen |
| Start | Choose a subject, click Start | Status shows "Studying", live MM:SS ticks upward |
| Reward preview | Let time pass (simulated) | "If you stop now: +X XP · +Y coins" updates live, matching `calculateSessionXp`/`calculateSessionCoins` |
| Pause/resume | Click Pause mid-session, wait, click Resume | Display freezes during pause; resumes counting from where it left off (paused time excluded from duration) |
| Stop | Click Stop | Session summary shows correct duration/XP/coins; timer returns to idle; Subject's totalMinutes/XP updated |
| Duration flooring | Stop a sub-1-minute session | 0 XP / 0 coins awarded (floors, doesn't round up into a reward) |
| Concurrency guard | Attempt to start a second session while one is active | Blocked (`startSession` throws; UI prevents it structurally via disabled/hidden controls) |
| Error handling | Force an invariant violation (e.g. via direct store call) | Inline error message renders (`role="alert"`), app doesn't crash |

## 3. Character Growth (`/character`)

| Scenario | Steps | Expected |
|---|---|---|
| Initial state | Fresh profile | Level 1, 0/100 XP, 🪙0, 💎0 |
| Session XP applied | Complete a study session | Level/XP update to match `applyXpGain` |
| Cascading level-up | Complete a very long session crossing multiple levels | Level jumps correctly; leftover XP carries over; "Level up! +N character levels" shown in the timer summary |
| Level-up coin bonus | Cross one or more levels | Coin balance includes `+50 * level` for every level crossed, not just the final level |
| Diamond milestone | Cross a level that's a multiple of 5 | +1 diamond per multiple-of-5 level crossed |
| Equipped item display | Equip an item in the shop, revisit `/character` | Placeholder shows "Wearing: {item name}" |

## 4. Shop (`/shop`)

| Scenario | Steps | Expected |
|---|---|---|
| Catalog display | Load `/shop` | All catalog items shown with price, currency icon, type |
| Balance display | — | Header shows current coin/diamond balance |
| Purchase (affordable) | Buy an owned-eligible item | Balance decreases by price in the correct currency; card switches to Equip/Equipped |
| Purchase blocked — insufficient funds | Attempt to buy an item priced above current balance | Buy button disabled; tooltip explains why |
| Purchase blocked — insufficient diamonds specifically | Attempt to buy a diamond item with 0 diamonds (even with excess coins) | Blocked — currency types are not interchangeable |
| Already owned | Attempt to re-purchase an owned item | Not possible via UI (card shows Equip, not Buy); `evaluatePurchase` returns `already-owned` if called directly |
| Equip | Click Equip on an owned item | Button becomes "Equipped" and disabled; character page reflects it |
| Persistence | Purchase + equip, reload `/shop` | Ownership and equip state survive (LocalStorage) |

## 5. Dashboard (`/dashboard`)

| Scenario | Steps | Expected |
|---|---|---|
| Empty state | No sessions logged | "No study time recorded yet." for subject breakdown; stats show 0 |
| Today total | Complete a session today | "Today" stat matches that session's duration (same local day) |
| Weekly chart | Complete sessions across several simulated days | Bar chart shows 7 day labels; bars render for days with >0 minutes; weekly total matches the sum |
| Subject breakdown | Multiple subjects with study time | Listed sorted by minutes descending; **archived subjects included** (historical accuracy) |
| Streak — consecutive days | Study on N consecutive days (including today) | Streak = N |
| Streak — today not yet studied | Study yesterday but not yet today | Streak still counts through yesterday (not broken until today ends with 0) |
| Streak — gap | A day with 0 minutes breaks the chain | Streak resets at the gap |

## 6. Navigation & App Shell

| Scenario | Steps | Expected |
|---|---|---|
| Deep link | Load each route directly (`/`, `/subjects`, `/timer`, `/character`, `/shop`, `/dashboard`) | Nav bar present with all 6 links; correct link highlighted active |
| Click-through | From Home, click each nav link in turn | URL updates, correct page renders, no full reload needed |
| Return to Home | From any deep page, click Home | Returns to `/` |
| Page metadata | Check browser tab title | "StudyQuest", not the `create-next-app` default |

## 7. Cross-Cutting

| Scenario | Steps | Expected |
|---|---|---|
| SSR hydration | Load any page fresh | No React hydration-mismatch warnings in console |
| Console errors | Exercise the full golden path across all features | Zero `console.error`/`pageerror` events |
| Typecheck | `npx tsc --noEmit` | Passes with no errors |
| Lint | `npx eslint src` | Passes with no errors or warnings |
| LocalStorage keys | Inspect Application → Local Storage in devtools | `studyquest:user`, `studyquest:subjects`, `studyquest:sessions`, `studyquest:inventory` present; no stray `studyquest:items` key |
