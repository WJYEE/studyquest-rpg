"use client";

import { WindowFrame } from "../../../components/rpg/WindowFrame";
import { calculateCurrentStreak } from "../../../lib/dashboardStats";
import { useAppStore } from "../../../store/useAppStore";

export function StreakStat() {
  const sessions = useAppStore((state) => state.sessions);
  const streak = calculateCurrentStreak(sessions);

  return (
    <WindowFrame variant="slot" className="px-4 py-3">
      <p className="text-xs text-gray-500">Current Streak</p>
      <p className="text-lg font-semibold">
        {streak} day{streak === 1 ? "" : "s"}
      </p>
    </WindowFrame>
  );
}
