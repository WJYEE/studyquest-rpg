"use client";

import Link from "next/link";

import { buttonClassName } from "../../../components/Button";
import { selectClassName } from "../../../components/Input";
import { WindowFrame } from "../../../components/rpg/WindowFrame";
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
      <WindowFrame variant="window" className="flex flex-col items-start gap-2 px-3 py-2 text-sm text-rpg-ink-soft">
        <p>No subjects available yet.</p>
        <Link href="/subjects" className={buttonClassName("secondary", "sm")}>
          Add one on the Subjects page
        </Link>
      </WindowFrame>
    );
  }

  return (
    <div className="relative w-full">
      <select
        value={selectedSubjectId ?? ""}
        onChange={(event) => onSelect(event.target.value)}
        disabled={disabled}
        aria-label="Select subject"
        className={selectClassName()}
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
      <span
        className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-rpg-ink"
        aria-hidden="true"
      >
        ▾
      </span>
    </div>
  );
}
