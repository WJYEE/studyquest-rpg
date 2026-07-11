"use client";

import { useState } from "react";

import { PageTitle } from "../../../components/rpg/PageTitle";
import { RpgBackground, type RpgScene } from "../../../components/rpg/RpgBackground";
import { useAppStore, type StopSessionResult } from "../../../store/useAppStore";
import {
  CharacterSprite,
  type CharacterAnimState,
  tierForLevel,
} from "../../character/components/CharacterSprite";
import { SessionSummary } from "./SessionSummary";
import { SubjectSelector } from "./SubjectSelector";
import { TimerControls } from "./TimerControls";
import { TimerDisplay } from "./TimerDisplay";

/**
 * Owns the scene/animation-state decision itself (rather than the page)
 * because both depend on `lastResult`, local interaction state that only
 * exists here — the quest-complete moment switches the backdrop to `field`
 * and the character to `levelup`/`training`, distinct from the `library`
 * backdrop + `walking`/`idle` character used while a session is in
 * progress.
 */
export function TimerManager() {
  const activeSession = useAppStore((state) => state.activeSession);
  const user = useAppStore((state) => state.user);
  const equippedItemIds = useAppStore((state) => state.equippedItemIds);
  const appearance = useAppStore((state) => state.appearance);
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

  const scene: RpgScene = lastResult ? "field" : "library";
  const animState: CharacterAnimState = lastResult
    ? lastResult.userLevelsGained > 0
      ? "levelup"
      : "training"
    : activeSession?.status === "running"
      ? "walking"
      : "idle";

  return (
    <RpgBackground scene={scene}>
      <main className="mx-auto w-full max-w-lg px-4 py-8">
        <section className="flex flex-col items-center gap-6">
          <PageTitle>Study Quest</PageTitle>

          <div className="relative flex flex-col items-center">
            <CharacterSprite
              tier={tierForLevel(user.level)}
              appearance={appearance}
              hasHat={Boolean(equippedItemIds.hat)}
              hasOutfit={Boolean(equippedItemIds.outfit)}
              hasAccessory={Boolean(equippedItemIds.accessory)}
              animState={animState}
            />
            <div className="-mt-2 h-2 w-10 rounded-full bg-rpg-ink opacity-20" aria-hidden="true" />
          </div>

          {lastResult ? (
            <SessionSummary
              result={lastResult}
              onDismiss={() => setLastResult(null)}
            />
          ) : (
            <div className="flex w-full flex-col items-center gap-6">
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
            </div>
          )}
        </section>
      </main>
    </RpgBackground>
  );
}
