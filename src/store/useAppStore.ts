import { create } from "zustand";

import { calculateSessionCoins } from "../lib/coinCalculation";
import { generateId } from "../lib/id";
import { getItemById } from "../lib/itemCatalog";
import { applyXpGain } from "../lib/levelCalculation";
import { calculateLevelUpBonus } from "../lib/levelUpRewards";
import { evaluatePurchase, purchaseIneligibleMessage } from "../lib/shopValidation";
import {
  DEFAULT_USER,
  loadInventory,
  loadSessions,
  loadSubjects,
  loadUser,
  saveInventory,
  saveSessions,
  saveSubjects,
  saveUser,
} from "../lib/storage";
import { calculateElapsedMs, elapsedMsToMinutes } from "../lib/timerElapsed";
import { calculateSessionXp } from "../lib/xpCalculation";
import type { StudySession } from "../types/session";
import type { Subject } from "../types/subject";
import type { User } from "../types/user";

type ActiveSessionStatus = "running" | "paused";

/**
 * The in-progress timer. Not one of data_model.md's persisted entities and
 * intentionally not written to LocalStorage (coding_standard.md §4 only
 * documents keys for User/Subject/StudySession/Item) — a v1 simplification
 * that lets refresh-mid-session simply lose the running timer rather than
 * having to reconcile stale timestamps.
 */
interface ActiveSession {
  subjectId: string;
  status: ActiveSessionStatus;
  /** Epoch ms when the current running segment began; unused while paused. */
  startedAt: number;
  /** Elapsed ms banked from prior running segments, as of the last pause. */
  accumulatedMs: number;
}

export interface StopSessionResult {
  session: StudySession;
  xpEarned: number;
  coinEarned: number;
  userLevelsGained: number;
  subjectLevelsGained: number;
}

interface AppState {
  user: User;
  subjects: Subject[];
  sessions: StudySession[];
  activeSession: ActiveSession | null;
  ownedItemIds: string[];
  equippedItemId: string | null;
}

interface AppActions {
  /** Loads persisted state from LocalStorage. Call once on client mount. */
  hydrate: () => void;
  addSubject: (name: string) => Subject;
  renameSubject: (id: string, name: string) => void;
  /** Deletes subjects with no session history; archives subjects that have any (requirements.md FR-S3). */
  removeSubject: (id: string) => void;
  startSession: (subjectId: string) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  cancelSession: () => void;
  stopSession: () => StopSessionResult;
  purchaseItem: (itemId: string) => void;
  equipItem: (itemId: string) => void;
}

/** Subjects available for starting a new session (requirements.md FR-S5). */
export function selectSelectableSubjects(subjects: Subject[]): Subject[] {
  return subjects.filter((subject) => !subject.isArchived);
}

