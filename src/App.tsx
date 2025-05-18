import { Route, Routes } from "react-router";
import { Suspense, lazy } from "react";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";

// Lazy-loaded pages
const PlayGame = lazy(() => import("./pages/PlayGame"));
const Info = lazy(() => import("./pages/Info"));
const Instructions = lazy(() => import("./pages/Instructions"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));

function App() {
  return (
    <main className="bg-black text-white min-h-screen w-full">
      <NavBar />
      <Suspense fallback={<div className="p-20 text-center text-gray-300">Loading Poké magic...</div>}>
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
