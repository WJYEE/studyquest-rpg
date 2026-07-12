"use client";

import { useState } from "react";

import { PageTitle } from "../../../components/rpg/PageTitle";
import { RpgBackground } from "../../../components/rpg/RpgBackground";
import { WindowFrame } from "../../../components/rpg/WindowFrame";
import { useAppStore, type StopSessionResult } from "../../../store/useAppStore";
import type { CharacterAnimState } from "../../character/components/CharacterSprite";
import { SessionSummary } from "./SessionSummary";
import { SubjectSelector } from "./SubjectSelector";
import { TimerControls } from "./TimerControls";
import { TimerDisplay } from "./TimerDisplay";
import { TimerFocusScene } from "./TimerFocusScene";

/**
 * Single primary panel — subject selector, the bounded focus scene, the
 * digit readout, and controls all live inside one `WindowFrame`, replacing
 * the old full-viewport scene-switching background plus a separately
 * floating character and a separately floating `TimerDisplay` box
 * (docs/02_design/screen-specs.md §5.2). `SessionSummary` still replaces
 * this panel entirely on completion — kept un-nested (its own `DialogBox`
 * chrome) rather than boxed inside a second panel.
 */
export function TimerManager() {
  const activeSession = useAppStore((state) => state.activeSession);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<StopSessionResult | null>(null);

  function handleStopped(result: StopSessionResult) {
    setLastResult(result);
    setSelectedSubjectId(null);
  }

  const animState: CharacterAnimState = activeSession?.status === "running" ? "walking" : "idle";

  return (
    <RpgBackground scene="quiet">
      <main className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 pt-6 pb-8">
        <PageTitle>Study Quest</PageTitle>

        {lastResult ? (
          <SessionSummary result={lastResult} onDismiss={() => setLastResult(null)} />
        ) : (
          <WindowFrame variant="window" className="flex flex-col gap-4 p-4">
            <SubjectSelector
              selectedSubjectId={selectedSubjectId}
              onSelect={setSelectedSubjectId}
              disabled={activeSession !== null}
            />
            <TimerFocusScene animState={animState} />
            <TimerDisplay />
            <TimerControls selectedSubjectId={selectedSubjectId} onStopped={handleStopped} />
          </WindowFrame>
        )}
      </main>
    </RpgBackground>
  );
}
