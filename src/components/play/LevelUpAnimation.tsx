import { useEffect, useRef } from "react"
import { Zap, Sparkles } from "lucide-react"
import gsap from "gsap"

interface LevelUpAnimationProps {
  level: number
}

export default function LevelUpAnimation({ level }: LevelUpAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const levelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !contentRef.current || !titleRef.current || !levelRef.current) return

    // Create a GSAP timeline for the level up animation
    const tl = gsap.timeline()

    // Fade in the overlay
    tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 })

    // Animate in the content box
    tl.fromTo(
      contentRef.current,
      { scale: 0.8, y: 20, opacity: 0 },
      {
        scale: 1,
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.7)",
      },
    )

    // Animate the title
    tl.fromTo(
      titleRef.current,
      { scale: 1 },
      {
        scale: 1.2,
        duration: 0.5,
        yoyo: true,
        repeat: 1,
      },
    )

    // Animate the level number
    tl.fromTo(
      levelRef.current,
      { scale: 1 },
      {
        scale: 1.3,
        duration: 0.5,
        yoyo: true,
        repeat: 1,
      },
      "-=0.5",
    )

    // Animate lightning bolts
    const bolts = document.querySelectorAll(".level-up-bolt")
    bolts.forEach((bolt, i) => {
      gsap.fromTo(
        bolt,
        {
          x: Math.random() * 300 - 150,
          y: -100,
          opacity: 0,
          rotate: Math.random() * 20 - 10,
        },
        {
          y: 100,
          opacity: [0, 1, 0],
          scale: [0.5, 1.5, 0.8],
          duration: 0.8,
          delay: i * 0.08,
          ease: "power2.out",
        },
      )
    })

    // Animate particles
    const particles = document.querySelectorAll(".level-up-particle")
    particles.forEach((particle, i) => {
      gsap.fromTo(
        particle,
        {
          x: "50%",
          y: "50%",
          scale: 0,
          opacity: 0,
        },
        {
          x: `${Math.random() * 100}%`,
          y: `${Math.random() * 100}%`,
          scale: [0, 1, 0],
          opacity: [0, 1, 0],
          duration: 2,
          delay: i * 0.1,
          ease: "power2.out",
          repeat: 1,
        },
      )
    })

    return () => {
      tl.kill()
    }
  }, [level])

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Lightning bolts */}
        <div className="relative w-full h-40">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="level-up-bolt absolute left-1/2">
              <Zap className="w-16 h-16 text-yellow-300" />
            </div>
          ))}
        </div>

        <div
          ref={contentRef}
          className="bg-gradient-to-br from-indigo-800 to-purple-900 px-12 py-8 rounded-xl shadow-lg shadow-indigo-500/30 text-center border-2 border-indigo-400/30"
        >
          <h2
            ref={titleRef}
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 mb-2"
          >
            Level Up!
          </h2>
          <div ref={levelRef} className="text-6xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Sparkles className="w-12 h-12 text-yellow-300" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">{level}</span>
            <Sparkles className="w-12 h-12 text-yellow-300" />
          </div>
          <p className="text-indigo-200">Get ready for more challenges and evolutions!</p>

          {/* Particles */}
          <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="level-up-particle absolute w-2 h-2 rounded-full bg-yellow-300/60" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
