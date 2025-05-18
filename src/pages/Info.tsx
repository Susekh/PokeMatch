import { useEffect, useRef, useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { GiPokecog } from "react-icons/gi";
import { gsap } from "gsap";

const Info = () => {
  const containerRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            const elements = gsap.utils.toArray(".animate-child");
            gsap.from(elements, {
              duration: 1,
              y: 40,
              opacity: 0,
              stagger: 0.25,
              ease: "power3.out",
            });
            setHasAnimated(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of section is visible
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section
      ref={containerRef}
      className="min-h-screen w-full bg-black text-gray-300 flex flex-col items-center px-6 py-36 overflow-hidden"
    >
      <div className="w-full max-w-4xl flex flex-col items-center gap-6">
        <p className="animate-child font-mono text-xs uppercase bg-gray-800 px-3 py-1 rounded-full tracking-wider">
          Welcome to PokeMatch
        </p>

        <h1 className="animate-child text-center text-4xl md:text-5xl font-semibold leading-tight max-w-3xl">
          Sharpen your <span className="text-white font-bold">mind</span> & catch them{" "}
          <span className="text-white font-bold">all</span>!
        </h1>

        <p className="animate-child max-w-xl text-center text-gray-400 text-sm md:text-base">
          Flip, match, and evolve Pokémon in this sleek memory game built for the Codecircuit Hackathon.
        </p>

        <div className="animate-child max-w-3xl bg-gray-900 rounded-lg p-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-3">
            <GiPokecog className="text-yellow-400" />
            Info PokeMatch
          </h2>
          <p className="text-gray-300 mb-4 leading-relaxed">
            PokeMatch is a memory matching card game inspired by classic Pokémon themes.
            It features a score tracker, level progression, and dynamic gameplay designed to challenge your brain while keeping the nostalgic vibe alive.
          </p>
          <p className="text-gray-400 mb-6 leading-relaxed">
            Built as my entry for the Codecircuit Hackathon, I chose the prompt:{" "}
            <em className="italic text-white">
              "Memory matching game with score tracker and level up"
            </em>. My goal was to create an engaging experience that’s both fun and brain-boosting, wrapped in a clean and minimal Pokémon-inspired UI.
          </p>

          <h3 className="text-lg font-semibold mb-3">Find me on</h3>
          <div className="flex gap-8">
            <a
              href="https://github.com/your-github-username"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <FaGithub size={22} /> GitHub
            </a>
            <a
              href="https://linkedin.com/in/your-linkedin-username"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <FaLinkedin size={22} /> LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Info;
