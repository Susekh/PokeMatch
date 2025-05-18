import { User, Users, Bot, Zap, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface ScoreTrackerProps {
  scores: {
    player1: number;
    player2: number;
  };
  currentPlayer: "player1" | "player2";
  gameMode: "single" | "multiplayer" | "ai" | null;
  level: number;
}

export default function ScoreTracker({
  scores,
  currentPlayer,
  gameMode,
  level,
}: ScoreTrackerProps) {
  const player1Ref = useRef<HTMLDivElement>(null);
  const player2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (player1Ref.current && player2Ref.current) {
      gsap.to(currentPlayer === "player1" ? player1Ref.current : player2Ref.current, {
        scale: 1.03,
        y: -2,
        duration: 0.3,
        ease: "back.out(1.7)",
      });
      gsap.to(currentPlayer === "player1" ? player2Ref.current : player1Ref.current, {
        scale: 1,
        y: 0,
        duration: 0.3,
      });
    }
  }, [currentPlayer]);

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-lg p-3 shadow border border-white/10 w-full max-w-[280px] text-sm text-indigo-100 space-y-3">
      <h3 className="flex items-center gap-2 text-indigo-200 text-xs font-semibold">
        <Zap className="w-4 h-4 text-yellow-300" />
        Score Tracker
      </h3>

      <div className="space-y-2">
        <div
          ref={player1Ref}
          className={`p-2 rounded-md ${
            currentPlayer === "player1"
              ? "bg-yellow-400/10 border border-yellow-300/30"
              : "bg-white/5 border border-white/10"
          }`}
        >
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-yellow-300" />
            <span>{gameMode === "single" ? "You" : "Player 1"}</span>
            {currentPlayer === "player1" && (
              <span className="ml-auto px-2 py-[1px] text-[10px] bg-yellow-400/20 text-yellow-100 rounded-full">
                Turn
              </span>
            )}
          </div>
          <div className="player1-score text-lg font-bold text-yellow-300 mt-1">{scores.player1}</div>
        </div>

        {(gameMode === "multiplayer" || gameMode === "ai") && (
          <div
            ref={player2Ref}
            className={`p-2 rounded-md ${
              currentPlayer === "player2"
                ? "bg-blue-400/10 border border-blue-300/30"
                : "bg-white/5 border border-white/10"
            }`}
          >
            <div className="flex items-center gap-2">
              {gameMode === "multiplayer" ? (
                <Users className="w-4 h-4 text-blue-300" />
              ) : (
                <Bot className="w-4 h-4 text-blue-300" />
              )}
              <span>{gameMode === "multiplayer" ? "Player 2" : "AI"}</span>
              {currentPlayer === "player2" && (
                <span className="ml-auto px-2 py-[1px] text-[10px] bg-blue-400/20 text-blue-100 rounded-full">
                  Turn
                </span>
              )}
            </div>
            <div className="player2-score text-lg font-bold text-blue-300 mt-1">{scores.player2}</div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="bg-white/5 border border-white/10 p-2 rounded-md">
          <h4 className="text-indigo-300 mb-1 text-xs font-medium">Game Info</h4>
          <div className="space-y-[2px] text-[12px]">
            <div className="flex justify-between">
              <span>Level</span>
              <span>{level}</span>
            </div>
            <div className="flex justify-between">
              <span>Cards</span>
              <span>{level <= 3 ? 12 : level <= 6 ? 16 : level <= 9 ? 20 : 24}</span>
            </div>
            <div className="flex justify-between">
              <span>Mode</span>
              <span className="capitalize">{gameMode}</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-2 rounded-md text-[11px] text-indigo-300">
          <h4 className="text-indigo-200 mb-1 text-xs">Scoring</h4>
          <ul className="list-disc pl-4 space-y-[2px]">
            <li>10 × Level points per match</li>
            <li>Max 3× multiplier</li>
            <li>Bonus turn on match</li>
          </ul>
        </div>

        <div className="bg-yellow-400/10 border border-yellow-300/20 p-2 rounded-md text-[11px] text-yellow-100">
          <div className="flex items-center gap-1 mb-1">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <h4 className="text-xs font-semibold">Evolution Bonus</h4>
          </div>
          <ul className="list-disc pl-4 space-y-[2px]">
            <li>+15 points for evolution</li>
            <li>Evolved Pokémon stay</li>
            <li>Stronger forms, more score</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
