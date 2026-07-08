import type { ReactNode } from "react";

/** Grid of InventorySlot cells — the RPG-inventory-grid replacement for a plain <ul> of rows. */
export function InventoryPanel({ children }: { children: ReactNode }) {
  return <ul className="grid grid-cols-2 gap-3">{children}</ul>;
}
