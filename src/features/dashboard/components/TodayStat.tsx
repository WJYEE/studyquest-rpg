"use client";

import { calculateTodayTotalMinutes } from "../../../lib/dashboardStats";
import { useAppStore } from "../../../store/useAppStore";

export function TodayStat() {
  const sessions = useAppStore((state) => state.sessions);
  const minutes = calculateTodayTotalMinutes(sessions);

  return (
    <div className="rounded border border-gray-200 px-4 py-3">
      <p className="text-xs text-gray-500">Today</p>
      <p className="text-lg font-semibold">{minutes} min</p>
    </div>
  );
}
