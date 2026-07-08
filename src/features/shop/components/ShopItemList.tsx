"use client";

import { InventoryPanel } from "../../../components/rpg/InventoryPanel";
import { ITEM_CATALOG } from "../../../lib/itemCatalog";
import { ShopItemCard } from "./ShopItemCard";

export function ShopItemList() {
  return (
    <InventoryPanel>
      {ITEM_CATALOG.map((item) => (
        <ShopItemCard key={item.id} item={item} />
      ))}
    </InventoryPanel>
  );
}
