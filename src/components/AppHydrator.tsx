"use client";

import { useHydrateStore } from "../hooks/useHydrateStore";

/** Renders nothing; triggers the one-time store hydration on client mount. */
export function AppHydrator() {
  useHydrateStore();
  return null;
}
