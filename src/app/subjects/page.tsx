import { RpgBackground } from "../../components/rpg/RpgBackground";
import { SubjectManager } from "../../features/subject/components/SubjectManager";

export default function SubjectsPage() {
  return (
    <RpgBackground scene="town">
      <main className="mx-auto w-full max-w-lg px-4 py-8">
        <SubjectManager />
      </main>
    </RpgBackground>
  );
}
