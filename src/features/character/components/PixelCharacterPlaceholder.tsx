interface PixelCharacterPlaceholderProps {
  level: number;
  /** Name of the currently equipped item, if any (requirements.md FR-P4). */
  equippedItemName?: string;
}

/**
 * Static stand-in for the future pixel-art sprite — no art assets or visual
 * spec exist yet (ui_design.md is still a stub), so equipping an item shows
 * as a text label rather than a layered sprite. `level` and
 * `equippedItemName` are threaded through now so swapping in real per-level,
 * per-item art later won't require touching call sites.
 */
export function PixelCharacterPlaceholder({
  level,
  equippedItemName,
}: PixelCharacterPlaceholderProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded border-4 border-gray-800 bg-amber-100"
        style={{ imageRendering: "pixelated" }}
        aria-label={`Character, level ${level}${
          equippedItemName ? `, wearing ${equippedItemName}` : ""
        }`}
      >
        <span className="text-4xl">🧑‍🎓</span>
        <span className="text-xs font-semibold text-gray-600">Lv.{level}</span>
      </div>
      {equippedItemName && (
        <p className="text-xs text-gray-500">Wearing: {equippedItemName}</p>
      )}
    </div>
  );
}
