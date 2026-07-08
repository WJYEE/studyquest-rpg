import { RpgBackground } from "../../components/rpg/RpgBackground";
import { DashboardManager } from "../../features/dashboard/components/DashboardManager";

export default function DashboardPage() {
  return (
    <RpgBackground scene="town">
      <main className="mx-auto w-full max-w-lg px-4 py-8">
        <DashboardManager />
      </main>
    </RpgBackground>
  );
}
