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
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create and play battle sound when component mounts
    audioRef.current = new Audio("/audio/battle.mp3")
    audioRef.current.volume = 0.6 // Adjust volume as needed
    audioRef.current.play().catch(error => {
      // Handle any autoplay restrictions silently
      console.log("Audio playback prevented:", error)
    })

    if (!containerRef.current) return

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(onComplete, 1000)
      },
    })

    tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 })

    tl.fromTo(
      [titleRef.current, subtitleRef.current],
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, stagger: 0.2, duration: 0.5 },
    )

    tl.fromTo(baseRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 })

    tl.to(baseRef.current, {
      boxShadow: "0 0 20px 10px rgba(250, 204, 21, 0.7)",
      duration: 1.5,
      repeat: 1,
      yoyo: true,
    })

    tl.to(baseRef.current, {
      x: -150,
      opacity: 0,
      duration: 1,
    })

    tl.fromTo(".evolution-arrow", { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.5 }, "-=0.5")

    tl.fromTo(
      evolvedRef.current,
      { x: 150, opacity: 0, scale: 1.2 },
      { x: 0, opacity: 1, scale: 1, duration: 1 },
      "-=0.5",
    )

    tl.fromTo(resultRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 })

    // Animate sparkles using keyframes
    const sparkles = document.querySelectorAll<HTMLElement>(".evolution-sparkle")
    sparkles.forEach((sparkle, i) => {
      gsap.to(sparkle, {
        keyframes: [
          { opacity: 1, scale: 1.5 },
          { opacity: 0, scale: 0.5 },
        ],
        x: Math.cos((i / sparkles.length) * Math.PI * 2) * 50,
        y: Math.sin((i / sparkles.length) * Math.PI * 2) * 50,
        repeat: -1,
        duration: 2,
        delay: i * 0.2,
      })
    })

    return () => {
      // Stop and clean up the audio when component unmounts
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      tl.kill()
    }
  }, [onComplete])

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="text-center mb-8">
          <h2 ref={titleRef} className="text-3xl font-pokemon-hollow font-bold text-white mb-2">
            Evolution!
          </h2>
          <p ref={subtitleRef} className="text-yellow-300 font-pokemon text-lg">
            {basePokemon.name.charAt(0).toUpperCase() + basePokemon.name.slice(1)} is evolving...
          </p>
        </div>

        <div className="relative flex items-center justify-center">
          {/* Base Pokemon */}
          <div ref={baseRef} className="bg-gradient-to-br from-gray-800 to-black p-6 rounded-xl">
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
          <h3 className="text-2xl font-bold font-pokemon text-white mb-2">
            {basePokemon.name.charAt(0).toUpperCase() + basePokemon.name.slice(1)} evolved into{" "}
            {evolvedPokemon.name.charAt(0).toUpperCase() + evolvedPokemon.name.slice(1)}!
          </h3>
          <p className="text-yellow-200">+15 bonus points for evolution!</p>
        </div>
      </div>
    </div>
  )
}