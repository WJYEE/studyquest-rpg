"use client";

import { useState } from "react";

import type { CharacterAppearance } from "../../../types/appearance";
import {
  CharacterSprite,
  tierForLevel,
  type CharacterAnimState,
} from "./CharacterSprite";

/**
 * Bitmap paper-doll character — layered crops from the concept sheets under
 * public/assets/characters/doll (see scripts/extract_assets.py and
 * docs/02_design/asset-manifest.md). Hair color and skin tone come from
 * offline-recolored variants (48 head files + 3 bodies), so every
 * combination the customizer offers has a real painted layer; eyes and
 * mouth are overlay glyphs positioned against per-style face anchors
 * measured from the crops.
 *
 * Known, deliberate limits (documented in the phase plan): nose styles have
 * no visual analog in the sheets, and equipped items are not yet drawn on
 * the doll (equipment shows in the slot chips instead). If the body layer
 * fails to load, the component falls back to the legacy SVG sprite so the
 * app never shows a broken character.
 */

// Source-space canvas in *body-native units* (the proportion-guide body is
// 201 x 220 source px). The head crops come from the hair sheet, which is
// drawn at a smaller scale, so every head-space measurement (widths, chin
// line, eye/mouth anchors) is multiplied by HEAD_SCALE. 1.2 was picked
// empirically against the proportion-guide reference (target head-with-hair
// ratio ~0.44 of total height; trial composites at 1.0/1.15/1.2/1.3/1.45
// bracketed it) — it yields natural 4.5-5 head proportions with visibly
// long legs instead of the old squashed chibi. Every layer sets width only;
// height stays auto so each image keeps its own aspect ratio.
const CANVAS_W = 202;
const CANVAS_H = 348;
const CANVAS_CX = CANVAS_W / 2;
const HEAD_SCALE = 1.2;
// The head chin sits at this canvas y; the body's neck top overlaps it by
// 3px so head and torso join without a seam.
const CHIN_Y = 131;
// body.png is 201x220 natural px; content center measured at x=101.
const BODY = { left: 0, top: CHIN_Y - 3, w: 201 };

interface HeadLayout {
  /** Natural width of the head crop (hair-sheet px). */
  w: number;
  /** x of the face center inside the head crop (hair-sheet px). */
  anchorCx: number;
  /** y of the chin inside the head crop (hair-sheet px). */
  chin: number;
  /** Eye-line / mouth-line y inside the head crop (hair-sheet px). */
  eyesOff: number;
  mouthOff: number;
  eyesW: number;
  mouthW: number;
  /** Visual face-center correction (hair-sheet px) where the skin bbox center is off — e.g. asymmetric hair sweeps. */
  faceDx: number;
}

const HEADS: Record<string, HeadLayout> = {
  bald: { w: 94, anchorCx: 46, chin: 86, eyesOff: 52, mouthOff: 73, eyesW: 55, mouthW: 20, faceDx: 0 },
  short: { w: 131, anchorCx: 66, chin: 107, eyesOff: 76, mouthOff: 93, eyesW: 47, mouthW: 17, faceDx: 0 },
  long: { w: 101, anchorCx: 48, chin: 103, eyesOff: 71, mouthOff: 88, eyesW: 50, mouthW: 18, faceDx: 0 },
  spiky: { w: 92, anchorCx: 47, chin: 109, eyesOff: 80, mouthOff: 96, eyesW: 48, mouthW: 19, faceDx: 4 },
};

const EYE_ASPECT: Record<string, number> = {
  round: 37 / 83,
  sharp: 35 / 85,
  sleepy: 34 / 89,
};

const MOUTH_ASPECT: Record<string, number> = {
  neutral: 8 / 20,
  open: 20 / 11,
  smile: 13 / 23,
};

