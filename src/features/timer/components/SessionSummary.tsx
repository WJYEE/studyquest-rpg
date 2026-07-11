"use client";

import { useEffect, useState } from "react";

import { DialogBox } from "../../../components/rpg/DialogBox";
import type { StopSessionResult } from "../../../store/useAppStore";

/** Counts 0 -> target over durationMs via rAF; skips the animation entirely under prefers-reduced-motion. */
function useCountUp(target: number, durationMs = 600): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // Deferred to a rAF callback (rather than called synchronously here)
      // to satisfy react-hooks/set-state-in-effect, matching the pattern
      // `tick` already uses below.
      const frameId = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(frameId);
    }

    if (target <= 0) return;

    const start = performance.now();
    let frameId: number;

    // First tick's progress is ~0ms in, so this also covers the reset to 0
    // (the initial `useState(0)` already covers it on mount) without a
    // synchronous setState call here.
    function tick(now: number) {
      const progress = Math.min((now - start) / durationMs, 1);
      setValue(Math.round(target * progress));
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    }

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [target, durationMs]);

  return value;
}

interface SessionSummaryProps {
  result: StopSessionResult;
  onDismiss: () => void;
}

export function SessionSummary({ result, onDismiss }: SessionSummaryProps) {
  const xp = useCountUp(result.xpEarned);
  const coin = useCountUp(result.coinEarned);

  return (
    <DialogBox title="Quest Complete" onDismiss={onDismiss}>
      <p className="text-sm font-medium text-rpg-ink">{result.session.duration} min studied</p>
      <p className="text-sm text-rpg-ink-soft">
        +{xp} XP · +{coin} coin{result.coinEarned === 1 ? "" : "s"}
      </p>
      {result.userLevelsGained > 0 && (
        <p className="text-sm font-medium text-rpg-success">
          ⭐ Level up! +{result.userLevelsGained} character level
          {result.userLevelsGained > 1 ? "s" : ""}
        </p>
      )}
      {result.subjectLevelsGained > 0 && (
        <p className="text-sm font-medium text-rpg-success">
          ⭐ Subject leveled up +{result.subjectLevelsGained}!
        </p>
      )}
    </DialogBox>
  );
}
