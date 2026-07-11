import type { EyeStyle, MouthStyle, NoseStyle } from "../../../types/appearance";

interface FaceRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface EyeShape {
  base: FaceRect;
  pupil: FaceRect;
}

const EYE_SHAPES: Record<EyeStyle, EyeShape[]> = {
  round: [
    { base: { x: 16, y: 12, w: 2, h: 2 }, pupil: { x: 17, y: 13, w: 1, h: 1 } },
    { base: { x: 22, y: 12, w: 2, h: 2 }, pupil: { x: 22, y: 13, w: 1, h: 1 } },
  ],
  sharp: [
    { base: { x: 14, y: 12, w: 4, h: 2 }, pupil: { x: 16, y: 12, w: 2, h: 2 } },
    { base: { x: 22, y: 12, w: 4, h: 2 }, pupil: { x: 24, y: 12, w: 2, h: 2 } },
  ],
  sleepy: [
    { base: { x: 14, y: 14, w: 4, h: 1 }, pupil: { x: 16, y: 14, w: 1, h: 1 } },
    { base: { x: 22, y: 14, w: 4, h: 1 }, pupil: { x: 24, y: 14, w: 1, h: 1 } },
  ],
};

const NOSE_RECT: Record<NoseStyle, FaceRect> = {
  small: { x: 19, y: 16, w: 2, h: 2 },
  long: { x: 19, y: 16, w: 2, h: 4 },
  button: { x: 18, y: 16, w: 4, h: 2 },
};

const MOUTH_RECTS: Record<MouthStyle, FaceRect[]> = {
  neutral: [{ x: 18, y: 20, w: 4, h: 2 }],
  smile: [
    { x: 16, y: 18, w: 2, h: 2 },
    { x: 18, y: 20, w: 4, h: 2 },
    { x: 22, y: 18, w: 2, h: 2 },
  ],
  open: [{ x: 18, y: 20, w: 4, h: 4 }],
};

interface CharacterSpriteFaceProps {
  eyeStyle: EyeStyle;
  noseStyle: NoseStyle;
  mouthStyle: MouthStyle;
}

/**
 * Eyes/eyebrows/nose/mouth rects, drawn directly on top of the head-skin
 * rect — part of the base (layer 1) appearance, not a separate layer of its
 * own (see `CharacterSprite`'s layer-order comment). Eyes are two-tone (a
 * white base rect plus a smaller ink pupil, offset toward one side so a
 * sliver of the base shows as a highlight) rather than a single flat rect,
 * the extra pixel budget from the sprite's 40x48 grid.
 */
export function CharacterSpriteFace({
  eyeStyle,
  noseStyle,
  mouthStyle,
}: CharacterSpriteFaceProps) {
  const nose = NOSE_RECT[noseStyle];

  return (
    <>
      {EYE_SHAPES[eyeStyle].map((eye, index) => (
        <g key={`eye-${index}`}>
          <rect
            x={eye.base.x}
            y={eye.base.y - 2}
            width={eye.base.w}
            height={1}
            fill="var(--rpg-ink)"
            fillOpacity={0.6}
          />
          <rect x={eye.base.x} y={eye.base.y} width={eye.base.w} height={eye.base.h} fill="#fdf6e3" />
          <rect x={eye.pupil.x} y={eye.pupil.y} width={eye.pupil.w} height={eye.pupil.h} fill="var(--rpg-ink)" />
        </g>
      ))}
      <rect
        x={nose.x}
        y={nose.y}
        width={nose.w}
        height={nose.h}
        fill="var(--rpg-ink)"
        fillOpacity={0.35}
      />
      {MOUTH_RECTS[mouthStyle].map((rect, index) => (
        <rect
          key={`mouth-${index}`}
          x={rect.x}
          y={rect.y}
          width={rect.w}
          height={rect.h}
          fill="var(--rpg-ink)"
        />
      ))}
    </>
  );
}
