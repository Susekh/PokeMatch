import About from "../components/About"
import Features from "../components/Features"
import FloatingImage from "../components/FloatingImage"
import Hero from "../components/Hero"

function HomePage() {
  return (
    <main className="relative min-h-screen bg-black w-screen overflow-x-hidden">
      <Hero />
      <About/>
      <Features/>
      <FloatingImage/>
    </main>
  )
}

export default HomePage