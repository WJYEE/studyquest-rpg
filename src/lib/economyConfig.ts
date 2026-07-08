/**
 * Central, tunable economy constants — single source of truth for the rules
 * documented in requirements.md §4. xpCalculation.ts, coinCalculation.ts, and
 * levelCalculation.ts all read from here instead of hardcoding values, so the
 * economy can be re-balanced in one place.
 */

export const XP_PER_MINUTE = 1;
export const MINUTES_PER_COIN = 10;
export const MIN_SESSION_MINUTES_FOR_REWARD = 1;

export interface BonusXpTier {
  minMinutes: number;
  bonusXp: number;
}

/**
 * Ordered highest-tier-first. Only the first tier whose minMinutes is met
 * applies — bonus XP is non-cumulative (requirements.md §4.1).
 */
export const BONUS_XP_TIERS: BonusXpTier[] = [
  { minMinutes: 120, bonusXp: 60 },
  { minMinutes: 60, bonusXp: 25 },
  { minMinutes: 30, bonusXp: 10 },
];

/** XP needed to advance from currentLevel to currentLevel + 1 (requirements.md §4.2). */
export const XP_PER_LEVEL_MULTIPLIER = 100;

/** Coin bonus for reaching a level = level * this multiplier (requirements.md §4.3). */
export const COIN_PER_LEVEL_MULTIPLIER = 50;

/** A diamond is awarded for every level reached that's a multiple of this (requirements.md §4.3). */
export const DIAMOND_LEVEL_INTERVAL = 5;
