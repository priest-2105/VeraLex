import { Routes, Route } from "react-router-dom";
import Home from "./pages/public/homepage/index";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
