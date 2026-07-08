import type { ReactNode } from "react";

export type RpgScene = "town" | "room" | "library" | "field";

interface SceneStyle {
  gradient: string;
  /** Relative heights (px) of the decorative silhouette bars along the bottom edge. */
  bars: number[];
  barColor: string;
}

const SCENE_STYLES: Record<RpgScene, SceneStyle> = {
  town: {
    gradient: "linear-gradient(180deg, #fef3d7 0%, #f7d9a0 100%)",
    bars: [18, 30, 22, 36, 20, 28, 16],
    barColor: "rgba(38,32,25,0.25)",
  },
  room: {
    gradient: "linear-gradient(180deg, #e9d8b4 0%, #c9a876 100%)",
    bars: [40, 24, 40, 24, 40, 24, 40],
    barColor: "rgba(38,32,25,0.3)",
  },
  library: {
    gradient: "linear-gradient(180deg, #4a3a2c 0%, #6b4f3a 100%)",
    bars: [46, 30, 46, 30, 46, 30, 46],
    barColor: "rgba(0,0,0,0.35)",
  },
  field: {
    gradient: "linear-gradient(180deg, #bfe3a0 0%, #7cb768 100%)",
    bars: [14, 26, 12, 34, 14, 22, 16],
    barColor: "rgba(38,32,25,0.2)",
  },
};

interface RpgBackgroundProps {
  scene: RpgScene;
  children: ReactNode;
}

/**
 * Full-bleed scene backdrop (gradient + a row of decorative silhouette
 * bars evoking rooftops/bookshelves/hills depending on `scene`) behind a
 * page's content. CSS-only — no image files — per v1.1/v1.2's "no external
 * assets yet" constraint; see public/assets/backgrounds for the future
 * swap-in point.
 */
export function RpgBackground({ scene, children }: RpgBackgroundProps) {
  const style = SCENE_STYLES[scene];

  return (
    <div
      className="relative min-h-[calc(100vh-8rem)] w-full overflow-hidden"
      style={{ background: style.gradient }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end gap-2 px-4 opacity-80"
        aria-hidden="true"
      >
        {style.bars.map((height, index) => (
          <div
            key={index}
            className="w-6 shrink-0"
            style={{ height, backgroundColor: style.barColor }}
          />
        ))}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
