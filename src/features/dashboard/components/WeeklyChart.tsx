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
import type { TooltipContentProps } from "recharts";

import { WindowFrame } from "../../../components/rpg/WindowFrame";
import {
  calculateWeeklyBreakdown,
  calculateWeeklyTotalMinutes,
} from "../../../lib/dashboardStats";
import { useAppStore } from "../../../store/useAppStore";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TICK_STYLE = { fontSize: 12, fill: "#82683f" };

/** Cozy-panel mini tooltip in place of Recharts' default white tooltip card. */
function ChartTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) {
    return null;
  }
  return (
    <div className="rounded-lg border border-rpg-ink-soft/70 bg-rpg-parchment px-2 py-1 text-xs text-rpg-ink shadow-[0_4px_10px_-2px_rgba(74,55,40,0.2)]">
      {payload[0].value} min studied
    </div>
  );
}

export function WeeklyChart() {
  const sessions = useAppStore((state) => state.sessions);
  const breakdown = calculateWeeklyBreakdown(sessions);
  const totalMinutes = calculateWeeklyTotalMinutes(sessions);

  const chartData = breakdown.map((day) => ({
    label: WEEKDAY_LABELS[day.dayOfWeek],
    minutes: day.minutes,
  }));

  return (
    <WindowFrame variant="window" className="flex flex-col gap-2 p-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-semibold text-rpg-ink">This Week</h2>
        <span className="text-xs text-rpg-ink-soft">{totalMinutes} min total</span>
      </div>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#82683f" opacity={0.3} />
            <XAxis dataKey="label" tick={TICK_STYLE} axisLine={{ stroke: "#82683f" }} tickLine={false} />
            <YAxis tick={TICK_STYLE} axisLine={{ stroke: "#82683f" }} tickLine={false} allowDecimals={false} />
            <Tooltip content={ChartTooltip} cursor={{ fill: "#82683f", opacity: 0.15 }} />
            <Bar dataKey="minutes" fill="#d9a441" radius={0} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </WindowFrame>
  );
}
