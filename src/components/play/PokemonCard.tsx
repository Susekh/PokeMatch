import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SiPokemon } from "react-icons/si";
import { MdOutlineCatchingPokemon } from "react-icons/md";

interface PokemonCardProps {
  pokemon: {
    id: number;
    name: string;
    image: string;
    flipped: boolean;
    matched: boolean;
  };
  onClick: () => void;
  disabled: boolean;
  currentPlayer: "player1" | "player2";
  cardIndex: number;
}

export default function PokemonCard({
  pokemon,
  onClick,
  disabled,
  currentPlayer,
  cardIndex,
}: PokemonCardProps) {
  const playerColor = currentPlayer === "player1" ? "yellow" : "blue";
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        rotationY: pokemon.flipped ? 180 : 0,
        duration: 0.3,
        ease: "power4",
      });
    }
  }, [pokemon.flipped]);

  useEffect(() => {
    if (pokemon.matched && cardRef.current) {
      gsap.to(cardRef.current, {
        rotationY: 180,
        duration: 0.6,
        ease: "power2.out",
      });

      const matchAnimation = gsap.timeline();
      matchAnimation
        .to(cardRef.current, {
          boxShadow: "0 0 15px 5px rgba(250, 204, 21, 0.6)",
          scale: 1.05,
          duration: 0.3,
        })
        .to(cardRef.current, {
          boxShadow: "0 0 5px 2px rgba(250, 204, 21, 0.3)",
          scale: 1,
          duration: 0.5,
        });
    }
  }, [pokemon.matched]);

  const handleCardClick = () => {
    if (!disabled && !pokemon.flipped && !pokemon.matched) {
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { scale: 1 },
          { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 }
        );
      }
      onClick();
    }
  };

  return (
    <div className="w-full aspect-[3/4]" style={{ perspective: "500px" }}>
      <div
        ref={cardRef}
        data-card-id={cardIndex}
        className={`relative w-full h-full transition-transform duration-500 ease-in-out ${
          disabled ? "pointer-events-none" : "cursor-pointer"
        }`}
        style={{ transformStyle: "preserve-3d" }}
        onClick={handleCardClick}
      >
        {/* Card Back - Dark Glassmorphism */}
        <div
          className={`absolute w-full h-full rounded-xl overflow-hidden border-2 ${
            currentPlayer === "player1"
              ? "border-yellow-400"
              : "border-blue-400"
          } shadow-xl backdrop-blur-lg bg-black/30`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="w-full h-full relative bg-gradient-to-br from-gray-900/40 to-black/60 flex items-center justify-center p-2">
            {/* Lightning Pattern */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              {Array.from({ length: 5 }).map((_, i) => (
                <MdOutlineCatchingPokemon
                  key={i}
                  className={`absolute text-${playerColor}-300 w-8 h-8`}
                  style={{
                    top: ["10%", "30%", "50%", "70%", "85%"][i],
                    left: ["20%", "60%", "40%", "75%", "30%"][i],
                    opacity: 0.3 + 0.1 * i,
                    transform: `rotate(${i * 45}deg)`,
                  }}
                />
              ))}
            </div>

            {/* Emblem */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`w-16 h-16 rounded-full border border-white/20 shadow-inner bg-gradient-to-br from-${playerColor}-500/20 to-${playerColor}-700/10 backdrop-blur-md flex items-center justify-center`}
              >
                <SiPokemon className={`w-10 h-10 text-${playerColor}-200`} />
              </div>
            </div>
          </div>
        </div>

        {/* Card Front - Dark Mode */}
        <div
          className="absolute w-full h-full rounded-xl overflow-hidden border-2 border-gray-700 shadow-xl bg-gray-900/80 backdrop-blur-sm"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div
            className={`w-full h-full flex flex-col items-center justify-between p-2 transition-all duration-300 ${
              pokemon.matched
                ? "bg-gradient-to-br from-yellow-900/30 to-yellow-700/30"
                : "bg-gray-900/80"
            }`}
          >
            <div className="w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-md flex-1 flex items-center justify-center p-1">
              {pokemon.image ? (
                <img
                  src={pokemon.image || "/placeholder.svg"}
                  alt={pokemon.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse" />
              )}
            </div>
            <div className="w-full text-center mt-1">
              <p className="text-xs font-medium text-gray-100 capitalize truncate">
                {pokemon.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
