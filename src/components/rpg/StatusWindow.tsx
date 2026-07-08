import type { ReactNode } from "react";

import { WindowFrame } from "./WindowFrame";

interface StatusWindowProps {
  /** The character portrait/sprite, rendered above the stats block. */
  portrait: ReactNode;
  /** Stats content — level/XP bar, currency, etc. Composition stays with the caller. */
  children: ReactNode;
}

/** Character-sheet layout: portrait on top, a stats block below, in a full pixel window. */
export function StatusWindow({ portrait, children }: StatusWindowProps) {
  return (
    <WindowFrame
      variant="window"
      className="flex flex-col items-center gap-3 px-6 py-6 text-center"
    >
      {portrait}
      <div className="flex w-full flex-col items-center gap-3">{children}</div>
    </WindowFrame>
  );
}
