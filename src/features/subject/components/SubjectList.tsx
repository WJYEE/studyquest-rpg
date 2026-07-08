"use client";

import { selectSelectableSubjects, useAppStore } from "../../../store/useAppStore";
import { SubjectListItem } from "./SubjectListItem";

export function SubjectList() {
  const subjects = useAppStore((state) => state.subjects);
  const selectableSubjects = selectSelectableSubjects(subjects);

  if (selectableSubjects.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No subjects yet — add one above to start studying.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {selectableSubjects.map((subject) => (
        <SubjectListItem key={subject.id} subject={subject} />
      ))}
    </ul>
  );
}
