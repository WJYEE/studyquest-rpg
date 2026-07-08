import type { ReactNode } from "react";

import { WindowFrame } from "./WindowFrame";

interface InventorySlotProps {
  icon: ReactNode;
  title: string;
  subtitle: ReactNode;
  error?: ReactNode;
  /** The action button for this slot (Buy/Equip/etc.), rendered at the bottom. */
  children: ReactNode;
}

/** One cell in an InventoryPanel grid: icon-first, vertical, unlike a v1.0 text-row list item. */
export function InventorySlot({
  icon,
  title,
  subtitle,
  error,
  children,
}: InventorySlotProps) {
  return (
    <WindowFrame
      as="li"
      variant="slot"
      className="flex flex-col items-center gap-1 px-3 py-3 text-center"
    >
      <div className="text-3xl" aria-hidden="true">
        {icon}
      </div>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
      {error}
      {children}
    </WindowFrame>
  );
}
