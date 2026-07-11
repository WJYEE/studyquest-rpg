import type { ReactNode } from "react";

interface PageTitleProps {
  children: ReactNode;
}

/**
 * Shared pixel-font game-title chip for page headers — replaces the
 * copy-pasted bare `<h1 className="text-lg font-semibold">` (or one-off
 * hand-rolled ink-box) that used to appear on every feature page.
 */
export function PageTitle({ children }: PageTitleProps) {
  return (
    <h1 className="self-start border-2 border-rpg-ink bg-rpg-parchment px-3 py-2 font-pixel text-sm tracking-wide text-rpg-ink shadow-[3px_3px_0_0_var(--rpg-ink)]">
      {children}
    </h1>
  );
}
