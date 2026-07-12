/**
 * Cozy-panel field styling (docs/02_design/art-direction.md §8), mirroring
 * `Button.tsx`'s `buttonClassName()` pattern — rounded corners, a thin
 * warm border, and a soft focus ring instead of the old sharp ink-square
 * field / hard focus-border swap.
 */
export function inputClassName(className?: string): string {
  return [
    "rounded-xl border border-rpg-ink-soft/60 bg-rpg-parchment px-3 py-2 text-sm text-rpg-ink placeholder:text-rpg-ink-soft transition-colors focus:outline-none focus-visible:border-rpg-forest focus-visible:ring-2 focus-visible:ring-rpg-forest/30 disabled:opacity-60",
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
