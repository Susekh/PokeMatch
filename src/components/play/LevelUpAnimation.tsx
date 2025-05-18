import { useEffect, useRef } from "react";
import { Zap, Sparkles } from "lucide-react";
import gsap from "gsap";

interface LevelUpAnimationProps {
  level: number;
}

export default function LevelUpAnimation({ level }: LevelUpAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const levelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current || !titleRef.current || !levelRef.current)
      return;

    const tl = gsap.timeline();

    tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });

    tl.fromTo(
      contentRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.7)" }
    );

    tl.fromTo(
      titleRef.current,
      { scale: 1 },
      {
        scale: 1.3,
        duration: 0.5,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut",
      },
      "+=0.1"
    );

    tl.fromTo(
      levelRef.current,
      { scale: 1 },
      {
        scale: 1.4,
        duration: 0.5,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut",
      },
      "-=0.4"
    );

    const bolts = document.querySelectorAll(".level-up-bolt");
    bolts.forEach((bolt, i) => {
      gsap.fromTo(
        bolt,
        {
          x: Math.random() * 200 - 100,
          y: -100,
          opacity: 0,
          rotate: Math.random() * 40 - 20,
          scale: 0.5,
        },
        {
          y: 100,
          opacity: [0, 1, 0],
          rotate: Math.random() * 40 - 20,
          scale: [0.5, 1.3, 0.7],
          duration: 1.2,
          delay: i * 0.08,
          ease: "power2.out",
        }
      );
    });

    const particles = document.querySelectorAll(".level-up-particle");
    particles.forEach((particle, i) => {
      gsap.fromTo(
        particle,
        {
          xPercent: 0,
          yPercent: 0,
          scale: 0,
          opacity: 0,
        },
        {
          xPercent: Math.random() * 200 - 100,
          yPercent: Math.random() * 200 - 100,
          scale: [0, 1, 0],
          opacity: [0, 1, 0],
          duration: 2.5,
          delay: i * 0.05,
          ease: "power2.out",
          repeat: 1,
        }
      );
    });

    return () => {
      tl.kill();
    };
  }, [level]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-black to-indigo-950 opacity-90 pointer-events-none animate-pulse" />

      <div className="relative z-10 flex flex-col items-center pointer-events-none">
        {/* Bolts */}
        <div className="relative w-full h-32 -mt-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="level-up-bolt absolute left-1/2 top-0 transform -translate-x-1/2">
              <Zap className="w-10 h-10 text-yellow-400 drop-shadow-glow animate-spin-slow" />
            </div>
          ))}
        </div>

        {/* Main Box */}
        <div
          ref={contentRef}
          className="relative px-10 py-8 bg-gradient-to-br from-purple-600 via-fuchsia-600 to-amber-400 rounded-2xl shadow-2xl border border-white/20 text-center animate-pop"
        >
          {/* Particles */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="level-up-particle absolute w-2 h-2 rounded-full bg-white/70 blur-sm"
              />
            ))}
          </div>

          <h2
            ref={titleRef}
            className="text-5xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-300 to-cyan-300 drop-shadow-glow"
          >
            Level Up!
          </h2>

          <div
            ref={levelRef}
            className="text-7xl font-extrabold text-white mb-4 flex items-center justify-center gap-4 animate-bounce-slow"
          >
            <Sparkles className="w-10 h-10 text-white drop-shadow-glow animate-ping" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-100 to-white drop-shadow-glow">
              {level}
            </span>
            <Sparkles className="w-10 h-10 text-white drop-shadow-glow animate-ping" />
          </div>

          <p className="text-white/90 text-lg tracking-wide animate-fade-in-up">
            You've grown stronger. New challenges await!
          </p>
        </div>
      </div>
    </div>
  );
}
