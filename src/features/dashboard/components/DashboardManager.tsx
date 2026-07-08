"use client";

import { StreakStat } from "./StreakStat";
import { SubjectBreakdown } from "./SubjectBreakdown";
import { TodayStat } from "./TodayStat";
import { WeeklyChart } from "./WeeklyChart";

export function DashboardManager() {
  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">Dashboard</h1>
      <div className="grid grid-cols-2 gap-3">
        <TodayStat />
        <StreakStat />
      </div>
      <WeeklyChart />
      <SubjectBreakdown />
    </section>
  );
}
