/**
 * Pixel-square ink-bordered field styling, mirroring `Button.tsx`'s
 * `buttonClassName()` pattern — replaces native `<input>`/`<select>`
 * elements' default `rounded border-gray-300` SaaS-form look with the
 * ink/parchment game-UI language used everywhere else.
 */
export function inputClassName(className?: string): string {
  return [
    "border-2 border-rpg-ink bg-rpg-parchment px-2 py-1.5 text-sm text-rpg-ink placeholder:text-rpg-ink-soft focus:outline-none focus:border-rpg-gold disabled:opacity-60",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * Same field chrome as `inputClassName`, plus `appearance-none` and right
 * padding for a manually-drawn `▾` glyph (native select arrows can't be
 * pixel-styled) — pair with a `<span className="pointer-events-none absolute ...">▾</span>`
 * inside a `relative` wrapper, see `SubjectSelector.tsx`.
 */
export function selectClassName(className?: string): string {
  return [inputClassName(), "w-full appearance-none pr-7", className]
    .filter(Boolean)
    .join(" ");
}
