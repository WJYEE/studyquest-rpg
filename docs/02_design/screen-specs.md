# Screen-Level Design Specification

Concrete, screen-by-screen redesign plan. `design-principles.md` is the
*why*, `art-direction.md` is the app-wide visual language (tokens,
panels, buttons, typography), and **this document is the *where*** —
how that language applies to each of the app's eight screens, and in
what order to build it.

**Status: planning document. No application code has changed as a
result of this doc.** Phase 1 (tokens/typography/`WindowFrame`/`Button`)
and Phase 2 (`PageTitle`/`Input`/chart tooltip/`InventorySlot` icon
backdrop consistency) from `art-direction.md` §8 are already shipped.
Everything below is Phase 3 and later.

**Diagnosis.** The previous two passes fixed *material* consistency
(color, shape, shadow) but not *composition* — every screen still uses
the same "page title chip + stacked full-width cards" layout regardless
of what it's for, the character still renders full-size on Home/Timer/
HUD simultaneously, and no screen has a real focal hierarchy. That's why
it still reads as "a generic web app with a new coat of paint" rather
than a distinctive product. This spec's job is to give each screen its
own deliberate composition, pulled directly from the references, while
keeping the plain screens (Subjects, Dashboard) *deliberately plain*.

---

## 1. Reference-by-reference breakdown

For each reference: what to adopt, what not to adopt, how it translates
to StudyQuest, and the usability guard-rail that keeps it from
regressing clarity.

### 1.1 `references/ui/ChatGPT Image Jul 11, 2026, 04_29_04 PM.png` and `04_33_36 PM.png` — full UI mockup sheets

**Adopt**
- Panel identity: rounded-rect card, cream fill, thin warm border, soft
  shadow, plus a small wood-tone **label tab** sitting on the panel's top
  edge (e.g. "상태창", "타이머 설정 모달"). This is the concrete next step for
  `WindowFrame`/`PageTitle` beyond what's already shipped.
- Button shape: rounded/pill primary actions ("확인", "구매하기",
  "시작하기") — flat pastel fill, minimal border, a real text label.
- The timer hero pattern ("타이머/공부 진행 UI"): big legible digits *on
  top of* a small illustrated scene, not floating on a bare page.
- The quest-row anatomy: icon + title + inline progress bar + reward
  chip, one row. Reusable for Dashboard's stat tiles or a future daily
  goal — the row shape, not the tab categorization.
- Session-complete card: celebratory glow behind the mascot, a clean
  2-column stat readout, one confirm button.
- Bottom nav: one rounded pill container holding 5-6 icon+label tabs,
  current tab shown as a filled pill — much more compact than a
  full-width bordered tab strip.
- A single small mascot speech-bubble in one corner for light tips —
  used *once*, not throughout.

**Do not adopt**
- HP/MP bars with heart/droplet icons on the "상태창" panel — battle-stat
  vocabulary, explicitly excluded.
- The multi-category inventory (장비/소비/재료/기타) implying dozens of
  item types — StudyQuest has 3 equipment slots; adopt the grid/tab
  *shape* only, not the catalog breadth.
- The NPC dialogue tree with numbered reply choices — implies a
  quest-giving NPC/branching conversation, i.e. exploration content.
- The dense "퀵 액션 위젯" sidebar of stacked colored buttons — too many
  peer actions competing at once for a focused single-purpose screen.
- The stacked column of always-visible toast badges — fine as transient
  feedback, not as permanent chrome.

**Translate**: panel-plus-label-tab → `WindowFrame`/`PageTitle` next
iteration. Pill nav → the shared shell's nav bar (§3). Timer hero →
Timer/Focus screen (§5.2). Quest row → Dashboard stat tiles (§5.4).

**Usability guard-rail**: keep every label as real text (icon-only
controls only where the icon is unambiguous, e.g. pause/close); never
let the wood-tag be a panel's *only* heading.

