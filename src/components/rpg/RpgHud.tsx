"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  CharacterSprite,
  tierForLevel,
} from "../../features/character/components/CharacterSprite";
import { CurrencyDisplay } from "../../features/character/components/CurrencyDisplay";
import { calculateLevelProgress, xpRequiredForLevel } from "../../lib/levelCalculation";
import { useAppStore } from "../../store/useAppStore";
import { useAudioStore } from "../../store/useAudioStore";
import { buttonClassName } from "../Button";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/subjects", label: "Subjects" },
  { href: "/timer", label: "Timer" },
  { href: "/character", label: "Character" },
  { href: "/shop", label: "Shop" },
  { href: "/dashboard", label: "Dashboard" },
];

/**
 * Replaces NavBar (v1.1) — a persistent RPG HUD combining player status and
 * navigation into one window, per the v1.2 decision to make navigation feel
 * like part of the game shell rather than a separate website chrome bar.
 * Three stacked rows: portrait/level/XP/currency, current-quest status,
 * then a horizontal tab-ribbon nav (decision: not a collapsed corner menu —
 * navigation stays obvious).
 */
export function RpgHud() {
  const pathname = usePathname();
  const user = useAppStore((state) => state.user);
  const activeSession = useAppStore((state) => state.activeSession);
  const subjects = useAppStore((state) => state.subjects);
  const equippedItemIds = useAppStore((state) => state.equippedItemIds);
  const appearance = useAppStore((state) => state.appearance);
  const muted = useAudioStore((state) => state.muted);
  const toggleMuted = useAudioStore((state) => state.toggleMuted);

  const requiredXp = xpRequiredForLevel(user.level);
  const progressRatio = calculateLevelProgress(user.level, user.xp);
  const activeSubject = activeSession
    ? subjects.find((subject) => subject.id === activeSession.subjectId)
    : undefined;

  return (
    <header className="border-b-4 border-rpg-ink bg-rpg-parchment">
      <div className="mx-auto flex w-full max-w-lg flex-wrap items-center gap-3 px-4 py-2">
        <div className="relative flex flex-col items-center">
          <CharacterSprite
            tier={tierForLevel(user.level)}
            appearance={appearance}
            hasHat={Boolean(equippedItemIds.hat)}
            hasOutfit={Boolean(equippedItemIds.outfit)}
            hasAccessory={Boolean(equippedItemIds.accessory)}
          />
          <div className="-mt-1 h-1.5 w-8 rounded-full bg-rpg-ink opacity-20" aria-hidden="true" />
        </div>
        <div className="min-w-[7rem] flex-1">
          <div className="flex items-center justify-between text-xs font-semibold text-rpg-ink">
            <span className="font-pixel text-[10px] tracking-wide">Lv.{user.level}</span>
            <span className="font-normal text-rpg-ink-soft">
              {user.xp} / {requiredXp} XP
            </span>
          </div>
          <div className="mt-0.5 h-2 w-full overflow-hidden border border-rpg-ink-soft bg-rpg-parchment-dark">
            <div
              className="h-full bg-rpg-xp transition-[width] duration-500"
              style={{ width: `${progressRatio * 100}%` }}
            />
          </div>
        </div>
        <CurrencyDisplay coin={user.coin} diamond={user.diamond} />
        <button
          type="button"
          onClick={toggleMuted}
          aria-label={muted ? "Unmute sound" : "Mute sound"}
          className={buttonClassName("secondary", "sm", "px-2 py-1 text-base")}
        >
          {muted ? "🔇" : "🔊"}
        </button>
      </div>

      <div className="border-t-2 border-rpg-ink-soft px-4 py-1 text-xs">
        {activeSubject ? (
          <p className="text-rpg-ink">
            ⚔ On quest: <span className="font-semibold">{activeSubject.name}</span>
            {activeSession?.status === "paused" ? " (resting)" : ""}
          </p>
        ) : (
          <p className="text-rpg-ink-soft">No quest active</p>
        )}
      </div>

      <nav className="border-t-2 border-rpg-ink-soft">
        <ul className="mx-auto flex w-full max-w-lg flex-wrap gap-1 px-2 py-2 text-sm">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={
                    "inline-block border-2 px-2 py-1 font-pixel text-[10px] tracking-wide " +
                    (isActive
                      ? "border-rpg-ink bg-rpg-parchment-dark text-rpg-ink"
                      : "border-transparent text-rpg-ink-soft hover:border-rpg-ink-soft")
                  }
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
