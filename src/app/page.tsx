"use client";

import Link from "next/link";

import { buttonClassName } from "../components/Button";
import { RpgBackground } from "../components/rpg/RpgBackground";
import { StudyVignette } from "../components/rpg/StudyVignette";
import { calculateCurrentStreak, calculateTodayTotalMinutes } from "../lib/dashboardStats";
import { useAppStore } from "../store/useAppStore";

/**
 * Home's job is orientation + one action, not branding (the shell's top
 * bar already carries the wordmark on every route) or a stat dashboard.
 * The hero is a built pixel scene (`StudyVignette`), not a text panel —
 * see docs/02_design/screen-specs.md's diorama concept, brought forward to
 * Home per explicit direction. "Today"/"Streak" get bespoke, differently-
 * shaped zones here rather than reusing the Dashboard's identical stat
 * chips, so Home doesn't just look like a smaller copy of Dashboard.
 */
export default function HomePage() {
  const sessions = useAppStore((state) => state.sessions);
  const todayMinutes = calculateTodayTotalMinutes(sessions);
  const streak = calculateCurrentStreak(sessions);

  return (
    <RpgBackground scene="quiet">
      <main className="mx-auto w-full max-w-lg px-4 pt-6 pb-8">
        <h1 className="sr-only">StudyQuest Home</h1>
        <p className="mb-2 text-center text-xs font-semibold tracking-wide text-rpg-ink-soft uppercase">
          Welcome back
        </p>

        <div className="relative">
          <StudyVignette />
          <Link
            href="/timer"
            className={buttonClassName(
              "primary",
              "md",
              "absolute -bottom-5 left-1/2 -translate-x-1/2 shadow-lg"
            )}
          >
            ▶ Start Studying
          </Link>
        </div>

        <div className="mt-9 flex gap-3">
          <div className="flex-[2] rounded-xl border border-rpg-ink-soft/50 bg-rpg-parchment-dark/20 p-3">
            <p className="text-[11px] font-medium tracking-wide text-rpg-ink-soft uppercase">Today</p>
            <p className="mt-1 text-2xl font-bold text-rpg-ink tabular-nums">
              {todayMinutes}
              <span className="ml-1 text-xs font-normal text-rpg-ink-soft">min</span>
            </p>
          </div>
          <div className="flex-1 rounded-xl border border-rpg-ink-soft/50 bg-rpg-parchment-dark/20 p-3 text-center">
            <p className="text-[11px] font-medium tracking-wide text-rpg-ink-soft uppercase">Streak</p>
            <p className="mt-1 text-2xl font-bold text-rpg-ink tabular-nums">🔥{streak}</p>
          </div>
        </div>

        <Link
          href="/subjects"
          className="mt-3 flex items-center justify-between rounded-xl border border-rpg-ink-soft/50 bg-rpg-parchment px-4 py-3 text-sm font-medium text-rpg-ink transition-colors hover:bg-rpg-parchment-dark/30"
        >
          <span className="flex items-center gap-2">
            <span aria-hidden="true">📚</span> Manage Subjects
          </span>
          <span aria-hidden="true">→</span>
        </Link>
      </main>
    </RpgBackground>
  );
}
