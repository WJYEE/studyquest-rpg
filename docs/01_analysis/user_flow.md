# User Flow — v1.0 Local MVP

Companion to `requirements.md`. Describes screen-to-screen navigation and the
step-by-step user journeys for each core loop.

---

## 1. Information Architecture

Proposed v1 routes (revises `folder_structure.md`'s example — `ranking` dropped
per `requirements.md` §6.1, since it needs multi-user data not available in v1):

```
/               Home — character view, coin/diamond HUD, "Start Studying" entry
/timer          Active study session (subject select → stopwatch)
/dashboard      Study stats & charts
/shop           Browse & purchase items
/subjects       Manage subjects (create / edit / delete)
```

All routes read/write the same LocalStorage-backed state (via Zustand store),
so navigation never loses in-progress data except an unsaved running timer
(see §3).

---

## 2. First-Time User Flow (Onboarding)

```mermaid
flowchart TD
    A[Open app, no LocalStorage data] --> B[Initialize default User: level 1, xp 0, coin 0, diamond 0]
    B --> C[Prompt: create first Subject]
    C --> D[Home screen: character at level 1, empty subject shown]
```

- No nickname/account step — v1 has no login. A default `User` record is created
  silently on first load.
- The user must create at least one `Subject` before the timer can be used
  (a session requires a `subjectId`).

---

## 3. Core Loop: Study Session Flow

This is the primary loop the entire app is built around: **study → earn → grow**.

```mermaid
flowchart TD
    Start([User on Home]) --> SelectSubject[Select a Subject]
    SelectSubject --> StartTimer[Start Timer]
    StartTimer --> Running{Timer Running}
    Running -->|Pause| Paused[Paused]
    Paused -->|Resume| Running
    Running -->|Cancel| Cancelled[Discard session, no rewards]
    Paused -->|Cancel| Cancelled
    Running -->|Stop| Stop[Stop Timer]
    Stop --> CheckMin{Duration >= 1 min?}
    CheckMin -->|No| NoReward[Save session*, award 0 XP/coin]
    CheckMin -->|Yes| Reward[Calculate XP + coin per requirements 4.1]
    Reward --> ApplyCharacter[Add XP to User + Subject]
    ApplyCharacter --> LevelCheck{XP crosses next level threshold?}
    LevelCheck -->|Yes| LevelUp[Level up: apply coin bonus, diamond if milestone]
    LevelCheck -->|No| Summary
    LevelUp --> Summary[Show session summary screen]
    NoReward --> Summary
    Cancelled --> End([Return to Home])
    Summary --> End
```

\* Whether sub-1-minute sessions are saved at all (with 0 reward) or discarded
entirely is an implementation detail; either is acceptable per `requirements.md`.

### Step-by-step

1. User lands on Home, sees character + HUD (level, XP bar, coin, diamond).
2. User taps "Start Studying" → navigates to `/timer`.
3. User selects a `Subject` from a dropdown/list.
4. User starts the stopwatch. Timer counts up; Pause/Resume available.
5. User stops the timer → session duration is finalized.
6. App computes `xpEarned` / `coinEarned` (requirements §4.1) and writes a new
   `StudySession` record.
7. App adds XP to both the global `User` and the selected `Subject`.
8. App checks level thresholds (requirements §4.2) for both; if crossed, applies
   level-up rewards (requirements §4.3) — this may cascade (e.g. large session
   duration triggers multiple level-ups).
9. App shows a session summary (XP gained, coins gained, level-up notice if any).
10. User returns to Home; character visual and HUD reflect new state.

---

## 4. Character Growth Flow

```mermaid
flowchart TD
    A[User XP updated after session] --> B{Crossed level threshold?}
    B -->|No| C[XP bar fills, no other change]
    B -->|Yes| D[Level increments, overflow XP carries over]
    D --> E[+50 * newLevel coins]
    D --> F{newLevel is multiple of 5?}
    F -->|Yes| G[+1 diamond]
    F -->|No| H[No diamond]
    E --> I[Character visual updates if level unlocks new appearance]
    G --> I
    H --> I
```

Character appearance changes are read from `User.level` and any **equipped**
`Item` (see §5) — no separate "growth" screen is needed; the Home view always
reflects current state live.

---

## 5. Shop Flow

```mermaid
flowchart TD
    A[User navigates to /shop] --> B[Browse item catalog]
    B --> C[Select item]
    C --> D{Balance >= Item.price in Item.currency?}
    D -->|No| E[Show insufficient-funds message]
    D -->|Yes| F[Deduct balance, add item to inventory]
    F --> G{User equips item now?}
    G -->|Yes| H[Set as equipped, character view updates]
    G -->|No| I[Item stays in inventory, unequipped]
    E --> B
    H --> B
    I --> B
```

- Coin-priced items: everyday cosmetics, affordable from normal session rewards.
- Diamond-priced items: rare cosmetics, only obtainable via level-up milestones
  (requirements §4.3–4.5) — never purchasable with coins, reinforcing scarcity.

---

## 6. Subject Management Flow

```mermaid
flowchart TD
    A[User navigates to /subjects] --> B[View list of Subjects]
    B --> C[Create new Subject]
    B --> D[Edit existing Subject name]
    B --> E[Delete Subject]
    E --> F{Sessions exist for this subject?}
    F -->|Yes| G[Retain StudySession history, mark subject deleted for dashboard]
    F -->|No| H[Remove Subject record entirely]
    C --> B
    D --> B
    G --> B
    H --> B
```

---

## 7. Dashboard Flow

```mermaid
flowchart TD
    A[User navigates to /dashboard] --> B[Load all StudySession records]
    B --> C[Total study time summary]
    B --> D[Study time by Subject - chart]
    B --> E[Study time over time - chart]
    B --> F[Character level / XP progress / coin & diamond balance]
```

Read-only view — no state mutation happens on the dashboard.

---

## 8. Navigation Map

```mermaid
flowchart LR
    Home["/  (Home)"] -->|Start Studying| Timer["/timer"]
    Timer -->|Stop / Cancel| Home
    Home -->|Manage Subjects| Subjects["/subjects"]
    Subjects --> Home
    Home -->|Shop| Shop["/shop"]
    Shop --> Home
    Home -->|Dashboard| Dashboard["/dashboard"]
    Dashboard --> Home
```

Home acts as the hub; every other route returns to it. This keeps navigation
shallow and consistent with the "no unnecessary complexity" rule in `CLAUDE.md`.
