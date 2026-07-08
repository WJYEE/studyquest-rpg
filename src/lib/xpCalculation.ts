import {
  BONUS_XP_TIERS,
  MIN_SESSION_MINUTES_FOR_REWARD,
  XP_PER_MINUTE,
} from "./economyConfig";

/**
 * Flat bonus XP from the highest duration tier reached, or 0 if none apply.
 * Exported separately from calculateSessionXp so a session summary UI can
 * show base XP and bonus XP as distinct line items later.
 */
export function calculateBonusXp(durationMinutes: number): number {
  const tier = BONUS_XP_TIERS.find((t) => durationMinutes >= t.minMinutes);
  return tier ? tier.bonusXp : 0;
}

/**
 * Total XP earned for a completed study session (requirements.md §4.1).
 * Applied to both the global User XP and the selected Subject's XP.
 */
export function calculateSessionXp(durationMinutes: number): number {
  if (durationMinutes < MIN_SESSION_MINUTES_FOR_REWARD) {
    return 0;
  }

  const baseXp = Math.floor(durationMinutes) * XP_PER_MINUTE;
  return baseXp + calculateBonusXp(durationMinutes);
}
