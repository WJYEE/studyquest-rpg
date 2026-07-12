# Asset Manifest

Concrete production spec for the real visual assets StudyQuest needs to
close the gap between the current CSS-built placeholders and the quality
bar set by `docs/02_design/references/`. This document is **asset
production guidance only** — no application code changes as a result of
it. `art-direction.md` covers the visual language, `screen-specs.md`
covers screen composition; this document covers **exactly what files to
draw or generate, at what size, and where they go.**

## 0. Scope and ground rules

- Every asset below is additive. Dropping a file into `public/assets/`
  does **nothing** by itself — a separate future code-integration pass
  wires each component to read from the file instead of its current
  CSS/emoji placeholder (matching the existing pattern already noted in
  `public/assets/*/README.md`: "swapping in real art should only require
  changing `X.tsx`, not call sites"). Until that integration lands, the
  app keeps working exactly as it does today.
- The existing `public/assets/{characters,items,backgrounds}/README.md`
  files describe an older naming scheme (per-tier `bronze/silver/gold`
  animation folders, `ICON_BY_ITEM_ID` before it moved to
  `src/lib/itemIcons.ts`) and don't cover icons/currency/panels/nav at
  all. This document supersedes them for planning purposes; updating the
  READMEs themselves is a small follow-up left for the code-integration
  phase, not done here.
- No placeholder art is included here — this is a spec for a human
  illustrator or an image-generation prompt, not new CSS.

## 1. Core technical decisions

Read this section before the per-asset tables — it explains *why* each
one is specified the way it is.

### 1.1 Rendering mode: smooth, not `image-rendering: pixelated`

The current CSS-built art (`CharacterSprite`, `RpgBackground`'s scene
decor) uses flat-color rects with `image-rendering: pixelated` because
it *is* genuinely low-resolution blocky geometry. The reference images
are a different kind of "pixel art" — detailed, shaded, many colors per
character, closer to a modern indie chibi-RPG sprite than literal 8-bit
blocks. Forcing nearest-neighbor scaling on art like that produces
noise, not crispness, especially when it's *downscaled* for a HUD
thumbnail. **New raster assets should be authored at generous
resolution and displayed with the browser's default smooth scaling.**
`pixelated` rendering should be dropped from any element once it starts
rendering a real asset instead of the old flat-rect geometry — that's a
code change for the future integration pass, noted here so it isn't
missed, not something changed now.

### 1.2 Recolor strategy: CSS mask + existing color tokens, not per-color files

`CharacterAppearance` already has 3 skin tones and 5 hair colors
(`src/lib/characterAppearance.ts`'s `SKIN_TONE_SWATCHES` /
`HAIR_COLOR_SWATCHES`). Commissioning a separate painted file per
skin-tone/hair-color combination would mean 1 base-body file ×3 and
4 hair-style files ×5 = 23 files for what is visually the same shape in
different flat colors. Instead:

- **Base body** and **hair** assets are drawn as a single silhouette per
  shape (1 body shape, 4 hair styles), delivered as **white-on-transparent
  alpha masks** (fully opaque white where the shape is, fully transparent
  elsewhere — no internal color/shading baked in for the recolorable
  regions).
- At render time, CSS applies `mask-image: url(...)` +
  `background-color: <token>` using the *exact same* swatch tokens
  already in `characterAppearance.ts` — no new color data, no new files
  per color.
- This does **not** apply to hats/outfits/accessories/face features —
  those are genuinely multi-color painted items (a Golden Crown has gold
  *and* jewel-color details) and are delivered as normal full-color PNGs,
  one per item, no masking.

### 1.3 Character animation: one static pose per layer

`CharacterAnimState` (`idle`/`walking`/`training`/`levelup`) is currently
driven entirely by CSS transforms on a wrapper element (`pixel-bob`,
`pixel-walk`, `pixel-train`, `pixel-levelup` keyframes in `globals.css`),
plus one extra trick: the walking state also toggles opacity on two
separate leg `<rect>`s (`pixel-leg-a`/`pixel-leg-b`) to fake a step cycle.
**Real assets need only one static standing pose per layer** — the
existing wrapper-level CSS transforms (bob/shimmy/scale-pulse/flash)
continue to drive all motion. The isolated leg-swap opacity trick is
dropped (it requires legs to be a separate image layer, which isn't
worth the added asset-production complexity for a subtle effect) — the
wrapper-level walking shimmy alone is enough motion cue. This is a
deliberate scope reduction, not an oversight.

### 1.4 Navigation icons: SVG, not PNG

Every other asset category is raster (PNG) because it needs real
shading/detail. Nav icons are small, simple, and need to switch
appearance for the active/inactive tab state. SVG with `fill="currentColor"`
lets that state switch happen in CSS (matching how `RpgHud.tsx` already
recolors the active tab today) without needing two file variants per
icon, and stays crisp at any size/DPI without export multiples.

### 1.5 Naming convention

File name = the exact identifier the code already uses to look the asset
up, so integration is a lookup-table change, not a rename exercise:
`Item.id` from `src/lib/itemCatalog.ts` for anything item-related,
the `RpgScene` union member for backgrounds, the appearance union
members (`HairStyle`, `EyeStyle`, etc.) for character layers. All
lowercase, hyphenated, matching the TypeScript string literal exactly.

---

## 2. Asset specifications

### 2.1 Home study vignette

| | |
|---|---|
| **Dimensions** | 640×384px (5:3), delivered at that resolution — displayed responsively via `object-fit: cover` inside the existing rounded card |
| **Background** | Opaque — this is a full backdrop scene, not an overlay |
| **Variants** | 1 (`home-desk.png`) |
| **Naming** | `home-desk.png` |
| **Folder** | `public/assets/backgrounds/vignettes/` |
| **Consumes into** | `src/components/rpg/StudyVignette.tsx` |
| **CSS still needed for** | Rounding/clipping the card, the 4 corner-bracket ornaments (§2.8), and — critically — **positioning the character layer on top**, since the scene must stay static while the character reflects the user's actual customization/equipment. The desk/window/books/lamp in the current CSS version are replaced by this one image; the character is *not* baked into it. |
| **Fallback when missing** | Current CSS-built vignette (div-based desk scene in `StudyVignette.tsx`) keeps rendering exactly as it does today until the component is updated to consume this file. |

### 2.2 Timer bounded diorama

| | |
|---|---|
| **Dimensions** | 640×384px, same convention as the Home vignette for consistency |
| **Background** | Opaque |
| **Variants** | 1 required (`timer-study.png`, the active-study state). A second celebratory variant (`timer-complete.png`, brighter palette, matching the existing `field` scene's "payoff" mood) is a natural phase-2 addition but not required to reach parity with Home — flagged, not specified in detail here. |
| **Naming** | `timer-study.png` (+ optional `timer-complete.png` later) |
| **Folder** | `public/assets/backgrounds/vignettes/` |
| **Consumes into** | Not yet built — per `screen-specs.md`'s Phase 5, Timer's diorama is future work. When built, it will be a new component analogous to `StudyVignette.tsx`, consumed by `TimerManager.tsx`/`TimerDisplay.tsx`. |
| **CSS still needed for** | Same as §2.1 — card framing, corner ornaments, character layer positioning on top of the static scene. |
| **Fallback when missing** | Timer is unmodified in the current codebase (still the old full-viewport `library`/`field` `RpgScene` treatment) — nothing regresses if this asset doesn't exist yet, since no component consumes it. |

### 2.3 Character sprite base

| | |
|---|---|
| **Dimensions** | 128×128px canvas — generous headroom above the head for hats, matching the shared canvas every other character layer (§2.4) must align to pixel-for-pixel |
| **Background** | Transparent |
| **Variants** | **1** — a single white-on-transparent alpha-mask silhouette (see §1.2), recolored at render time via the existing `SKIN_TONE_SWATCHES` tokens. Not 3 separate painted files. |
| **Naming** | `body.png` |
| **Folder** | `public/assets/characters/base/` |
| **Consumes into** | `src/features/character/components/CharacterSprite.tsx` |
| **CSS still needed for** | `mask-image` + `background-color` recolor (§1.2), plus all existing wrapper-level animation transforms (§1.3), plus absolute-positioning the face/hair/outfit/accessory/hat layers on top in the documented layer order. |
| **Fallback when missing** | Current inline-SVG rect-grid rendering in `CharacterSprite.tsx` is untouched and keeps working. |

### 2.4 Character layers: hair, face, outfit, accessory, hat

All share the **same 128×128px canvas** as §2.3 and must be drawn
aligned to it (e.g. in a template file with the base body on a guide
layer) so they composite correctly when stacked via absolute
positioning, in the existing layer order: base → face → hair → outfit →
accessory → hat.

| Layer | Variants (from `types/appearance.ts` / `types/item.ts`) | Recolor strategy | Naming | Folder |
|---|---|---|---|---|
| Hair | `short`, `long`, `spiky` (3 files — `bald` renders nothing, no asset) | Alpha mask + `HAIR_COLOR_SWATCHES` (§1.2) | `<hairStyle>.png` | `public/assets/characters/hair/` |
| Eyes | `round`, `sharp`, `sleepy` (3 files) | None — fixed ink color, baked in | `eyes-<eyeStyle>.png` | `public/assets/characters/face/` |
| Nose | `small`, `long`, `button` (3 files) | None — fixed ink color, baked in | `nose-<noseStyle>.png` | `public/assets/characters/face/` |
| Mouth | `neutral`, `smile`, `open` (3 files) | None — fixed ink color, baked in | `mouth-<mouthStyle>.png` | `public/assets/characters/face/` |
| Outfit | `traveler-cloak`, `scholar-robe`, `royal-mantle` (3 items) + 1 `default.png` (bare shirt shown when no outfit is equipped) | None — fully painted per item | `<Item.id>.png` / `default.png` | `public/assets/characters/outfits/` |
| Hat | `straw-hat`, `wizard-hat`, `headband`, `golden-crown` (4 items) | None — fully painted per item | `<Item.id>.png` | `public/assets/characters/hats/` |
| Accessory | `focus-charm`, `lucky-pendant`, `diamond-ring` (3 items) | None — fully painted per item | `<Item.id>.png` | `public/assets/characters/accessories/` |

- **Background**: transparent for every file in this table.
- **Consumes into**: `CharacterSpriteFace.tsx` (eyes/nose/mouth),
  `CharacterSpriteHair.tsx` (hair), `CharacterSprite.tsx` (outfit/hat/
  accessory, currently inline in the same file as the body rect).
- **CSS still needed for**: layer stacking/positioning (unchanged from
  today's approach, just swapping SVG rects for `<img>`/`background-image`
  layers at identical coordinates), hair recolor masking, and all
  existing animation transforms.
- **Fallback when missing**: current SVG-rect rendering in all three
  `CharacterSprite*.tsx` files is untouched.

### 2.5 Shop item icons

| | |
|---|---|
| **Dimensions** | 32×32px pixel grid (per `docs/02_design/prompts/icons.md`'s explicit "32x32 pixels" spec — the one place the prompt docs give a literal pixel count) — delivered as a 128×128px export (4x) so it's crisp on high-DPI screens without upscaling blur, displayed at ~32-40px |
| **Background** | Transparent |
| **Variants** | 1 per catalog item — 10 total, matching `ITEM_CATALOG` exactly: `straw-hat`, `wizard-hat`, `headband`, `golden-crown`, `traveler-cloak`, `scholar-robe`, `royal-mantle`, `focus-charm`, `lucky-pendant`, `diamond-ring` |
| **Naming** | `<Item.id>.png` |
| **Folder** | `public/assets/items/icons/` |
| **Consumes into** | `src/lib/itemIcons.ts` (replacing `ICON_BY_ITEM_ID`'s emoji values), read by `ShopItemCard.tsx` |
| **CSS still needed for** | The existing icon-backdrop square in `InventorySlot.tsx` (border/rounding/background) — the icon just becomes an `<img>` inside it instead of an emoji character. |
| **Fallback when missing** | `ICON_BY_ITEM_ID` emoji map in `itemIcons.ts` keeps rendering as-is; `ShopItemCard.tsx`'s `ICON_BY_ITEM_ID[item.id] ?? "🎁"` fallback already handles any item without an entry. |

**Note**: this is a *distinct* asset from the character-equip-layer art
in §2.4's Outfit/Hat/Accessory rows, even though both are named after
the same `Item.id`. §2.5 is a standalone catalog-icon presentation (item
shown on its own, like a shop thumbnail); §2.4 is the same item
pre-cropped/positioned to overlay correctly on the character canvas.
They will very likely share a source illustration in production (paint
the item once, crop two ways) but are delivered as two separate files in
two separate folders.

### 2.6 Inventory slot icons

Not a separate asset category — **identical to §2.5**. `InventorySlot.tsx`
is a shared component rendering whatever `icon` prop `ShopItemCard.tsx`
passes it, and owned items use the exact same catalog icon whether shown
in the "buy" or "equip/unequip" state. No additional files needed beyond
§2.5's 10 icons.

### 2.7 Background decorative elements

Replaces the flat-color CSS shapes in `RpgBackground.tsx`'s `RoomDecor`/
`TownDecor`/`LibraryDecor`/`FieldDecor` functions with small reusable
sprite elements, kept in the same "decorations only around edges, large
empty center" composition those functions already use (per
`prompts/background.md`).

| Element | Dimensions | Used in scene(s) |
|---|---|---|
| `tree.png` | 64×80px | `field` |
| `cloud.png` | 96×48px | `field` |
| `house-a.png` / `house-b.png` / `house-c.png` | ~80×70px each, 3 silhouette variants for skyline variety | `town` |
| `bookshelf.png` | 96×96px | `room`, `library` |
| `window.png` | 64×64px | `room` |

- **Background**: transparent for all.
- **Naming/folder**: `public/assets/backgrounds/decor/<name>.png` — names
  are descriptive (not tied to a TS union) since each scene composes
  several of them, unlike the 1-scene-1-file vignettes in §2.1/§2.2.
- **Consumes into**: `src/components/rpg/RpgBackground.tsx`'s per-scene
  decor functions — each `<div style={{backgroundColor: "#..."}}>` becomes
  an `<img>`/`background-image` reference to one of these files, same
  absolute positioning already in place.
- **CSS still needed for**: all existing positioning (`absolute
  bottom-3`, per-element offsets), the drifting-cloud animation
  (`animate-pixel-drift`), and the `quiet` scene correctly continues to
  use *none* of these (it has no decor function to begin with).
- **Fallback when missing**: current flat-color/clip-path CSS shapes in
  each decor function are untouched.

### 2.8 Panel ornaments

| | |
|---|---|
| **Dimensions** | `corner-bracket.png`: 24×24px. `title-tag.png`: 160×40px (a horizontal banner shape sized for a page-title chip, per the wood-tag label seen on every panel in `references/ui/*.png`) |
| **Background** | Transparent |
| **Variants** | 1 each — `corner-bracket.png` is reused 4× per panel via CSS `transform: rotate(90deg/180deg/270deg)` for the other 3 corners, not 4 separate files |
| **Naming** | `corner-bracket.png`, `title-tag.png` |
| **Folder** | `public/assets/panels/` |
| **Consumes into** | `corner-bracket.png`: `src/app/page.tsx` (Home hero) and `src/components/rpg/StudyVignette.tsx`, replacing the current CSS-border corner marks. `title-tag.png`: `src/components/rpg/PageTitle.tsx`, as the chip's background in place of its current flat `bg-rpg-parchment` + border. |
| **CSS still needed for** | Positioning (`absolute` corners) and rotation for `corner-bracket.png`; text remains a real HTML element layered on top of `title-tag.png` (never baked into the image, so it stays localizable/selectable/accessible). |
| **Fallback when missing** | Current CSS-only corner marks (`border-t-2 border-l-2`, etc.) and `PageTitle`'s flat bordered chip are untouched. |

### 2.9 Currency and reward icons

| | |
|---|---|
| **Dimensions** | 48×48px canvas, delivered at that resolution |
| **Background** | Transparent |
| **Variants** | `coin.png`, `diamond.png`, `xp-star.png` (a reward/level-up icon — currently a plain sparkle CSS dot in `SessionSummary.tsx`/`CharacterSprite.tsx`'s level-up state) |
| **Naming** | `coin.png`, `diamond.png`, `xp-star.png` |
| **Folder** | `public/assets/currency/` |
| **Consumes into** | `src/features/character/components/CurrencyDisplay.tsx`, `src/components/rpg/RpgHud.tsx` (inline currency text), `src/components/rpg/InventorySlot.tsx` (price chip), `src/features/timer/components/SessionSummary.tsx` (reward line) |
| **CSS still needed for** | Sizing/spacing inline with text (these replace the 🪙/💎 emoji characters directly in text flow, so they need `inline-block` + `vertical-align` tuning to sit correctly next to a number) |
| **Fallback when missing** | Emoji (🪙💎) keep rendering everywhere currency is shown today; the CSS sparkle-dot level-up effect is untouched. |

### 2.10 Navigation icons

| | |
|---|---|
| **Dimensions** | 24×24 SVG viewBox (vector, not a fixed raster size — see §1.4) |
| **Background** | Transparent (SVG has no background layer) |
| **Variants** | 1 per nav destination — 6 total: `home`, `subjects`, `timer`, `character`, `shop`, `dashboard` |
| **Naming** | `<route-name>.svg` (matches the route segment, e.g. `subjects.svg` for `/subjects`) |
| **Folder** | `public/assets/nav/` |
| **Consumes into** | `src/components/rpg/RpgHud.tsx`'s `NAV_LINKS` array (replacing each entry's emoji `icon` field) |
| **CSS still needed for** | `fill: currentColor` driving the active/inactive color swap (already how the active-tab text color is decided today — same `text-rpg-ink` vs `text-rpg-ink-soft` class toggle now also colors the icon), plus the small active-state dot indicator, which stays a plain CSS-drawn circle, not part of the icon art. |
| **Fallback when missing** | Emoji icons (🏠📚⏱️🧑🛍️📊) in `NAV_LINKS` keep rendering as-is. |

---

## 3. Complete folder tree

```
public/assets/
  backgrounds/
    decor/
      tree.png
      cloud.png
      house-a.png
      house-b.png
      house-c.png
      bookshelf.png
      window.png
    vignettes/
      home-desk.png
      timer-study.png
      timer-complete.png        (optional, phase 2)
  characters/
    base/
      body.png                  (alpha mask, recolored via CSS)
    hair/
      short.png                 (alpha mask, recolored via CSS)
      long.png
      spiky.png
    face/
      eyes-round.png
      eyes-sharp.png
      eyes-sleepy.png
      nose-small.png
      nose-long.png
      nose-button.png
      mouth-neutral.png
      mouth-smile.png
      mouth-open.png
    outfits/
      default.png
      traveler-cloak.png
      scholar-robe.png
      royal-mantle.png
    hats/
      straw-hat.png
      wizard-hat.png
      headband.png
      golden-crown.png
    accessories/
      focus-charm.png
      lucky-pendant.png
      diamond-ring.png
  items/
    icons/
      straw-hat.png
      wizard-hat.png
      headband.png
      golden-crown.png
      traveler-cloak.png
      scholar-robe.png
      royal-mantle.png
      focus-charm.png
      lucky-pendant.png
      diamond-ring.png
  currency/
    coin.png
    diamond.png
    xp-star.png
  panels/
    corner-bracket.png
    title-tag.png
  nav/
    home.svg
    subjects.svg
    timer.svg
    character.svg
    shop.svg
    dashboard.svg
```

Total: **~48 raster files + 6 SVGs** for full parity across every screen
currently shipped, plus the Home vignette. The single biggest lever for
perceived quality is §2.3/§2.4 (the character system, ~20 files) and
§2.1 (the Home vignette, 1 file) — those two are what's currently most
visibly "CSS-shape-made" against the references.

## 4. Fallback behavior (cross-cutting summary)

Every category above degrades to its **current, already-shipped**
CSS/emoji placeholder when its file doesn't exist — nothing in this
document requires an all-or-nothing swap. That means assets can be
produced and integrated incrementally, category by category, without a
big-bang cutover, and the app never has a broken/missing-image state in
the interim (no code will attempt to load these files until the future
integration pass explicitly points a component at them).

## 5. Suggested production order

1. **Character system** (§2.3, §2.4) — highest visual impact, appears on
   every screen via the HUD thumbnail alone.
2. **Home study vignette** (§2.1) — the screen most recently redesigned
   around a CSS placeholder built specifically to be replaced.
3. **Shop/inventory item icons** (§2.5/§2.6) — self-contained, no
   dependency on the character system, meaningfully upgrades the Shop
   screen on its own.
4. **Currency/reward icons** (§2.9) and **nav icons** (§2.10) — small in
   count, appear everywhere (HUD), quick win once the palette/style is
   locked in from steps 1-2.
5. **Panel ornaments** (§2.8) — a finishing detail, best done once the
   character/vignette art establishes the final line-weight and shading
   style to match.
6. **Background decorative elements** (§2.7) and **Timer diorama**
   (§2.2) — lowest urgency; `quiet`-scene screens (Home, Subjects, Shop,
   Dashboard, Character Customization) don't use scene decor at all per
   `screen-specs.md` §4, and Timer hasn't been redesigned yet.