### 1.2 `references/backgrounds/ChatGPT Image Jul 11, 2026, 04_05_55 PM.png` — study-vignette-with-mascot sheet

The single most directly relevant reference in the whole set: 12 cards,
each a small round mascot sitting at a desk inside a distinct cozy
backdrop (나의 공부방, 숲속 공부터, 도서관, 호숫가 공부터, 집중의 하늘섬,
카페 공부존, 달빛 공부터, 바닷가 공부터, 교실, 학원 마을, 나의 학습 플래너,
목표 달성의 성소).

**Adopt**
- The core composition rule: desk + character, centered-low, with 2-3
  simple background props above/behind — this *is* the "bounded pixel
  diorama" concept from `art-direction.md` §3, now with a concrete
  reference image.
- The idea of swappable backdrop *skins* behind one consistent
  composition (forest/library/lake/cafe) — a plausible future
  personalization axis, not required now.
- The small Lv./coin/diamond HUD chip tucked in one corner of "나의 학습
  플래너" — confirms (doesn't change) the already-planned compact shell
  badge strip.

**Do not adopt**
- Painterly, high-detail rendering (cherry blossoms, moonlit castle
  skyline, glowing shrine crystal) — far too rich for a UI backdrop that
  must stay quiet behind real content, and inconsistent with the
  project's CSS/SVG-only "no real art yet" constraint.
- "목표 달성의 성소" (glowing shrine) and "학원 마을" (castle hub-map) —
  overtly fantasy/exploration-coded, reads as a full RPG game.
- "교실" (classroom with empty desks) — implies a school/teacher context
  outside StudyQuest's actual feature set.
- Anything requiring "travel" between illustrated locations to reach a
  feature — StudyQuest navigates via the nav bar, not by walking through
  a world.

**Translate**: one simplified diorama composition (desk + character +
2-3 flat/soft-shaded props, no dramatic lighting) becomes the Timer
screen's hero visual, and a lighter variant becomes the Character
screen's portrait backdrop.

**Usability guard-rail**: the diorama is decoration behind the timer
digits/stats, never a competing focal point — digits stay the largest,
highest-contrast element on the Timer screen regardless of diorama detail.

### 1.3 `references/backgrounds/ChatGPT Image Jul 11, 2026, 04_09_26 PM.png` — plain scenic backdrop sheet

15 landscape/interior plates, no character, single-word labels (숲 속
길, 푸른 잔디밭, 맑은 하늘, 평화로운 해변, 나의 방, 공부 책상, 동굴 입구,
사막 지역, 눈 덮인 들판, 별이 빛나는 밤, etc.).

**Adopt**: "나의 방"/"공부 책상" (room/desk, no character) as a reference
for what a *quiet* backdrop could look like if the Character screen ever
wants a touch more than flat cream without a full diorama.

**Do not adopt**: the seasonal/biome breadth (desert, snow, cave, starry
night, tropical beach) — general-purpose RPG backdrop variety StudyQuest
has no use for. Full-bleed viewport treatment — every plate here is
meant to fill the whole screen, which contradicts "one small diorama,
not a world."

**Translate**: only the room/desk pairing is relevant, and only as a
secondary option for Character, not a requirement.

### 1.4 `references/backgrounds/ChatGPT Image Jul 11, 2026, 04_03_09 PM.png` — whimsical nature vignettes

**Adopt**: mood confirmation only — soft greens/blues, no UI or combat
noise, reinforces the palette direction already codified.

**Do not adopt**: floating sky islands, a giant whale, ruined temple in
clouds — surreal high-fantasy content, reads as a full RPG game. Any
full-viewport garden/forest scene.

**Translate**: none directly; mood-board reference only.

### 1.5 `references/backgrounds/ChatGPT Image Jul 11, 2026, 04_02_03 PM.png` and `04_02_13 PM.png` — classic JRPG tile sheets

**Adopt**: nothing content-wise. Pure rendering-technique reference — if
StudyQuest ever produces real custom pixel art, this shows how tile-art
achieves depth via layered foliage/shadow and a consistent light source.

