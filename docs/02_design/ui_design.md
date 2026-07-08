# UI Design

Documents the conventions actually implemented in the app. Originally
written after the v1.0 release-prep consistency pass; rewritten for v1.2's
RPG shell (window system, scenes, character animation states, the RPG HUD).
This describes reality, not aspiration — update it when the conventions
below change, rather than letting it drift.

## Layout

- Every page (`src/app/*/page.tsx`) wraps its content in
  `<main className="mx-auto w-full max-w-lg px-4 py-8">`, itself wrapped in
  an `RpgBackground` scene (see below). The Timer route is the one
  exception: `TimerManager` owns its own `RpgBackground` + `<main>` because
  its scene is dynamic (depends on local quest-complete state), not static
  per-route like the other five.
- Each feature's top-level component owns its own `<h1>` (not the page
  wrapper), styled `text-lg font-semibold`. Every route has exactly one. On
  the Timer route, where the `<h1>` sits directly over a scene gradient
  rather than inside a window, it gets an explicit parchment/ink pill
  (`border-2 border-rpg-ink bg-rpg-parchment`) so it stays legible on the
  dark `library` scene — elsewhere the ambient light scene backgrounds give
  plain dark text enough contrast on their own.
- A persistent `RpgHud` (`src/components/rpg/RpgHud.tsx`) replaces the old
  `NavBar` and sits above `{children}` in the root layout, on every route.
  It combines player status and navigation into one window (see "RPG HUD"
  below) rather than being a plain link row.

## Buttons

All buttons go through the shared component in `src/components/Button.tsx`
— don't hand-roll button classes in a feature component. It exports both
`<Button>` (for real `<button>` elements) and `buttonClassName()` (for
non-button elements styled as a button, e.g. a `<Link>` used as a CTA).

| Variant | Look | Use for |
|---|---|---|
| `primary` (default) | `bg-blue-600`, white text | The main action on a screen (Begin Quest, Add Subject, Buy) |
| `secondary` | `bg-gray-200` | Alternate/less-emphasized actions (Rest, Continue, Abandon Quest, Equip) |
| `success` | `bg-green-600`, white text | Completing/confirming something positive (Claim Reward) |
| `danger` | `text-red-600`, no fill | Destructive actions (Remove). Deliberately lower visual weight than a filled button — avoids destructive actions being the most prominent thing on screen |

Sizes: `md` (`px-4 py-2 text-sm`, default) for standalone action rows;
`sm` (`px-3 py-1.5 text-xs`) for buttons embedded in an inventory slot.
Disabled state is always `disabled:opacity-40` — don't introduce a
different disabled opacity for a new button.

**Pixel interaction style:** filled variants (`primary`, `secondary`,
`success`) get a 2px ink border and an offset ink drop-shadow
(`shadow-[3px_3px_0_0_var(--rpg-ink)]`) that collapses to 0 and nudges the
button down-right by 3px on `:active` — a physical "pressed button" feel.
`danger` deliberately opts out (`border-transparent shadow-none`) to keep
its lower visual weight. Don't hand-roll this shadow/press effect outside
`Button.tsx` / `buttonClassName()`.

## Design tokens

Defined in `src/app/globals.css` as CSS custom properties and mapped into
Tailwind's `@theme inline` (same pattern as `--color-background`), so
they're available as utility classes (`bg-rpg-parchment`,
`border-rpg-ink`, etc.):

| Token | Value | Use |
|---|---|---|
| `--rpg-ink` | `#262019` | Primary border/text ink — the pixel-UI "black" |
| `--rpg-ink-soft` | `#8a7a5c` | Light-weight frame borders (`WindowFrame` "slot" variant) |
| `--rpg-parchment` | `#fdf6e3` | Window fill |
| `--rpg-parchment-dark` | `#f3e4bd` | Inset line on windows, tint on slots, XP-bar track |
| `--rpg-gold` | `#b8860b` | Coin-adjacent accent (paired with 🪙), level-up sparkles |
| `--rpg-diamond` | `#0e7c86` | Diamond-adjacent accent (paired with 💎) |

Semantic colors (success green, danger red, primary blue) are unchanged
from v1.0.

## RPG Window System

v1.0 had one "gamey" motif (the hero pixel-border); v1.1 extended it
app-wide but with generic cards. v1.2 replaces that with **purpose-built
window types**, all under `src/components/rpg/`, sharing one low-level
primitive:

- **`WindowFrame`** (`WindowFrame.tsx`) — the shared ink-on-parchment
  frame every other window type is built from. `variant="window"` (thick
  4px ink border + inset parchment-dark line, SNES-dialog double-border
  feel) for a page's primary panel; `variant="slot"` (thinner 2px
  `--rpg-ink-soft` border, subtle tint) for rows/cells inside a window or
  list, so a screen full of slots doesn't compete with its window. Takes an
  `as` prop for polymorphism (e.g. `<WindowFrame as="li" variant="slot">`).
  **Don't hand-roll pixel border/shadow classes outside this component.**
- **`DialogBox`** (`DialogBox.tsx`) — NPC-textbox-style window with a
  pointer tail and an optional `onDismiss` continue affordance. Used for
  transient message content: `SessionSummary`'s "Quest Complete" screen is
  the only current usage.
- **`StatusWindow`** (`StatusWindow.tsx`) — character-sheet layout:
  portrait slot on top, a stats block below. Used by `CharacterStatus`.
