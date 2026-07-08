"use client";

import { useState } from "react";

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
    <li className="flex items-center justify-between gap-4 rounded border border-gray-200 px-4 py-3">
      <div>
        <p className="text-sm font-medium">{item.name}</p>
        <p className="text-xs text-gray-500">
          {item.currency === "coin" ? "🪙" : "💎"} {item.price} · {item.type}
        </p>
        {error && (
          <p className="text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
      {isOwned ? (
        <button
          type="button"
          onClick={handleEquip}
          disabled={isEquipped}
          className="shrink-0 rounded bg-gray-200 px-3 py-1.5 text-xs font-medium disabled:opacity-60"
        >
          {isEquipped ? "Equipped" : "Equip"}
        </button>
      ) : (
        <button
          type="button"
          onClick={handlePurchase}
          disabled={!eligibility.eligible}
          title={
            !eligibility.eligible && eligibility.reason
              ? purchaseIneligibleMessage(eligibility.reason)
              : undefined
          }
          className="shrink-0 rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40"
        >
          Buy
        </button>
      )}
    </li>
  );
}
