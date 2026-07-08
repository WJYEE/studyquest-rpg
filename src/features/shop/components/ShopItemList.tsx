"use client";

import { ITEM_CATALOG } from "../../../lib/itemCatalog";
import { ShopItemCard } from "./ShopItemCard";

export function ShopItemList() {
  return (
    <ul className="flex flex-col gap-2">
      {ITEM_CATALOG.map((item) => (
        <ShopItemCard key={item.id} item={item} />
      ))}
    </ul>
  );
}
