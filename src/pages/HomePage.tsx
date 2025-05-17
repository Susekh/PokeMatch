import About from "../components/About"
import Features from "../components/Features"
import Footer from "../components/Footer"
import Hero from "../components/Hero"
import NavBar from "../components/Navbar"

function HomePage() {
  return (
    <main className="relative min-h-screen bg-black w-screen overflow-x-hidden">
      <NavBar />
      <Hero />
      <About/>
      <Features/>
      <Footer />
    </main>
  )
}

export default HomePage