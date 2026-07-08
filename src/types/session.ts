export interface StudySession {
  id: string;
  subjectId: string;
  /** Length of the session in minutes — the unit XP/coin formulas operate on (requirements.md §4.1). */
  duration: number;
  /** ISO 8601 timestamp of session completion. */
  createdAt: string;
}
