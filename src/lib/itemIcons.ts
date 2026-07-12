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

/**
 * Real painted icons cropped from the accessories concept sheet
 * (scripts/extract_assets.py). Only items whose crops passed the visual
 * quality gate have an entry — everything else stays on its emoji above,
 * which remains the runtime fallback either way (see `AssetIcon`).
 */
export const ICON_ASSET_BY_ITEM_ID: Record<string, string> = {
  "focus-charm": "/assets/items/icons/focus-charm.png",
  "lucky-pendant": "/assets/items/icons/lucky-pendant.png",
  "diamond-ring": "/assets/items/icons/diamond-ring.png",
};
