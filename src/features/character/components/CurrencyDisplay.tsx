interface CurrencyDisplayProps {
  coin: number;
  diamond: number;
}

export function CurrencyDisplay({ coin, diamond }: CurrencyDisplayProps) {
  return (
    <div className="flex gap-4 text-sm font-medium">
      <span aria-label={`${coin} coins`}>🪙 {coin}</span>
      <span aria-label={`${diamond} diamonds`}>💎 {diamond}</span>
    </div>
  );
}
