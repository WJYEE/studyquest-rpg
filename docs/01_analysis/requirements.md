# Requirements — v1.0 Local MVP

Source docs: `CLAUDE.md`, `02_design/architecture.md`, `02_design/data_model.md`, `02_design/folder_structure.md`.

---

## 1. Purpose

Define what "done" means for StudyQuest v1.0: a frontend-only, LocalStorage-backed
web app where study time converts into character growth through a deterministic,
rule-based XP/coin economy. No AI, no login, no database, no payments.

---

## 2. MVP Scope

### 2.1 In Scope (v1.0)

| Feature | Maps to folder |
|---|---|
| Study timer (start / pause / resume / stop) | `features/timer` |
| Subject management (create / edit / delete / select) | `features/subject` |
| Character XP & level system | `features/character` |
| Subject-level XP & level system | `features/subject` |
| Coin system (earn / spend / balance) | `features/character`, `lib` |
| Shop system (browse / buy / equip items) | `features/shop` |
| Dashboard (study stats, charts) | `app/dashboard` |

### 2.2 Out of Scope (v1.0)

Per `CLAUDE.md` restrictions:

- AI features (recommendations, insights, chat)
- Login / authentication / multi-user accounts
- Database / backend API (LocalStorage only)
- Payment system (diamonds are earned in-app only, never purchased)
- **Ranking / leaderboard** — `folder_structure.md` lists `app/ranking` as an example
  route, but ranking implies comparing multiple users, which requires accounts and a
  backend that don't exist in v1. **Decision: excluded from v1, moved to v2** once
  accounts/backend land. Not part of v1 routing or functional requirements.

---

## 3. Functional Requirements

### 3.1 Study Timer — `features/timer`

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| FR-T1 | User can select a subject and start a stopwatch. | Timer starts at 00:00 and counts up while running. |
| FR-T2 | User can pause and resume the timer. | Elapsed time excludes paused duration. |
| FR-T3 | User can stop the timer to end a session. | Stopping creates a `StudySession` record and triggers reward calculation (§4). |
| FR-T4 | User can cancel a session without saving it. | No `StudySession` is created; no XP/coin awarded. |
| FR-T5 | Only one timer can run at a time. | Starting a new session while one is already active is blocked (e.g. disabled control or warning message); the running session is unaffected. |

### 3.2 Subject Management — `features/subject`

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| FR-S1 | User can create a subject with a name. | New `Subject` starts at level 1, xp 0, totalMinutes 0, isArchived false. |
| FR-S2 | User can edit a subject's name. | Existing sessions keep their `subjectId` reference. |
| FR-S3 | User can remove a subject. | If the subject has no `StudySession` history, it is deleted outright. If it has history, it is **archived** (`isArchived: true`) instead of deleted — hidden from the active subject list and timer selector, but its past `StudySession` records remain intact for dashboard stats. |
| FR-S4 | User can view a subject's current level, XP, and total study minutes. | Values match the Subject data model. |
| FR-S5 | Archived subjects are excluded from subject-selection UI (e.g. timer start). | Only subjects with `isArchived: false` appear in selectable lists. |

### 3.3 Character & XP System — `features/character`

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| FR-C1 | Every completed study session awards XP to the global character. | XP awarded per §4.2. |
| FR-C2 | Character levels up automatically when XP crosses the threshold for the next level. | Level and XP update per §4.3; overflow XP carries into the new level. |
| FR-C3 | Character sprite/appearance reflects current level or equipped items. | Visual state reads from `User.level` and equipped `Item`s. |

### 3.4 Coin & Diamond Economy

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| FR-E1 | Every completed study session awards coins to the user. | Coins awarded per §4.2. |
| FR-E2 | Character level-ups award a coin bonus. | Per §4.4. |
| FR-E3 | Character level-ups at milestone levels award diamonds. | Per §4.4. |
| FR-E4 | Coin/diamond balances persist and are visible to the user at all times. | Balances shown in a persistent UI element (e.g. header/HUD). |

### 3.5 Shop — `features/shop`

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| FR-P1 | User can browse available `Item`s with price, currency, and type. | Items rendered from a static catalog (no backend). |
| FR-P2 | User can purchase an item if the matching-currency balance is sufficient. | Balance for `Item.currency` decreases by item price; item added to inventory. |
| FR-P3 | Purchase is blocked if the matching-currency balance is insufficient. | No state change; user sees an insufficient-funds message. |
| FR-P4 | User can equip a purchased item on the character. | Character view reflects equipped item. |
| FR-P5 | User can unequip an equipped item. | Slot returns to empty; character view no longer shows that item. (v1.2) |
| FR-P6 | User can equip one item per slot (`hat`, `outfit`, `accessory`) simultaneously. | Equipping a new item in a slot replaces only that slot's item; other slots' equipped items are unaffected. (v1.2) |

