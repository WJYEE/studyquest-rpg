# UI Design

Documents the conventions actually implemented in v1.0, written after the
v1.0 release-prep consistency pass. This describes reality, not aspiration —
update it when the conventions below change, rather than letting it drift.

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

## Cards / List Items

Recurring pattern for one row in a list (subjects, shop items):
`<li className="flex items-center justify-between gap-4 rounded border border-gray-200 px-4 py-3">`
— content on the left, one action button on the right (`shrink-0` so long
names don't squeeze it).

## The Pixel-RPG Hero Pattern

Introduced on the Home page (`src/app/page.tsx`) and reused by
`PixelCharacterPlaceholder`: a thick pixel-style border
(`border-4 border-gray-800`) around a light panel (`bg-amber-50` /
`bg-amber-100`), `image-rendering: pixelated` on the character box itself.
This is the one deliberately "gamey" visual motif in an otherwise plain
Tailwind UI — keep it contained to the character/hero presentation, don't
spread pixel-border styling to every card (that would fight with the plain
`border-gray-200` list-item convention above).

`PixelCharacterPlaceholder` itself is a static placeholder — no real sprite
art or per-level visual variation exists yet (tracked in
`00_project/roadmap.md`).

## Responsive

No component uses more than an occasional single breakpoint
(`sm:flex-row` on the Home CTA row is the only one in the app as of v1.0).
Layouts are deliberately simple enough that they don't need more — verified
at a 375px viewport with no horizontal overflow on any route
(`03_development/test_plan.md` §6). If a new component needs real
responsive behavior beyond stacking, that's a signal to reconsider the
layout rather than reach for more breakpoints.
