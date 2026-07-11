interface CurrencyDisplayProps {
  coin: number;
  diamond: number;
}

export function CurrencyDisplay({ coin, diamond }: CurrencyDisplayProps) {
  return (
    <div className="flex gap-2 text-sm font-medium text-rpg-ink">
      <span
        className="border-2 border-rpg-ink-soft bg-rpg-parchment-dark/40 px-2 py-0.5"
        aria-label={`${coin} coins`}
      >
        🪙 {coin}
      </span>
      <span
        className="border-2 border-rpg-ink-soft bg-rpg-parchment-dark/40 px-2 py-0.5"
        aria-label={`${diamond} diamonds`}
      >
        💎 {diamond}
      </span>
    </div>
  );
}
