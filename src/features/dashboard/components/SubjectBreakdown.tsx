"use client";

import { WindowFrame } from "../../../components/rpg/WindowFrame";
import { calculateSubjectBreakdown } from "../../../lib/dashboardStats";
import { useAppStore } from "../../../store/useAppStore";

export function SubjectBreakdown() {
  const subjects = useAppStore((state) => state.subjects);
  const breakdown = calculateSubjectBreakdown(subjects);

  return (
    <WindowFrame variant="slot" className="flex flex-col gap-2 px-4 py-3">
      <h2 className="text-sm font-semibold text-rpg-ink">By Subject</h2>
      {breakdown.length === 0 ? (
        <p className="text-sm text-rpg-ink-soft">No study time recorded yet.</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {breakdown.map((entry) => (
            <li
              key={entry.subjectId}
              className="flex items-center justify-between text-sm text-rpg-ink"
            >
              <span>{entry.name}</span>
              <span className="text-rpg-ink-soft">{entry.minutes} min</span>
            </li>
          ))}
        </ul>
      )}
    </WindowFrame>
  );
}
