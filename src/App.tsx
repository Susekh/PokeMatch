import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import GameContainer from "./components/play/GameContainer";

function App() {
  return (
    <main>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/play"
          element={<GameContainer/>}
        />
      </Routes>
      <Footer/>
    </main>
  );
}

export default App;
