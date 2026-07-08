export interface Subject {
  id: string;
  name: string;
  level: number;
  xp: number;
  totalMinutes: number;
  /**
   * Subjects with existing StudySession history are archived instead of
   * deleted, to preserve historical dashboard stats (requirements.md FR-S3).
   */
  isArchived: boolean;
}
