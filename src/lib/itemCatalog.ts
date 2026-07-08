import type { Item } from "../types/item";

/**
 * Static shop inventory — content data, not user data. Deliberately kept
 * separate from the shop UI (which only ever reads this list) and from the
 * store (which only tracks per-user ownership/equip state, see
 * types/item.ts's Inventory). Editing prices/adding items means editing
 * this array; no admin UI exists or is planned for v1.
 */
export const ITEM_CATALOG: Item[] = [
  { id: "straw-hat", name: "Straw Hat", price: 60, currency: "coin", type: "hat" },
  { id: "wizard-hat", name: "Wizard Hat", price: 150, currency: "coin", type: "hat" },
  { id: "headband", name: "Focus Headband", price: 90, currency: "coin", type: "hat" },
  { id: "golden-crown", name: "Golden Crown", price: 5, currency: "diamond", type: "hat" },
];

export function getItemById(itemId: string): Item | undefined {
  return ITEM_CATALOG.find((item) => item.id === itemId);
}
