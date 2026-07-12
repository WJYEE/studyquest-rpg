"use client";

import { useState } from "react";

interface AssetIconProps {
  /** Path under public/, e.g. "/assets/currency/coin.png". */
  src: string;
  /** Emoji shown if the file 404s or hasn't been produced yet. */
  fallback: string;
  alt: string;
  size?: number;
  className?: string;
}

/**
 * Real-asset-with-graceful-fallback wrapper (docs/02_design/asset-manifest.md
 * §4) — tries the real image first, and if it fails to load (missing file,
 * not yet produced, renamed) swaps to the emoji placeholder that every icon
 * spot in the app already used before real assets existed. This is a
 * runtime fallback, not just "the file happens to exist today."
 */
export function AssetIcon({ src, fallback, alt, size = 20, className }: AssetIconProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className={className} style={{ fontSize: size }} role="img" aria-label={alt}>
        {fallback}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", objectFit: "contain" }}
      onError={() => setFailed(true)}
    />
  );
}
