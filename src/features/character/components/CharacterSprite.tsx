import { DEFAULT_APPEARANCE, SKIN_TONE_SWATCHES } from "../../../lib/characterAppearance";
import type { CharacterAppearance } from "../../../types/appearance";
import { CharacterSpriteFace } from "./CharacterSpriteFace";
import { CharacterSpriteHair } from "./CharacterSpriteHair";

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

/** Outfit swaps the body-rect fill; no outfit equipped keeps the default tunic blue. */
const OUTFIT_BODY_FILL = "#6b3fa0";
const OUTFIT_BODY_SHADE = "#55317f";
const DEFAULT_BODY_FILL = "#4a6fa5";
const DEFAULT_BODY_SHADE = "#3a5a87";

interface CharacterSpriteProps {
  tier: CharacterTier;
  appearance?: CharacterAppearance;
  hasHat?: boolean;
  hasOutfit?: boolean;
  hasAccessory?: boolean;
  animState?: CharacterAnimState;
}

/**
 * Inline SVG placeholder sprite — a grid of rects on a 40x48 viewBox (2x the
 * original 20x24 resolution, same on-screen footprint), no external image
 * file (see public/assets/characters README). The finer grid buys room for
 * actual extra detail (eyebrows/two-tone eyes, hair strands, a collar/cuff
 * shade, split hat brim+crown, a two-tone accessory) rather than just
 * scaling the old blocky shapes up. Layers draw in priority order, each on
 * top of the previous:
 *
 *   1. Base (`appearance`) — skin rect + `CharacterSpriteFace` (eyes/nose/mouth)
 *   2. Hair (`appearance`) — `CharacterSpriteHair`
 *   3. Outfit (equipment) — `hasOutfit` recolors the body rect
 *   4. Accessory (equipment) — `hasAccessory`
 *   5. Hat (equipment) — `hasHat`
 *
 * `appearance` (base customization) and `hasHat`/`hasOutfit`/`hasAccessory`
 * (equipped items, `types/item.ts`) are deliberately separate prop groups —
 * equipment always renders on top of the base look, never replaces it.
 *
 * `animState` drives which CSS animation class the wrapper gets: idle bob,
 * walking shimmy (with alternating leg opacity for a step cue), a training
 * scale-pulse with a badge, or a level-up flash-pulse with sparkle
 * particles. Swapping in a real sprite sheet later only touches this file
 * (plus `CharacterSpriteHair`/`CharacterSpriteFace`), not call sites.
 */
export function CharacterSprite({
  tier,
  appearance = DEFAULT_APPEARANCE,
  hasHat = false,
  hasOutfit = false,
  hasAccessory = false,
  animState = "idle",
}: CharacterSpriteProps) {
  return (
    <div className={`relative inline-block ${WRAPPER_ANIM_CLASS[animState]}`}>
      <svg
        viewBox="0 0 40 48"
        className="h-16 w-14"
        style={{ imageRendering: "pixelated", shapeRendering: "crispEdges" }}
        aria-hidden="true"
      >
        {/* Layer 1: base — skin (head, ears, neck) + face */}
        <rect
          x="12"
          y="8"
          width="16"
          height="12"
          fill={SKIN_TONE_SWATCHES[appearance.skinTone]}
        />
        <rect x="10" y="13" width="2" height="3" fill={SKIN_TONE_SWATCHES[appearance.skinTone]} />
        <rect x="28" y="13" width="2" height="3" fill={SKIN_TONE_SWATCHES[appearance.skinTone]} />
        <rect x="18" y="20" width="4" height="2" fill={SKIN_TONE_SWATCHES[appearance.skinTone]} />
        <CharacterSpriteFace
          eyeStyle={appearance.eyeStyle}
          noseStyle={appearance.noseStyle}
          mouthStyle={appearance.mouthStyle}
        />

        {/* Layer 2: hair */}
        <CharacterSpriteHair style={appearance.hairStyle} color={appearance.hairColor} />

        {/* Layer 3: outfit (equipment) */}
        <rect
          x="10"
          y="22"
          width="20"
          height="12"
          fill={hasOutfit ? OUTFIT_BODY_FILL : DEFAULT_BODY_FILL}
        />
        <rect
          x="16"
          y="22"
          width="8"
          height="2"
          fill={hasOutfit ? OUTFIT_BODY_SHADE : DEFAULT_BODY_SHADE}
        />
        <rect
          x="10"
          y="26"
          width="2"
          height="4"
          fill={hasOutfit ? OUTFIT_BODY_SHADE : DEFAULT_BODY_SHADE}
        />
        <rect
          x="28"
          y="26"
          width="2"
          height="4"
          fill={hasOutfit ? OUTFIT_BODY_SHADE : DEFAULT_BODY_SHADE}
        />
        <rect x="10" y="34" width="20" height="2" fill={TIER_ACCENT[tier]} />

        <rect
          x="12"
          y="36"
          width="6"
          height="8"
          fill="var(--rpg-ink)"
          className={animState === "walking" ? "pixel-leg-a" : undefined}
        />
        <rect
          x="22"
          y="36"
          width="6"
          height="8"
          fill="var(--rpg-ink)"
          className={animState === "walking" ? "pixel-leg-b" : undefined}
        />
        <rect
          x="12"
          y="44"
          width="6"
          height="4"
          fill="#1a1410"
          className={animState === "walking" ? "pixel-leg-a" : undefined}
        />
        <rect
          x="22"
          y="44"
          width="6"
          height="4"
          fill="#1a1410"
          className={animState === "walking" ? "pixel-leg-b" : undefined}
        />

        {/* Layer 4: accessory (equipment) */}
        {hasAccessory && (
          <>
            <rect x="18" y="26" width="4" height="4" fill="var(--rpg-gold)" />
            <rect x="19" y="27" width="2" height="2" fill="var(--rpg-diamond)" />
          </>
        )}

        {/* Layer 5: hat (equipment) */}
        {hasHat && (
          <>
            <rect x="8" y="8" width="24" height="3" fill="#c0392b" />
            <rect x="12" y="2" width="16" height="6" fill="#c0392b" />
            <rect x="12" y="6" width="16" height="2" fill="#922b21" />
          </>
        )}
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