**Do not adopt** (explicit, per the brief): throne rooms, skeletons,
lava, treasure hoards, knight-statue guards, mine-cart tunnels,
multi-tile explorable villages — none of this belongs in StudyQuest.

**Translate**: none. Flagged as background reading only, should not
visibly influence any shipped screen.

### 1.6 `references/characters/ChatGPT Image Jul 11, 2026, 04_22_19 PM.png` — study-persona character sheet

**Adopt**
- Chibi proportion: large head-to-body ratio, simple rounded features,
  soft cel-shading — the target proportion system, replacing
  `CharacterSprite`'s current blocky rect-grid.
- The costume/persona vocabulary: 학생(student)/독서마스터(reading
  master)/필기노트(note-taker)/집중의달인(focus master)/과목별전문가(subject
  expert)/시험목표(exam goal)/디지털러너(digital learner)/카페스터디(cafe
  studier)/휴식힐링(rest & healing) — direct source for shop item
  hat/outfit/accessory flavor.
- The "휴식 & 힐링" row's small pet options (cat, dog, healing slime) —
  concrete precedent for the "future pet/companion option" already
  flagged in `art-direction.md` §2.

**Do not adopt**: the "특별한 컨셉 친구들" row's more fantasy-leaning
costumes (마법사 학생=wizard student, 기사 수험생=knight examinee, 해적
선장=pirate captain) — reintroduces class-fantasy flavor the brief wants
minimized. Keep only the clearly study/lifestyle-coded ones (시간
관리왕=time-management, 저녁의 공부러=night owl, 아침형 인간=morning
person, 주말의 여유=weekend relaxer are all fine; wizard/knight/pirate are
not).

**Translate**: the 9 core personas + rest/healing row become the actual
outfit-slot names and art direction for Shop and Character
Customization, replacing today's generic tunic/hat vocabulary.

### 1.7 `references/characters/ChatGPT Image Jul 11, 2026, 04_19_14 PM.png` — fantasy class roster sheet

**Adopt**: rendering technique only — consistent chibi proportion across
a full turnaround, readable silhouettes at small size. The
hairstyle/hair-color/eye-shape/outfit-color **horizontal swatch-row**
layout is a directly reusable UI pattern — `CharacterCustomizer.tsx`
already uses this exact pattern; this reference simply confirms it.

**Do not adopt**: the class vocabulary (전사=warrior, 기사=knight,
마법사=mage, 힐러=healer, 궁수=archer, 도적=rogue, 연금술사=alchemist,
음유시인=bard, 소환사=summoner, 드루이드=druid) and their weapon/shield/staff
props — pure combat-class content, fully excluded.

**Translate**: swatch-row pattern only; no change needed to
`CharacterCustomizer.tsx` beyond what's already shipped.

### 1.8 `references/icons/ChatGPT Image Jul 11, 2026, 04_26_01 PM.png` — icon pack sheet

**Adopt**: rendering technique (soft-rounded pixel icons, consistent
warm single-light shading, readable at ~32px) as the quality bar for any
future custom iconography. The 코인/재화 (coin/currency) row and the 기타
UI 아이콘 (generic arrow/check/x/pause/home/settings glyphs) rows are
directly reusable content.

**Do not adopt**: the 무기(weapons) row and 방패(shields) row entirely —
excluded per the brief. The 상태 효과/버프 (buff/status: fire, lightning,
poison, HP, MP) row — battle-status vocabulary. The 아이템/재료 (raw
crafting materials: ore, log, mushroom, bone, fang) row — implies a
crafting system StudyQuest doesn't have.

**Translate**: only currency icons and generic UI glyphs are directly
relevant. Study-specific icon vocabulary (book, notebook, pencil,
hourglass, coffee, backpack, headphones, laptop) already comes from
`art-direction.md` §5 — this sheet is a technique reference for *that*
list, not a source of new item types.

