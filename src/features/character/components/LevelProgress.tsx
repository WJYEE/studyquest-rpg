import { calculateLevelProgress, xpRequiredForLevel } from "../../../lib/levelCalculation";

interface LevelProgressProps {
  level: number;
  xp: number;
}

export function LevelProgress({ level, xp }: LevelProgressProps) {
  const required = xpRequiredForLevel(level);
  const ratio = calculateLevelProgress(level, xp);

  return (
    <div className="w-full max-w-xs">
      <div className="flex items-center justify-between text-sm font-medium text-rpg-ink">
        <span>Level {level}</span>
        <span className="text-rpg-ink-soft">
          {xp} / {required} XP
        </span>
      </div>
      <div className="mt-1 h-3 w-full overflow-hidden border-2 border-rpg-ink bg-rpg-parchment-dark">
        <div
          className="h-full bg-rpg-xp shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)] transition-[width] duration-500"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    </div>
  );
}
