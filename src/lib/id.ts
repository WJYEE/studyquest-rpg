/** Centralized id strategy so callers never depend on crypto.randomUUID() directly. */
export function generateId(): string {
  return crypto.randomUUID();
}
