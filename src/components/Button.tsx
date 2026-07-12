import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "success" | "danger";
export type ButtonSize = "md" | "sm";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "border border-transparent bg-rpg-forest text-rpg-parchment shadow-[0_4px_10px_-2px_rgba(74,55,40,0.3)]",
  secondary:
    "border border-rpg-ink-soft/60 bg-rpg-parchment text-rpg-ink shadow-[0_2px_6px_-2px_rgba(74,55,40,0.15)]",
  success:
    "border border-transparent bg-rpg-success text-rpg-ink shadow-[0_4px_10px_-2px_rgba(74,55,40,0.25)]",
  // Deliberately no fill/shadow — keeps destructive actions visually
  // quieter than filled buttons.
  danger: "border-transparent text-rpg-danger shadow-none",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: "px-4 py-2 text-sm",
  sm: "px-3 py-1.5 text-xs",
};

/**
 * Builds the shared button visual classes. Exported so non-<button>
 * elements that need to look like a button (e.g. a Next.js <Link> used as
 * a CTA) reuse the exact same styling instead of duplicating it.
 *
 * Cozy interaction motif (docs/02_design/art-direction.md §8): a soft
 * diffuse shadow that lifts slightly on hover and settles with a gentle
 * scale-down on press — not the old hard pixel-shove offset shadow.
 * `danger` opts out of the shadow/fill (see VARIANT_CLASSES) to stay
 * lightweight. Labels use the default sans body font, not the pixel
 * display font, per the typography direction (pixel font is reserved for
 * page titles and badge/ribbon chips).
 */
export function buttonClassName(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string
): string {
  return [
    "inline-flex items-center justify-center rounded-full font-medium transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rpg-forest disabled:opacity-40 disabled:hover:translate-y-0",
    SIZE_CLASSES[size],
    VARIANT_CLASSES[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName(variant, size, className)}
      {...props}
    />
  );
}
