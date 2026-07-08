# Character assets (future)

No files here yet — characters render as an inline SVG placeholder
(`src/features/character/components/CharacterSprite.tsx`), not image files.

When real sprite art is ready, drop it in here using this naming convention
so it lines up with the existing tier/animation-state logic in
`CharacterSprite.tsx` (`tierForLevel`, `CharacterAnimState`):

```
characters/
  base/
    bronze/{idle,walk,train,levelup}.png   # level < 10
    silver/{idle,walk,train,levelup}.png   # level 10-24
    gold/{idle,walk,train,levelup}.png     # level 25+
  hats/
    <item-id>.png   # matches Item.id in src/lib/itemCatalog.ts
```

Swapping placeholder art for real files should only require changing
`CharacterSprite.tsx` — no call-site changes.
