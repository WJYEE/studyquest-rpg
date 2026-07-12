import type { ReactNode } from "react";

import { WindowFrame } from "./WindowFrame";

interface InventorySlotProps {
  icon: ReactNode;
  title: string;
  subtitle: ReactNode;
  error?: ReactNode;
  /** Shows a small "Equipped" ribbon in the corner — merchant-stall/equipment-menu tag. */
  equipped?: boolean;
  /** The action button for this slot (Buy/Equip/etc.), rendered at the bottom. */
  children: ReactNode;
}

/** One cell in an InventoryPanel grid: icon-first, vertical, unlike a v1.0 text-row list item. */
export function InventorySlot({
  icon,
  title,
  subtitle,
  error,
  equipped = false,
  children,
}: InventorySlotProps) {
  return (
    <WindowFrame
      as="li"
      variant="slot"
      className="relative flex flex-col items-center gap-1 !bg-rpg-parchment px-3 py-3 text-center"
    >
      {equipped && (
        <span
          className="absolute -top-2 -right-2 border-2 border-rpg-ink bg-rpg-gold px-1 py-0.5 text-[9px] font-pixel tracking-wide text-rpg-ink shadow-[2px_2px_0_0_var(--rpg-ink)]"
          aria-hidden="true"
        >
          ON
        </span>
      )}
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl border border-rpg-ink-soft/50 bg-rpg-parchment-dark/30 text-2xl"
        aria-hidden="true"
      >
        {icon}
      </div>
      <p className="text-sm font-medium text-rpg-ink">{title}</p>
      <p className="inline-block border border-rpg-ink-soft bg-rpg-parchment-dark/50 px-1.5 py-0.5 text-xs text-rpg-ink-soft">
        {subtitle}
      </p>
      {error}
      {children}
    </WindowFrame>
  );
}
