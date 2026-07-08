export type ItemCurrency = "coin" | "diamond";

export interface Item {
  id: string;
  name: string;
  price: number;
  currency: ItemCurrency;
  /** Cosmetic category, e.g. "hat" — catalog not finalized yet. */
  type: string;
}

/**
 * The user's shop ownership state. Items themselves are static catalog data
 * (see lib/itemCatalog.ts), not per-user data — this is the part that's
 * actually specific to the user and needs to persist.
 */
export interface Inventory {
  ownedItemIds: string[];
  equippedItemId: string | null;
}
