"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AssetIcon } from "../AssetIcon";
import { DollSprite } from "../../features/character/components/DollSprite";
import { calculateLevelProgress, xpRequiredForLevel } from "../../lib/levelCalculation";
import { useAppStore } from "../../store/useAppStore";
import { useAudioStore } from "../../store/useAudioStore";

interface NavLink {
  href: string;
  label: string;
  icon: string;
  /** Real cropped asset, when one exists (docs/02_design/asset-manifest.md) — falls back to `icon` via AssetIcon. */
  asset?: string;
}

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home", icon: "🏠", asset: "/assets/nav/home.png" },
  { href: "/subjects", label: "Subjects", icon: "📚", asset: "/assets/nav/subjects.png" },
  { href: "/timer", label: "Timer", icon: "⏱️", asset: "/assets/nav/timer.png" },
  { href: "/character", label: "Character", icon: "🧑", asset: "/assets/nav/character.png" },
  { href: "/shop", label: "Shop", icon: "🛍️", asset: "/assets/nav/shop.png" },
  { href: "/dashboard", label: "Dashboard", icon: "📊", asset: "/assets/nav/dashboard.png" },
];

/**
 * Persistent app shell, structurally split in two (docs/02_design's request
 * for a shell that reads as an app skeleton, not a single header block):
 *
 * - A slim top bar in normal document flow — brand mark on the left, a
 *   compact "portrait badge" on the right (framed avatar with a thin XP
 *   sliver along its own bottom edge, classic RPG-portrait convention,
 *   plus level/currency as stacked micro-text — not one long pill row).
 * - A fixed bottom tab bar (`position: fixed`, matching the reference UI
 *   sheet's 하단 네비게이션 바) — icon-over-label tabs with a small dot as
 *   the active indicator, not a filled pill. `layout.tsx` reserves body
 *   padding so this never covers page content.
 *
 * The old "on quest" status line stays dropped (see prior revision) — that
 * info lives on the Timer screen itself.
 */
export function RpgHud() {
  const pathname = usePathname();
  const user = useAppStore((state) => state.user);
  const appearance = useAppStore((state) => state.appearance);
  const muted = useAudioStore((state) => state.muted);
  const toggleMuted = useAudioStore((state) => state.toggleMuted);

  const requiredXp = xpRequiredForLevel(user.level);
  const progressRatio = calculateLevelProgress(user.level, user.xp);

  return (
    <>
      <header className="bg-rpg-parchment">
        <div className="mx-auto flex w-full max-w-lg items-center justify-between px-3 py-2">
          <Link href="/" className="flex items-center gap-1.5">
            <span className="relative block h-4 w-4 shrink-0" aria-hidden="true">
              <span className="absolute inset-0 rotate-45 bg-rpg-forest" />
              <span className="absolute inset-[3px] rotate-45 bg-rpg-parchment" />
            </span>
            <span className="font-pixel text-[11px] tracking-wide text-rpg-ink">StudyQuest</span>
          </Link>

          <div className="flex items-center gap-1.5 rounded-xl border border-rpg-ink-soft/40 bg-rpg-parchment-dark/30 p-1 pr-2">
            <div
              className="relative flex h-8 w-8 shrink-0 items-end justify-center overflow-hidden rounded-md bg-rpg-parchment"
              aria-hidden="true"
            >
              {/* height 26 -> width ~31px (26/168*202), so the w-8 box never crops the hair */}
              <DollSprite
                appearance={appearance}
                height={26}
                variant="bust"
                fallbackLevel={user.level}
              />
              <div
                className="absolute inset-x-0 bottom-0 h-1 bg-rpg-parchment-dark"
                role="progressbar"
                aria-valuenow={user.xp}
                aria-valuemin={0}
                aria-valuemax={requiredXp}
                aria-label={`Level ${user.level} progress: ${user.xp} of ${requiredXp} XP`}
              >
                <div
                  className="h-full bg-rpg-xp transition-[width] duration-500"
                  style={{ width: `${progressRatio * 100}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col items-start leading-tight">
              <span className="text-[10px] font-semibold whitespace-nowrap text-rpg-ink">
                Lv.{user.level}
              </span>
              <span className="flex items-center gap-1 text-[10px] whitespace-nowrap text-rpg-ink-soft">
                <AssetIcon src="/assets/currency/coin.png" fallback="🪙" alt="" size={13} />
                {user.coin}
                <span aria-hidden="true">·</span>
                <AssetIcon src="/assets/currency/diamond.png" fallback="💎" alt="" size={13} />
                {user.diamond}
              </span>
            </div>

            <button
              type="button"
              onClick={toggleMuted}
              aria-label={muted ? "Unmute sound" : "Mute sound"}
              className="ml-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs transition-transform active:scale-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rpg-forest"
            >
              {muted ? "🔇" : "🔊"}
            </button>
          </div>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-20 bg-rpg-parchment">
        <div className="pixel-step-divider" aria-hidden="true" />
        <ul className="mx-auto flex w-full max-w-lg items-stretch justify-between px-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href} className="flex-1">
                <Link
                  href={link.href}
                  className="flex flex-col items-center gap-0.5 py-1.5 text-[10px] font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rpg-forest"
                >
                  <span className={isActive ? "" : "opacity-60"} aria-hidden="true">
                    {link.asset ? (
                      <AssetIcon src={link.asset} fallback={link.icon} alt="" size={18} />
                    ) : (
                      <span className="text-base">{link.icon}</span>
                    )}
                  </span>
                  <span className={isActive ? "text-rpg-ink" : "text-rpg-ink-soft"}>
                    {link.label}
                  </span>
                  <span
                    className={
                      "h-1 w-1 rounded-full " + (isActive ? "bg-rpg-forest" : "bg-transparent")
                    }
                    aria-hidden="true"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
