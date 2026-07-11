"use client";

import Link from "next/link";

import { buttonClassName } from "../components/Button";
import { RpgBackground } from "../components/rpg/RpgBackground";
import { WindowFrame } from "../components/rpg/WindowFrame";
import { CharacterSprite, tierForLevel } from "../features/character/components/CharacterSprite";
import { useAppStore } from "../store/useAppStore";

const FEATURE_HIGHLIGHTS = [
  { icon: "🕹️", label: "Timed study sessions" },
  { icon: "🧙", label: "XP & leveling" },
  { icon: "🛒", label: "Coin & diamond shop" },
  { icon: "📊", label: "Progress dashboard" },
];

export default function HomePage() {
  const user = useAppStore((state) => state.user);
  const equippedItemIds = useAppStore((state) => state.equippedItemIds);
  const appearance = useAppStore((state) => state.appearance);

  return (
    <RpgBackground scene="town">
      <main className="mx-auto w-full max-w-lg px-4 py-8">
        <WindowFrame
          as="section"
          variant="window"
          className="flex flex-col items-center gap-4 px-6 py-8 text-center"
        >
          <div className="relative flex flex-col items-center">
            <CharacterSprite
              tier={tierForLevel(user.level)}
              appearance={appearance}
              hasHat={Boolean(equippedItemIds.hat)}
              hasOutfit={Boolean(equippedItemIds.outfit)}
              hasAccessory={Boolean(equippedItemIds.accessory)}
            />
            <div className="-mt-2 h-2 w-10 rounded-full bg-rpg-ink opacity-20" aria-hidden="true" />
          </div>
          <p className="font-pixel text-[10px] tracking-wide text-rpg-ink">Lv.{user.level}</p>
          <div>
            <h1 className="font-pixel text-xl tracking-wide text-rpg-ink">StudyQuest</h1>
            <p className="mt-2 text-sm text-rpg-ink-soft">
              Study time becomes character growth.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/timer" className={buttonClassName("primary", "md")}>
              ▶ Begin Quest
            </Link>
            <Link href="/subjects" className={buttonClassName("secondary", "md")}>
              Manage Subjects
            </Link>
          </div>
        </WindowFrame>

        <ul className="mt-6 grid grid-cols-2 gap-3 text-sm text-rpg-ink-soft">
          {FEATURE_HIGHLIGHTS.map((feature) => (
            <WindowFrame as="li" variant="slot" key={feature.label} className="px-3 py-2">
              {feature.icon} {feature.label}
            </WindowFrame>
          ))}
        </ul>
      </main>
    </RpgBackground>
  );
}
