import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { TbPokeball } from "react-icons/tb";

const Instructions = () => {
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
              stagger: 0.2,
              ease: "power3.out",
            });
            setHasAnimated(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section
      ref={containerRef}
      className="min-h-screen w-full bg-black text-gray-300 flex flex-col items-center px-6 py-36 overflow-hidden"
    >
      <div className="w-full max-w-3xl flex flex-col gap-8">
        <div className="flex flex-col items-center">
          <p className="animate-child font-mono text-xs uppercase bg-gray-800 px-3 py-1 rounded-full tracking-wider">
            Instructions
          </p>
        </div>

        <h1 className="animate-child text-4xl md:text-5xl font-pokemon text-center text-white mb-8">
          How to Play <span className="text-yellow-400">PokeMatch</span>
        </h1>

        <div className="animate-child bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-3 text-yellow-400">
            <TbPokeball size={26} />
            Evolution Mechanics
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Match Pokémon pairs to trigger evolutions! When you match a Pokémon
            that can evolve, you'll see an evolution animation. The evolved form
            will appear in the next level, making your collection stronger as
            you progress!
          </p>
        </div>

        <div className="animate-child bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-3 text-yellow-400">
            <TbPokeball size={26} />
            Scoring
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 leading-relaxed">
            <li>10 × Level points per match</li>
            <li>Max 3× multiplier</li>
            <li>Bonus turn on match</li>
            <li>Evolution Bonus: +15 points for evolution</li>
            <li>Evolved Pokémon stay in your collection</li>
            <li>Stronger forms, more score</li>
          </ul>
        </div>

        <div className="animate-child bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-3 text-yellow-400">
            <TbPokeball size={26} />
            Rules
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 leading-relaxed">
            <li>Flip two cards per turn to find matching pairs.</li>
            <li>Matching pairs earn points and may trigger evolution.</li>
            <li>Use your memory and strategy to progress through levels.</li>
            <li>Score multipliers increase with consecutive matches.</li>
            <li>
              Game ends if no moves left or timer runs out (if applicable).
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Instructions;
