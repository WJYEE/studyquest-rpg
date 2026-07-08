import { XP_PER_LEVEL_MULTIPLIER } from "./economyConfig";

/** XP required to advance from currentLevel to currentLevel + 1 (requirements.md §4.2). */
export function xpRequiredForLevel(currentLevel: number): number {
  return currentLevel * XP_PER_LEVEL_MULTIPLIER;
}

export interface LevelProgress {
  level: number;
  xp: number;
  levelsGained: number;
}

/**
 * Applies an XP gain to a level/xp pair, cascading through multiple
 * level-ups if the gain crosses more than one threshold in one go (e.g. a
 * long study session), carrying remaining XP into the new level.
 */
export function applyXpGain(
  currentLevel: number,
  currentXp: number,
  xpGained: number
): LevelProgress {
  let level = currentLevel;
  let xp = currentXp + xpGained;
  let levelsGained = 0;

  while (xp >= xpRequiredForLevel(level)) {
    xp -= xpRequiredForLevel(level);
    level += 1;
    levelsGained += 1;
  }

  return { level, xp, levelsGained };
}

/** Progress toward the next level as a 0–1 ratio, for progress-bar UI. */
export function calculateLevelProgress(level: number, xp: number): number {
  const required = xpRequiredForLevel(level);
  if (required <= 0) {
    return 0;
  }
  return Math.min(xp / required, 1);
}