- **`InventoryPanel` / `InventorySlot`** (`InventoryPanel.tsx`,
  `InventorySlot.tsx`) — a 2-column grid of icon-first vertical cells,
  replacing the v1.0/v1.1 text-row list for the shop. `ShopItemCard` is one
  `InventorySlot`.
- Plain list rows that aren't inventory-grade (subject list, dashboard stat
  tiles) use `WindowFrame variant="slot"` directly rather than a dedicated
  component — see `SubjectListItem.tsx`, `TodayStat.tsx`, `StreakStat.tsx`.

## RPG World Design (scenes)

`RpgBackground` (`RpgBackground.tsx`) renders a full-bleed gradient plus a
row of decorative silhouette bars behind a page's content — CSS-only, no
image files (see "Asset Structure"). Four scenes:

| Scene | Used by | Feel |
|---|---|---|
| `town` | Home, Subjects, Shop, Dashboard | Neutral warm sky gradient — hub/management screens stay low-key |
| `room` | Character page | Warm tan gradient + tall silhouette bars (bookshelf cue) — "this is your character's space" |
| `library` | Timer, while no quest is complete (idle/running/paused) | Dark warm-brown gradient — quiet-focus mood |
| `field` | Timer, while a `SessionSummary` dialog is showing | Green gradient — the "adventure" payoff, distinct from library's focus mood |

Timer's scene switches dynamically (`lastResult ? "field" : "library"`) —
see `TimerManager.tsx`. Every other route's scene is static, chosen in its
`page.tsx`.

## Character sprite & animation

`CharacterSprite` (`src/features/character/components/CharacterSprite.tsx`)
is an inline SVG built from a small grid of `<rect>`s
(`shape-rendering: crispEdges`, `image-rendering: pixelated`), not an image
file. It takes `tier` (cosmetic level-bracket accent color — bronze/silver/
gold via `tierForLevel`, a UI-only grouping not tied to any game-balance
threshold), `hasHat` (equipped-item overlay), and `animState`:

| `animState` | Wrapper class | When |
|---|---|---|
| `idle` | `animate-pixel-bob` | Default — no session running |
| `walking` | `animate-pixel-walk` + alternating leg opacity | `activeSession.status === "running"` (`useCharacterAnimationState`) |
| `training` | `animate-pixel-train` + a small badge | Quest complete, no level gained |
| `levelup` | `animate-pixel-levelup` + sparkle particles | Quest complete with `userLevelsGained > 0` |

`useCharacterAnimationState` (`features/character/hooks/`) derives the
idle/walking default from `activeSession.status`; `training`/`levelup` are
set locally by whichever component owns that moment (`TimerManager`), since
they're tied to a specific UI event, not persistent store state.

All animation keyframes live in `globals.css`. Every one is neutralized by
a global `prefers-reduced-motion` override there — new animations don't
each need their own media query.

## RPG HUD

`RpgHud` (`src/components/rpg/RpgHud.tsx`) replaces `NavBar` and renders on
every route, three stacked rows:

1. Character portrait (idle `CharacterSprite`) + level + an animated XP bar
   (`transition-[width] duration-500`, not an instant-width snap) + coin/
   diamond counts + a mute toggle (see "Sound System").
2. Current-quest status line — the active session's subject name (and
   "(resting)" while paused), or "No quest active".
3. A horizontal tab-ribbon nav (decision: combined into the HUD rather than
   a separate bar, and kept as visible tabs rather than a collapsed corner
   menu — navigation stays obvious).

Reuses `lib/levelCalculation.ts`'s existing XP-ratio math — the HUD
restyles, it doesn't recalculate.

## Sound System (placeholder architecture)

`useAudioStore` (`src/store/useAudioStore.ts`) persists `muted`/`volume` to
LocalStorage under its own key (`studyquest:audioSettings`, deliberately
separate from `lib/storage.ts`'s 4 domain-entity keys), hydrated alongside
the app store in `useHydrateStore`. Starts muted (no BGM/SFX files exist
yet, and browsers block autoplay before a user gesture anyway).

`useBgm` (`src/hooks/useBgm.ts`) takes a `track: "hub" | "quest"` and is an
intentional no-op — it reads `muted` but doesn't create an `<audio>`
element, since there's no file to point it at. The mute toggle in `RpgHud`
is fully wired; actual playback is future work once
`public/assets/audio/bgm` has real files.

## Asset Structure

`public/assets/{characters,items,backgrounds,audio/{bgm,sfx}}` exists with
README files documenting the intended naming convention (tied to `Item.id`
in `itemCatalog.ts`, the `RpgScene`/`CharacterAnimState` unions, and store
event names) but **no real asset files** — this is design-system and CSS/
SVG-placeholder scope, not final artwork or audio production. Swapping in
real files later should only touch `CharacterSprite.tsx` (character art),
`RpgBackground.tsx` (scene art), `ShopItemCard.tsx`'s `ICON_BY_ITEM_ID`
(item icons), and `useBgm.ts` (audio) — not call sites.

## Responsive

No component uses more than an occasional single breakpoint
(`sm:flex-row` on the Home CTA row). Layouts are deliberately simple enough
that they don't need more — verified at a 375px viewport with no
horizontal overflow on any route (`03_development/test_plan.md` §6). If a
new component needs real responsive behavior beyond stacking, that's a
signal to reconsider the layout rather than reach for more breakpoints.
