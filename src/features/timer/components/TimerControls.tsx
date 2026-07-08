"use client";

import { useState } from "react";

import { useAppStore, type StopSessionResult } from "../../../store/useAppStore";

interface TimerControlsProps {
  selectedSubjectId: string | null;
  onStopped: (result: StopSessionResult) => void;
}

export function TimerControls({
  selectedSubjectId,
  onStopped,
}: TimerControlsProps) {
  const activeSession = useAppStore((state) => state.activeSession);
  const startSession = useAppStore((state) => state.startSession);
  const pauseSession = useAppStore((state) => state.pauseSession);
  const resumeSession = useAppStore((state) => state.resumeSession);
  const cancelSession = useAppStore((state) => state.cancelSession);
  const stopSession = useAppStore((state) => state.stopSession);

  const [error, setError] = useState<string | null>(null);

  function runAction(action: () => void) {
    try {
      setError(null);
      action();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  function handleStart() {
    if (!selectedSubjectId) {
      setError("Choose a subject before starting.");
      return;
    }
    runAction(() => startSession(selectedSubjectId));
  }

  function handleStop() {
    runAction(() => {
      const result = stopSession();
      onStopped(result);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {!activeSession && (
          <button
            type="button"
            onClick={handleStart}
            disabled={!selectedSubjectId}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            Start
          </button>
        )}
        {activeSession?.status === "running" && (
          <button
            type="button"
            onClick={() => runAction(pauseSession)}
            className="rounded bg-gray-200 px-4 py-2 text-sm font-medium"
          >
            Pause
          </button>
        )}
        {activeSession?.status === "paused" && (
          <button
            type="button"
            onClick={() => runAction(resumeSession)}
            className="rounded bg-gray-200 px-4 py-2 text-sm font-medium"
          >
            Resume
          </button>
        )}
        {activeSession && (
          <>
            <button
              type="button"
              onClick={handleStop}
              className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white"
            >
              Stop
            </button>
            <button
              type="button"
              onClick={() => runAction(cancelSession)}
              className="rounded bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600"
            >
              Cancel
            </button>
          </>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
