# UI Design

Documents the conventions actually implemented in the app. Originally written
after the v1.0 release-prep consistency pass; updated for v1.1's pixel
design system. This describes reality, not aspiration — update it when the
conventions below change, rather than letting it drift.

## Layout

- Every page (`src/app/*/page.tsx`) wraps its content in
  `<main className="mx-auto w-full max-w-lg px-4 py-8">`. Identical on all
  6 routes — don't deviate per-page.
- Each feature's top-level component owns its own `<h1>` (not the page
  wrapper), styled `text-lg font-semibold`. Every route has exactly one.
- A shared `NavBar` (`src/components/NavBar.tsx`) sits above `{children}`
  in the root layout. It's a `flex flex-wrap` row (not horizontal-scroll —
  wrapping was chosen over scroll so nothing is ever visually clipped on
  narrow viewports) with the active route shown as `font-semibold
  text-blue-600`.

## Buttons

All buttons go through the shared component in `src/components/Button.tsx`
— don't hand-roll button classes in a feature component. It exports both
`<Button>` (for real `<button>` elements) and `buttonClassName()` (for
non-button elements styled as a button, e.g. a `<Link>` used as a CTA).

| Variant | Look | Use for |
|---|---|---|
| `primary` (default) | `bg-blue-600`, white text | The main action on a screen (Start, Add Subject, Buy) |
| `secondary` | `bg-gray-200` | Alternate/less-emphasized actions (Pause, Resume, Cancel, Equip) |
| `success` | `bg-green-600`, white text | Completing/confirming something positive (Stop session) |
| `danger` | `text-red-600`, no fill | Destructive actions (Remove). Deliberately lower visual weight than a filled button — avoids destructive actions being the most prominent thing on screen |

Sizes: `md` (`px-4 py-2 text-sm`, default) for standalone action rows;
`sm` (`px-3 py-1.5 text-xs`) for buttons embedded in a list item (shop
cards). Disabled state is always `disabled:opacity-40` — don't introduce a
different disabled opacity for a new button.

**Pixel interaction style (v1.1):** filled variants (`primary`, `secondary`,
`success`) get a 2px ink border and an offset ink drop-shadow
(`shadow-[3px_3px_0_0_var(--rpg-ink)]`) that collapses to 0 and nudges the
button down-right by 3px on `:active` — a physical "pressed button" feel.
`danger` deliberately opts out (`border-transparent shadow-none`) to keep its
lower visual weight. Don't hand-roll this shadow/press effect outside
`Button.tsx` / `buttonClassName()`.

## Typography & Color

- Headings: `text-lg font-semibold` (page `<h1>`s), `text-sm font-medium`
  (section subheadings, e.g. dashboard's "This Week" / "By Subject").
- Body/meta text: `text-sm` normal weight for primary content, `text-xs
  text-gray-500` for secondary/meta info (level·XP·minutes lines, item
  price lines).
- Errors: `text-xs text-red-600`, with `role="alert"` when it's a
  store-thrown message surfaced after a failed action.
- Currency icons are emoji, not custom art: 🪙 coin, 💎 diamond — consistent
  everywhere a balance is shown (`CurrencyDisplay`, shop header, timer
  reward preview).

## Pixel Design System (v1.1)

v1.0 had one "gamey" motif (the hero pixel-border) surrounded by plain
Tailwind UI. v1.1 extends the pixel language across the whole app, but
**deliberately in two weights** so it doesn't turn every element heavy:

- **Strong** — hero/character presentation only (Home hero,
  `PixelCharacterPlaceholder`). Thick 4px ink border plus an inset
  parchment-dark line (`shadow-[inset_0_0_0_3px_var(--rpg-parchment-dark)]`)
  for an SNES-dialog double-border feel, on a parchment (`--rpg-parchment`)
  fill.
- **Light** — everything else that used to be a plain
  `border-gray-200` card/list row (subject list rows, shop item cards, the
  Home feature-highlight tiles). Thinner 2px `--rpg-ink-soft` border, subtle
  `--rpg-parchment-dark/30` tint. Same ink-on-parchment language as strong
  panels, low enough contrast that a page full of list rows doesn't compete
  with the hero.

Both weights are the shared `src/components/PixelPanel.tsx` component
(`weight="strong" | "light"`, `as` prop for polymorphism — e.g.
`<PixelPanel as="li">`). **Don't hand-roll pixel border/shadow classes
outside this component** — that's what caused the v1.0 duplication between
`page.tsx` and `PixelCharacterPlaceholder.tsx` that this component now
replaces.

### Design tokens

Defined in `src/app/globals.css` as CSS custom properties and mapped into
Tailwind's `@theme inline` (same pattern as `--color-background`), so they're
available as utility classes (`bg-rpg-parchment`, `border-rpg-ink`, etc.):

| Token | Value | Use |
|---|---|---|
| `--rpg-ink` | `#262019` | Primary border/text ink — the pixel-UI "black" |
| `--rpg-ink-soft` | `#8a7a5c` | Light-weight panel borders |
| `--rpg-parchment` | `#fdf6e3` | Strong panel fill |
| `--rpg-parchment-dark` | `#f3e4bd` | Inset line on strong panels, tint on light panels |
| `--rpg-gold` | `#b8860b` | Coin-adjacent accent (paired with 🪙) |
| `--rpg-diamond` | `#0e7c86` | Diamond-adjacent accent (paired with 💎) |

Semantic colors (success green, danger red, primary blue) are unchanged from
v1.0 — only the ink/parchment/currency tokens are new.

### Character sprite & animation

`PixelCharacterPlaceholder` now wraps `CharacterSprite`
(`src/features/character/components/CharacterSprite.tsx`): an inline SVG
built from a small grid of `<rect>`s (`shape-rendering: crispEdges`,
`image-rendering: pixelated`), not an image file — see "Asset Structure"
below for why. It has an idle "bob" animation
(`.animate-pixel-bob` in `globals.css`, `steps()` timing for a retro stepped
feel) and a cosmetic level-tier accent color (`tierForLevel` — bronze/silver/
gold, UI-only grouping, not tied to any game-balance threshold).

All animation in the app must respect `prefers-reduced-motion`: `globals.css`
has a global override that collapses animation/transition durations to
~0 for users who request reduced motion — new animations don't each need
their own media query.

### Asset Structure

`public/assets/{characters,items,audio/{bgm,sfx}}` exists with README files
documenting the intended naming convention (tied to `Item.id` in
`itemCatalog.ts` and to store event names) but **no real asset files yet** —
v1.1's scope is the design system and CSS/SVG placeholders, not final
artwork or audio production. Swapping in real files later should only touch
`CharacterSprite.tsx` (art) and the future sound-system hook (audio), not
call sites. Tracked as follow-up work in `00_project/roadmap.md`.

## Responsive

No component uses more than an occasional single breakpoint
(`sm:flex-row` on the Home CTA row is the only one in the app as of v1.0).
Layouts are deliberately simple enough that they don't need more — verified
at a 375px viewport with no horizontal overflow on any route
(`03_development/test_plan.md` §6). If a new component needs real
responsive behavior beyond stacking, that's a signal to reconsider the
layout rather than reach for more breakpoints.
