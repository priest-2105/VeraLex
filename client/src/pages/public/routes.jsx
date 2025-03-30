import { Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./homepage";
import PublicNavbar from "../../components/public/layout/navbar";
import PublicFooter from "../../components/public/layout/footer";

function PublicRoute() {
  return (
    <div>
      <PublicNavbar />
      <div className="max-w-[1800px] max-sm:px-4 px-12 mx-auto pt-24">
        <Routes>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
        </Routes>
      </div>
      <PublicFooter />
    </div>
  );
}

export default PublicRoute;
