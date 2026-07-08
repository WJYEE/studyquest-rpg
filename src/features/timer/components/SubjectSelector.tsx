"use client";

import Link from "next/link";

import { selectSelectableSubjects, useAppStore } from "../../../store/useAppStore";

interface SubjectSelectorProps {
  selectedSubjectId: string | null;
  onSelect: (subjectId: string) => void;
  disabled: boolean;
}

export function SubjectSelector({
  selectedSubjectId,
  onSelect,
  disabled,
}: SubjectSelectorProps) {
  const subjects = useAppStore((state) => state.subjects);
  const selectableSubjects = selectSelectableSubjects(subjects);

  if (selectableSubjects.length === 0) {
    return (
      <p className="border-2 border-rpg-ink bg-rpg-parchment px-3 py-2 text-sm text-gray-600">
        No subjects available —{" "}
        <Link href="/subjects" className="text-blue-600 underline">
          add one on the Subjects page
        </Link>
        .
      </p>
    );
  }

  return (
    <select
      value={selectedSubjectId ?? ""}
      onChange={(event) => onSelect(event.target.value)}
      disabled={disabled}
      aria-label="Select subject"
      className="border-2 border-rpg-ink bg-rpg-parchment px-3 py-2 text-sm disabled:opacity-60"
    >
      <option value="" disabled>
        Choose a subject
      </option>
      {selectableSubjects.map((subject) => (
        <option key={subject.id} value={subject.id}>
          {subject.name}
        </option>
      ))}
    </select>
  );
}
