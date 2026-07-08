export type CharacterTier = "bronze" | "silver" | "gold";

/** Level brackets are a purely cosmetic UI grouping, not tied to any game-balance threshold. */
export function tierForLevel(level: number): CharacterTier {
  if (level >= 25) return "gold";
  if (level >= 10) return "silver";
  return "bronze";
}

const TIER_ACCENT: Record<CharacterTier, string> = {
  bronze: "#a9673a",
  silver: "#9aa5ad",
  gold: "#d4a017",
};

interface CharacterSpriteProps {
  tier: CharacterTier;
  hasHat: boolean;
}

/**
 * Inline SVG placeholder sprite — a small grid of rects, no external image
 * file. Deliberately drawn on a 16x16 grid with crisp edges so it reads as
 * "pixel art" without depending on any asset (see public/assets/characters
 * README). Swapping in a real sprite sheet later only touches this file.
 */
export function CharacterSprite({ tier, hasHat }: CharacterSpriteProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-16 w-16"
      style={{ imageRendering: "pixelated", shapeRendering: "crispEdges" }}
      aria-hidden="true"
    >
      <rect x="5" y="1" width="6" height="3" fill="var(--rpg-ink)" />
      <rect x="5" y="4" width="6" height="3" fill="#f4c99b" />
      <rect x="4" y="7" width="8" height="5" fill="#4a6fa5" />
      <rect x="5" y="12" width="6" height="3" fill="var(--rpg-ink)" />
      <rect x="4" y="9" width="8" height="1" fill={TIER_ACCENT[tier]} />
      {hasHat && <rect x="4" y="0" width="8" height="2" fill="#c0392b" />}
    </svg>
  );
}
