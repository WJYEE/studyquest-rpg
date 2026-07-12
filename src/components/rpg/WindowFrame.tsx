import type { ComponentPropsWithoutRef, ElementType } from "react";

export type WindowFrameVariant = "window" | "slot";

/**
 * Shared cozy-panel frame used by every RPG window type (DialogBox,
 * StatusWindow, InventoryPanel/Slot) — see docs/02_design/art-direction.md
 * §8. "window" = a page's primary panel: rounded corners, a thin warm
 * border, and a soft diffuse shadow so it reads as a gently raised card,
 * not a hard-edged game dialog box. "slot" = lighter framing for rows/
 * cells inside a window or list — a touch less rounding, a fainter border/
 * shadow, so a screen full of slots doesn't compete with its containing
 * window. Don't hand-roll panel border/shadow classes outside this
 * component.
 */
const VARIANT_CLASSES: Record<WindowFrameVariant, string> = {
  window:
    "rounded-2xl border border-rpg-ink-soft/70 bg-rpg-parchment shadow-[0_6px_16px_-4px_rgba(74,55,40,0.18)]",
  slot: "rounded-xl border border-rpg-ink-soft/40 bg-rpg-parchment-dark/40 shadow-[0_2px_6px_-2px_rgba(74,55,40,0.12)]",
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
