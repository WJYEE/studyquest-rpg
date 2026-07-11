import type { CSSProperties, ReactNode } from "react";

export type RpgScene = "town" | "room" | "library" | "field";

interface SceneStyle {
  gradient: string;
  groundColor: string;
  groundDark: string;
}

const SCENE_STYLES: Record<RpgScene, SceneStyle> = {
  town: {
    gradient: "linear-gradient(180deg, #fef3d7 0%, #f7d9a0 100%)",
    groundColor: "#c9a876",
    groundDark: "#b08e5f",
  },
  room: {
    gradient: "linear-gradient(180deg, #e9d8b4 0%, #c9a876 100%)",
    groundColor: "#8a5a34",
    groundDark: "#6b4226",
  },
  library: {
    gradient: "linear-gradient(180deg, #4a3a2c 0%, #6b4f3a 100%)",
    groundColor: "#3f2c1e",
    groundDark: "#2c1f15",
  },
  field: {
    gradient: "linear-gradient(180deg, #bfe3a0 0%, #7cb768 100%)",
    groundColor: "#5c9450",
    groundDark: "#4a7d3f",
  },
};

const BOOK_COLORS = ["#a83232", "#4c7a3d", "#6fa8c9", "#b8860b", "#8a5a34", "#6b4fa0"];

/** A stack of shelf rows with variable-height "book spine" ticks, wood-strip shelves between rows. */
function Bookshelf({ rows, className }: { rows: number; className?: string }) {
  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`} aria-hidden="true">
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="flex items-end gap-0.5 border-b-4" style={{ borderColor: "#5c3a22" }}>
          {BOOK_COLORS.map((color, i) => (
            <div
              key={i}
              className="w-2"
              style={{ height: 10 + ((row * 7 + i * 5) % 14), backgroundColor: color }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function RoomDecor() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-3 flex items-end justify-between px-6 sm:px-10"
      aria-hidden="true"
    >
      <Bookshelf rows={2} className="opacity-90" />
      <div
        className="relative h-16 w-16 border-4 shrink-0"
        style={{
          borderColor: "#5c3a22",
          background: "linear-gradient(180deg, #d7ecf5 0%, #9fcfe0 100%)",
        }}
      >
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2" style={{ backgroundColor: "#5c3a22" }} />
        <div className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2" style={{ backgroundColor: "#5c3a22" }} />
      </div>
    </div>
  );
}

function TownDecor() {
  const houses = [
    { w: 44, h: 34, color: "#c0392b" },
    { w: 58, h: 46, color: "#a9673a" },
    { w: 40, h: 30, color: "#6b4fa0" },
    { w: 52, h: 42, color: "#c0392b" },
    { w: 44, h: 34, color: "#a9673a" },
  ];
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-3 flex items-end justify-center gap-3 px-4 opacity-90"
      aria-hidden="true"
    >
      {houses.map((house, i) => (
        <div
          key={i}
          className="shrink-0"
          style={
            {
              width: house.w,
              height: house.h,
              backgroundColor: house.color,
              clipPath: "polygon(0% 100%, 0% 45%, 50% 0%, 100% 45%, 100% 100%)",
            } satisfies CSSProperties
          }
        />
      ))}
    </div>
  );
}

function LibraryDecor() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-3 flex flex-col gap-3 px-4" aria-hidden="true">
      <Bookshelf rows={1} />
      <Bookshelf rows={1} />
      <Bookshelf rows={1} />
    </div>
  );
}

function FieldDecor() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-3" aria-hidden="true">
      {/* drifting clouds */}
      <div className="absolute -top-24 left-6 flex gap-1 opacity-80 animate-pixel-drift">
        <div className="h-4 w-8 rounded-full bg-white" />
        <div className="h-6 w-6 -ml-3 rounded-full bg-white" />
      </div>
      <div className="absolute -top-16 right-10 flex gap-1 opacity-70 animate-pixel-drift" style={{ animationDelay: "-3s" }}>
        <div className="h-3 w-6 rounded-full bg-white" />
        <div className="h-5 w-5 -ml-2 rounded-full bg-white" />
      </div>
      {/* rolling hills */}
      <div className="absolute inset-x-0 bottom-0 h-10 rounded-t-[50%] opacity-70" style={{ backgroundColor: "#4a7d3f" }} />
      <div className="absolute -left-6 bottom-0 h-16 w-40 rounded-t-[50%]" style={{ backgroundColor: "#5c9450" }} />
      <div className="absolute right-0 bottom-0 h-12 w-52 rounded-t-[50%] opacity-90" style={{ backgroundColor: "#5c9450" }} />
      {/* trees */}
      {[20, 55, 82].map((left, i) => (
        <div key={i} className="absolute bottom-6" style={{ left: `${left}%` }}>
          <div className="mx-auto h-4 w-1.5" style={{ backgroundColor: "#5c3a22" }} />
          <div
            className="-mt-6 h-6 w-6 rounded-full"
            style={{ backgroundColor: i % 2 === 0 ? "#3f6b3a" : "#4c7a3d" }}
          />
        </div>
      ))}
    </div>
  );
}

const SCENE_DECOR: Record<RpgScene, () => ReactNode> = {
  room: RoomDecor,
  town: TownDecor,
  library: LibraryDecor,
  field: FieldDecor,
};

interface RpgBackgroundProps {
  scene: RpgScene;
  children: ReactNode;
}

/**
 * Full-bleed scene backdrop behind a page's content: a gradient sky, a
 * scene-appropriate CSS silhouette (bookshelf+window for `room`, a rooftop
 * skyline for `town`, stacked bookshelves for `library`, rolling hills +
 * trees + drifting clouds for `field`), a low-opacity dither texture, and a
 * plank/cobble ground strip. CSS-only — no image files — per v1.1/v1.2's
 * "no external assets yet" constraint; see public/assets/backgrounds for
 * the future swap-in point.
 */
export function RpgBackground({ scene, children }: RpgBackgroundProps) {
  const style = SCENE_STYLES[scene];
  const Decor = SCENE_DECOR[scene];

  return (
    <div
      className="pixel-texture relative min-h-[calc(100vh-8rem)] w-full overflow-hidden"
      style={{ background: style.gradient }}
    >
      <Decor />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-3"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, ${style.groundColor} 0px, ${style.groundColor} 18px, ${style.groundDark} 18px, ${style.groundDark} 20px)`,
        }}
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
