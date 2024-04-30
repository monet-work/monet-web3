import CollectPoints from "@/components/collect-points";
import Hero from "@/components/hero";
import SubNavbar from "@/components/sub-navbar";

export default function Home() {
  return (
    <main className="">
      <SubNavbar />

      <Hero />

      <section
        className="py-16 px-4 dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center"
        id="collect-points"
      >
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <CollectPoints />
      </section>
    </main>
  );
}
