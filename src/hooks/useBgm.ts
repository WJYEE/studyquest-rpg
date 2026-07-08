import { useEffect } from "react";

import { useAudioStore } from "../store/useAudioStore";

export type BgmTrack = "hub" | "quest";

/**
 * Placeholder BGM hook — v1.2 wires the architecture (mute state, track
 * selection by scene) but ships no audio files yet (see
 * public/assets/audio/bgm's README). Once real files land at
 * /assets/audio/bgm/{hub,quest}-loop.mp3, this becomes a real <audio> src
 * swap keyed by `track`; until then it's a documented no-op so call sites
 * (RpgHud, TimerManager) don't need to change later.
 */
export function useBgm(track: BgmTrack): void {
  const muted = useAudioStore((state) => state.muted);

  useEffect(() => {
    if (muted) return;
    // No audio source exists yet — intentionally not creating an <audio>
    // element that would point at a missing file.
  }, [track, muted]);
}
