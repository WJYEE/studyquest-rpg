# Background music (future)

No files here yet — `src/hooks/useBgm.ts` wires the mute-state plumbing
(persisted via `src/store/useAudioStore.ts`) but intentionally plays
nothing, since no track exists to point an `<audio>` element at.

Planned tracks, one loop per context bucket (not per-route):

```
audio/bgm/
  hub-loop.mp3     # Home, Subjects, Character, Shop, Dashboard (town/room scenes)
  quest-loop.mp3   # Timer, while a session is running (library/field scenes)
```
