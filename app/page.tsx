import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Button } from "@/components/ui/button";
import { SparklesCore } from "@/components/ui/sparkles";
import Image from "next/image";

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
        <h1 className="md:text-7xl text-3xl lg:text-6xl font-bold text-center text-white relative z-20">
          Unleashing points like never before!
        </h1>

        <Button
          className="cursor-pointer mt-4 text-primary-foreground text-xl font-light transition duration-75 hover:font-bold z-10"
          variant={"ghost"}
        >
          <a href="#collect-points"> Show me how to collect points?</a>
        </Button>
      </div>

      <section
        className="h-[50rem] dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center"
        id="collect-points"
      >
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div>
          <h2 className="text-4xl font-bold text-center text-black dark:text-white">
            Collect Points
          </h2>
          <p className="text-center text-lg text-black dark:text-white">
            Collect points based on your activity.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-16">

            <BackgroundGradient className="rounded-[22px] max-w-sm p-4 bg-white dark:bg-zinc-900">
              <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
                Post a tweet! (0.1 points)
              </p>

              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Post a tweet about us and earn <span className="font-bold">0.1</span> points
              </p>
              <Button className="mt-4">Collect</Button>
            </BackgroundGradient>
            <BackgroundGradient className="rounded-[22px] max-w-sm p-4 bg-white dark:bg-zinc-900">
              <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
                Write a blog post! (5 points)
              </p>

              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Write a blog post about us and earn <span className="font-bold">5</span> points
              </p>
              <Button className="mt-4">Collect</Button>
            </BackgroundGradient>
            <BackgroundGradient className="rounded-[22px] max-w-sm p-4 bg-white dark:bg-zinc-900">
              <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
                Review us on Google! (10 points)
              </p>

              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Review us on Google and earn <span className="font-bold">10</span> points
              </p>
              <Button className="mt-4">Collect</Button>
            </BackgroundGradient>
            <BackgroundGradient className="rounded-[22px] max-w-sm p-4 bg-white dark:bg-zinc-900">
              <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
                Write a blog post! (5 points)
              </p>

              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Write a blog post about us and earn <span className="font-bold">5</span> points
              </p>
              <Button className="mt-4">Collect</Button>
            </BackgroundGradient>
          </div>
        </div>
      </section>
    </main>
  );
}
