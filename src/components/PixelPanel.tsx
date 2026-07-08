import type { ComponentPropsWithoutRef, ElementType } from "react";

export type PixelPanelWeight = "strong" | "light";

/**
 * "strong" = hero/character pixel window (thick ink border + inset
 * parchment-dark line, SNES-dialog feel). "light" = card/list-row framing —
 * same ink-on-parchment language, thinner border, no inset line, so it
 * doesn't compete with the strong panels. See ui_design.md's Pixel Panel
 * section for which weight to use where.
 */
const WEIGHT_CLASSES: Record<PixelPanelWeight, string> = {
  strong:
    "border-4 border-rpg-ink bg-rpg-parchment shadow-[inset_0_0_0_3px_var(--rpg-parchment-dark)]",
  light: "border-2 border-rpg-ink-soft bg-rpg-parchment-dark/30",
};

type PixelPanelProps<T extends ElementType> = {
  as?: T;
  weight?: PixelPanelWeight;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "weight">;

export function PixelPanel<T extends ElementType = "div">({
  as,
  weight = "light",
  className,
  ...props
}: PixelPanelProps<T>) {
  const Component = as ?? "div";
  return (
    <Component
      className={[WEIGHT_CLASSES[weight], className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