### 1.9 `references/color-palettes/image.png` — "RPG Palettes" swatch chart

**Adopt**: nothing literal — already established in `design-principles.md`
as a ramp-construction *technique* reference only.

**Do not adopt**: every named palette (Inner Dungeon, Swamp, Koopa King,
Blood Moon, Escape the Volcano, etc.) — all fantasy/dungeon-themed
and/or too saturated for "comfortable for long study sessions."

**Translate**: none. `moodboard.md` / `art-direction.md` §4's cream +
forest-green + pastel palette (already implemented) remains the sole
source of truth.

### 1.10 `prompts/*.md`

Already folded into `art-direction.md` in the previous pass — consistent
with the direction above, no new information. Pointer only.

---

## 2. Cross-cutting usability rules

These apply to every translation above, not just individual references:

1. **One hero element per screen.** If a screen has a diorama, digits,
   *and* a stat strip all competing for attention, the diorama loses —
   background decoration never outranks the data the user came for.
2. **Real text labels**, not icon-only controls, except for universally
   unambiguous glyphs (×, ▾, pause/play).
3. **WCAG AA contrast** holds regardless of how pastel the fill —
   already the rule in `art-direction.md` §4, restated here because
   screen-level decorative elements are the most likely place to
   accidentally violate it.
4. **Standard interaction patterns** underneath the skin: forms behave
   like forms, buttons behave like buttons, nothing requires "exploring"
   to discover (no hidden click targets on decorative art).
5. **`prefers-reduced-motion` still holds** — any new diorama-level
   idle animation (a candle flicker, a page turning) must respect it
   exactly like the existing character animations do.

---

## 3. Shared StudyQuest shell

One shell wraps every screen, replacing the current per-page
`RpgBackground` + ad hoc heading pattern:

- **Status strip** (persistent, top): one compact rounded pill/card —
  small character *thumbnail* (not the full sprite), level chip, a thin
  XP sliver, coin chip, diamond chip. Single row, not the current
  3-row HUD.
- **Nav bar** (persistent, below the status strip): a row of icon+label
  pills, current page shown as a filled pill — replaces the current
  square `border-2` tab strip.
- **Content area**: every screen's content sits in one primary
  `WindowFrame`-style panel (with the new label-tab treatment from §1.1)
  or, where a screen needs peer panels (Shop, Dashboard), a simple
  vertical/grid stack of same-language panels — never a second heavy
  frame nested inside the first.
- **Background**: flat quiet cream by default (§4); only Timer and
  Character opt into the bounded-diorama variant.
- **No additional persistent chrome** — no footer, no floating action
  button, no always-visible toast rail.

---

## 4. Background assignment

| Treatment | Screens |
|---|---|
| Quiet flat cream | Home, Subjects, Dashboard, Shop, Inventory, Character Customization |
| Bounded pixel diorama (primary, full detail) | Timer / Focus |
| Bounded pixel diorama (secondary, lighter/quieter) | Character |

Character Customization is deliberately excluded from the diorama list
even though it shows the character full-size: the user needs a neutral
backdrop to judge fine appearance changes without a scene competing for
attention.

---

## 5. Screen specifications

### 5.1 Home

- **Main visual hierarchy**: (1) app identity, (2) one primary CTA, (3)
  at-a-glance status, (4) secondary entry point.
- **Layout structure**: one hero panel (wordmark + tagline + primary
  pill CTA + secondary outline CTA), then a compact "today at a glance"
  stat row below it. No feature-highlight marketing list.
- **Character placement**: none in the page body — the shell's status-
  strip thumbnail is sufficient; a full-size character on Home duplicates
  the Character screen's job and violates the "one primary home" rule
  in `art-direction.md` §2.
- **Background**: quiet cream.
- **Panel composition**: one hero `WindowFrame` + one small 2-tile stat
  row (reusing `TodayStat`/`StreakStat`).
