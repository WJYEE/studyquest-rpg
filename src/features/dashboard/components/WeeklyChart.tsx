"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  calculateWeeklyBreakdown,
  calculateWeeklyTotalMinutes,
} from "../../../lib/dashboardStats";
import { useAppStore } from "../../../store/useAppStore";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function WeeklyChart() {
  const sessions = useAppStore((state) => state.sessions);
  const breakdown = calculateWeeklyBreakdown(sessions);
  const totalMinutes = calculateWeeklyTotalMinutes(sessions);

  const chartData = breakdown.map((day) => ({
    label: WEEKDAY_LABELS[day.dayOfWeek],
    minutes: day.minutes,
  }));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-medium">This Week</h2>
        <span className="text-xs text-gray-500">{totalMinutes} min total</span>
      </div>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip formatter={(value) => [`${value} min`, "Studied"]} />
            <Bar dataKey="minutes" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
