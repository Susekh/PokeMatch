import { useEffect, useRef } from "react"
import { Sparkles, Zap } from "lucide-react"
import gsap from "gsap"

interface EvolutionAnimationProps {
  basePokemon: {
    id: number
    name: string
    image: string
  }
  evolvedPokemon: {
    id: number
    name: string
    image: string
  }
  onComplete: () => void
}

export default function EvolutionAnimation({ basePokemon, evolvedPokemon, onComplete }: EvolutionAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const baseRef = useRef<HTMLDivElement>(null)
  const evolvedRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Create a GSAP timeline for the evolution animation
    const tl = gsap.timeline({
      onComplete: () => {
        // Wait a bit before calling onComplete
        setTimeout(onComplete, 1000)
      },
    })

    // Fade in the overlay
    tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 })

    // Animate in the title and subtitle
    tl.fromTo(
      [titleRef.current, subtitleRef.current],
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, stagger: 0.2, duration: 0.5 },
    )

    // Animate the base Pokémon
    tl.fromTo(baseRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 })

    // Glowing animation for base Pokémon
    tl.to(baseRef.current, {
      boxShadow: "0 0 20px 10px rgba(250, 204, 21, 0.7)",
      duration: 1.5,
      repeat: 1,
      yoyo: true,
    })

    // Move base Pokémon to the left and fade out
    tl.to(baseRef.current, {
      x: -150,
      opacity: 0,
      duration: 1,
    })

    // Show the arrow
    tl.fromTo(".evolution-arrow", { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.5 }, "-=0.5")

    // Bring in the evolved Pokémon
    tl.fromTo(
      evolvedRef.current,
      { x: 150, opacity: 0, scale: 1.2 },
      { x: 0, opacity: 1, scale: 1, duration: 1 },
      "-=0.5",
    )

    // Show the result text
    tl.fromTo(resultRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 })

    // Create sparkle animations
    const sparkles = document.querySelectorAll(".evolution-sparkle")
    sparkles.forEach((sparkle, i) => {
      gsap.fromTo(
        sparkle,
        {
          opacity: 0,
          scale: 0.5,
          x: 0,
          y: 0,
        },
        {
          opacity: [0, 1, 0],
          scale: [0.5, 1.5, 0.5],
          x: Math.cos((i / sparkles.length) * Math.PI * 2) * 50,
          y: Math.sin((i / sparkles.length) * Math.PI * 2) * 50,
          repeat: -1,
          duration: 2,
          delay: i * 0.2,
        },
      )
    })

    return () => {
      tl.kill()
    }
  }, [onComplete])

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="text-center mb-8">
          <h2 ref={titleRef} className="text-3xl font-bold text-white mb-2">
            Evolution!
          </h2>
          <p ref={subtitleRef} className="text-yellow-300 text-lg">
            {basePokemon.name.charAt(0).toUpperCase() + basePokemon.name.slice(1)} is evolving...
          </p>
        </div>

        <div className="relative flex items-center justify-center">
          {/* Base Pokemon */}
          <div ref={baseRef} className="bg-gradient-to-br from-indigo-900 to-purple-900 p-6 rounded-xl">
            <div className="relative">
              <img
                src={basePokemon.image || "/placeholder.svg"}
                alt={basePokemon.name}
                className="w-40 h-40 object-contain"
              />

              {/* Sparkles */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="evolution-sparkle absolute">
                  <Sparkles className="text-yellow-300 w-6 h-6" />
                </div>
              ))}
            </div>
          </div>

          {/* Evolution arrow */}
          <div className="evolution-arrow mx-4 opacity-0">
            <Zap className="w-12 h-12 text-yellow-400 rotate-90" />
          </div>

          {/* Evolved Pokemon */}
          <div
            ref={evolvedRef}
            className="bg-gradient-to-br from-yellow-500 to-amber-600 p-6 rounded-xl shadow-lg shadow-yellow-500/30"
          >
            <div>
              <img
                src={evolvedPokemon.image || "/placeholder.svg"}
                alt={evolvedPokemon.name}
                className="w-40 h-40 object-contain"
              />
            </div>
          </div>
        </div>

        <div ref={resultRef} className="mt-8 text-center opacity-0">
          <h3 className="text-2xl font-bold text-white mb-2">
            {basePokemon.name.charAt(0).toUpperCase() + basePokemon.name.slice(1)} evolved into{" "}
            {evolvedPokemon.name.charAt(0).toUpperCase() + evolvedPokemon.name.slice(1)}!
          </h3>
          <p className="text-yellow-200">+15 bonus points for evolution!</p>
        </div>
      </div>
    </div>
  )
}
