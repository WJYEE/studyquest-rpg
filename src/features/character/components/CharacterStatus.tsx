"use client";

import { StatusWindow } from "../../../components/rpg/StatusWindow";
import { getItemById } from "../../../lib/itemCatalog";
import { useAppStore } from "../../../store/useAppStore";
import { useCharacterAnimationState } from "../hooks/useCharacterAnimationState";
import { CharacterSprite, tierForLevel } from "./CharacterSprite";
import { CurrencyDisplay } from "./CurrencyDisplay";
import { LevelProgress } from "./LevelProgress";

export function CharacterStatus() {
  const user = useAppStore((state) => state.user);
  const equippedItemId = useAppStore((state) => state.equippedItemId);
  const equippedItem = equippedItemId ? getItemById(equippedItemId) : undefined;
  const animState = useCharacterAnimationState();

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">Character</h1>
      <StatusWindow
        portrait={
          <CharacterSprite
            tier={tierForLevel(user.level)}
            hasHat={Boolean(equippedItem)}
            animState={animState}
          />
        }
      >
        {equippedItem && (
          <p className="text-xs text-gray-500">Wearing: {equippedItem.name}</p>
        )}
        <LevelProgress level={user.level} xp={user.xp} />
        <CurrencyDisplay coin={user.coin} diamond={user.diamond} />
      </StatusWindow>
    </section>
  );
}
