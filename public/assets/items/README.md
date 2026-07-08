# Item icon assets (future)

No files here yet — the shop/inventory UI uses emoji icons
(`ICON_BY_ITEM_ID` in `src/features/shop/components/ShopItemCard.tsx`), not
per-item image files.

When item art is ready, name files after `Item.id` in
`src/lib/itemCatalog.ts` so they can be looked up directly:

```
items/
  straw-hat.png
  wizard-hat.png
  headband.png
  golden-crown.png
```
