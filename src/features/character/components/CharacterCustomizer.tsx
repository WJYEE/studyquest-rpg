"use client";

import { WindowFrame } from "../../../components/rpg/WindowFrame";
import {
  EYE_STYLE_OPTIONS,
  HAIR_COLOR_OPTIONS,
  HAIR_COLOR_SWATCHES,
  HAIR_STYLE_OPTIONS,
  MOUTH_STYLE_OPTIONS,
  NOSE_STYLE_OPTIONS,
  SKIN_TONE_OPTIONS,
  SKIN_TONE_SWATCHES,
} from "../../../lib/characterAppearance";
import { useAppStore } from "../../../store/useAppStore";
import type { CharacterAppearance } from "../../../types/appearance";
import { DollSprite } from "./DollSprite";

interface SwatchRowProps<T extends string> {
  label: string;
  options: readonly T[];
  swatches: Record<T, string>;
  selected: T;
  onSelect: (value: T) => void;
}

/** A row of color-swatch buttons, for fields whose options are colors (skin tone, hair color). */
function SwatchRow<T extends string>({
  label,
  options,
  swatches,
  selected,
  onSelect,
}: SwatchRowProps<T>) {
  return (
    <WindowFrame variant="slot" className="flex flex-col gap-2 px-3 py-2">
      <span className="text-xs font-semibold text-rpg-ink">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-label={`${label}: ${option}`}
            aria-pressed={option === selected}
            onClick={() => onSelect(option)}
            className={
              "h-7 w-7 border-2 " +
              (option === selected
                ? "border-rpg-ink shadow-[2px_2px_0_0_var(--rpg-ink)]"
                : "border-rpg-ink-soft")
            }
            style={{ backgroundColor: swatches[option] }}
          />
        ))}
      </div>
    </WindowFrame>
  );
}

interface OptionRowProps<T extends string> {
  label: string;
  options: readonly T[];
  selected: T;
  onSelect: (value: T) => void;
}

/** A row of text-label buttons, for fields whose options aren't colors (hair/eye/nose/mouth style). */
function OptionRow<T extends string>({ label, options, selected, onSelect }: OptionRowProps<T>) {
  return (
    <WindowFrame variant="slot" className="flex flex-col gap-2 px-3 py-2">
      <span className="text-xs font-semibold text-rpg-ink">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={option === selected}
            onClick={() => onSelect(option)}
            className={
              "border-2 px-2 py-1 text-xs capitalize " +
              (option === selected
                ? "border-rpg-ink bg-rpg-parchment-dark text-rpg-ink"
                : "border-transparent text-rpg-ink-soft hover:border-rpg-ink-soft")
            }
          >
            {option}
          </button>
        ))}
      </div>
    </WindowFrame>
  );
}

/**
 * Base-look picker — separate from the equipment shop/inventory UI. Reads
 * option/swatch constants from `lib/characterAppearance.ts` (shared with
 * `CharacterSprite`, so a swatch color always matches what renders) and
 * writes through `updateAppearance`, which already persists to LocalStorage
 * (see `useAppStore.ts`). Each pick applies immediately, matching the
 * equip/unequip pattern elsewhere in the app — no separate save step.
 */
export function CharacterCustomizer() {
  const user = useAppStore((state) => state.user);
  const appearance = useAppStore((state) => state.appearance);
  const updateAppearance = useAppStore((state) => state.updateAppearance);

  function set<K extends keyof CharacterAppearance>(key: K, value: CharacterAppearance[K]) {
    updateAppearance({ [key]: value });
  }

  return (
    <WindowFrame
      variant="window"
      className="flex flex-col items-center gap-4 px-6 py-6"
    >
      <h1 className="font-pixel text-sm tracking-wide text-rpg-ink">Customize Appearance</h1>

      <DollSprite appearance={appearance} height={210} fallbackLevel={user.level} />

      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-col gap-3">
          <p className="text-[11px] font-semibold tracking-wide text-rpg-ink-soft uppercase">
            Appearance
          </p>
          <SwatchRow
            label="Skin Tone"
            options={SKIN_TONE_OPTIONS}
            swatches={SKIN_TONE_SWATCHES}
            selected={appearance.skinTone}
            onSelect={(value) => set("skinTone", value)}
          />
          <OptionRow
            label="Hair Style"
            options={HAIR_STYLE_OPTIONS}
            selected={appearance.hairStyle}
            onSelect={(value) => set("hairStyle", value)}
          />
          <SwatchRow
            label="Hair Color"
            options={HAIR_COLOR_OPTIONS}
            swatches={HAIR_COLOR_SWATCHES}
            selected={appearance.hairColor}
            onSelect={(value) => set("hairColor", value)}
          />
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-[11px] font-semibold tracking-wide text-rpg-ink-soft uppercase">
            Face
          </p>
          <OptionRow
            label="Eye Style"
            options={EYE_STYLE_OPTIONS}
            selected={appearance.eyeStyle}
            onSelect={(value) => set("eyeStyle", value)}
          />
          <OptionRow
            label="Nose Style"
            options={NOSE_STYLE_OPTIONS}
            selected={appearance.noseStyle}
            onSelect={(value) => set("noseStyle", value)}
          />
          <OptionRow
            label="Mouth Style"
            options={MOUTH_STYLE_OPTIONS}
            selected={appearance.mouthStyle}
            onSelect={(value) => set("mouthStyle", value)}
          />
        </div>
      </div>
    </WindowFrame>
  );
}
