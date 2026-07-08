import { RpgBackground } from "../../components/rpg/RpgBackground";
import { ShopManager } from "../../features/shop/components/ShopManager";

export default function ShopPage() {
  return (
    <RpgBackground scene="town">
      <main className="mx-auto w-full max-w-lg px-4 py-8">
        <ShopManager />
      </main>
    </RpgBackground>
  );
}
