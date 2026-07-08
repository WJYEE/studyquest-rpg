"use client";

import { getItemById } from "../../../lib/itemCatalog";
import { useAppStore } from "../../../store/useAppStore";
import { CurrencyDisplay } from "./CurrencyDisplay";
import { LevelProgress } from "./LevelProgress";
import { PixelCharacterPlaceholder } from "./PixelCharacterPlaceholder";

export function CharacterStatus() {
  const user = useAppStore((state) => state.user);
  const equippedItemId = useAppStore((state) => state.equippedItemId);
  const equippedItem = equippedItemId ? getItemById(equippedItemId) : undefined;

  return (
    <section className="flex flex-col items-center gap-4">
      <PixelCharacterPlaceholder
        level={user.level}
        equippedItemName={equippedItem?.name}
      />
      <LevelProgress level={user.level} xp={user.xp} />
      <CurrencyDisplay coin={user.coin} diamond={user.diamond} />
    </section>
  );
}
