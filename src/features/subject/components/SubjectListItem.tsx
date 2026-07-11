"use client";

import { useState } from "react";

import { Button } from "../../../components/Button";
import { inputClassName } from "../../../components/Input";
import { WindowFrame } from "../../../components/rpg/WindowFrame";
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
    <WindowFrame
      as="li"
      variant="slot"
      className="flex items-center justify-between gap-4 px-4 py-3"
    >
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
            className={inputClassName()}
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-left text-sm font-medium text-rpg-ink underline decoration-rpg-ink-soft decoration-dotted underline-offset-2 hover:decoration-rpg-ink"
          >
            {subject.name}
          </button>
        )}
        <p className="text-xs text-rpg-ink-soft">
          Level {subject.level} · {subject.xp} XP · {subject.totalMinutes} min studied
        </p>
        {error && <p className="text-xs text-rpg-danger">{error}</p>}
      </div>
      <Button
        variant="danger"
        size="sm"
        onClick={handleRemove}
        className="shrink-0"
      >
        Remove
      </Button>
    </WindowFrame>
  );
}
