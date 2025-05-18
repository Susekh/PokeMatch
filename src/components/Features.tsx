import { useState, useRef, useEffect, } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface BentoTiltProps {
  children: React.ReactNode;
  className?: string;
}

export const BentoTilt: React.FC<BentoTiltProps> = ({ children, className = "" }) => {
  const [transformStyle, setTransformStyle] = useState<string>("");
  const itemRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!itemRef.current) return;

    const { left, top, width, height } = itemRef.current.getBoundingClientRect();

    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;

    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95, .95, .95)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => {
    setTransformStyle("");
  };

  useEffect(() => {
    if (!itemRef.current) return;

    const el = itemRef.current;

    const anim = gsap.fromTo(
      el,
      { autoAlpha: 0, y: 50, scale: 0.95 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      anim.scrollTrigger?.kill();
    };
  }, []);

  return (
    <div
      ref={itemRef}
      className={`opacity-0 transition duration-700 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
    >
      {children}
    </div>
  );
};

interface BentoCardProps {
  src: string;
  title: React.ReactNode;
  description?: string;
}

export const BentoCard: React.FC<BentoCardProps> = ({ src, title, description }) => {
  return (
    <div className="relative size-full overflow-hidden rounded-xl shadow-2xl">
      <video
        src={src}
        loop
        muted
        autoPlay
        className="absolute inset-0 size-full object-cover object-center"
      />
      <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50 bg-black/40">
        <div>
          <h1 className="bento-title font-pokemon-hollow text-yellow-300 text-2xl md:text-3xl font-bold drop-shadow-lg">
            {title}
          </h1>
          {description && (
            <p className="mt-3 max-w-64 text-sm md:text-base text-blue-100">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const Features: React.FC = () => (
  <section className="bg-black pb-52">
    <div className="container mx-auto px-4 md:px-10">
      <div className="px-5 py-32 text-center">
        <p className="text-lg font-pokemon text-blue-50">Enter the Pokématch Zone</p>
        <p className="mt-2 max-w-md mx-auto text-base text-blue-50 opacity-60">
          Dive into the ultimate memory challenge — flip, match, and train your
          mind in a nostalgic adventure full of familiar faces and evolving fun.
        </p>
      </div>

      <BentoTilt className="border-hsla relative mb-12 h-96 w-full overflow-hidden rounded-xl md:h-[65vh]">
        <BentoCard
          src="videos/feature-1.mp4"
          title={<>poké<b>m</b>atch</>}
          description="A memory card game reimagined for the web – match Pokémon pairs, unlock new challenges, and rise through the ranks."
        />
      </BentoTilt>

      <div className="grid h-[135vh] w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        <BentoTilt className="bento-tilt_1 row-span-1 md:col-span-1 md:row-span-2">
          <BentoCard
            src="videos/feature-2.mp4"
            title={<>trai<b>n</b>ing</>}
            description="Sharpen your memory with dynamic modes and climb the leaderboard as a true Pokématch Master."
          />
        </BentoTilt>

        <BentoTilt className="bento-tilt_1 md:col-span-1">
          <BentoCard
            src="videos/feature-3.mp4"
            title={<>ba<b>tt</b>le</>}
            description="Challenge friends in real-time memory duels and stake your claim as the sharpest trainer around."
          />
        </BentoTilt>

        <BentoTilt className="bento-tilt_1 md:col-span-1">
          <BentoCard
            src="videos/feature-4.mp4"
            title={<>evol<b>v</b>e</>}
            description="Unlock new Pokémon sets and visual themes as you progress — the game grows with you."
          />
        </BentoTilt>

        <BentoTilt className="bento-tilt_2 col-span-1 md:col-span-2 lg:col-span-1">
          <div className="flex size-full flex-col justify-between bg-violet-300 p-5 rounded-xl shadow-2xl">
            <h1 className="bento-title font-pokemon-hollow max-w-64 text-black text-2xl md:text-3xl font-bold">
              M<b>o</b>re po<b>k</b>é aweso<b>m</b>eness s<b>o</b>on.
            </h1>
            <TiLocationArrow className="m-5 scale-[4] self-end text-black" />
          </div>
        </BentoTilt>

        <BentoTilt className="bento-tilt_2 col-span-1 md:col-span-2 lg:col-span-1">
          <video
            src="videos/feature-5.mp4"
            loop
            muted
            autoPlay
            className="rounded-xl shadow-2xl size-full object-cover object-center"
          />
        </BentoTilt>
      </div>
    </div>
  </section>
);

export default Features;
