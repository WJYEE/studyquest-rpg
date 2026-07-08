import { useEffect, useState } from "react";

import { calculateElapsedMs } from "../lib/timerElapsed";
import { useAppStore } from "../store/useAppStore";

/**
 * Live elapsed ms for the current active session, ticking once per second
 * while running and frozen while paused or idle. Purely a display concern —
 * it never writes to the store, it only re-reads calculateElapsedMs (the
 * same lib function useAppStore uses) on an interval.
 */
export function useStopwatch(): number {
  const activeSession = useAppStore((state) => state.activeSession);
  const [elapsedMs, setElapsedMs] = useState<number>(() =>
    calculateElapsedMs(activeSession)
  );

  // Resync immediately when the active session changes identity (start,
  // pause, resume, stop, cancel all replace it with a new object or null)
  // instead of waiting for the next 1s tick. Safe to call during render:
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [syncedSession, setSyncedSession] = useState(activeSession);
  if (activeSession !== syncedSession) {
    setSyncedSession(activeSession);
    setElapsedMs(calculateElapsedMs(activeSession));
  }

  useEffect(() => {
    if (!activeSession || activeSession.status !== "running") {
      return;
    }

    const intervalId = setInterval(() => {
      setElapsedMs(calculateElapsedMs(activeSession));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [activeSession]);

  return elapsedMs;
}
