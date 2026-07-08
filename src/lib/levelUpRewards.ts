import { COIN_PER_LEVEL_MULTIPLIER, DIAMOND_LEVEL_INTERVAL } from "./economyConfig";

export interface LevelUpBonus {
  coin: number;
  diamond: number;
}

/**
 * Coin/diamond bonus for advancing from oldLevel to newLevel in one call.
 * A single long session can cross multiple levels at once (see
 * applyXpGain), so this sums the per-level coin bonus and diamond
 * milestones for every level crossed, not just the final level reached
 * (requirements.md §4.3).
 */
export function calculateLevelUpBonus(
  oldLevel: number,
  newLevel: number
): LevelUpBonus {
  let coin = 0;
  let diamond = 0;

  for (let level = oldLevel + 1; level <= newLevel; level += 1) {
    coin += level * COIN_PER_LEVEL_MULTIPLIER;
    if (level % DIAMOND_LEVEL_INTERVAL === 0) {
      diamond += 1;
    }
  }

  return { coin, diamond };
}
