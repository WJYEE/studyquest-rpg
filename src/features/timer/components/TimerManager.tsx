"use client";

import { useState } from "react";

import { useAppStore, type StopSessionResult } from "../../../store/useAppStore";
import { SessionSummary } from "./SessionSummary";
import { SubjectSelector } from "./SubjectSelector";
import { TimerControls } from "./TimerControls";
import { TimerDisplay } from "./TimerDisplay";

export function TimerManager() {
  const activeSession = useAppStore((state) => state.activeSession);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null
  );
  const [lastResult, setLastResult] = useState<StopSessionResult | null>(
    null
  );

  function handleStopped(result: StopSessionResult) {
    setLastResult(result);
    setSelectedSubjectId(null);
  }

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">Study Timer</h1>
      {lastResult && (
        <SessionSummary
          result={lastResult}
          onDismiss={() => setLastResult(null)}
        />
      )}
      <SubjectSelector
        selectedSubjectId={selectedSubjectId}
        onSelect={setSelectedSubjectId}
        disabled={activeSession !== null}
      />
      <TimerDisplay />
      <TimerControls
        selectedSubjectId={selectedSubjectId}
        onStopped={handleStopped}
      />
    </section>
  );
}
