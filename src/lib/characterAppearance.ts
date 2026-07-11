import type {
  CharacterAppearance,
  EyeStyle,
  HairColor,
  HairStyle,
  MouthStyle,
  NoseStyle,
  SkinTone,
} from "../types/appearance";

/**
 * Default look for a new profile, plus the fixed option sets and swatch
 * colors. Both the customization UI (`CharacterCustomizer`) and the sprite
 * itself (`CharacterSprite`, `CharacterSpriteHair`) read the swatch maps, so
 * a picker's swatch color always matches what actually renders.
 */
export const DEFAULT_APPEARANCE: CharacterAppearance = {
  skinTone: "light",
  hairStyle: "short",
  hairColor: "brown",
  eyeStyle: "round",
  noseStyle: "small",
  mouthStyle: "neutral",
};

export const SKIN_TONE_OPTIONS: SkinTone[] = ["light", "tan", "deep"];
export const HAIR_STYLE_OPTIONS: HairStyle[] = ["bald", "short", "long", "spiky"];
export const HAIR_COLOR_OPTIONS: HairColor[] = ["black", "brown", "blonde", "red", "blue"];
export const EYE_STYLE_OPTIONS: EyeStyle[] = ["round", "sharp", "sleepy"];
export const NOSE_STYLE_OPTIONS: NoseStyle[] = ["small", "long", "button"];
export const MOUTH_STYLE_OPTIONS: MouthStyle[] = ["neutral", "smile", "open"];

export const SKIN_TONE_SWATCHES: Record<SkinTone, string> = {
  light: "#f4c99b",
  tan: "#caa06f",
  deep: "#8d5b3f",
};

export const HAIR_COLOR_SWATCHES: Record<HairColor, string> = {
  black: "#262019",
  brown: "#6b4226",
  blonde: "#e8c96a",
  red: "#b6432c",
  blue: "#3a6ea5",
};
