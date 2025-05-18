import { Zap } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";

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

  // Handle flip animations when flipped state changes
  useEffect(() => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        rotationY: pokemon.flipped ? 180 : 0,
        duration: 0.8,
        ease: "power4",
      });
    }
  }, [pokemon.flipped]); // React to changes in the flipped state

  // Handle match animation
  useEffect(() => {
    if (pokemon.matched && cardRef.current) {
      gsap.to(cardRef.current, {
        rotationY: 180,
        duration: 0.6,
        ease: "power2.out",
      });

      // Add match animation
      const matchAnimation = gsap.timeline();
      matchAnimation
        .to(cardRef.current, {
          boxShadow: "0 0 15px 5px rgba(250, 204, 21, 0.7)",
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

  // Handle click with proper animation
  const handleCardClick = () => {
    if (!disabled && !pokemon.flipped && !pokemon.matched) {
      onClick();
    }
  };

  return (
    <div className="w-full aspect-[3/4]" style={{ perspective: "500px" }}>
      <div
        ref={cardRef}
        data-card-id={cardIndex}
        className={`relative w-full h-full ${
          disabled ? "pointer-events-none" : "cursor-pointer"
        }`}
        style={{ transformStyle: "preserve-3d" }}
        onClick={handleCardClick}
      >
        {/* Card Back */}
        <div
          className={`absolute w-full h-full rounded-xl overflow-hidden border-2 ${
            currentPlayer === "player1"
              ? "border-yellow-500"
              : "border-blue-500"
          } shadow-lg`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-2">
            <div className="relative w-full h-full">
              {/* Lightning bolt pattern */}
              <div className="absolute inset-0 opacity-20">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Zap
                    key={i}
                    className={`absolute text-${playerColor}-400 w-8 h-8 transform`}
                    style={{
                      top:
                        i === 0
                          ? "10%"
                          : i === 1
                          ? "30%"
                          : i === 2
                          ? "50%"
                          : i === 3
                          ? "70%"
                          : "85%",
                      left:
                        i === 0
                          ? "20%"
                          : i === 1
                          ? "60%"
                          : i === 2
                          ? "40%"
                          : i === 3
                          ? "75%"
                          : "30%",
                      opacity:
                        i === 0
                          ? 0.5
                          : i === 1
                          ? 0.7
                          : i === 2
                          ? 0.6
                          : i === 3
                          ? 0.4
                          : 0.8,
                      transform: `rotate(${i * 45}deg)`,
                    }}
                  />
                ))}
              </div>

              {/* Center emblem */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br from-${playerColor}-500/40 to-${playerColor}-600/20 flex items-center justify-center backdrop-blur-sm`}
                >
                  <Zap className={`w-10 h-10 text-${playerColor}-400`} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card Front */}
        <div
          className="absolute w-full h-full rounded-xl overflow-hidden border-2 border-gray-700 shadow-lg"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div
            className={`w-full h-full bg-white flex flex-col items-center justify-between p-2 ${
              pokemon.matched
                ? "bg-gradient-to-br from-yellow-100 to-yellow-200"
                : ""
            }`}
          >
            <div className="w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex-1 flex items-center justify-center p-1">
              {pokemon.image ? (
                <img
                  src={pokemon.image || "/placeholder.svg"}
                  alt={pokemon.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse" />
              )}
            </div>
            <div className="w-full text-center mt-1">
              <p className="text-xs font-medium text-gray-800 capitalize truncate">
                {pokemon.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
