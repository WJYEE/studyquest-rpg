import { RpgBackground } from "../../components/rpg/RpgBackground";
import { CharacterStatus } from "../../features/character/components/CharacterStatus";

export default function CharacterPage() {
  return (
    <RpgBackground scene="room">
      <main className="mx-auto w-full max-w-lg px-4 py-8">
        <CharacterStatus />
      </main>
    </RpgBackground>
  );
}
