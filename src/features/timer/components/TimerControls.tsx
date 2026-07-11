"use client";

import { useState } from "react";

import { Button } from "../../../components/Button";
import { WindowFrame } from "../../../components/rpg/WindowFrame";
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
    <WindowFrame variant="slot" className="flex flex-col gap-2 px-3 py-3">
      <div className="flex flex-wrap gap-2">
        {!activeSession && (
          <Button onClick={handleStart} disabled={!selectedSubjectId}>
            Begin Quest
          </Button>
        )}
        {activeSession?.status === "running" && (
          <Button variant="secondary" onClick={() => runAction(pauseSession)}>
            Rest
          </Button>
        )}
        {activeSession?.status === "paused" && (
          <Button variant="secondary" onClick={() => runAction(resumeSession)}>
            Continue
          </Button>
        )}
        {activeSession && (
          <>
            <Button variant="success" onClick={handleStop}>
              Claim Reward
            </Button>
            <Button variant="secondary" onClick={() => runAction(cancelSession)}>
              Abandon Quest
            </Button>
          </>
        )}
      </div>
      {error && (
        <p className="text-xs text-rpg-danger" role="alert">
          {error}
        </p>
      )}
    </WindowFrame>
  );
}
