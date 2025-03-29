import { Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./homepage";
import PublicNavbar from "../../components/public/layout/navbar";


function PublicRoute() {
  return (
    <div>
      <PublicNavbar/>
      <div className="max-w-[1800px] max-sm:px-4 px-12 mx-auto">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
    </div>
  );
}

export default PublicRoute;
