import { useEffect, useRef, useState } from "react";
import { FaUserSecret } from "react-icons/fa";
import { GiPokecog } from "react-icons/gi";
import { gsap } from "gsap";

const PrivacyPolicy = () => {
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
      className="min-h-screen w-full bg-black text-gray-300 px-6 py-36 flex flex-col items-center"
    >
      <div className="max-w-3xl w-full flex flex-col gap-10">
        <h1 className="animate-child text-4xl md:text-5xl text-center font-pokemon font-bold text-white">
          <FaUserSecret className="inline-block mr-2 mb-1" />
          PokéMatch Privacy Policy
        </h1>

        <p className="animate-child text-center text-sm md:text-base text-white/60">
          Because even Pikachu values its personal space.
        </p>

        <div className="animate-child bg-gray-900 p-6 rounded-lg shadow-lg space-y-5 text-sm md:text-base leading-relaxed">
          <h2 className="text-xl font-semibold text-yellow-400 flex items-center gap-2">
            <GiPokecog /> What We Collect
          </h2>
          <ul className="list-disc list-inside">
            <li>
              Absolutely nothing that would get us in trouble with Team Rocket.
            </li>
            <li>No passwords, no secret lair locations.</li>
            <li>Just your score, level, and love for Pokémon.</li>
          </ul>
        </div>

        <div className="animate-child bg-gray-900 p-6 rounded-lg shadow-lg space-y-5 text-sm md:text-base leading-relaxed">
          <h2 className="text-xl font-semibold text-yellow-400 flex items-center gap-2">
            👀 Tracking & Cookies
          </h2>
          <p>
            We don’t use cookies — unless they’re Poké Puffs. We don't follow
            you around the internet or send a Pidgey to spy on you.
          </p>
        </div>

        <div className="animate-child bg-gray-900 p-6 rounded-lg shadow-lg space-y-5 text-sm md:text-base leading-relaxed">
          <h2 className="text-xl font-semibold text-yellow-400 flex items-center gap-2">
            ⚡ Third-Party Shenanigans
          </h2>
          <p>
            We don’t share your data with any third-party unless it’s Professor
            Oak and he promises to use it *only* for research... and maybe a
            Pokédex update.
          </p>
        </div>

        <div className="animate-child bg-gray-900 p-6 rounded-lg shadow-lg space-y-5 text-sm md:text-base leading-relaxed">
          <h2 className="text-xl font-semibold text-yellow-400 flex items-center gap-2">
            🎮 Children’s Privacy
          </h2>
          <p>
            PokéMatch is safe for all trainers — no creepy Drowzees lurking here.
            But ask your guardian before challenging Mewtwo, please.
          </p>
        </div>

        <div className="animate-child text-center text-sm text-white/50 italic pt-6">
          Got concerns? Send a carrier Pidgeot, or email us (that works too).
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
