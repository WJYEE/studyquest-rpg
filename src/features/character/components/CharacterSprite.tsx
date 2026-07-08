export type CharacterTier = "bronze" | "silver" | "gold";
export type CharacterAnimState = "idle" | "walking" | "training" | "levelup";

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

const WRAPPER_ANIM_CLASS: Record<CharacterAnimState, string> = {
  idle: "animate-pixel-bob",
  walking: "animate-pixel-walk",
  training: "animate-pixel-train",
  levelup: "animate-pixel-levelup",
};

interface CharacterSpriteProps {
  tier: CharacterTier;
  hasHat: boolean;
  animState?: CharacterAnimState;
}

/**
 * Inline SVG placeholder sprite — a small grid of rects, no external image
 * file (see public/assets/characters README). `animState` drives which CSS
 * animation class the wrapper gets: idle bob, walking shimmy (with
 * alternating leg opacity for a step cue), a training scale-pulse with a
 * badge, or a level-up flash-pulse with sparkle particles. Swapping in a
 * real sprite sheet later only touches this file, not call sites.
 */
export function CharacterSprite({
  tier,
  hasHat,
  animState = "idle",
}: CharacterSpriteProps) {
  return (
    <div className={`relative inline-block ${WRAPPER_ANIM_CLASS[animState]}`}>
      <svg
        viewBox="0 0 16 16"
        className="h-16 w-16"
        style={{ imageRendering: "pixelated", shapeRendering: "crispEdges" }}
        aria-hidden="true"
      >
        <rect x="5" y="1" width="6" height="3" fill="var(--rpg-ink)" />
        <rect x="5" y="4" width="6" height="3" fill="#f4c99b" />
        <rect x="4" y="7" width="8" height="5" fill="#4a6fa5" />
        <rect
          x="5"
          y="12"
          width="3"
          height="3"
          fill="var(--rpg-ink)"
          className={animState === "walking" ? "pixel-leg-a" : undefined}
        />
        <rect
          x="8"
          y="12"
          width="3"
          height="3"
          fill="var(--rpg-ink)"
          className={animState === "walking" ? "pixel-leg-b" : undefined}
        />
        <rect x="4" y="9" width="8" height="1" fill={TIER_ACCENT[tier]} />
        {hasHat && <rect x="4" y="0" width="8" height="2" fill="#c0392b" />}
      </svg>

      {animState === "training" && (
        <span
          className="absolute -right-1 -top-1 text-sm"
          aria-hidden="true"
        >
          ✦
        </span>
      )}

      {animState === "levelup" && (
        <>
          <span
            className="pixel-spark absolute left-1 top-2 h-1 w-1 rounded-full bg-rpg-gold"
            style={{ animationDelay: "0ms" }}
            aria-hidden="true"
          />
          <span
            className="pixel-spark absolute right-1 top-4 h-1 w-1 rounded-full bg-rpg-gold"
            style={{ animationDelay: "150ms" }}
            aria-hidden="true"
          />
          <span
            className="pixel-spark absolute left-1/2 top-0 h-1 w-1 rounded-full bg-rpg-gold"
            style={{ animationDelay: "300ms" }}
            aria-hidden="true"
          />
        </>
      )}
    </div>
  );
}
