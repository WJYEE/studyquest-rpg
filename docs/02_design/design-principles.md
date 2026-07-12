# Design Principles

## Goal

Create a study tracking application with **subtle pixel RPG elements**,
rather than a full RPG game.

StudyQuest is a productivity tool first. The RPG layer exists to make
consistent studying feel rewarding — it should never compete with, slow
down, or obscure the actual task of tracking study time.

## Principles

1. **Productivity comes first.** Every screen's primary space goes to the
   actual task — the timer, the subject list, the stats — never to RPG
   chrome. If a screen has to choose between showing more study data
   clearly or more game flavor, it shows the data.
2. **RPG elements support motivation, not decoration.** Level, XP, coins,
   streaks, and quests exist because they reinforce "I studied, and that
   counted for something." An RPG element that doesn't map to a real
   study action (a scene to explore, a monster to fight, an NPC to talk
   to) doesn't belong.
3. **Clean and intuitive UI.** Familiar app patterns — standard nav,
   standard forms, standard information hierarchy — sit underneath the
   pixel skin. A new user should understand the app instantly; the pixel
   art is a mood, not a puzzle.
4. **Cozy pixel atmosphere.** Warm, soft, low-contrast, rounded — a quiet
   study nook, not an adventure. See `art-direction.md` for the concrete
   palette/shape language this implies.
5. **Minimal but meaningful RPG elements.** One companion, one small
   diorama, one compact stat badge — each RPG element should be
   singular and load-bearing, not one of many competing decorations. See
   "What to emphasize / minimize" below.
6. **Modern web usability.** Accessible contrast, keyboard/focus support,
   responsive layout, fast interactions. Pixel styling never excuses
   worse usability than a plain web app would have.
7. **Consistent pixel art style.** One rendering technique (soft-shaded,
   rounded, warm-lit) applied everywhere — character, icons, diorama art
   — so nothing looks like it came from a different game.
8. **Responsive and accessible design.** Every principle above holds at
   every viewport size and for users relying on reduced motion or
   assistive tech — RPG flavor is the first thing that should degrade
   gracefully, never the last.

## What to emphasize

- **Level / XP progress** — the core "growth" feedback loop — as a
  compact, glanceable badge.
- **Coin / diamond rewards** tied directly to completed study sessions —
  the tangible payoff for studying.
- **Streaks and quest-style daily goals** — a checklist with inline
  progress and a reward chip maps naturally onto "study 60 minutes
  today" and motivates without needing exploration or combat framing.
- **Session-complete / level-up celebration** — a warm, brief celebratory
  moment, not a detour.
- **A small, optional companion** that visibly grows (new gear, new
  level) as a light personalization and reward layer.

## What to minimize or remove

- Full-viewport "world" scenes behind every page (explorable
  town/dungeon backdrops).
- Heavy ink-black borders and hard offset drop-shadows as the default
  chrome for every panel and button.
- "NPC textbox" dialog framing and in-character adventurer copy
  ("Welcome, adventurer!", "Begin Quest", "Abandon Quest").
- A full-size character sprite repeated on every page and in the nav
  header.
- Pixel display font on body copy, buttons, and navigation.
- Combat/dungeon imagery, weapons, monsters, thrones — never
  appropriate for a study tool, regardless of source inspiration.

## Relationship to references

`docs/02_design/prompts/*.md` and `docs/02_design/references/**` split
into two kinds of source material:

- **Technique references** (generic fantasy tile-sets, class rosters,
  weapon/armor icon sheets) — useful only for *how* to render pixel art
  (soft shading, chibi proportion, consistent lighting), never for their
  *content* (combat, dungeons, full explorable towns).
- **Content references** (the study-persona character sheet, the
  study-vignette background sheet, the two UI mockup sheets) — these
  show the actual target: a small mascot studying inside a tiny cozy
  diorama, RPG stats reduced to a corner badge, rounded cream-and-wood
  UI chrome. These are the primary source of inspiration; see
  `art-direction.md` for how they translate into concrete visual rules.
