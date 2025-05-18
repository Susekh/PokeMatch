import { Route, Routes } from "react-router";
import { Suspense } from "react";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import GeometricLoader from "./components/loaders/HeroLoader";
import PlayGame from "./pages/PlayGame";
import Instructions from "./pages/Instructions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Info from "./pages/Info";

// Lazy-loaded pages

function App() {
  return (
    <main className="bg-black text-white min-h-screen w-full">
      <NavBar />
      <Suspense fallback={<GeometricLoader/>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/play" element={<PlayGame />} />
          <Route path="/about" element={<Info />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
        </Routes>
      </Suspense>
      <Footer />
    </main>
  );
}

export default App;