- **Primary action placement**: single dominant pill CTA ("Start
  Studying") centered in the hero panel; "Manage Subjects" as a
  lower-emphasis outline pill beneath it.
- **RPG elements to include**: streak flame icon in the at-a-glance row.
- **RPG elements to exclude**: full-size character, the 🕹️/🧙/🛒/📊
  feature-highlight grid, adventurer copy.
- **Mobile layout**: single column; hero panel full-width; CTA buttons
  stack vertically below ~360px; stat row stays 2-up.
- **Components to change**: `app/page.tsx` — remove `CharacterSprite`
  and the "Lv." line, add reused `TodayStat`/`StreakStat`, drop the
  `FEATURE_HIGHLIGHTS` grid.

### 5.2 Timer / Focus

- **Main visual hierarchy**: (1) timer digits, (2) the diorama
  (supporting, not competing), (3) session controls, (4) subject context.
- **Layout structure**: single column — subject selector (compact, top)
  → one hero card containing the diorama with digits overlaid/beside it
  → controls row below, all inside one primary panel (not three separate
  boxes floating on a full-viewport scene).
- **Character placement**: inside the bounded diorama, small, seated,
  idle animation only.
- **Background**: page background is quiet cream; the diorama is the
  only illustrated element, scoped to the hero card — not a full-
  viewport gradient+scene.
- **Panel composition**: one primary `WindowFrame` hosting subject
  selector, diorama/timer, and controls as internal sections.
- **Primary action placement**: Start/Pause/Claim as a pill row directly
  under the diorama card; "Claim Reward" visually primary when available.
- **RPG elements to include**: the diorama itself, a small XP/coin
  preview line, the existing sparkle + count-up session-complete
  celebration.
- **RPG elements to exclude**: full-viewport scene background, any
  character animation state beyond idle-in-diorama plus the existing
  complete-state celebration.
- **Mobile layout**: diorama scales down but keeps a minimum readable
  digit size; the control row wraps to two lines before shrinking touch
  targets.
- **Components to change**: `TimerManager.tsx` (remove the full-viewport
  scene switch and standalone character block; compose everything inside
  one panel), `RpgBackground.tsx` (needs a new bounded-diorama
  variant/prop — the single largest new capability in this whole plan),
  `TimerDisplay.tsx` (host the diorama alongside the digits).

### 5.3 Subjects

- **Main visual hierarchy**: (1) add-subject action, (2) subject list —
  intentionally the plainest screen in the app.
- **Layout structure**: unchanged — form row + vertical list, already
  correct after Phase 1/2.
- **Character placement**: none.
- **Background**: quiet cream.
- **Panel composition**: form row as one slot panel, each subject as its
  own slot panel.
- **Primary action placement**: "Add Subject" pill inline at the end of
  the form row (unchanged).
- **RPG elements to include**: the existing per-subject level/XP/minutes
  caption — the one legitimate growth signal for this screen.
- **RPG elements to exclude**: any per-subject character, diorama, or
  decorative icon beyond a plain subject glyph.
- **Mobile layout**: already single-column and narrow-safe.
- **Components to change**: none required beyond shell inheritance;
  optionally revisit the rename-trigger's dotted-underline affordance
  for consistency with the softer language elsewhere.

### 5.4 Dashboard

- **Main visual hierarchy**: today → streak → weekly trend → per-subject
  breakdown, a clear top-to-bottom zoom-out.
- **Layout structure**: unchanged section order (already correct):
  2-col stat tiles, weekly chart panel, subject-breakdown panel.
- **Character placement**: none — the most "plain productivity" screen
  in the app by design.
- **Background**: quiet cream.
- **Panel composition**: unchanged; already using the redesigned
  `WindowFrame`/tooltip from Phase 1/2.
- **Primary action placement**: none — read-only screen, correct as-is.
- **RPG elements to include**: streak flame icon, gold-accent chart bars
  (already shipped).
- **RPG elements to exclude**: any achievement-badge grid, character
  cameo, or diorama — this screen should read the most like "a clean
  study-recording application" of all eight.
- **Mobile layout**: stat grid already 2-up; chart already responsive.
- **Components to change**: none — this screen is effectively done,
  which is why it's last in the implementation order.

### 5.5 Character

- **Main visual hierarchy**: character → level/XP → equipment slots →
  currency → customize entry point.
- **Layout structure**: single centered column, current order already
  close to correct.
- **Character placement**: full-size, centered, primary hero — the one
  screen (besides Customization) where this is appropriate.
- **Background**: page stays quiet cream; the portrait itself sits on a
  small, *lighter* bounded diorama than Timer's (e.g. a soft desk/shelf
  backdrop, not the full desk-and-props scene).
