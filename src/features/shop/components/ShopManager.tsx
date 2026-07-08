"use client";

import { CurrencyDisplay } from "../../character/components/CurrencyDisplay";
import { useAppStore } from "../../../store/useAppStore";
import { ShopItemList } from "./ShopItemList";

export function ShopManager() {
  const user = useAppStore((state) => state.user);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Shop</h1>
        <CurrencyDisplay coin={user.coin} diamond={user.diamond} />
      </div>
      <ShopItemList />
    </section>
  );
}
