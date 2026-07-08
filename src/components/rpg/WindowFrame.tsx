import type { ComponentPropsWithoutRef, ElementType } from "react";

export type WindowFrameVariant = "window" | "slot";

/**
 * Shared ink-on-parchment frame used by every RPG window type (DialogBox,
 * StatusWindow, InventoryPanel/Slot). "window" = full pixel-window chrome
 * (thick ink border + inset parchment-dark line, SNES-dialog feel) — use
 * for a page's primary window. "slot" = the lighter framing for rows/cells
 * inside a window or list, so a screen full of slots doesn't compete with
 * its containing window. Don't hand-roll pixel border/shadow classes
 * outside this component.
 */
const VARIANT_CLASSES: Record<WindowFrameVariant, string> = {
  window:
    "border-4 border-rpg-ink bg-rpg-parchment shadow-[inset_0_0_0_3px_var(--rpg-parchment-dark)]",
  slot: "border-2 border-rpg-ink-soft bg-rpg-parchment-dark/30",
};

type WindowFrameProps<T extends ElementType> = {
  as?: T;
  variant?: WindowFrameVariant;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "variant">;

export function WindowFrame<T extends ElementType = "div">({
  as,
  variant = "window",
  className,
  ...props
}: WindowFrameProps<T>) {
  const Component = as ?? "div";
  return (
    <Component
      className={[VARIANT_CLASSES[variant], className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
