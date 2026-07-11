"use client";

import { WindowFrame } from "../../../components/rpg/WindowFrame";
import { calculateTodayTotalMinutes } from "../../../lib/dashboardStats";
import { useAppStore } from "../../../store/useAppStore";

export function TodayStat() {
  const sessions = useAppStore((state) => state.sessions);
  const minutes = calculateTodayTotalMinutes(sessions);

  return (
    <WindowFrame variant="slot" className="px-4 py-3">
      <p className="text-xs text-rpg-ink-soft">Today</p>
      <p className="text-lg font-semibold text-rpg-ink">⏱ {minutes} min</p>
    </WindowFrame>
  );
}
