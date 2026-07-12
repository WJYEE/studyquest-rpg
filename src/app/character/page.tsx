import Link from "next/link";

import { buttonClassName } from "../../components/Button";
import { RpgBackground } from "../../components/rpg/RpgBackground";
import { CharacterStatus } from "../../features/character/components/CharacterStatus";

export default function CharacterPage() {
  return (
    <RpgBackground scene="quiet">
      <main className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 py-8">
        <CharacterStatus />
        <Link
          href="/character/customize"
          className={buttonClassName("primary", "md", "self-center")}
        >
          🎨 Customize Appearance
        </Link>
      </main>
    </RpgBackground>
  );
}
