"use client";

import Link from "next/link";

import { buttonClassName } from "../components/Button";
import { PixelPanel } from "../components/PixelPanel";
import { PixelCharacterPlaceholder } from "../features/character/components/PixelCharacterPlaceholder";
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
    <main className="mx-auto w-full max-w-lg px-4 py-8">
      <PixelPanel
        as="section"
        weight="strong"
        className="flex flex-col items-center gap-4 px-6 py-8 text-center"
      >
        <PixelCharacterPlaceholder
          level={user.level}
          equippedItemName={equippedItem?.name}
        />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">StudyQuest</h1>
          <p className="mt-1 text-sm text-gray-600">
            Study time becomes character growth.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href="/timer" className={buttonClassName("primary", "md")}>
            ▶ Start Studying
          </Link>
          <Link href="/subjects" className={buttonClassName("secondary", "md")}>
            Manage Subjects
          </Link>
        </div>
      </PixelPanel>

      <ul className="mt-6 grid grid-cols-2 gap-3 text-sm text-gray-600">
        {FEATURE_HIGHLIGHTS.map((feature) => (
          <PixelPanel as="li" key={feature.label} className="px-3 py-2">
            {feature.icon} {feature.label}
          </PixelPanel>
        ))}
      </ul>
    </main>
  );
}
