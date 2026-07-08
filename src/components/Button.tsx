import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "success" | "danger";
export type ButtonSize = "md" | "sm";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "rounded bg-blue-600 text-white",
  secondary: "rounded bg-gray-200 text-gray-900",
  success: "rounded bg-green-600 text-white",
  danger: "text-red-600",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: "px-4 py-2 text-sm",
  sm: "px-3 py-1.5 text-xs",
};

/**
 * Builds the shared button visual classes. Exported so non-<button>
 * elements that need to look like a button (e.g. a Next.js <Link> used as
 * a CTA) reuse the exact same styling instead of duplicating it.
 */
export function buttonClassName(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string
): string {
  return [
    "inline-flex items-center justify-center font-medium disabled:opacity-40",
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
