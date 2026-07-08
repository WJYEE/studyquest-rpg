import { PixelPanel } from "../../../components/PixelPanel";
import { CharacterSprite, tierForLevel } from "./CharacterSprite";

interface PixelCharacterPlaceholderProps {
  level: number;
  /** Name of the currently equipped item, if any (requirements.md FR-P4). */
  equippedItemName?: string;
}

/**
 * SVG placeholder sprite in a strong PixelPanel window — no real art assets
 * exist yet (see public/assets/characters), so `CharacterSprite` draws a
 * simple rect-based pixel character instead of loading a file. `level` and
 * `equippedItemName` are threaded through so swapping in real per-level,
 * per-item art later won't require touching call sites.
 */
export function PixelCharacterPlaceholder({
  level,
  equippedItemName,
}: PixelCharacterPlaceholderProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <PixelPanel
        weight="strong"
        className="flex h-24 w-24 flex-col items-center justify-center gap-1"
        aria-label={`Character, level ${level}${
          equippedItemName ? `, wearing ${equippedItemName}` : ""
        }`}
      >
        <div className="animate-pixel-bob">
          <CharacterSprite
            tier={tierForLevel(level)}
            hasHat={Boolean(equippedItemName)}
          />
        </div>
        <span className="text-xs font-semibold text-rpg-ink">Lv.{level}</span>
      </PixelPanel>
      {equippedItemName && (
        <p className="text-xs text-gray-500">Wearing: {equippedItemName}</p>
      )}
    </div>
  );
}
