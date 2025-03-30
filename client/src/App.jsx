import React from "react";
import PublicRoute from "./pages/public/routes";
import AuthRoute from "./pages/auth/routes";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/*" element={<PublicRoute />} />
      <Route path="/auth/*" element={<AuthRoute />} />
    </Routes>
  );
}

export default App;
