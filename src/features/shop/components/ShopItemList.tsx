"use client";

import { InventoryPanel } from "../../../components/rpg/InventoryPanel";
import { ITEM_CATALOG } from "../../../lib/itemCatalog";
import { useAppStore } from "../../../store/useAppStore";
import { ShopItemCard } from "./ShopItemCard";

interface ShopItemListProps {
  /** "all" = the full catalog (Shop tab); "owned" = only items the player owns (My Items tab). */
  filter?: "all" | "owned";
}

export function ShopItemList({ filter = "all" }: ShopItemListProps) {
  const ownedItemIds = useAppStore((state) => state.ownedItemIds);
  const items =
    filter === "owned"
      ? ITEM_CATALOG.filter((item) => ownedItemIds.includes(item.id))
      : ITEM_CATALOG;

  if (items.length === 0) {
    return (
      <p className="text-center text-sm text-rpg-ink-soft">
        Nothing here yet — items you buy will show up in My Items.
      </p>
    );
  }

  return (
    <InventoryPanel>
      {items.map((item) => (
        <ShopItemCard key={item.id} item={item} />
      ))}
    </InventoryPanel>
  );
}
