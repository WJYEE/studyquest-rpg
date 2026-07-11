"use client";

import { DialogBox } from "../../../components/rpg/DialogBox";
import { CurrencyDisplay } from "../../character/components/CurrencyDisplay";
import { useAppStore } from "../../../store/useAppStore";
import { ShopItemList } from "./ShopItemList";

export function ShopManager() {
  const user = useAppStore((state) => state.user);

  return (
    <section className="flex flex-col gap-6">
      <DialogBox title="Merchant">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-rpg-ink">Welcome, adventurer! Take a look around.</p>
          <CurrencyDisplay coin={user.coin} diamond={user.diamond} />
        </div>
      </DialogBox>
      <ShopItemList />
    </section>
  );
}
