import { MIN_SESSION_MINUTES_FOR_REWARD, MINUTES_PER_COIN } from "./economyConfig";

/** Coins earned for a completed study session (requirements.md §4.1). */
export function calculateSessionCoins(durationMinutes: number): number {
  if (durationMinutes < MIN_SESSION_MINUTES_FOR_REWARD) {
    return 0;
  }

  return Math.floor(durationMinutes / MINUTES_PER_COIN);
}
