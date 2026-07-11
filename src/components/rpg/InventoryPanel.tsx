import type { ReactNode } from "react";

import { WindowFrame } from "./WindowFrame";

/**
 * Grid of InventorySlot cells, framed as a shop shelf — a wood-toned
 * window with a subtle plank-grain background so items visually sit "on
 * shelves" rather than floating in a plain card grid.
 */
export function InventoryPanel({ children }: { children: ReactNode }) {
  return (
    <WindowFrame
      variant="window"
      className="p-3"
      style={{
        backgroundImage:
          "repeating-linear-gradient(180deg, var(--rpg-wood) 0px, var(--rpg-wood) 2px, transparent 2px, transparent 48px)",
        backgroundColor: "var(--rpg-parchment)",
      }}
    >
      <ul className="grid grid-cols-2 gap-3">{children}</ul>
    </WindowFrame>
  );
}
