import CollectPoints from "@/components/collect-points";
import { Button } from "@/components/ui/button";
import { SparklesCore } from "@/components/ui/sparkles";


export default function Home() {
  return (
    <main className="">
      <div className="h-screen relative w-full bg-black flex flex-col items-center justify-center overflow-hidden">
        <div className="w-full absolute inset-0 h-screen">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={100}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
        </div>
        <h1 className="md:text-6xl text-2xl lg:text-6xl md:max-w-2xl font-bold text-center text-white relative z-20">
          Unleashing points like <br/><span className="text-teal-400">never before!</span>
        </h1>

        <Button
          className="cursor-pointer mt-4 text-primary-foreground text-xl font-light transition duration-75 hover:font-bold z-10"
          variant={"ghost"}
        >
          <a href="#collect-points"> Show me how to collect points?</a>
        </Button>
      </div>

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
