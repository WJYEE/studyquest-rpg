"use client";

import Link from "next/link";

import { buttonClassName } from "../components/Button";
import { RpgBackground } from "../components/rpg/RpgBackground";
import { WindowFrame } from "../components/rpg/WindowFrame";
import { CharacterSprite, tierForLevel } from "../features/character/components/CharacterSprite";
import { getItemById } from "../lib/itemCatalog";
import { useAppStore } from "../store/useAppStore";

const FEATURE_HIGHLIGHTS = [
  { icon: "🕹️", label: "Timed study sessions" },
  { icon: "🧙", label: "XP & leveling" },
  { icon: "🛒", label: "Coin & diamond shop" },
  { icon: "📊", label: "Progress dashboard" },
];

export default function HomePage() {
  const user = useAppStore((state) => state.user);
  const equippedItemId = useAppStore((state) => state.equippedItemId);
  const equippedItem = equippedItemId ? getItemById(equippedItemId) : undefined;

  return (
<<<<<<< HEAD
    <RpgBackground scene="town">
      <main className="mx-auto w-full max-w-lg px-4 py-8">
        <WindowFrame
          as="section"
          className="flex flex-col items-center gap-4 px-6 py-8 text-center"
        >
          <CharacterSprite
            tier={tierForLevel(user.level)}
            hasHat={Boolean(equippedItem)}
          />
          <p className="text-xs font-semibold text-rpg-ink">Lv.{user.level}</p>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">StudyQuest</h1>
            <p className="mt-1 text-sm text-gray-600">
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

        <ul className="mt-6 grid grid-cols-2 gap-3 text-sm text-gray-600">
          {FEATURE_HIGHLIGHTS.map((feature) => (
            <WindowFrame as="li" variant="slot" key={feature.label} className="px-3 py-2">
              {feature.icon} {feature.label}
            </WindowFrame>
          ))}
        </ul>
      </main>
    </RpgBackground>
=======
    <main className="mx-auto w-full max-w-lg px-4 py-8">
      <PixelPanel
        as="section"
        weight="strong"
