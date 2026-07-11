"use client";

import { useState } from "react";

import { Button } from "../../../components/Button";
import { InventorySlot } from "../../../components/rpg/InventorySlot";
import { ICON_BY_ITEM_ID } from "../../../lib/itemIcons";
import {
  evaluatePurchase,
  purchaseIneligibleMessage,
} from "../../../lib/shopValidation";
import { useAppStore } from "../../../store/useAppStore";
import type { Item } from "../../../types/item";

interface ShopItemCardProps {
  item: Item;
}

export function ShopItemCard({ item }: ShopItemCardProps) {
  const user = useAppStore((state) => state.user);
  const ownedItemIds = useAppStore((state) => state.ownedItemIds);
  const equippedItemIds = useAppStore((state) => state.equippedItemIds);
  const purchaseItem = useAppStore((state) => state.purchaseItem);
  const equipItem = useAppStore((state) => state.equipItem);
  const unequipItem = useAppStore((state) => state.unequipItem);

  const [error, setError] = useState<string | null>(null);

  const isOwned = ownedItemIds.includes(item.id);
  const isEquipped = equippedItemIds[item.type] === item.id;
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

  function handleUnequip() {
    try {
      setError(null);
      unequipItem(item.type);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unequip item.");
    }
  }

  return (
    <InventorySlot
      icon={ICON_BY_ITEM_ID[item.id] ?? "🎁"}
      title={item.name}
      subtitle={`${item.currency === "coin" ? "🪙" : "💎"} ${item.price} · ${item.type}`}
      equipped={isEquipped}
      error={
        error && (
          <p className="text-xs text-rpg-danger" role="alert">
            {error}
          </p>
        )
      }
    >
      {isOwned ? (
        <Button
          variant="secondary"
          size="sm"
          onClick={isEquipped ? handleUnequip : handleEquip}
        >
          {isEquipped ? "Unequip" : "Equip"}
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