export const useAppStore = create<AppState & AppActions>()((set, get) => ({
  // Initial state is always the pre-hydration default, on both server and
  // the first client render, so SSR output and the initial client render
  // match. hydrate() applies real LocalStorage data after mount.
  user: DEFAULT_USER,
  subjects: [],
  sessions: [],
  activeSession: null,
  ownedItemIds: [],
  equippedItemId: null,

  hydrate: () => {
    const inventory = loadInventory();
    set({
      user: loadUser(),
      subjects: loadSubjects(),
      sessions: loadSessions(),
      ownedItemIds: inventory.ownedItemIds,
      equippedItemId: inventory.equippedItemId,
    });
  },

  addSubject: (name) => {
    const subject: Subject = {
      id: generateId(),
      name,
      level: 1,
      xp: 0,
      totalMinutes: 0,
      isArchived: false,
    };
    const subjects = [...get().subjects, subject];
    set({ subjects });
    saveSubjects(subjects);
    return subject;
  },

  renameSubject: (id, name) => {
    const subjects = get().subjects.map((subject) =>
      subject.id === id ? { ...subject, name } : subject
    );
    set({ subjects });
    saveSubjects(subjects);
  },

  removeSubject: (id) => {
    const { subjects, sessions, activeSession } = get();

    if (activeSession?.subjectId === id) {
      throw new Error(
        "Cannot remove a subject with an active session in progress."
      );
    }

    const hasHistory = sessions.some((session) => session.subjectId === id);
    const nextSubjects = hasHistory
      ? subjects.map((subject) =>
          subject.id === id ? { ...subject, isArchived: true } : subject
        )
      : subjects.filter((subject) => subject.id !== id);

    set({ subjects: nextSubjects });
    saveSubjects(nextSubjects);
  },

  startSession: (subjectId) => {
    const { activeSession, subjects } = get();

    if (activeSession !== null) {
      throw new Error(
        "A session is already active; stop or cancel it before starting a new one."
      );
    }

    const subject = subjects.find((s) => s.id === subjectId);
    if (!subject) {
      throw new Error(`No subject found with id "${subjectId}".`);
    }
    if (subject.isArchived) {
      throw new Error("Archived subjects cannot be selected for new sessions.");
    }

    set({
      activeSession: {
        subjectId,
        status: "running",
        startedAt: Date.now(),
        accumulatedMs: 0,
      },
    });
  },

  pauseSession: () => {
    const { activeSession } = get();
    if (!activeSession) {
      throw new Error("No active session to pause.");
    }
    if (activeSession.status !== "running") {
      throw new Error("Active session is not running.");
    }

    set({
      activeSession: {
        ...activeSession,
        status: "paused",
        accumulatedMs: calculateElapsedMs(activeSession),
      },
    });
  },

  resumeSession: () => {
    const { activeSession } = get();
    if (!activeSession) {
      throw new Error("No active session to resume.");
    }
    if (activeSession.status !== "paused") {
      throw new Error("Active session is not paused.");
    }

    set({
      activeSession: {
        ...activeSession,
        status: "running",
        startedAt: Date.now(),
      },
    });
  },

  cancelSession: () => {
    if (!get().activeSession) {
      throw new Error("No active session to cancel.");
    }
    set({ activeSession: null });
  },

  stopSession: () => {
    const { activeSession, user, subjects, sessions } = get();
    if (!activeSession) {
      throw new Error("No active session to stop.");
    }

    const elapsedMs = calculateElapsedMs(activeSession);
    const durationMinutes = elapsedMsToMinutes(elapsedMs);

    const xpEarned = calculateSessionXp(durationMinutes);
    const coinEarned = calculateSessionCoins(durationMinutes);

    const session: StudySession = {
      id: generateId(),
      subjectId: activeSession.subjectId,
      duration: durationMinutes,
      createdAt: new Date().toISOString(),
    };

    const userProgress = applyXpGain(user.level, user.xp, xpEarned);
    const levelUpBonus = calculateLevelUpBonus(user.level, userProgress.level);
    const nextUser: User = {
      ...user,
      level: userProgress.level,
      xp: userProgress.xp,
      coin: user.coin + coinEarned + levelUpBonus.coin,
      diamond: user.diamond + levelUpBonus.diamond,
    };

    const subject = subjects.find((s) => s.id === activeSession.subjectId);
    if (!subject) {
      throw new Error(
        `Active session references a missing subject "${activeSession.subjectId}".`
      );
    }
    const subjectProgress = applyXpGain(subject.level, subject.xp, xpEarned);
    const nextSubjects = subjects.map((s) =>
      s.id === subject.id
        ? {
            ...s,
            level: subjectProgress.level,
            xp: subjectProgress.xp,
            totalMinutes: s.totalMinutes + durationMinutes,
          }
        : s
    );

    const nextSessions = [...sessions, session];

    set({
      user: nextUser,
      subjects: nextSubjects,
      sessions: nextSessions,
      activeSession: null,
    });

    saveUser(nextUser);
    saveSubjects(nextSubjects);
    saveSessions(nextSessions);

    return {
      session,
      xpEarned,
      coinEarned,
      userLevelsGained: userProgress.levelsGained,
      subjectLevelsGained: subjectProgress.levelsGained,
    };
  },

  purchaseItem: (itemId) => {
    const { user, ownedItemIds, equippedItemId } = get();
    const item = getItemById(itemId);

    const eligibility = evaluatePurchase(
      item,
      { coin: user.coin, diamond: user.diamond },
      ownedItemIds
    );
    if (!eligibility.eligible || !item) {
      throw new Error(
        purchaseIneligibleMessage(eligibility.reason ?? "item-not-found")
      );
    }

    const nextUser: User = {
      ...user,
      coin: item.currency === "coin" ? user.coin - item.price : user.coin,
      diamond:
        item.currency === "diamond" ? user.diamond - item.price : user.diamond,
    };
    const nextOwnedItemIds = [...ownedItemIds, itemId];

    set({ user: nextUser, ownedItemIds: nextOwnedItemIds });
    saveUser(nextUser);
    saveInventory({ ownedItemIds: nextOwnedItemIds, equippedItemId });
  },

  equipItem: (itemId) => {
    const { ownedItemIds } = get();

    if (!ownedItemIds.includes(itemId)) {
      throw new Error("You can only equip items you own.");
    }

    set({ equippedItemId: itemId });
    saveInventory({ ownedItemIds, equippedItemId: itemId });
  },
}));
