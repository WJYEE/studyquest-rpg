import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "success" | "danger";
export type ButtonSize = "md" | "sm";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "border-rpg-ink bg-rpg-gold text-rpg-ink shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),3px_3px_0_0_var(--rpg-ink)]",
  secondary:
    "border-rpg-ink bg-rpg-parchment-dark text-rpg-ink shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),3px_3px_0_0_var(--rpg-ink)]",
  success:
    "border-rpg-ink bg-rpg-success text-rpg-parchment shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),3px_3px_0_0_var(--rpg-ink)]",
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
 * Pixel interaction motif: an offset ink shadow that collapses to 0 and
 * nudges the button down-right on press, mimicking a physical button being
 * pushed in. `danger` opts out (see VARIANT_CLASSES) to stay lightweight.
 */
export function buttonClassName(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string
): string {
  return [
    "inline-flex items-center justify-center border-2 font-pixel tracking-wide transition-transform duration-100 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:opacity-40",
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
