"use client";

import { useState } from "react";

import { useAppStore } from "../../../store/useAppStore";
import type { Subject } from "../../../types/subject";

interface SubjectListItemProps {
  subject: Subject;
}

export function SubjectListItem({ subject }: SubjectListItemProps) {
  const renameSubject = useAppStore((state) => state.renameSubject);
  const removeSubject = useAppStore((state) => state.removeSubject);

  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(subject.name);
  const [error, setError] = useState<string | null>(null);

  function commitRename() {
    const trimmed = draftName.trim();
    if (trimmed && trimmed !== subject.name) {
      renameSubject(subject.id, trimmed);
    } else {
      setDraftName(subject.name);
    }
    setIsEditing(false);
  }

  function handleRemove() {
    try {
      removeSubject(subject.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove subject.");
    }
  }

  return (
    <li className="flex items-center justify-between gap-4 rounded border border-gray-200 px-4 py-3">
      <div>
        {isEditing ? (
          <input
            autoFocus
            value={draftName}
            onChange={(event) => setDraftName(event.target.value)}
            onBlur={commitRename}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                commitRename();
              }
              if (event.key === "Escape") {
                setDraftName(subject.name);
                setIsEditing(false);
              }
            }}
            aria-label="Subject name"
            className="rounded border border-gray-300 px-2 py-1 text-sm"
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-left text-sm font-medium"
          >
            {subject.name}
          </button>
        )}
        <p className="text-xs text-gray-500">
          Level {subject.level} · {subject.xp} XP · {subject.totalMinutes} min studied
        </p>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
      <button
        type="button"
        onClick={handleRemove}
        className="shrink-0 text-xs font-medium text-red-600"
      >
        Remove
      </button>
    </li>
  );
}
