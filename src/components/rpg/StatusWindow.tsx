import type { ReactNode } from "react";

import { WindowFrame } from "./WindowFrame";

interface StatusWindowProps {
  /** The character portrait/sprite, rendered above the stats block. */
  portrait: ReactNode;
  /** Stats content — level/XP bar, currency, etc. Composition stays with the caller. */
  children: ReactNode;
}

/**
 * Character-sheet layout: portrait on top, a stats block below, in a full
 * pixel window. The portrait sits on a small "stage" — a light bounded
 * backdrop (soft gradient + floor strip), quieter than Timer's full desk
 * diorama per docs/02_design/screen-specs.md §5.5, since the Character
 * page's own background stays flat cream.
 */
export function StatusWindow({ portrait, children }: StatusWindowProps) {
  return (
    <WindowFrame
      variant="window"
      className="flex flex-col items-center gap-3 px-6 py-6 text-center"
    >
      <div
        className="relative flex w-full flex-col items-center justify-end overflow-hidden rounded-xl border border-rpg-ink-soft/40 pt-6 pb-3"
        style={{ background: "linear-gradient(180deg, #f3e4bd 0%, #e6d2a0 100%)" }}
      >
        {portrait}
        {/* ground-shadow ellipse grounds the sprite as a standing player avatar */}
        <div className="-mt-2 h-2 w-10 rounded-full bg-rpg-ink opacity-20" aria-hidden="true" />
        <div
          className="mt-2 h-1.5 w-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, #cdae72 0px, #cdae72 12px, #b8945c 12px, #b8945c 14px)",
          }}
          aria-hidden="true"
        />
      </div>
      <div className="flex w-full flex-col items-center gap-3">{children}</div>
    </WindowFrame>
  );
}
