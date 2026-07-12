import type { ReactNode } from "react";

interface PageTitleProps {
  children: ReactNode;
}

/**
 * Shared pixel-font game-title chip for page headers — replaces the
 * copy-pasted bare `<h1 className="text-lg font-semibold">` (or one-off
 * hand-rolled ink-box) that used to appear on every feature page. Cozy
 * panel chrome per docs/02_design/art-direction.md §8 — page titles are
 * one of the two contexts (with badge/ribbon chips) that keep the pixel
 * display font, but the chip shape follows the same soft/rounded language
 * as `WindowFrame` now, not the old hard-offset pixel box.
 */
export function PageTitle({ children }: PageTitleProps) {
  return (
    <h1 className="self-start rounded-xl border border-rpg-ink-soft/70 bg-rpg-parchment px-3 py-2 font-pixel text-sm tracking-wide text-rpg-ink shadow-[0_4px_10px_-2px_rgba(74,55,40,0.18)]">
      {children}
    </h1>
  );
}
