import { User, Users, Bot, Zap, Sparkles } from "lucide-react"
import { useEffect, useRef } from "react"
import gsap from "gsap"

interface ScoreTrackerProps {
  scores: {
    player1: number
    player2: number
  }
  currentPlayer: "player1" | "player2"
  gameMode: "single" | "multiplayer" | "ai" | null
  level: number
}

export default function ScoreTracker({ scores, currentPlayer, gameMode, level }: ScoreTrackerProps) {
  const player1Ref = useRef<HTMLDivElement>(null)
  const player2Ref = useRef<HTMLDivElement>(null)

  // Animate player turn changes
  useEffect(() => {
    if (player1Ref.current && player2Ref.current) {
      if (currentPlayer === "player1") {
        gsap.to(player1Ref.current, {
          scale: 1.03,
          y: -2,
          duration: 0.3,
          ease: "back.out(1.7)",
        })
        gsap.to(player2Ref.current, {
          scale: 1,
          y: 0,
          duration: 0.3,
        })
      } else {
        gsap.to(player2Ref.current, {
          scale: 1.03,
          y: -2,
          duration: 0.3,
          ease: "back.out(1.7)",
        })
        gsap.to(player1Ref.current, {
          scale: 1,
          y: 0,
          duration: 0.3,
        })
      }
    }
  }, [currentPlayer])

  return (
    <div className="bg-gradient-to-br from-indigo-800/30 to-purple-800/30 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-indigo-500/20 h-full">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-300">
        <Zap className="w-5 h-5 text-yellow-300" />
        Score Tracker
      </h3>

      <div className="space-y-4">
        <div
          ref={player1Ref}
          className={`p-3 rounded-lg ${
            currentPlayer === "player1"
              ? "bg-gradient-to-r from-yellow-500/20 to-amber-600/20 border border-yellow-500/50"
              : "bg-indigo-900/30 border border-indigo-700/30"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <User className="w-5 h-5 text-yellow-300" />
            <h4 className="font-medium">{gameMode === "single" ? "Your Score" : "Player 1"}</h4>
            {currentPlayer === "player1" && (
              <span className="ml-auto text-xs bg-yellow-500/30 px-2 py-0.5 rounded-full text-yellow-200">
                Current Turn
              </span>
            )}
          </div>
          <div className="player1-score text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">
            {scores.player1}
          </div>
        </div>

        {(gameMode === "multiplayer" || gameMode === "ai") && (
          <div
            ref={player2Ref}
            className={`p-3 rounded-lg ${
              currentPlayer === "player2"
                ? "bg-gradient-to-r from-blue-500/20 to-indigo-600/20 border border-blue-500/50"
                : "bg-indigo-900/30 border border-indigo-700/30"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {gameMode === "multiplayer" ? (
                <Users className="w-5 h-5 text-blue-300" />
              ) : (
                <Bot className="w-5 h-5 text-blue-300" />
              )}
              <h4 className="font-medium">{gameMode === "multiplayer" ? "Player 2" : "AI Opponent"}</h4>
              {currentPlayer === "player2" && (
                <span className="ml-auto text-xs bg-blue-500/30 px-2 py-0.5 rounded-full text-blue-200">
                  Current Turn
                </span>
              )}
            </div>
            <div className="player2-score text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-400">
              {scores.player2}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-3">
        <div className="bg-indigo-900/30 p-3 rounded-lg border border-indigo-700/30">
          <h4 className="text-sm font-medium mb-2 text-indigo-200">Game Info</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-indigo-300">Level</span>
              <span className="font-medium text-white">{level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-indigo-300">Cards</span>
              <span className="font-medium text-white">{level <= 3 ? 12 : level <= 6 ? 16 : level <= 9 ? 20 : 24}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-indigo-300">Mode</span>
              <span className="font-medium text-white capitalize">{gameMode}</span>
            </div>
          </div>
        </div>

        <div className="bg-indigo-900/30 p-3 rounded-lg border border-indigo-700/30">
          <h4 className="text-sm font-medium mb-2 text-indigo-200">Scoring</h4>
          <div className="space-y-1 text-xs text-indigo-300">
            <p>• Match: 10 × Level points</p>
            <p>• Consecutive matches increase multiplier</p>
            <p>• Max multiplier: 3×</p>
            <p>• Bonus turn on match</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500/20 to-amber-600/20 p-3 rounded-lg border border-yellow-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <h4 className="text-sm font-medium text-yellow-200">Evolution Bonus</h4>
          </div>
          <div className="space-y-1 text-xs text-indigo-200">
            <p>• +15 points for each evolution</p>
            <p>• Pokémon evolve in place</p>
            <p>• Evolved forms are stronger!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