function headSrc(appearance: CharacterAppearance): string {
  const base = "/assets/characters/doll/variants";
  if (appearance.hairStyle === "bald") {
    return `${base}/head-bald-${appearance.skinTone}.png`;
  }
  return `${base}/head-${appearance.hairStyle}-${appearance.hairColor}-${appearance.skinTone}.png`;
}

const WRAPPER_ANIM_CLASS: Record<CharacterAnimState, string> = {
  idle: "animate-pixel-bob",
  walking: "animate-pixel-walk",
  training: "animate-pixel-train",
  levelup: "animate-pixel-levelup",
};

interface DollSpriteProps {
  appearance: CharacterAppearance;
  /** Rendered height in px; width scales proportionally. */
  height: number;
  /** "full" = whole body; "bust" = head only (for compact HUD portraits). */
  variant?: "full" | "bust";
  animState?: CharacterAnimState;
  /** Used only by the SVG fallback if the bitmap layers fail to load. */
  fallbackLevel?: number;
  className?: string;
}

export function DollSprite({
  appearance,
  height,
  variant = "full",
  animState = "idle",
  fallbackLevel = 1,
  className,
}: DollSpriteProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <CharacterSprite
        tier={tierForLevel(fallbackLevel)}
        appearance={appearance}
        animState={animState}
      />
    );
  }

  const head = HEADS[appearance.hairStyle] ?? HEADS.short;
  // Bust shows the head region only (top ~168 source px of the canvas —
  // chin line plus a sliver of neck).
  const srcH = variant === "bust" ? 168 : CANVAS_H;
  const scale = height / srcH;
  const px = (n: number) => n * scale;

  const headW = head.w * HEAD_SCALE;
  const headLeft = CANVAS_CX - head.anchorCx * HEAD_SCALE;
  const headTop = CHIN_Y - head.chin * HEAD_SCALE;
  const faceCx = CANVAS_CX + head.faceDx * HEAD_SCALE;

  const eyesW = head.eyesW * HEAD_SCALE;
  const eyesH = eyesW * (EYE_ASPECT[appearance.eyeStyle] ?? 0.44);
  const mouthW = head.mouthW * HEAD_SCALE * (appearance.mouthStyle === "open" ? 0.65 : 1);
  const mouthH = mouthW * (MOUTH_ASPECT[appearance.mouthStyle] ?? 0.4);

  return (
    <div
      className={[WRAPPER_ANIM_CLASS[animState], className].filter(Boolean).join(" ")}
      style={{ width: px(CANVAS_W), height, position: "relative" }}
      aria-hidden="true"
    >
      {variant === "full" && (
        <img
          src={`/assets/characters/doll/variants/body-${appearance.skinTone}.png`}
          alt=""
          onError={() => setFailed(true)}
          style={{
            position: "absolute",
            left: px(BODY.left),
            top: px(BODY.top),
            width: px(BODY.w),
            height: "auto",
            objectFit: "contain",
          }}
        />
      )}
      <img
        src={headSrc(appearance)}
        alt=""
        onError={() => setFailed(true)}
        style={{
          position: "absolute",
          left: px(headLeft),
          top: px(headTop),
          width: px(headW),
          height: "auto",
          objectFit: "contain",
        }}
      />
      <img
        src={`/assets/characters/doll/eyes-${appearance.eyeStyle}.png`}
        alt=""
        style={{
          position: "absolute",
          left: px(faceCx - eyesW / 2),
          top: px(headTop + head.eyesOff * HEAD_SCALE - eyesH / 2),
          width: px(eyesW),
          height: "auto",
          objectFit: "contain",
        }}
      />
      <img
        src={`/assets/characters/doll/mouth-${appearance.mouthStyle}.png`}
        alt=""
        style={{
          position: "absolute",
          left: px(faceCx - mouthW / 2),
          top: px(headTop + head.mouthOff * HEAD_SCALE - mouthH / 2),
          width: px(mouthW),
          height: "auto",
          objectFit: "contain",
        }}
      />
    </div>
  );
}
