export type ItemCurrency = "coin" | "diamond";

/** Equip slot a cosmetic item occupies — also doubles as its shop category. */
export type ItemSlot = "hat" | "outfit" | "accessory";

export interface Item {
  id: string;
  name: string;
  price: number;
  currency: ItemCurrency;
  type: ItemSlot;
}

/**
 * The user's shop ownership state. Items themselves are static catalog data
 * (see lib/itemCatalog.ts), not per-user data — this is the part that's
 * actually specific to the user and needs to persist.
 */
export interface Inventory {
  ownedItemIds: string[];
  /** At most one equipped item per slot; a slot with nothing equipped is simply absent. */
  equippedItemIds: Partial<Record<ItemSlot, string>>;
}
