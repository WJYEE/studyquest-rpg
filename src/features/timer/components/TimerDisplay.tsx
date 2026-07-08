"use client";

import { WindowFrame } from "../../../components/rpg/WindowFrame";
import { useStopwatch } from "../../../hooks/useStopwatch";
import { calculateSessionCoins } from "../../../lib/coinCalculation";
import { elapsedMsToMinutes, formatElapsedTime } from "../../../lib/timerElapsed";
import { calculateSessionXp } from "../../../lib/xpCalculation";
import { useAppStore } from "../../../store/useAppStore";

export function TimerDisplay() {
  const activeSession = useAppStore((state) => state.activeSession);
  const elapsedMs = useStopwatch();

  if (!activeSession) {
    return (
      <p className="border-2 border-rpg-ink bg-rpg-parchment px-4 py-2 text-sm text-gray-600">
        No quest underway. Choose a subject and begin.
      </p>
    );
  }

  const elapsedMinutes = elapsedMsToMinutes(elapsedMs);
  const previewXp = calculateSessionXp(elapsedMinutes);
  const previewCoins = calculateSessionCoins(elapsedMinutes);

  return (
    <WindowFrame
      variant="window"
      className="flex flex-col items-center gap-1 px-6 py-4"
    >
      <p className="font-mono text-4xl tabular-nums text-rpg-ink">
        {formatElapsedTime(elapsedMs)}
      </p>
      <p className="text-xs uppercase tracking-wide text-gray-500">
        {activeSession.status === "paused" ? "Resting" : "Adventuring"}
      </p>
      <p className="text-sm text-gray-600">
        If you claim now: +{previewXp} XP · +{previewCoins} coin
        {previewCoins === 1 ? "" : "s"}
      </p>
    </WindowFrame>
  );
}
