import Link from "next/link";

import { buttonClassName } from "../../../components/Button";
import { RpgBackground } from "../../../components/rpg/RpgBackground";
import { CharacterCustomizer } from "../../../features/character/components/CharacterCustomizer";

export default function CharacterCustomizePage() {
  return (
    <RpgBackground scene="room">
      <main className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 py-8">
        <Link href="/character" className={buttonClassName("secondary", "sm")}>
          ← Back to Character
        </Link>
        <CharacterCustomizer />
      </main>
    </RpgBackground>
  );
}
