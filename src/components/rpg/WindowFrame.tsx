import type { ComponentPropsWithoutRef, ElementType } from "react";

export type WindowFrameVariant = "window" | "slot";

/**
 * Shared ink-on-parchment frame used by every RPG window type (DialogBox,
 * StatusWindow, InventoryPanel/Slot). "window" = full pixel-window chrome —
 * thick ink border, an inset parchment-dark bevel, and an offset drop
 * shadow so it reads as a floating game dialog box, not a flat web card —
 * use for a page's primary window. "slot" = the lighter framing for
 * rows/cells inside a window or list, with a faint top-edge highlight for a
 * subtle bevel, so a screen full of slots doesn't compete with its
 * containing window. Don't hand-roll pixel border/shadow classes outside
 * this component.
 */
const VARIANT_CLASSES: Record<WindowFrameVariant, string> = {
  window:
    "border-4 border-rpg-ink bg-rpg-parchment shadow-[inset_2px_2px_0_0_rgba(255,255,255,0.4),inset_-3px_-3px_0_0_var(--rpg-parchment-dark),6px_6px_0_0_rgba(38,32,25,0.3)]",
  slot: "border-2 border-rpg-ink-soft bg-rpg-parchment-dark/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5)]",
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
