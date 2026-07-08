import { create } from "zustand";

/**
 * Own storage key/module, deliberately separate from lib/storage.ts — that
 * file's docstring scopes it to the 4 persisted domain entities
 * (User/Subject/StudySession/Item) from data_model.md. Audio settings are a
 * UI preference, not a domain entity, so they get their own tiny
 * read/write pair here rather than growing that file's scope.
 */
const STORAGE_KEY = "studyquest:audioSettings";

interface AudioSettings {
  muted: boolean;
  volume: number;
}

const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  // Starts muted: no BGM/SFX files exist yet (public/assets/audio is a
  // placeholder), and browsers block autoplay before a user gesture anyway.
  muted: true,
  volume: 0.6,
};

function readSettings(): AudioSettings {
  if (typeof window === "undefined") {
    return DEFAULT_AUDIO_SETTINGS;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return DEFAULT_AUDIO_SETTINGS;
    }
    return { ...DEFAULT_AUDIO_SETTINGS, ...JSON.parse(raw) } as AudioSettings;
  } catch {
    return DEFAULT_AUDIO_SETTINGS;
  }
}

function writeSettings(settings: AudioSettings): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Storage may be unavailable; settings just won't persist across reloads.
  }
}

interface AudioState extends AudioSettings {
  hydrate: () => void;
  toggleMuted: () => void;
}

export const useAudioStore = create<AudioState>()((set, get) => ({
  ...DEFAULT_AUDIO_SETTINGS,

  hydrate: () => set(readSettings()),

  toggleMuted: () => {
    const next: AudioSettings = { muted: !get().muted, volume: get().volume };
    set(next);
    writeSettings(next);
  },
}));
