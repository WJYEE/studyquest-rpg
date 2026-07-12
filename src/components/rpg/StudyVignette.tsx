"use client";

import { DollSprite } from "../../features/character/components/DollSprite";
import { useAppStore } from "../../store/useAppStore";

/**
 * Home's hero: the painted cafe study-corner backdrop
 * (public/assets/backgrounds/vignettes/cafe.png, cropped from the reference
 * vignette sheet) with the user's live paper-doll standing in the scene.
 * The backdrop carries the cozy density the references call for; the doll
 * keeps the hero consistent with the customization system everywhere else.
 */
export function StudyVignette() {
  const appearance = useAppStore((state) => state.appearance);
  const user = useAppStore((state) => state.user);

  return (
    <div className="relative h-56 w-full overflow-hidden rounded-2xl border border-rpg-ink-soft/60">
      <img
        src="/assets/backgrounds/vignettes/cafe.png"
        alt="Cozy cafe study corner"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "center 30%" }}
      />

      {/* pixel corner marks */}
      <span
        className="pointer-events-none absolute top-2 left-2 h-3 w-3 border-t-2 border-l-2 border-rpg-parchment/80"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute top-2 right-2 h-3 w-3 border-t-2 border-r-2 border-rpg-parchment/80"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute bottom-2 left-2 h-3 w-3 border-b-2 border-l-2 border-rpg-parchment/80"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute right-2 bottom-2 h-3 w-3 border-r-2 border-b-2 border-rpg-parchment/80"
        aria-hidden="true"
      />

      {/* soft floor shadow under the doll */}
      <div
        className="absolute bottom-2 left-[30%] h-2.5 w-20 -translate-x-1/2 rounded-full bg-black/30 blur-[2px]"
        aria-hidden="true"
      />
      <div className="absolute bottom-3 left-[30%] -translate-x-1/2">
        <DollSprite appearance={appearance} height={170} fallbackLevel={user.level} />
      </div>
    </div>
  );
}
