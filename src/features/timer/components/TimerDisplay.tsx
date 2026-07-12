"use client";

import { useStopwatch } from "../../../hooks/useStopwatch";
import { calculateSessionCoins } from "../../../lib/coinCalculation";
import { elapsedMsToMinutes, formatElapsedTime } from "../../../lib/timerElapsed";
import { calculateSessionXp } from "../../../lib/xpCalculation";
import { useAppStore } from "../../../store/useAppStore";

/**
 * Digits + status + reward preview only — no longer self-framed in its own
 * `WindowFrame` (that caused double-boxing once it moved inside
 * `TimerManager`'s single primary panel alongside `TimerFocusScene`/
 * `TimerControls`). The digits stay the largest, highest-contrast element
 * on the Timer screen regardless of the diorama above them.
 */
export function TimerDisplay() {
  const activeSession = useAppStore((state) => state.activeSession);
  const elapsedMs = useStopwatch();

  if (!activeSession) {
    return (
      <p className="text-center text-sm text-rpg-ink-soft">
        No quest underway. Choose a subject and begin.
      </p>
    );
  }

  const elapsedMinutes = elapsedMsToMinutes(elapsedMs);
  const previewXp = calculateSessionXp(elapsedMinutes);
  const previewCoins = calculateSessionCoins(elapsedMinutes);

  return (
    <div className="flex flex-col items-center gap-1">
      <p className="font-mono text-4xl text-rpg-ink tabular-nums">{formatElapsedTime(elapsedMs)}</p>
      <p className="text-xs font-semibold tracking-wide text-rpg-ink-soft uppercase">
        {activeSession.status === "paused" ? "Resting" : "Studying"}
      </p>
      <p className="text-sm text-rpg-ink-soft">
        If you claim now: +{previewXp} XP · +{previewCoins} coin
        {previewCoins === 1 ? "" : "s"}
      </p>
    </div>
  );
}
