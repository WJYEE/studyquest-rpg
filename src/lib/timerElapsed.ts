/**
 * Shared by useAppStore.ts (to compute accumulated/final elapsed time) and
 * the live-ticking timer display, so the "how much time has this active
 * session accumulated" rule exists in exactly one place.
 */
export interface ActiveSessionTiming {
  status: "running" | "paused";
  /** Epoch ms when the current running segment began; unused while paused. */
  startedAt: number;
  /** Elapsed ms banked from prior running segments, as of the last pause. */
  accumulatedMs: number;
}

/** Total elapsed ms for an active session as of `now`, accounting for pause state. */
export function calculateElapsedMs(
  activeSession: ActiveSessionTiming | null,
  now: number = Date.now()
): number {
  if (!activeSession) {
    return 0;
  }

  return (
    activeSession.accumulatedMs +
    (activeSession.status === "running" ? now - activeSession.startedAt : 0)
  );
}

/**
 * Floors (not rounds) so sessions under 1 minute stay below the no-reward
 * threshold (requirements.md §4.1) instead of rounding up into a reward.
 */
export function elapsedMsToMinutes(elapsedMs: number): number {
  return Math.floor(elapsedMs / 60000);
}

/** Formats elapsed ms as MM:SS for the running timer display. */
export function formatElapsedTime(elapsedMs: number): string {
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
