import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import GameContainer from "./components/play/GameContainer";
import PlayGame from "./pages/PlayGame";

function App() {
  return (
    <main>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/play"
          element={<PlayGame/>}
        />
      </Routes>
      <Footer/>
    </main>
  );
}

export default App;
