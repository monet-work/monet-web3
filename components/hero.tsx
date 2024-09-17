"use client";

import { useGlitch } from "react-powerglitch";
import { Button } from "./ui/button";
import { SparklesCore } from "./ui/sparkles";

const Hero = () => {
  const glitch = useGlitch({
    playMode: "always",
    createContainers: true,
    hideOverflow: false,
    timing: {
      duration: 2000,
    },
    glitchTimeSpan: {
      start: 0.5,
      end: 0.7,
    },
    shake: {
      velocity: 15,
      amplitudeX: 0.2,
      amplitudeY: 0.2,
    },
    slice: {
      count: 6,
      velocity: 15,
      minHeight: 0.02,
      maxHeight: 0.15,
      hueRotate: true,
    },
    pulse: false,
  });
  return (
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
        Unleashing points like <br />
        <span className="text-teal-400" ref={glitch.ref}>
          never before!
        </span>
      </h1>

      <Button
        className="cursor-pointer mt-4 text-primary-foreground text-xl font-light transition duration-75 hover:font-bold z-10"
        variant={"ghost"}
      >
        <a href="#collect-points"> Show me how to collect points?</a>
      </Button>
    </div>
  );
};

export default Hero;
