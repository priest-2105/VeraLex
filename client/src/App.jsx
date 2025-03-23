import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SubmitCase from "./pages/SubmitCase";
import LawyerDashboard from "./pages/LawyerDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/submit-case" element={<SubmitCase />} />
      <Route path="/lawyer-dashboard" element={<LawyerDashboard />} />
    </Routes>
  );
}

export default App;
