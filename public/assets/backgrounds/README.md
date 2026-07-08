# Background scene assets (future)

No files here yet — scenes render as CSS gradients + a decorative
silhouette-bar strip generated entirely in
`src/components/rpg/RpgBackground.tsx` (`SCENE_STYLES`), not image files.

If hand-authored background art turns out cleaner than the generated
gradient/silhouette, drop files in here named after the `RpgScene` union in
`RpgBackground.tsx`:

```
backgrounds/
  town.svg
  room.svg
  library.svg
  field.svg
```

Swapping in real art should only require changing `RpgBackground.tsx`.
