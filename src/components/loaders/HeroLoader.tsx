import { useEffect, useRef } from "react"
import { gsap } from "gsap"

const GeometricLoader = () => {
  // Create refs for our animation elements
  const containerRef = useRef<HTMLDivElement>(null)
  const elementsRef = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    // Filter out null elements
    const elements = elementsRef.current.filter((el): el is HTMLDivElement => el !== null)

    // Create our main timeline
    const tl = gsap.timeline({ repeat: -1 })

    // Initial animation - elements appear
    tl.from(elements, {
      scale: 0,
      opacity: 0,
      rotation: -180,
      stagger: 0.1,
      ease: "back.out(1.7)",
      duration: 0.8,
    })

    // Pulsing animation
    tl.to(
      elements,
      {
        scale: 0.8,
        duration: 0.6,
        stagger: {
          each: 0.1,
          repeat: 1,
          yoyo: true,
        },
        ease: "sine.inOut",
      },
      "+=0.2",
    )

    // Rotation animation
    tl.to(
      elements,
      {
        rotation: 360,
        duration: 1.5,
        stagger: 0.1,
        ease: "power1.inOut",
      },
      "-=0.5",
    )

    // Elements move to form a circle
    tl.to(elements, {
      x: (i) => Math.cos(i * ((2 * Math.PI) / elements.length)) * 80,
      y: (i) => Math.sin(i * ((2 * Math.PI) / elements.length)) * 80,
      duration: 1,
      stagger: 0.05,
      ease: "back.out(1.2)",
    })

    // Elements return to center
    tl.to(
      elements,
      {
        x: 0,
        y: 0,
        scale: 1,
        duration: 1,
        stagger: 0.05,
        ease: "back.inOut(1)",
      },
      "+=0.5",
    )

    // Fade out
    tl.to(
      elements,
      {
        scale: 0,
        opacity: 0,
        stagger: 0.05,
        ease: "back.in(1.7)",
        duration: 0.6,
      },
      "+=0.2",
    )

    // Clean up the animation when component unmounts
    return () => {
      tl.kill()
    }
  }, [])

  // Create an array of different shapes
  const shapes = [
    "rounded-full", // Circle
    "rounded", // Square with rounded corners
    "rounded-lg rotate-45", // Diamond
    "clip-path-triangle", // Triangle
    "rounded-full", // Circle
    "rounded", // Square with rounded corners
    "rounded-lg rotate-45", // Diamond
    "clip-path-triangle", // Triangle
  ]

  // Create an array of different colors
  const colors = [
    "bg-purple-500",
    "bg-indigo-500",
    "bg-blue-500",
    "bg-teal-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-orange-500",
    "bg-red-500",
  ]

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black">
      <div ref={containerRef} className="relative w-64 h-64 flex items-center justify-center">
        {shapes.map((shape, i) => (
          <div
            key={i}
            ref={(el) => {
              elementsRef.current[i] = el
            }}
            className={`absolute w-12 h-12 ${shape} ${colors[i]} shadow-lg`}
          />
        ))}
      </div>
    </div>
  )
}

export default GeometricLoader
