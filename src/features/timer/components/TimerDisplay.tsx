"use client";

import { useStopwatch } from "../../../hooks/useStopwatch";
import { calculateSessionCoins } from "../../../lib/coinCalculation";
import { elapsedMsToMinutes, formatElapsedTime } from "../../../lib/timerElapsed";
import { calculateSessionXp } from "../../../lib/xpCalculation";
import { useAppStore } from "../../../store/useAppStore";

export function TimerDisplay() {
  const activeSession = useAppStore((state) => state.activeSession);
  const elapsedMs = useStopwatch();

  if (!activeSession) {
    return <p className="text-sm text-gray-500">No session running.</p>;
  }

  const elapsedMinutes = elapsedMsToMinutes(elapsedMs);
  const previewXp = calculateSessionXp(elapsedMinutes);
  const previewCoins = calculateSessionCoins(elapsedMinutes);

  return (
    <div className="flex flex-col items-center gap-1">
      <p className="font-mono text-4xl tabular-nums">
        {formatElapsedTime(elapsedMs)}
      </p>
      <p className="text-xs uppercase tracking-wide text-gray-500">
        {activeSession.status === "paused" ? "Paused" : "Studying"}
      </p>
      <p className="text-sm text-gray-600">
        If you stop now: +{previewXp} XP · +{previewCoins} coin
        {previewCoins === 1 ? "" : "s"}
      </p>
    </div>
  );
}
