import React from "react";
import { Outlet } from "react-router-dom";

function AuthRoute() {
  return (
    <div className="w-full max-h-[80vh]">
      <Outlet />
    </div>
  );
}

export default AuthRoute;
