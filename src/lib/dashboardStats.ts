import type { StudySession } from "../types/session";
import type { Subject } from "../types/subject";

/**
 * Local (not UTC) calendar-day key, so "today"/streaks match the day the
 * user actually experiences rather than shifting at UTC midnight.
 */
function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Total minutes studied on the current local calendar day. */
export function calculateTodayTotalMinutes(
  sessions: StudySession[],
  now: Date = new Date()
): number {
  const todayKey = toDateKey(now);
  return sessions
    .filter((session) => toDateKey(new Date(session.createdAt)) === todayKey)
    .reduce((sum, session) => sum + session.duration, 0);
}

export interface DailyMinutes {
  /** "YYYY-MM-DD", local calendar day. */
  date: string;
  /** 0 (Sunday) – 6 (Saturday), local — computed alongside `date` so chart
   * labels never need to re-parse a date-only string (new Date("YYYY-MM-DD")
   * parses as UTC midnight, which shifts the weekday in negative-UTC-offset
   * timezones). */
  dayOfWeek: number;
  minutes: number;
}

/** Study minutes for each of the last 7 local days, oldest first, today last. */
export function calculateWeeklyBreakdown(
  sessions: StudySession[],
  now: Date = new Date()
): DailyMinutes[] {
  const days: DailyMinutes[] = [];

  for (let offset = 6; offset >= 0; offset -= 1) {
    const day = new Date(now);
    day.setDate(day.getDate() - offset);
    const dateKey = toDateKey(day);

    const minutes = sessions
      .filter((session) => toDateKey(new Date(session.createdAt)) === dateKey)
      .reduce((sum, session) => sum + session.duration, 0);

    days.push({ date: dateKey, dayOfWeek: day.getDay(), minutes });
  }

  return days;
}

/** Total minutes studied across the last 7 local days. */
export function calculateWeeklyTotalMinutes(
  sessions: StudySession[],
  now: Date = new Date()
): number {
  return calculateWeeklyBreakdown(sessions, now).reduce(
    (sum, day) => sum + day.minutes,
    0
  );
}

export interface SubjectMinutes {
  subjectId: string;
  name: string;
  minutes: number;
}

/**
 * Per-subject total study time, sorted highest-first. Includes archived
 * subjects — they're hidden from selection UI, not from historical stats
 * (requirements.md FR-S3), so excluding them here would silently understate
 * total study time.
 */
export function calculateSubjectBreakdown(subjects: Subject[]): SubjectMinutes[] {
  return subjects
    .map((subject) => ({
      subjectId: subject.id,
      name: subject.name,
      minutes: subject.totalMinutes,
    }))
    .filter((entry) => entry.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes);
}

/**
 * Consecutive local days, ending today or yesterday, with at least 1 minute
 * of study logged. If today has no study time yet, counting starts from
 * yesterday instead of breaking the streak immediately — today isn't over.
 */
export function calculateCurrentStreak(
  sessions: StudySession[],
  now: Date = new Date()
): number {
  const minutesByDate = new Map<string, number>();
  for (const session of sessions) {
    const key = toDateKey(new Date(session.createdAt));
    minutesByDate.set(key, (minutesByDate.get(key) ?? 0) + session.duration);
  }

  const cursor = new Date(now);
  if ((minutesByDate.get(toDateKey(cursor)) ?? 0) <= 0) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while ((minutesByDate.get(toDateKey(cursor)) ?? 0) > 0) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
