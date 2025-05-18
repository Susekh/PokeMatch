import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    clipAnimation.to(".mask-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    });
  });

  return (
    <div id="about" className="min-h-screen w-screen bg-black text-white">
      {/* Top Section */}
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <p className="font-general text-xs uppercase md:text-[10px] bg-white text-black px-3 py-1 rounded-full tracking-wider">
          Welcome to PokéMatch
        </p>

        <AnimatedTitle
          title="Sharpen your <b>mind</b><br />& catch them <b>all</b>!"
          containerClass="mt-4 font-pokemon-hollow text-center text-white text-3xl md:text-4xl lg:text-5xl"
        />

        <div className="about-subtext text-center text-sm md:text-base text-white px-4">
          <p className="mb-2 font-medium">
            Flip, match, and evolve Pokémon in a memory-powered adventure
          </p>
          <p className="text-white/60">
            Challenge your skills across levels, earn points, and become the ultimate memory master.
          </p>
        </div>
      </div>

      {/* Image Clip Section */}
      <div className="h-dvh w-screen" id="clip">
        <div className="mask-clip-path about-image relative">
          <img
            src="img/about.webp"
            alt="Pokémon background"
            className="absolute left-0 top-0 size-full object-cover"
          />
          {/* Optional dark overlay for contrast */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      </div>
    </div>
  );
};

export default About;
