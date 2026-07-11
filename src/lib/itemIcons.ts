/**
 * Presentation-only lookup — itemCatalog.ts stays icon-agnostic content
 * data. Shared by the shop grid (`ShopItemCard`) and the character page's
 * equipment-slot readout (`CharacterStatus`) so both show the same icon per
 * item without duplicating the map or creating a shop->character import.
 */
export const ICON_BY_ITEM_ID: Record<string, string> = {
  "straw-hat": "👒",
  "wizard-hat": "🧙",
  headband: "🎧",
  "golden-crown": "👑",
  "traveler-cloak": "🧥",
  "scholar-robe": "🥼",
  "royal-mantle": "👘",
  "focus-charm": "🍀",
  "lucky-pendant": "📿",
  "diamond-ring": "💍",
};
