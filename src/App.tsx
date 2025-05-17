import Footer from "./components/Footer";
import Hero from "./components/Hero";
import NavBar from "./components/Navbar";


function App() {
  return (
    <main className="relative min-h-screen bg-black w-screen overflow-x-hidden">
      <NavBar />
      <Hero />
      <Footer />
    </main>
  );
}

export default App;
