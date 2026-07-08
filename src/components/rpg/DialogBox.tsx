import type { ReactNode } from "react";

import { WindowFrame } from "./WindowFrame";

interface DialogBoxProps {
  title?: string;
  children: ReactNode;
  /** Rendered as the bottom-right "continue" affordance, e.g. a Done button. */
  onDismissLabel?: string;
  onDismiss?: () => void;
}

/**
 * NPC-textbox-style window: a window frame with a small pointer tail at the
 * top-left (the classic RPG dialog "speaking to you" cue) and an optional
 * continue affordance. Used for transient message content — quest
 * completion, level-up, purchase confirmations — in place of a plain
 * colored `<div>`.
 */
export function DialogBox({
  title,
  children,
  onDismissLabel = "Continue ▸",
  onDismiss,
}: DialogBoxProps) {
  return (
    <div className="relative mt-3">
      <div
        className="absolute -top-3 left-6 h-3 w-3 rotate-45 border-t-4 border-l-4 border-rpg-ink bg-rpg-parchment"
        aria-hidden="true"
      />
      <WindowFrame variant="window" className="flex flex-col gap-2 px-4 py-3">
        {title && (
          <p className="text-xs font-semibold tracking-wide text-rpg-ink uppercase">
            {title}
          </p>
        )}
        {children}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="self-end text-xs font-semibold text-rpg-ink"
          >
            {onDismissLabel}
          </button>
        )}
      </WindowFrame>
    </div>
  );
}
