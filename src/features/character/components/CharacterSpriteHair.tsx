import { HAIR_COLOR_SWATCHES } from "../../../lib/characterAppearance";
import type { HairColor, HairStyle } from "../../../types/appearance";

interface CharacterSpriteHairProps {
  style: HairStyle;
  color: HairColor;
}

/**
 * Hair rects only (layer 2 — drawn after the base head/face, before outfit/
 * accessory/hat; see `CharacterSprite`'s layer-order comment). `bald` draws
 * nothing so the head-skin rect shows through. Each style is built from
 * several smaller rects (fringe tufts / individual spikes / a highlight
 * strip) rather than one flat block, using the sprite's 40x48 grid.
 */
export function CharacterSpriteHair({ style, color }: CharacterSpriteHairProps) {
  if (style === "bald") {
    return null;
  }

  const fill = HAIR_COLOR_SWATCHES[color];

  if (style === "spiky") {
    return (
      <>
        <rect x="12" y="8" width="16" height="2" fill={fill} />
        <rect x="12" y="2" width="4" height="6" fill={fill} />
        <rect x="16" y="4" width="4" height="4" fill={fill} />
        <rect x="18" y="0" width="4" height="8" fill={fill} />
        <rect x="22" y="4" width="4" height="4" fill={fill} />
        <rect x="24" y="2" width="4" height="6" fill={fill} />
      </>
    );
  }

  return (
    <>
      <rect x="12" y="6" width="16" height="2" fill={fill} />
      <rect x="12" y="8" width="3" height="2" fill={fill} />
      <rect x="16" y="8" width="3" height="2" fill={fill} />
      <rect x="21" y="8" width="3" height="2" fill={fill} />
      <rect x="25" y="8" width="3" height="2" fill={fill} />
      <rect x="15" y="6" width="2" height="1" fill="#ffffff" fillOpacity={0.25} />
      <rect x="10" y="10" width="2" height="4" fill={fill} />
      <rect x="28" y="10" width="2" height="4" fill={fill} />
      {style === "long" && (
        <>
          <rect x="10" y="14" width="2" height="8" fill={fill} />
          <rect x="28" y="14" width="2" height="8" fill={fill} />
        </>
      )}
    </>
  );
}
