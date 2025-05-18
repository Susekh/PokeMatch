import { useState, useEffect } from "react";
import { Zap, Trophy, ArrowLeft, Sparkles } from "lucide-react";
import ScoreTracker from "./ScoreTracker";
import LevelUpAnimation from "./LevelUpAnimation";
import GameModeSelection from "./GameModeSelection";
import gsap from "gsap";
import Button from "../Button";
import GameBoard from "./GameBoard";

type GameMode = "single" | "multiplayer" | "ai" | null;
type GameState = "menu" | "playing" | "levelUp" | "victory";

export default function GameContainer() {
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [gameState, setGameState] = useState<GameState>("menu");
  const [level, setLevel] = useState(1);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [currentPlayer, setCurrentPlayer] = useState<"player1" | "player2">(
    "player1"
  );
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Initialize GSAP animations
  useEffect(() => {
    // Animate header on load
    gsap.fromTo(
      ".game-title",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5 }
    );

    gsap.fromTo(
      ".game-subtitle",
      { opacity: 0 },
      { opacity: 1, duration: 0.5, delay: 0.3 }
    );
  }, []);

  const startGame = (mode: GameMode) => {
    setGameMode(mode);
    setGameState("playing");
    setScores({ player1: 0, player2: 0 });
    setLevel(1);
  };

  const handleMatchFound = (multiplier = 1, evolutionBonus = false) => {
    // Calculate points - regular match points plus evolution bonus if applicable
    const matchPoints = 10 * multiplier * level;
    const bonusPoints = evolutionBonus ? 15 : 0;
    const totalPoints = matchPoints + bonusPoints;

    setScores((prev) => ({
      ...prev,
      [currentPlayer]: prev[currentPlayer] + totalPoints,
    }));

    // Animate score increase
    const scoreElement = document.querySelector(`.${currentPlayer}-score`);
    if (scoreElement) {
      gsap.fromTo(
        scoreElement,
        { scale: 1 },
        {
          scale: 1.2,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
        }
      );
    }

    if (gameMode === "multiplayer" || gameMode === "ai") {
      // Don't switch turns on match in multiplayer/AI mode to give bonus turn
    }
  };

  const handleNoMatch = () => {
    if (gameMode === "multiplayer" || gameMode === "ai") {
      setCurrentPlayer((prev) => (prev === "player1" ? "player2" : "player1"));
    }
  };

  const handleLevelComplete = () => {
    setShowLevelUp(true);
    setGameState("levelUp");

    setTimeout(() => {
      setLevel((prev) => prev + 1);
      setShowLevelUp(false);
      setGameState("playing");
    }, 3000);
  };

  const handleGameComplete = () => {
    setGameState("victory");
  };

  const resetGame = () => {
    setGameMode(null);
    setGameState("menu");
    setScores({ player1: 0, player2: 0 });
    setLevel(1);
    setCurrentPlayer("player1");
  };

  return (
    <main className="container  w-full  mx-auto px-4 py-12">
      <div className=" mt-12 px-12">
        {gameState === "menu" && <GameModeSelection onSelectMode={startGame} />}

        {gameState === "playing" && (
          <div className="game-board">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-full md:w-3/4">

                <GameBoard
                  level={level}
                  gameMode={gameMode}
                  currentPlayer={currentPlayer}
                  score={scores[currentPlayer]}
                  onMatchFound={handleMatchFound}
                  onNoMatch={handleNoMatch}
                  onLevelComplete={handleLevelComplete}
                  onGameComplete={handleGameComplete}
                  aiPlayer={gameMode === "ai" ? "player2" : undefined}
                />
              </div>

              <div className=" md:w-1/4">
                <div className="flex justify-between items-center mb-4">
                  <button
                    onClick={resetGame}
                  > 
                    <Button containerClass={"flex bg-gray-700 w- text-white"} leftIcon={<ArrowLeft className=" h-4" />} title={"Back to Menu"} />
                    
                  </button>
                </div>

                <ScoreTracker
                  scores={scores}
                  currentPlayer={currentPlayer}
                  gameMode={gameMode}
                  level={level}
                />
                
              </div>
            </div>
          </div>
        )}

        {gameState === "levelUp" && showLevelUp && (
          <LevelUpAnimation level={level + 1} />
        )}

        {gameState === "victory" && (
          <div className="victory-screen text-center py-12">
            <div className="mb-8">
              <Trophy className="w-24 h-24 mx-auto text-yellow-300 mb-4" />
              <h2 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">
                Victory!
              </h2>
              <p className="text-xl text-indigo-200">
                {gameMode === "multiplayer"
                  ? `${
                      scores.player1 > scores.player2 ? "Player 1" : "Player 2"
                    } wins!`
                  : "You've completed all levels!"}
              </p>
              <p className="text-lg mt-4">
                Final Score:{" "}
                {gameMode === "multiplayer"
                  ? `Player 1: ${scores.player1} | Player 2: ${scores.player2}`
                  : scores.player1}
              </p>
            </div>

            <button
              size="lg"
              onClick={resetGame}
              className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-bold"
            >
              <Button title={"Play Again"} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
