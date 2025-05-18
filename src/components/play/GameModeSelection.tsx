import { motion } from "framer-motion";
import { User, Users, Bot, Sparkles, Play } from "lucide-react";
import Button from "../Button";

type GameMode = "single" | "multiplayer" | "ai" | null;

interface GameModeSelectionProps {
  onSelectMode: (mode: GameMode) => void;
}

export default function GameModeSelection({ onSelectMode }: GameModeSelectionProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 py-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.h2
        className="text-3xl font-bold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400"
        variants={item}
      >
        Select Game Mode
      </motion.h2>

      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4" variants={item}>
        {/* Single Player */}
        <motion.div
          className="bg-gradient-to-br from-slate-900/50 to-gray-800/30 backdrop-blur-md p-5 rounded-xl border border-slate-500/20 shadow-md hover:shadow-yellow-300/10 transition-all"
          whileHover={{ scale: 1.02, y: -4 }}
          variants={item}
        >
          <div className="w-14 h-14 rounded-full bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mx-auto mb-4">
            <User className="w-7 h-7 text-yellow-300" />
          </div>
          <h3 className="text-lg font-semibold text-center text-slate-100 mb-2">Single Player</h3>
          <p className="text-sm text-slate-300 text-center mb-5">
            Challenge yourself to match cards and evolve your Pokémon!
          </p>
          <div className="flex justify-center">
            <button className="w-full" onClick={() => onSelectMode("single")}>
              <Button
                title="Start Game"
                rightIcon={<Play className="w-4 h-4" />}
                containerClass="w-full bg-gradient-to-r bg-gray-800 text-white border-2 border-yellow-500 hover:from-yellow-500 hover:to-amber-600 hover:text-black font-medium flex items-center justify-center gap-2"
              />
            </button>
          </div>
        </motion.div>

        {/* Multiplayer */}
        <motion.div
          className="bg-gradient-to-br from-slate-900/50 to-gray-800/30 backdrop-blur-md p-5 rounded-xl border border-blue-500/20 shadow-md hover:shadow-blue-300/10 transition-all"
          whileHover={{ scale: 1.02, y: -4 }}
          variants={item}
        >
          <div className="w-14 h-14 rounded-full bg-blue-400/10 border border-blue-400/20 flex items-center justify-center mx-auto mb-4">
            <Users className="w-7 h-7 text-blue-300" />
          </div>
          <h3 className="text-lg font-semibold text-center text-slate-100 mb-2">Multiplayer</h3>
          <p className="text-sm text-slate-300 text-center mb-5">
            Play with a friend and compete to evolve the most Pokémon!
          </p>
          <div className="flex justify-center">
            <button className="w-full" onClick={() => onSelectMode("multiplayer")}>
              <Button
                title="Start Game"
                rightIcon={<Play className="w-4 h-4" />}
                containerClass="w-full bg-gradient-to-r bg-gray-800 border-2 border-blue-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium flex items-center justify-center gap-2"
              />
            </button>
          </div>
        </motion.div>

        {/* AI Opponent */}
        <motion.div
          className="bg-gradient-to-br from-slate-900/50 to-gray-800/30 backdrop-blur-md p-5 rounded-xl border border-purple-500/20 shadow-md hover:shadow-purple-300/10 transition-all"
          whileHover={{ scale: 1.02, y: -4 }}
          variants={item}
        >
          <div className="w-14 h-14 rounded-full bg-purple-400/10 border border-purple-400/20 flex items-center justify-center mx-auto mb-4">
            <Bot className="w-7 h-7 text-purple-300" />
          </div>
          <h3 className="text-lg font-semibold text-center text-slate-100 mb-2">AI Opponent</h3>
          <p className="text-sm text-slate-300 text-center mb-5">
            Challenge the AI with increasing difficulty as you level up!
          </p>
          <div className="flex justify-center">
            <button className="w-full" onClick={() => onSelectMode("ai")}>
              <Button
                title="Start Game"
                rightIcon={<Play className="w-4 h-4" />}
                containerClass="w-full bg-gradient-to-r bg-gray-800 border-2 border-purple-800 hover:from-purple-600 hover:to-pink-700 text-white font-medium flex items-center justify-center gap-2"
              />
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Evolution Info */}
      <motion.div
        className="mt-10 p-4 bg-gradient-to-br from-slate-800/40 to-gray-900/30 backdrop-blur-md rounded-lg border border-slate-600/20 shadow-inner"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-yellow-300 mt-1" />
          <div>
            <h3 className="text-base font-semibold text-yellow-200 mb-1">Evolution Mechanics</h3>
            <p className="text-sm text-slate-300">
              Match Pokémon pairs to trigger evolutions! When you match a Pokémon that can evolve, you'll see an
              evolution animation. The evolved form will appear in the next level, making your collection stronger as
              you progress!
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
