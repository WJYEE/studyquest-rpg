import type { Inventory } from "../types/item";
import type { StudySession } from "../types/session";
import type { Subject } from "../types/subject";
import type { User } from "../types/user";

/** One namespaced key per top-level entity collection (coding_standard.md §4). */
const STORAGE_KEYS = {
  user: "studyquest:user",
  subjects: "studyquest:subjects",
  sessions: "studyquest:sessions",
  inventory: "studyquest:inventory",
} as const;

const DEFAULT_INVENTORY: Inventory = {
  ownedItemIds: [],
  equippedItemId: null,
};

/** v1 has no accounts, so there is exactly one local profile with a fixed id. */
const LOCAL_USER_ID = "local-user";

export const DEFAULT_USER: User = {
  id: LOCAL_USER_ID,
  nickname: "Player",
  level: 1,
  xp: 0,
  coin: 0,
  diamond: 0,
};

function readFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be unavailable (quota exceeded, private browsing).
    // v1 has no offline-write queue, so writes fail silently.
  }
}

export function loadUser(): User {
  return readFromStorage(STORAGE_KEYS.user, DEFAULT_USER);
}

export function saveUser(user: User): void {
  writeToStorage(STORAGE_KEYS.user, user);
}

export function loadSubjects(): Subject[] {
  return readFromStorage<Subject[]>(STORAGE_KEYS.subjects, []);
}

export function saveSubjects(subjects: Subject[]): void {
  writeToStorage(STORAGE_KEYS.subjects, subjects);
}

export function loadSessions(): StudySession[] {
  return readFromStorage<StudySession[]>(STORAGE_KEYS.sessions, []);
}

export function saveSessions(sessions: StudySession[]): void {
  writeToStorage(STORAGE_KEYS.sessions, sessions);
}

export function loadInventory(): Inventory {
  return readFromStorage(STORAGE_KEYS.inventory, DEFAULT_INVENTORY);
}

export function saveInventory(inventory: Inventory): void {
  writeToStorage(STORAGE_KEYS.inventory, inventory);
}
