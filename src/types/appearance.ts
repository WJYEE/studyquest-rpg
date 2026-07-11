export type SkinTone = "light" | "tan" | "deep";
export type HairStyle = "bald" | "short" | "long" | "spiky";
export type HairColor = "black" | "brown" | "blonde" | "red" | "blue";
export type EyeStyle = "round" | "sharp" | "sleepy";
export type NoseStyle = "small" | "long" | "button";
export type MouthStyle = "neutral" | "smile" | "open";

/**
 * The base character look — independent of the equipment system
 * (`types/item.ts`'s `Inventory`). Persisted under its own key
 * (`studyquest:appearance`) since it's per-user identity, not shop
 * ownership state, and equipped items always render on top of it
 * (see `CharacterSprite`'s layer order).
 */
export interface CharacterAppearance {
  skinTone: SkinTone;
  hairStyle: HairStyle;
  hairColor: HairColor;
  eyeStyle: EyeStyle;
  noseStyle: NoseStyle;
  mouthStyle: MouthStyle;
}
