import { Route, Routes } from "react-router";
import { Suspense, lazy } from "react";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";

// Lazy-loaded pages
const HomePage = lazy(() => import("./pages/HomePage"));
const PlayGame = lazy(() => import("./pages/PlayGame"));

function App() {
  return (
    <main>
      <NavBar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/play" element={<PlayGame />} />
        </Routes>
      </Suspense>
      <Footer />
    </main>
  );
}

export default App;
