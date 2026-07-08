"use client";

import { useState } from "react";

import { Button } from "../../../components/Button";
import { InventorySlot } from "../../../components/rpg/InventorySlot";
import {
  evaluatePurchase,
  purchaseIneligibleMessage,
} from "../../../lib/shopValidation";
import { useAppStore } from "../../../store/useAppStore";
import type { Item } from "../../../types/item";

/** Presentation-only lookup — itemCatalog.ts stays icon-agnostic content data. */
const ICON_BY_ITEM_ID: Record<string, string> = {
  "straw-hat": "👒",
  "wizard-hat": "🧙",
  headband: "🎧",
  "golden-crown": "👑",
};

interface ShopItemCardProps {
  item: Item;
}

export function ShopItemCard({ item }: ShopItemCardProps) {
  const user = useAppStore((state) => state.user);
  const ownedItemIds = useAppStore((state) => state.ownedItemIds);
  const equippedItemId = useAppStore((state) => state.equippedItemId);
  const purchaseItem = useAppStore((state) => state.purchaseItem);
  const equipItem = useAppStore((state) => state.equipItem);

  const [error, setError] = useState<string | null>(null);

  const isOwned = ownedItemIds.includes(item.id);
  const isEquipped = equippedItemId === item.id;
  const eligibility = evaluatePurchase(
    item,
    { coin: user.coin, diamond: user.diamond },
    ownedItemIds
  );

  function handlePurchase() {
    try {
      setError(null);
      purchaseItem(item.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Purchase failed.");
    }
  }

  function handleEquip() {
    try {
      setError(null);
      equipItem(item.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to equip item.");
    }
  }

  return (
    <InventorySlot
      icon={ICON_BY_ITEM_ID[item.id] ?? "🎁"}
      title={item.name}
      subtitle={`${item.currency === "coin" ? "🪙" : "💎"} ${item.price} · ${item.type}`}
      error={
        error && (
          <p className="text-xs text-red-600" role="alert">
            {error}
          </p>
        )
      }
    >
      {isOwned ? (
        <Button
          variant="secondary"
          size="sm"
          onClick={handleEquip}
          disabled={isEquipped}
        >
          {isEquipped ? "Equipped" : "Equip"}
        </Button>
      ) : (
        <Button
          size="sm"
          onClick={handlePurchase}
          disabled={!eligibility.eligible}
          title={
            !eligibility.eligible && eligibility.reason
              ? purchaseIneligibleMessage(eligibility.reason)
              : undefined
          }
        >
          Buy
        </Button>
      )}
    </InventorySlot>
  );
}
