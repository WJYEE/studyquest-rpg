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
      <div className="flex items-center justify-between text-sm font-medium">
        <span>Level {level}</span>
        <span className="text-gray-500">
          {xp} / {required} XP
        </span>
      </div>
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full bg-blue-600"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    </div>
  );
}