### 3.6 Dashboard — `app/dashboard`

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| FR-D1 | User can view total study time across all subjects. | Sum of `StudySession.duration`. |
| FR-D2 | User can view study time broken down by subject. | Chart (Recharts) grouped by `subjectId`. |
| FR-D3 | User can view study time trends over a period (e.g. daily/weekly). | Chart grouped by `StudySession.createdAt`. |
| FR-D4 | User can view current character level, XP progress, and coin/diamond balance. | Summary widget on dashboard. |

---

## 4. XP & Coin Economy Rules

Design principle: **deterministic, transparent, and simple** — no randomness, no
hidden multipliers, no AI tuning. Every reward must be reproducible from a
`StudySession.duration` value alone. This keeps `lib/` functions pure and testable,
per the folder structure's separation of business logic from UI.

### 4.1 Session Rewards (on session stop)

| Rule | Value |
|---|---|
| Minimum session length to earn rewards | 1 minute (sessions < 1 min award nothing) |
| XP per minute studied | 1 XP |
| Coin rate | 1 coin per 10 minutes studied |
| Bonus XP (duration milestone, highest tier only — not cumulative) | 30+ min: +10 XP · 60+ min: +25 XP · 120+ min: +60 XP |
| Applies to | Both the global character XP **and** the selected subject's XP (dual progression) |

Formula:
```
baseXP = floor(durationMinutes) * 1

bonusXP = 60  if durationMinutes >= 120
        = 25  if durationMinutes >= 60
        = 10  if durationMinutes >= 30
        = 0   otherwise

xpEarned   = baseXP + bonusXP
coinEarned = floor(durationMinutes / 10)
```

Bonus XP is a single flat amount from the **highest tier reached**, not a sum of
all tiers crossed (e.g. a 90-minute session earns `90 + 25 = 115` XP, not
`90 + 10 + 25`). **Decision: confirmed non-cumulative, highest tier only.**

### 4.2 Leveling Formula

Both `User.level` and `Subject.level` use the same shared formula (implemented once
in `lib/`, e.g. `calculateLevel(xp)`), to avoid duplicated logic:

```
xpRequiredForLevel(currentLevel) = currentLevel * 100
```

- To advance from the current level to the next, the character needs
  `currentLevel * 100` XP: level 1 → 2 requires 100 XP, level 2 → 3 requires 200
  XP, etc. (linear, not exponential — keeps early progression fast and
  predictable for an MVP).
- XP accumulates continuously; when total XP crosses the threshold for the next
  level, the level increments and remaining XP carries over (no XP lost).

### 4.3 Level-Up Rewards

| Trigger | Reward |
|---|---|
| Character levels up | `+50 * newLevel` coins |
| Character reaches a multiple-of-5 level (5, 10, 15, …) | `+1` diamond |
| Subject levels up | No separate currency reward (XP/coin already granted at session time); level-up is a visual/status milestone only |

### 4.4 Shop Pricing & Currency

`Item` has an explicit `currency` field (`"coin" | "diamond"`, added to
`data_model.md`). Most items are coin-priced (common cosmetics); diamond-priced
items are rare, premium cosmetics only obtainable via level-up milestones (§4.3)
— reinforcing diamonds as a scarce, non-purchasable reward.

### 4.5 Explicitly Deferred (not in v1)

To honor the "no unnecessary complexity" restriction in `CLAUDE.md`:

- No streak bonuses, daily caps, or diminishing returns.
- No difficulty/subject-based XP multipliers.
- No random rewards or loot boxes.

---

## 5. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-1 | All state must persist to `LocalStorage` and survive a page reload. |
| NFR-2 | App must function fully offline (no network calls in v1). |
| NFR-3 | XP/coin/level calculations live in `lib/`, decoupled from UI components. |
| NFR-4 | UI must be responsive down to typical mobile viewport widths. |

---

## 6. Open Questions / Assumptions

None outstanding for v1 at this time.

### Resolved

- ~~Ranking route~~ — excluded from v1, moved to v2 (§2.2).
- ~~Item.currency field~~ — added to `data_model.md` (§4.4).
- ~~Concurrent timer behavior~~ — only one timer may run at a time; new sessions
  are blocked while one is active (FR-T5).
- ~~Subject deletion~~ — subjects with study history are archived
  (`isArchived: true`) instead of deleted; subjects with no history are deleted
  outright (FR-S3, FR-S5).
- ~~Bonus XP stacking~~ — confirmed non-cumulative, highest tier only (§4.1).
