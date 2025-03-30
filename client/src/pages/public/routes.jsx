import React from "react";
import { Outlet } from "react-router-dom";
import PublicNavbar from "../../components/public/layout/navbar";
import PublicFooter from "../../components/public/layout/footer";

function PublicRoute() {
  return (
    <>
      <PublicNavbar />
      <main className="max-w-[1800px] max-sm:px-4 px-12 mx-auto pt-24">
        <Outlet />
      </main>
      <PublicFooter />
    </>
  );
}

export default PublicRoute;
