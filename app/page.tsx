import CollectPoints from "@/components/collect-points";
import Hero from "@/components/hero";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex justify-center items-center">
      <section className="flex gap-4">
        <a href="/v1">
          <Button>V1</Button>
        </a>
        <a href="/v2">
          <Button>V2</Button>
        </a>
      </section>
    </main>
  );
}