- **Panel composition**: one `StatusWindow`-style primary panel;
  equipment slots as 3 small chips in a row inside it (existing pattern).
- **Primary action placement**: "Customize Appearance" pill at the
  bottom, secondary-styled (a navigation action, not the page's purpose).
- **RPG elements to include**: full character, level/XP bar, equipment
  slots, currency — intentionally the most RPG-forward screen in the app.
- **RPG elements to exclude**: quest log, stat-point allocation, HP/MP,
  or any combat-class stat row.
- **Mobile layout**: single column; equipment row stays 3-across with
  tighter gaps on very narrow screens rather than wrapping to 2+1.
- **Components to change**: `CharacterStatus.tsx`/`StatusWindow.tsx`
  (add the lighter bounded-diorama backdrop, sharing the capability
  built for Timer), `CharacterSprite.tsx` (chibi-proportion redesign,
  shared with Customization).

### 5.6 Character Customization

- **Main visual hierarchy**: live preview first, then pickers grouped
  logically (appearance: skin/hair; face: eyes/nose/mouth) rather than
  one flat list of six.
- **Layout structure**: preview pinned near the top (unchanged), pickers
  below with light sub-grouping via spacing/subheadings.
- **Character placement**: full-size preview, primary focus, on a
  *neutral* background so appearance details read clearly.
- **Background**: quiet cream — no diorama, the one explicit exception
  among the "character appears" screens.
- **Panel composition**: one primary `WindowFrame`; each option row
  already a correctly-styled slot (unchanged).
- **Primary action placement**: none needed — immediate-apply-per-click
  is good UX here and should stay; "Back to Character" remains the only
  navigation action, secondary-styled.
- **RPG elements to include**: character preview, swatch pickers.
- **RPG elements to exclude**: diorama, currency/shop upsell (that's
  Shop's job), any decorative flourish beyond the swatches.
- **Mobile layout**: already functional single-column; verify swatch-row
  wrapping at ~360px.
- **Components to change**: `CharacterCustomizer.tsx` (light
  grouping/subheading pass only), shares `CharacterSprite.tsx`'s redesign
  with Character.

### 5.7 Shop

- **Main visual hierarchy**: currency → item grid → per-item action.
- **Layout structure**: currency prominent at the top, then the item
  grid. Category tabs (by slot: Hats/Outfits/Accessories) are a natural
  next step once the catalog grows past ~12 items; the current 10-item
  catalog is still fine as a single ungrouped grid.
- **Character placement**: none — Shop is about items, not the
  character.
- **Background**: quiet cream.
- **Panel composition**: replace the `DialogBox` "Merchant" NPC-textbox
  wrapper with a plain header row (title + currency chips) — the
  wood-shelf-textured item grid already carries enough "shop" identity
  on its own. This directly implements
  `design-principles.md`'s "minimize NPC textbox framing and adventurer
  copy" for this specific screen.
- **Primary action placement**: per-item Buy/Equip button, bottom of
  each card (existing pattern) — no single page-level primary action.
- **RPG elements to include**: coin/diamond chips, the wood-shelf grid
  texture, the pixel-styled "equipped" ribbon (kept, per the standing
  exception).
- **RPG elements to exclude**: the "Merchant"/"Welcome, adventurer!"
  NPC framing and voice; any weapon/shield/potion iconography beyond
  the existing hat/outfit/accessory set.
- **Mobile layout**: grid already responsive 2-col; future category tabs
  should scroll horizontally on narrow widths rather than wrap.
- **Components to change**: `ShopManager.tsx` (replace `DialogBox`
  wrapper with a plain header row); `InventoryPanel.tsx`/
  `InventorySlot.tsx`/`ShopItemCard.tsx` unchanged (already redesigned).

### 5.8 Inventory (owned items)

Currently not a distinct screen — owned items render inline in the Shop
grid, distinguished only by the card's button switching from "Buy" to
"Equip"/"Unequip."

- **Recommendation**: a lightweight **tab within the Shop screen**
  ("Shop" / "My Items"), not a new top-level nav route — keeps the
  existing 6-item nav from growing to 7, and mirrors the reference's own
  pairing of "상점(Shop)" and "인벤토리" as adjacent panels rather than
  distant destinations.
- **Main visual hierarchy**: currently-equipped items → owned-but-
  unequipped items → (implicitly) a path back to the Shop tab for more.
- **Layout structure**: same wood-shelf grid as Shop, filtered to
  `ownedItemIds`, equipped items sorted first.
- **Character placement**: none directly in the grid; consider a small
  equipped-summary strip at the top (reusing the 3-chip equipment
  readout already built for `CharacterStatus`) so equipped state is
  visible without leaving the tab.
- **Background**: quiet cream (same screen as Shop).
- **Panel composition**: same grid panel as Shop; the equipped-summary
  strip (if added) is one slot-row above the grid.
- **Primary action placement**: none page-level; per-item Equip/Unequip
  buttons (existing pattern).
- **RPG elements to include**: equipped ribbon, proposed equipment-
  summary strip, currency chips (visible via the shared header).
- **RPG elements to exclude**: same as Shop — no NPC framing, arguably
  even less appropriate here since this is "my stuff," not "browsing a
  merchant."
- **Mobile layout**: same grid as Shop; the Shop/My Items tab switcher is
  a full-width 2-segment control on narrow screens.
- **Components to change**: `ShopManager.tsx` (add tab switcher, filter
  the catalog view — the one screen in this spec implying new UI
  structure, not pure restyling); reuse or extract `CharacterStatus.tsx`'s
  equipment-chip markup for the proposed summary strip.

---

## 6. Prioritized implementation order

| Phase | Scope | Why here |
|---|---|---|
| 3 | Shared shell — compact status strip + pill nav (§3) | Highest leverage: every screen depends on the shell being right first. |
| 4 | Home (§5.1) | Small, high first-impression value; mostly a shrink/simplify pass using components that already exist. |
| 5 | Timer / Focus (§5.2) | The core product screen; needs the new bounded-diorama capability — the single largest genuinely-new asset in this plan, worth its own focused phase. |
| 6 | Character + Character Customization (§5.5, §5.6) | Paired because Customization directly previews Character; the chibi-proportion sprite redesign is the biggest asset-level lift after the diorama. |
| 7 | Shop + Inventory (§5.7, §5.8) | Paired because Inventory is proposed as a Shop tab; mostly panel/grid polish reusing already-redesigned components, plus one new tab-switcher structure. |
| 8 | Subjects + Dashboard (§5.3, §5.4) | Lowest visual-identity need by design — these should stay the plainest screens; effectively just inherit the shell. |
| 9 | Documentation sync | Rewrite `ui_design.md` to describe the shipped reality once Phases 3-8 land; retire its "aspiration" framing. |

Ordering logic: shell first (it touches everything), then screens
ordered by a combination of (a) how much genuinely *new* visual work
they need — diorama and character-art work outranks pure panel
rearrangement — and (b) product visibility. Subjects and Dashboard are
last on purpose: `design-principles.md` already asks for them to be the
most "plain productivity" screens, so they need the least additional
treatment.
