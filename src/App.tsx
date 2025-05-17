import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";


function App() {
  return (
    <Routes>
      <Route path="/"  element={<HomePage/>}/>
      <Route path="/play" element={<><h1>hi</h1></>}/>
    </Routes>
    
  );
}

export default App;
