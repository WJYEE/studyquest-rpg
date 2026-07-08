import type { Item } from "../types/item";

export type PurchaseIneligibleReason =
  | "item-not-found"
  | "already-owned"
  | "insufficient-funds";

export interface PurchaseEligibility {
  eligible: boolean;
  reason?: PurchaseIneligibleReason;
}

/**
 * Whether a purchase is allowed, and why not if it isn't. Kept separate
 * from calculateLevelUpBonus-style "apply" functions because both the
 * store (to gate the action) and the shop UI (to disable/explain a Buy
 * button before the user even clicks it) need this same read-only check.
 */
export function evaluatePurchase(
  item: Item | undefined,
  balances: { coin: number; diamond: number },
  ownedItemIds: string[]
): PurchaseEligibility {
  if (!item) {
    return { eligible: false, reason: "item-not-found" };
  }
  if (ownedItemIds.includes(item.id)) {
    return { eligible: false, reason: "already-owned" };
  }

  const balance = item.currency === "coin" ? balances.coin : balances.diamond;
  if (balance < item.price) {
    return { eligible: false, reason: "insufficient-funds" };
  }

  return { eligible: true };
}

export function purchaseIneligibleMessage(
  reason: PurchaseIneligibleReason
): string {
  switch (reason) {
    case "item-not-found":
      return "This item no longer exists.";
    case "already-owned":
      return "You already own this item.";
    case "insufficient-funds":
      return "You don't have enough currency for this item.";
  }
}
