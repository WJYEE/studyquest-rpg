"use client";

import { PageTitle } from "../../../components/rpg/PageTitle";
import { WindowFrame } from "../../../components/rpg/WindowFrame";
import { StatusWindow } from "../../../components/rpg/StatusWindow";
import { getItemById } from "../../../lib/itemCatalog";
import { ICON_BY_ITEM_ID } from "../../../lib/itemIcons";
import { useAppStore } from "../../../store/useAppStore";
import type { ItemSlot } from "../../../types/item";
import { useCharacterAnimationState } from "../hooks/useCharacterAnimationState";
import { CharacterSprite, tierForLevel } from "./CharacterSprite";
import { CurrencyDisplay } from "./CurrencyDisplay";
import { LevelProgress } from "./LevelProgress";

const EQUIPMENT_SLOTS: { slot: ItemSlot; label: string }[] = [
  { slot: "hat", label: "Hat" },
  { slot: "outfit", label: "Outfit" },
  { slot: "accessory", label: "Charm" },
];

export function CharacterStatus() {
  const user = useAppStore((state) => state.user);
  const equippedItemIds = useAppStore((state) => state.equippedItemIds);
  const appearance = useAppStore((state) => state.appearance);
  const animState = useCharacterAnimationState();

  return (
    <section className="flex flex-col gap-4">
      <PageTitle>Character</PageTitle>
      <StatusWindow
        portrait={
          <CharacterSprite
            tier={tierForLevel(user.level)}
            appearance={appearance}
            hasHat={Boolean(equippedItemIds.hat)}
            hasOutfit={Boolean(equippedItemIds.outfit)}
            hasAccessory={Boolean(equippedItemIds.accessory)}
            animState={animState}
          />
        }
      >
        <ul className="flex w-full gap-2">
          {EQUIPMENT_SLOTS.map(({ slot, label }) => {
            const itemId = equippedItemIds[slot];
            const item = itemId ? getItemById(itemId) : undefined;
            return (
              <WindowFrame
                as="li"
                variant="slot"
                key={slot}
                className="flex flex-1 flex-col items-center gap-0.5 px-2 py-1.5"
                title={item?.name ?? `No ${label.toLowerCase()} equipped`}
              >
                <span className="text-lg" aria-hidden="true">
                  {item ? ICON_BY_ITEM_ID[item.id] ?? "🎁" : "—"}
                </span>
                <span className="text-[10px] uppercase tracking-wide text-rpg-ink-soft">
                  {label}
                </span>
              </WindowFrame>
            );
          })}
        </ul>
        <LevelProgress level={user.level} xp={user.xp} />
        <CurrencyDisplay coin={user.coin} diamond={user.diamond} />
      </StatusWindow>
    </section>
  );
}
