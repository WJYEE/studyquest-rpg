"use client";

import { calculateSubjectBreakdown } from "../../../lib/dashboardStats";
import { useAppStore } from "../../../store/useAppStore";

export function SubjectBreakdown() {
  const subjects = useAppStore((state) => state.subjects);
  const breakdown = calculateSubjectBreakdown(subjects);

  if (breakdown.length === 0) {
    return <p className="text-sm text-gray-500">No study time recorded yet.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-sm font-medium">By Subject</h2>
      <ul className="flex flex-col gap-1">
        {breakdown.map((entry) => (
          <li
            key={entry.subjectId}
            className="flex items-center justify-between text-sm"
          >
            <span>{entry.name}</span>
            <span className="text-gray-500">{entry.minutes} min</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
