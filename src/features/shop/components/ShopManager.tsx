"use client";

import { useState } from "react";

import { PageTitle } from "../../../components/rpg/PageTitle";
import { CurrencyDisplay } from "../../character/components/CurrencyDisplay";
import { useAppStore } from "../../../store/useAppStore";
import { ShopItemList } from "./ShopItemList";

type ShopTab = "shop" | "owned";

const TABS: { id: ShopTab; label: string }[] = [
  { id: "shop", label: "Shop" },
  { id: "owned", label: "My Items" },
];

/**
 * Plain header (no "Merchant"/NPC-dialogue framing — the wood-shelf item
 * grid already carries enough shop identity on its own) plus a Shop / My
 * Items tab switcher, per docs/02_design/screen-specs.md §5.7-5.8. This is
 * the Inventory merge: rather than a new nav route, owned items are a
 * filtered view of the same grid, reusing `ShopItemList`/`InventoryPanel`/
 * `InventorySlot` as-is — no new inventory-specific components needed.
 */
export function ShopManager() {
  const user = useAppStore((state) => state.user);
  const [tab, setTab] = useState<ShopTab>("shop");

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <PageTitle>Shop</PageTitle>
        <CurrencyDisplay coin={user.coin} diamond={user.diamond} />
      </div>

      <div
        className="flex gap-1 rounded-xl border border-rpg-ink-soft/40 bg-rpg-parchment-dark/30 p-1"
        role="tablist"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={
              "flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rpg-forest " +
              (tab === t.id
                ? "bg-rpg-parchment text-rpg-ink shadow-[0_2px_6px_-2px_rgba(74,55,40,0.2)]"
                : "text-rpg-ink-soft")
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      <ShopItemList filter={tab === "owned" ? "owned" : "all"} />
    </section>
  );
}
