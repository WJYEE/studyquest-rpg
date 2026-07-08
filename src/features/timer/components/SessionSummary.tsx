"use client";

import type { StopSessionResult } from "../../../store/useAppStore";

interface SessionSummaryProps {
  result: StopSessionResult;
  onDismiss: () => void;
}

export function SessionSummary({ result, onDismiss }: SessionSummaryProps) {
  return (
    <div className="flex flex-col gap-2 rounded border border-green-200 bg-green-50 px-4 py-3">
      <p className="text-sm font-medium">
        Session complete — {result.session.duration} min studied
      </p>
      <p className="text-sm text-gray-700">
        +{result.xpEarned} XP · +{result.coinEarned} coin
        {result.coinEarned === 1 ? "" : "s"}
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
      <button
        type="button"
        onClick={onDismiss}
        className="self-start text-xs font-medium text-blue-600"
      >
        Done
      </button>
    </div>
  );
}
