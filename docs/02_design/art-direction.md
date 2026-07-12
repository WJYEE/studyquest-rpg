# Art Direction

Target visual language for StudyQuest — "a study tracking app with
subtle pixel RPG elements." This is a **spec to implement toward**, not
a description of the current code (see status note at the end).
`design-principles.md` covers the *why*; this doc covers the *what*.

## 1. Overall visual direction

**Cozy study companion, not a game shell.** The study content (timer,
subject list, stats) is always the visual hero of every screen. RPG
elements — character, level, currency, quests — are present, legible,
and rewarding, but peripheral: a companion and a reward layer, not the
interface itself.

Reference anchor: `references/ui/*.png` and the study-vignette sheet in
`references/backgrounds/` (the sheet with a small round mascot studying
at a desk inside tiny cozy dioramas, labeled 나의 공부방 / 숲속 공부터 /
도서관 / etc.) — soft, rounded, warm, low-contrast. Not the sharp
thick-ink SNES-dialog style, and not the dungeon/throne-room tile-sets
also present in the references (those are technique-only reference,
per `design-principles.md`).

## 2. Character design

- **Footprint**: one primary home (the Character page), plus a small
  idle thumbnail in the persistent HUD. Not full-size on every route.
- **Proportions**: round and soft — big head, simple round eyes, tiny
  body (chibi) — per `references/characters/*.png`'s study-persona
  sheet, not the current blocky rect-grid sprite.
- **Costume vocabulary**: study personas, not fantasy classes — Student,
  Bookworm/Reading Master, Focus Master, Subject Expert, Café Studier,
  Digital Learner, Rest & Healing — matching existing shop item slots
  (hat/outfit/accessory) but reskinned toward study flavor instead of
  generic tunics/hats.
- **Future option (not required now)**: a lower-commitment pet/companion
  alternative to a full humanoid avatar, per the reference's "pets" row.

## 3. Background design

- **One small diorama, not a world.** Where a background illustration
  appears (Timer, Character), it's sized to fit inside one card — a
  forest corner, library nook, or lakeside desk with the character
  studying inside it — not a full-viewport scene the whole page sits on.
- **Everywhere else, quiet.** Shop, Subjects, Dashboard get a flat warm
  cream surface — a clean workspace, not a "world." They don't need
  their own illustrated scene.
- **Excluded entirely**: dungeon/throne-room/combat imagery, and any
  scene implying exploration (quest markers, NPCs to walk up to).

## 4. Color palette direction

Source of truth: `moodboard.md` / `prompts/color-palette.md`.

| Role | Color | Notes |
|---|---|---|
| Primary / brand | Forest Green | Primary actions, progress fill |
| Base surface | Cream | Page background, panel fill |
| Accent — reward/currency | Soft Orange, Pastel Yellow | Coins, positive reward moments |
| Accent — informational | Sky Blue, Mint | Subject tags, secondary status |
| Accent — premium/rare | Lavender | Diamond currency, rare items |
| Text / structural ink | Warm dark brown (not pure black) | Body text, thin borders — kept dark enough for WCAG AA against cream |

Rules:
- Avoid saturated colors — everything is a soft/pastel tone, "comfortable
  for long study sessions" (direct language from the source prompt).
- Ink stays for **text legibility only** — it should not be the loudest
  visual element on screen via thick borders or hard drop-shadows.
- "Low contrast" describes mood (soft borders/shadows), not
  accessibility — text-on-surface contrast still targets WCAG AA.

## 5. Icon style direction

- **Technique**: soft-shaded, gently rounded pixel icons, consistent
  single warm light source — per `references/icons/*.png`.
- **Vocabulary**: study items first — book, notebook, pencil,
  hourglass/clock, coffee, backpack, headphones, laptop. Fantasy-trinket
  icons (potion, crystal, star) are reserved for reward/currency/status
  only, never literal equipment — keeps RPG flavor present but
  subordinate to the study theme.
- **Interim**: emoji remain an acceptable placeholder (consistent with
  the project's existing "no real art assets yet" constraint — see
  `public/assets/*` READMEs); new custom iconography should target this
  rounded/soft look rather than the flat sharp-rect style used in the
  current `CharacterSprite`.

## 6. Typography direction

- Pixel display font reserved for **identity/celebration moments only**:
  page titles, level-up callouts, badge/ribbon chips. Not body copy, not
  button labels, not nav — those use a clean, friendly sans-serif, per
  every UI reference image.
- Numeric data (timer digits, XP, streak counts) stays in a clear,
  tabular, highly legible face — legibility for data beats theming for
  data.

## 7. RPG elements — emphasize vs. minimize

See `design-principles.md` "What to emphasize" / "What to minimize or
remove" — this doc's job is the visual expression of those calls, not a
second copy of the list.

## 8. Design system

Concrete mapping onto the existing component architecture (component
names below are the current implementation's extension points — this
section describes target values/behavior for them, not new files):

- **Tokens** (`src/app/globals.css`, `@theme inline`): keep the existing
  CSS-custom-property + Tailwind token mechanism; replace values with
  the cream/forest-green/pastel palette above. Retire near-black ink as
  the *dominant* border/shadow color; keep a warm dark tone for text.
- **Chrome primitive** (`WindowFrame`): evolve into one "cozy panel" —
  rounded corners, thin warm border, soft diffuse shadow, optional small
  wood-tone label tab — replacing the current thick-ink-border
  "window"/"slot" variants.
- **Buttons** (`Button` / `buttonClassName`): rounded, soft-shadow,
  gentle press feedback (scale/lift, not a hard pixel-shove), sans-serif
  labels, pastel fill by semantic role (primary=forest green,
  secondary=cream/outline, success=mint, danger=soft coral).
- **Layout / HUD** (`RpgHud`): a compact top badge strip (avatar
  thumbnail + level chip + currency chip + streak) replacing the current
  3-row HUD; primary nav as a simple icon+label bar.
- **Backgrounds** (`RpgBackground`): quiet flat cream by default; a
  small bounded diorama variant used only on Timer/Character, replacing
  full-viewport gradient+silhouette scenes everywhere.
- **Iconography**: one consistent rounded/soft icon style reused across
  shop, inventory, and dashboard stat tiles.
- **Motion**: a small shared "reward" vocabulary (sparkle burst, number
  count-up, gentle scale-pop) reserved for real achievement events —
  idle/ambient animation removed from most screens or confined to the
  Character page. All motion still respects `prefers-reduced-motion`.
- **Copy tone**: light, warm flavor — not full in-character adventurer
  voice. E.g. "Start Studying" / "Give Up" / "Studying..." rather than
  "Begin Quest" / "Abandon Quest" / "Adventuring."

## Status

This is the target direction, approved as a design spec. It has **not
yet been implemented** — `ui_design.md` still documents the previously
implemented "RPG window system" (thick ink borders, full-viewport
scenes, 3-row HUD) as current reality, since that's still what's in the
codebase as of this writing. When this direction is implemented,
`ui_design.md` should be rewritten to match (it documents actual
conventions, not aspiration) rather than left describing the old style.
