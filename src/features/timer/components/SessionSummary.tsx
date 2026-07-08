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
      setValue(target);
      return;
    }

    setValue(0);
    if (target <= 0) return;

    const start = performance.now();
    let frameId: number;

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
      <p className="text-sm font-medium">{result.session.duration} min studied</p>
      <p className="text-sm text-gray-700">
        +{xp} XP · +{coin} coin{result.coinEarned === 1 ? "" : "s"}
      </p>
      {result.userLevelsGained > 0 && (
        <p className="text-sm font-medium text-green-700">
          Level up! +{result.userLevelsGained} character level
          {result.userLevelsGained > 1 ? "s" : ""}
        </p>
      )}
      {result.subjectLevelsGained > 0 && (
        <p className="text-sm font-medium text-green-700">
          Subject leveled up +{result.subjectLevelsGained}!
        </p>
      )}
    </DialogBox>
  );
}
