# Character assets (future)

No files here yet — v1.1 renders characters as an inline SVG placeholder
(`src/features/character/components/CharacterSprite.tsx`), not image files.

When real sprite art is ready, drop it in here using this naming convention
so it lines up with the existing tier/level logic in `CharacterSprite.tsx`
(`tierForLevel`):

```
characters/
  base/
    bronze.png   # level < 10
    silver.png   # level 10-24
    gold.png     # level 25+
  hats/
    <item-id>.png   # matches Item.id in src/lib/itemCatalog.ts
```

Swapping placeholder art for real files should only require changing
`CharacterSprite.tsx` — no call-site changes.
