import { motion } from "framer-motion"
import { User, Users, Bot, Sparkles } from "lucide-react"
import Button from "../Button"

type GameMode = "single" | "multiplayer" | "ai" | null

interface GameModeSelectionProps {
  onSelectMode: (mode: GameMode) => void
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
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div className="max-w-3xl mx-auto" variants={container} initial="hidden" animate="show">
      <motion.h2
        className="text-2xl font-bold mt-12 mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-300"
        variants={item}
      >
        Select Game Mode
      </motion.h2>

      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={item}>
        <motion.div
          className="bg-gradient-to-br from-indigo-800/40 to-indigo-900/40 backdrop-blur-sm p-6 rounded-xl border border-indigo-500/30 hover:border-indigo-400 transition-all shadow-lg hover:shadow-indigo-500/10"
          whileHover={{ scale: 1.03, y: -5 }}
          variants={item}
        >
          <div className="bg-yellow-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-500/30">
            <User className="w-8 h-8 text-yellow-300" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-center text-yellow-200">Single Player</h3>
          <p className="text-indigo-200 mb-6 text-center text-sm">
            Challenge yourself to match cards and evolve your Pokémon!
          </p>
          <button
            onClick={() => onSelectMode("single")}
          > 
          <Button
            containerClass={"w-full  bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-bold"}
            title={"Start Game"}
          />
          </button>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-indigo-800/40 to-indigo-900/40 backdrop-blur-sm p-6 rounded-xl border border-blue-500/30 hover:border-blue-400 transition-all shadow-lg hover:shadow-blue-500/10"
          whileHover={{ scale: 1.03, y: -5 }}
          variants={item}
        >
          <div className="bg-blue-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
            <Users className="w-8 h-8 text-blue-300" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-center text-blue-200">Multiplayer</h3>
          <p className="text-indigo-200 mb-6 text-center text-sm">
            Play with a friend and compete to evolve the most Pokémon!
          </p>
          <button
            onClick={() => onSelectMode("multiplayer")}
          > 
          <Button 
           containerClass={"w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold"}
            title={"Start Game"}
          />
          </button>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-indigo-800/40 to-indigo-900/40 backdrop-blur-sm p-6 rounded-xl border border-purple-500/30 hover:border-purple-400 transition-all shadow-lg hover:shadow-purple-500/10"
          whileHover={{ scale: 1.03, y: -5 }}
          variants={item}
        >
          <div className="bg-purple-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
            <Bot className="w-8 h-8 text-purple-300" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-center text-purple-200">AI Opponent</h3>
          <p className="text-indigo-200 mb-6 text-center text-sm">
            Challenge the computer AI with increasing difficulty as you level up!
          </p>
          <button
            onClick={() => onSelectMode("ai")}
          >
            <Button 
            containerClass={"w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold"}
              title={"Start Game"}
            />
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-12 p-4 bg-gradient-to-br from-yellow-500/20 to-amber-600/20 backdrop-blur-sm rounded-lg border border-yellow-500/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-start gap-3">
          <Sparkles className="w-6 h-6 text-yellow-300 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-bold text-yellow-200 mb-1">Evolution Mechanics</h3>
            <p className="text-indigo-200 text-sm">
              Match Pokémon pairs to trigger evolutions! When you match a Pokémon that can evolve, you'll see an
              evolution animation. The evolved form will appear in the next level, making your collection stronger as
              you progress!
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
