import { useAppStore } from "../../../store/useAppStore";
import type { CharacterAnimState } from "../components/CharacterSprite";

/**
 * Derives the character's default animation state from the active study
 * session — walking while a session is running, idle otherwise. The
 * transient "training"/"levelup" states are triggered locally by the
 * components that own that moment (e.g. the Quest Complete dialog), not
 * derived globally, since they're tied to a specific UI event rather than
 * persistent store state.
 */
export function useCharacterAnimationState(): CharacterAnimState {
  const activeSession = useAppStore((state) => state.activeSession);
  return activeSession?.status === "running" ? "walking" : "idle";
}
