import { AssetIcon } from "../../../components/AssetIcon";

interface CurrencyDisplayProps {
  coin: number;
  diamond: number;
}

export function CurrencyDisplay({ coin, diamond }: CurrencyDisplayProps) {
  return (
    <div className="flex gap-2 text-sm font-medium text-rpg-ink">
      <span
        className="flex items-center gap-1 rounded-lg border border-rpg-ink-soft/50 bg-rpg-parchment-dark/40 px-2 py-0.5"
        aria-label={`${coin} coins`}
      >
        <AssetIcon src="/assets/currency/coin.png" fallback="🪙" alt="" size={16} />
        {coin}
      </span>
      <span
        className="flex items-center gap-1 rounded-lg border border-rpg-ink-soft/50 bg-rpg-parchment-dark/40 px-2 py-0.5"
        aria-label={`${diamond} diamonds`}
      >
        <AssetIcon src="/assets/currency/diamond.png" fallback="💎" alt="" size={16} />
        {diamond}
      </span>
    </div>
  );
}
