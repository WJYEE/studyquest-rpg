"use client";

import type { CharacterAnimState } from "../../character/components/CharacterSprite";
import { DollSprite } from "../../character/components/DollSprite";
import { useAppStore } from "../../../store/useAppStore";

interface TimerFocusSceneProps {
  animState: CharacterAnimState;
}

/**
 * Timer's bounded diorama: the real painted library interior
 * (public/assets/backgrounds/vignettes/library.png, cropped from the
 * reference vignette sheet) with the user's live paper-doll composited in
 * front — so the scene carries the visual richness while the character
 * still reflects the player's actual customization.
 */
export function TimerFocusScene({ animState }: TimerFocusSceneProps) {
  const appearance = useAppStore((state) => state.appearance);
  const user = useAppStore((state) => state.user);

  return (
    <div className="relative h-44 w-full overflow-hidden rounded-xl border border-rpg-ink-soft/50">
      <img
        src="/assets/backgrounds/vignettes/library.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "center 40%" }}
      />
      {/* soft floor shadow keeps the standing doll grounded on the painted floor */}
      <div
        className="absolute bottom-2 left-1/4 h-2 w-16 -translate-x-1/2 rounded-full bg-black/30 blur-[2px]"
        aria-hidden="true"
      />
      <div className="absolute bottom-3 left-1/4 -translate-x-1/2">
        <DollSprite
          appearance={appearance}
          height={140}
          animState={animState}
          fallbackLevel={user.level}
        />
      </div>
    </div>
  );
}
