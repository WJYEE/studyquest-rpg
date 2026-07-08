import { useEffect } from "react";

import { useAppStore } from "../store/useAppStore";
import { useAudioStore } from "../store/useAudioStore";

/**
 * Loads persisted state from LocalStorage once, after mount. Must run on
 * the client only — calling hydrate() during the initial render would make
 * that render diverge from the server-rendered HTML (see useAppStore.ts).
 */
export function useHydrateStore(): void {
  useEffect(() => {
    useAppStore.getState().hydrate();
    useAudioStore.getState().hydrate();
  }, []);
}
